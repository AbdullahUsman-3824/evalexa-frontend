export type InterviewUploadStatus =
  | "queued"
  | "uploading"
  | "uploaded"
  | "failed";

export type InterviewUploadStrategy = "multipart" | "presigned";

export type UploadQueueEvent =
  | {
      type: "queued";
      item: InterviewUploadItem;
    }
  | {
      type: "uploading";
      item: InterviewUploadItem;
    }
  | {
      type: "uploaded";
      item: InterviewUploadItem;
    }
  | {
      type: "failed";
      item: InterviewUploadItem;
      error: string;
    }
  | {
      type: "retrying";
      item: InterviewUploadItem;
      attempt: number;
    }
  | {
      type: "online";
      isOnline: boolean;
    }
  | {
      type: "offline";
      isOnline: boolean;
    };

export type InterviewUploadItem = {
  id: string;
  sessionId: string;
  questionId: string;
  blob: Blob;
  mimeType: string;
  createdAt: string;
  status: InterviewUploadStatus;
  attempts: number;
  lastError?: string;
  progress: number;
  strategy: InterviewUploadStrategy;
};

export type UploadQueueConfig = {
  sessionId: string;
  concurrency?: number;
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  uploadUrl?: string;
  defaultStrategy?: InterviewUploadStrategy;
  uploadRequest?: (
    item: InterviewUploadItem,
    strategy: InterviewUploadStrategy,
  ) => Promise<void>;
  presignRequest?: (item: InterviewUploadItem) => Promise<{
    url: string;
    method?: string;
    headers?: Record<string, string>;
    body?: BodyInit;
  }>;
};

const DATABASE_NAME = "evalexa-interview-upload-queue";
const DATABASE_VERSION = 1;
const STORE_NAME = "pending-uploads";

export class InterviewUploadQueue {
  private readonly sessionId: string;
  private readonly concurrency: number;
  private readonly maxRetries: number;
  private readonly baseDelayMs: number;
  private readonly maxDelayMs: number;
  private readonly uploadUrl?: string;
  private readonly defaultStrategy: InterviewUploadStrategy;
  private readonly uploadRequest?: UploadQueueConfig["uploadRequest"];
  private readonly presignRequest?: UploadQueueConfig["presignRequest"];
  private readonly listeners = new Set<(event: UploadQueueEvent) => void>();
  private readonly items = new Map<string, InterviewUploadItem>();
  private readonly inflight = new Set<string>();
  private isOnline = typeof navigator === "undefined" ? true : navigator.onLine;
  private isDisposed = false;
  private drainScheduled = false;
  private readonly cleanupBeforeUnload = () => {
    if (this.hasPendingUploads()) {
      const event = window.event as BeforeUnloadEvent | undefined;
      if (event) {
        event.preventDefault();
        event.returnValue =
          "Uploads are still in progress. Leaving now may interrupt your interview submission.";
      }
    }
  };

  constructor(config: UploadQueueConfig) {
    this.sessionId = config.sessionId;
    this.concurrency = Math.max(1, config.concurrency ?? 2);
    this.maxRetries = Math.max(0, config.maxRetries ?? 4);
    this.baseDelayMs = Math.max(250, config.baseDelayMs ?? 1500);
    this.maxDelayMs = Math.max(this.baseDelayMs, config.maxDelayMs ?? 15000);
    this.uploadUrl = config.uploadUrl;
    this.defaultStrategy = config.defaultStrategy ?? "multipart";
    this.uploadRequest = config.uploadRequest;
    this.presignRequest = config.presignRequest;

    if (typeof window !== "undefined") {
      window.addEventListener("online", this.handleOnlineStatus);
      window.addEventListener("offline", this.handleOnlineStatus);
      window.addEventListener("beforeunload", this.cleanupBeforeUnload);
    }

    void this.restorePersistedQueue();
  }

