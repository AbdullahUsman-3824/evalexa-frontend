import { InterviewApiError } from "@/lib/interview-client";
import { interviewSessionService } from "@/services/interview-session.service";

/**
 * Sequential background queue: for each answer it does
 *   upload-url → direct upload → submit answer.
 * Answers are processed strictly in order because the backend requires
 * answers to be submitted in question order.
 */

type JobStatus = "queued" | "uploading" | "submitting" | "submitted" | "failed";

type Job = {
  questionId: string;
  blob: Blob | null;
  mimeType: string;
  durationSeconds: number;
  sizeBytes: number;
  status: JobStatus;
  attempts: number;
  storageKey?: string;
  isCompleted?: boolean;
  error?: string;
};

export type AnswerQueueSnapshot = {
  total: number;
  pending: number;
  submittedCount: number;
  failedCount: number;
  /** every enqueued answer is submitted */
  allSubmitted: boolean;
  /** the last submitted answer came back with isCompleted: true */
  lastSubmitCompleted: boolean;
  /** session cookie expired – retrying will not help */
  fatal: boolean;
  lastError: string | null;
};

export const EMPTY_QUEUE_SNAPSHOT: AnswerQueueSnapshot = {
  total: 0,
  pending: 0,
  submittedCount: 0,
  failedCount: 0,
  allSubmitted: true,
  lastSubmitCompleted: false,
  fatal: false,
  lastError: null,
};

type Options = {
  interviewId: string;
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
};

function deriveStorageKey(
  storagePath: string,
  interviewId: string,
  questionId: string,
): string {
  const prefix = `${interviewId}/${questionId}/`;
  const index = storagePath.indexOf(prefix);
  return index >= 0 ? storagePath.slice(index) : storagePath;
}

export class AnswerSubmissionQueue {
  private readonly interviewId: string;
  private readonly maxRetries: number;
  private readonly baseDelayMs: number;
  private readonly maxDelayMs: number;
  private readonly jobs: Job[] = [];
  private readonly listeners = new Set<(snapshot: AnswerQueueSnapshot) => void>();
  private running = false;
  private disposed = false;
  private fatal = false;

  constructor(options: Options) {
    this.interviewId = options.interviewId;
    this.maxRetries = options.maxRetries ?? 4;
    this.baseDelayMs = options.baseDelayMs ?? 1500;
    this.maxDelayMs = options.maxDelayMs ?? 12000;
  }

  subscribe(listener: (snapshot: AnswerQueueSnapshot) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getSnapshot(): AnswerQueueSnapshot {
    const submitted = this.jobs.filter((job) => job.status === "submitted");
    const failed = this.jobs.filter((job) => job.status === "failed");
    const pending = this.jobs.filter(
      (job) =>
        job.status === "queued" ||
        job.status === "uploading" ||
        job.status === "submitting",
    );
    const last = this.jobs[this.jobs.length - 1];

    return {
      total: this.jobs.length,
      pending: pending.length,
      submittedCount: submitted.length,
      failedCount: failed.length,
      allSubmitted: this.jobs.length === submitted.length,
      lastSubmitCompleted:
        !!last && last.status === "submitted" && last.isCompleted === true,
      fatal: this.fatal,
      lastError: failed[0]?.error ?? null,
    };
  }

  hasPending(): boolean {
    return this.jobs.some((job) => job.status !== "submitted");
  }

  enqueue(input: {
    questionId: string;
    blob: Blob;
    mimeType: string;
    durationSeconds: number;
  }): void {
    this.jobs.push({
      questionId: input.questionId,
      blob: input.blob,
      mimeType: input.mimeType,
      durationSeconds: Math.max(0, Math.round(input.durationSeconds)),
      sizeBytes: input.blob.size,
      status: "queued",
      attempts: 0,
    });
    this.emit();
    void this.run();
  }

  retryFailed(): void {
    let changed = false;
    for (const job of this.jobs) {
      if (job.status === "failed") {
        job.status = "queued";
        job.attempts = 0;
        job.error = undefined;
        changed = true;
      }
    }
    if (changed) {
      this.fatal = false;
      this.emit();
      void this.run();
    }
  }

  dispose(): void {
    this.disposed = true;
    this.listeners.clear();
  }

  private emit(): void {
    if (this.disposed) return;
    const snapshot = this.getSnapshot();
    for (const listener of this.listeners) listener(snapshot);
  }

  private async run(): Promise<void> {
    if (this.running || this.disposed) return;
    this.running = true;

    try {
      while (!this.disposed) {
        const job = this.jobs.find((item) => item.status === "queued");
        if (!job) break;

        const ok = await this.process(job);
        if (!ok) break; // keep order: stop until the failed job is retried
      }
    } finally {
      this.running = false;
    }
  }

  private async process(job: Job): Promise<boolean> {
    while (!this.disposed) {
      try {
        if (!job.storageKey) {
          job.status = "uploading";
          this.emit();

          if (!job.blob) throw new Error("Recording data is missing.");
          const upload = await interviewSessionService.getUploadUrl(
            this.interviewId,
            job.questionId,
          );
          await interviewSessionService.uploadRecording(
            upload,
            job.blob,
            job.mimeType,
          );
          job.storageKey = deriveStorageKey(
            upload.storagePath,
            this.interviewId,
            job.questionId,
          );
        }

        job.status = "submitting";
        this.emit();

        const result = await interviewSessionService.submitAnswer(
          this.interviewId,
          job.questionId,
          {
            durationSeconds: job.durationSeconds,
            storageKey: job.storageKey,
            mimeType: job.mimeType,
            sizeBytes: job.sizeBytes,
          },
        );

        job.status = "submitted";
        job.isCompleted = result.isCompleted;
        job.blob = null; // free memory
        job.error = undefined;
        this.emit();
        return true;
      } catch (error) {
        const status = error instanceof InterviewApiError ? error.status : undefined;
        job.error =
          error instanceof Error ? error.message : "Could not save your answer.";

        if (status === 401) {
          this.fatal = true;
          job.status = "failed";
          this.emit();
          return false;
        }

        // The file may be missing in storage – upload it again next time.
        if (status === 400) job.storageKey = undefined;

        job.attempts += 1;
        if (job.attempts > this.maxRetries) {
          job.status = "failed";
          this.emit();
          return false;
        }

        const delay = Math.min(
          this.baseDelayMs * 2 ** (job.attempts - 1) + Math.random() * 300,
          this.maxDelayMs,
        );
        job.status = "queued";
        this.emit();
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    return false;
  }
}