  subscribe(listener: (event: UploadQueueEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getItems(): InterviewUploadItem[] {
    return Array.from(this.items.values());
  }

  getItem(questionId: string): InterviewUploadItem | undefined {
    return Array.from(this.items.values()).find(
      (item) => item.questionId === questionId,
    );
  }

  async enqueue(
    questionId: string,
    blob: Blob,
    mimeType: string,
    options?: {
      strategy?: InterviewUploadStrategy;
      id?: string;
      createdAt?: string;
    },
  ): Promise<InterviewUploadItem> {
    const id = options?.id ?? `${this.sessionId}:${questionId}:${Date.now()}`;
    const record: InterviewUploadItem = {
      id,
      sessionId: this.sessionId,
      questionId,
      blob,
      mimeType,
      createdAt: options?.createdAt ?? new Date().toISOString(),
      status: "queued",
      attempts: 0,
      progress: 0,
      strategy: options?.strategy ?? this.defaultStrategy,
    };

    this.items.set(id, record);
    await this.persist(record);
    this.emit({ type: "queued", item: record });
    this.scheduleDrain();

    return record;
  }

  async retryQuestion(
    questionId: string,
  ): Promise<InterviewUploadItem | undefined> {
    const item = this.getItem(questionId);
    if (!item) {
      throw new Error(`No upload queued for question ${questionId}.`);
    }

    if (item.status !== "failed") {
      return item;
    }

    const updatedItem: InterviewUploadItem = {
      ...item,
      status: "queued",
      progress: 0,
      lastError: undefined,
    };

    this.items.set(item.id, updatedItem);
    await this.persist(updatedItem);
    this.emit({
      type: "retrying",
      item: updatedItem,
      attempt: updatedItem.attempts + 1,
    });
    this.scheduleDrain();

    return updatedItem;
  }

  async flush(): Promise<void> {
    if (this.items.size === 0) {
      return;
    }

    while (this.hasWork()) {
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }

  hasPendingUploads(): boolean {
    return Array.from(this.items.values()).some(
      (item) => item.status === "queued" || item.status === "uploading",
    );
  }

  dispose(): void {
    this.isDisposed = true;

    if (typeof window !== "undefined") {
      window.removeEventListener("online", this.handleOnlineStatus);
      window.removeEventListener("offline", this.handleOnlineStatus);
      window.removeEventListener("beforeunload", this.cleanupBeforeUnload);
    }

    this.listeners.clear();
    this.items.clear();
    this.inflight.clear();
  }

  private readonly handleOnlineStatus = () => {
    const nextValue =
      typeof navigator === "undefined" ? true : navigator.onLine;
    this.isOnline = nextValue;

    this.emit({
      type: nextValue ? "online" : "offline",
      isOnline: nextValue,
    });

    if (nextValue) {
      this.scheduleDrain();
    }
  };

  private emit(event: UploadQueueEvent): void {
    for (const listener of this.listeners) {
      listener(event);
    }
  }

  private scheduleDrain(): void {
    if (this.isDisposed || this.drainScheduled) {
      return;
    }

    this.drainScheduled = true;
    queueMicrotask(() => {
      this.drainScheduled = false;
      void this.drain();
    });
  }

  private async drain(): Promise<void> {
    if (this.isDisposed || !this.isOnline) {
      return;
    }

    const readyItems = Array.from(this.items.values()).filter(
      (item) => item.status === "queued" && !this.inflight.has(item.id),
    );

    if (readyItems.length === 0) {
      return;
    }

    const availableSlots = this.concurrency - this.inflight.size;
    const itemsToRun = readyItems.slice(0, Math.max(1, availableSlots));

    for (const item of itemsToRun) {
      this.inflight.add(item.id);
      item.status = "uploading";
      item.progress = 10;
      this.emit({ type: "uploading", item });
      await this.persist(item);

      try {
        await this.upload(item);

        item.status = "uploaded";
        item.progress = 100;
        item.lastError = undefined;
        this.emit({ type: "uploaded", item });
        await this.removePersisted(item.id);
        this.items.delete(item.id);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Upload failed.";
        item.lastError = message;

        if (item.attempts >= this.maxRetries) {
          item.status = "failed";
          item.progress = 100;
          this.emit({ type: "failed", item, error: message });
        } else {
          item.attempts += 1;
          item.status = "queued";
          item.progress = 0;
          const delay = this.getBackoffDelay(item.attempts);
          this.emit({ type: "failed", item, error: message });
          setTimeout(() => this.scheduleDrain(), delay);
        }
      } finally {
        this.inflight.delete(item.id);
        await this.persist(item);
      }
    }

    if (this.hasWork()) {
      this.scheduleDrain();
    }
  }

  private hasWork(): boolean {
    return Array.from(this.items.values()).some(
      (item) => item.status === "queued" || item.status === "uploading",
    );
  }

  private getBackoffDelay(attempt: number): number {
    const exponential = this.baseDelayMs * 2 ** (attempt - 1);
    const withJitter = exponential + Math.random() * 300;
    return Math.min(withJitter, this.maxDelayMs);
  }

  private async upload(item: InterviewUploadItem): Promise<void> {
    const strategy = item.strategy;

    if (this.uploadRequest) {
      await this.uploadRequest(item, strategy);
      return;
    }

    if (strategy === "presigned") {
      if (!this.presignRequest) {
        throw new Error(
          "A presigned upload handler is required for presigned uploads.",
        );
      }

      const presigned = await this.presignRequest(item);
      const response = await fetch(presigned.url, {
        method: presigned.method ?? "PUT",
        headers: presigned.headers,
        body: presigned.body ?? item.blob,
      });

      if (!response.ok) {
        throw new Error(
          `Presigned upload failed: ${response.status} ${response.statusText}`,
        );
      }

      return;
    }

    if (!this.uploadUrl) {
      throw new Error(
        "No direct multipart upload endpoint has been configured.",
      );
    }

    const formData = new FormData();
    formData.append("file", item.blob, `${item.questionId}.webm`);
    formData.append("sessionId", item.sessionId);
    formData.append("questionId", item.questionId);
    formData.append("mimeType", item.mimeType);

    const response = await fetch(this.uploadUrl, {
      method: "POST",
      body: formData,
      headers: {
        "X-Session-Id": item.sessionId,
        "X-Question-Id": item.questionId,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Direct upload failed: ${response.status} ${response.statusText}`,
      );
    }
  }

  private async restorePersistedQueue(): Promise<void> {
    const records = await this.readStoredRecords();

    for (const record of records) {
      if (!this.items.has(record.id)) {
        this.items.set(record.id, record);
      }
    }

    if (this.hasPendingUploads()) {
      this.scheduleDrain();
    }
  }

  private async persist(record: InterviewUploadItem): Promise<void> {
    if (typeof indexedDB === "undefined") {
      return;
    }

    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(record);

      request.onsuccess = () => resolve();
      request.onerror = () =>
        reject(request.error ?? new Error("Failed to persist upload record."));
    });
  }

  private async removePersisted(id: string): Promise<void> {
    if (typeof indexedDB === "undefined") {
      return;
    }

    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () =>
        reject(request.error ?? new Error("Failed to remove upload record."));
    });
  }

  private async readStoredRecords(): Promise<InterviewUploadItem[]> {
    if (typeof indexedDB === "undefined") {
      return [];
    }

    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const records = Array.isArray(request.result) ? request.result : [];
        resolve(
          records.filter(
            (record) => record?.sessionId === this.sessionId,
          ) as InterviewUploadItem[],
        );
      };

      request.onerror = () =>
        reject(request.error ?? new Error("Failed to read queued uploads."));
    });
  }
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("Unable to open IndexedDB."));
  });
}
