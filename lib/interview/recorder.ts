export type InterviewRecorderReason = "next" | "skip" | "timeout";

export type InterviewRecordMetadata = {
  questionId: string;
  durationMs: number;
  mimeType: string;
  startedAt: string;
  endedAt: string;
  skipped: boolean;
  reason: InterviewRecorderReason;
};

export type RecordedQuestionAnswer = InterviewRecordMetadata & {
  blob: Blob;
};

export type InterviewRecorderConfig = {
  stream: MediaStream;
  videoBitsPerSecond?: number;
  audioBitsPerSecond?: number;
  mimeType?: string;
};

const DEFAULT_VIDEO_BITS_PER_SECOND = 700 * 1000;
const DEFAULT_AUDIO_BITS_PER_SECOND = 96 * 1000;
const MIME_TYPE_CANDIDATES = [
  "video/webm;codecs=vp9,opus",
  "video/webm;codecs=vp8,opus",
  "video/webm",
  "video/mp4",
];

export class InterviewRecorder {
  private readonly stream: MediaStream;
  private readonly videoBitsPerSecond: number;
  private readonly audioBitsPerSecond: number;
  private readonly preferredMimeType?: string;

  private currentQuestionId: string | null = null;
  private startedAt: number | null = null;
  private recorder: MediaRecorder | null = null;
  private chunks: BlobPart[] = [];

  constructor(config: InterviewRecorderConfig) {
    if (typeof MediaRecorder === "undefined") {
      throw new Error("MediaRecorder is not supported in this browser.");
    }

    this.stream = config.stream;
    this.videoBitsPerSecond =
      config.videoBitsPerSecond ?? DEFAULT_VIDEO_BITS_PER_SECOND;
    this.audioBitsPerSecond =
      config.audioBitsPerSecond ?? DEFAULT_AUDIO_BITS_PER_SECOND;
    this.preferredMimeType = config.mimeType ?? getSupportedMimeType();
  }

  static getSupportedMimeType(): string | undefined {
    return getSupportedMimeType();
  }

  getCurrentQuestionId(): string | null {
    return this.currentQuestionId;
  }

  async startQuestion(questionId: string): Promise<void> {
    if (!questionId.trim()) {
      throw new Error("A questionId is required to start recording.");
    }

    if (this.recorder && this.recorder.state !== "inactive") {
      throw new Error("A question is already being recorded.");
    }

    const mimeType = this.preferredMimeType ?? getSupportedMimeType();
    const options: MediaRecorderOptions = {};

    if (mimeType) {
      options.mimeType = mimeType;
    }

    if (this.stream.getVideoTracks().length > 0) {
      options.videoBitsPerSecond = this.videoBitsPerSecond;
    }

    if (this.stream.getAudioTracks().length > 0) {
      options.audioBitsPerSecond = this.audioBitsPerSecond;
    }

    this.currentQuestionId = questionId;
    this.startedAt = Date.now();
    this.chunks = [];

    try {
      this.recorder = new MediaRecorder(this.stream, options);
      this.recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.chunks.push(event.data);
        }
      };
      this.recorder.onerror = (event) => {
        const message =
          event.error instanceof Error
            ? event.error.message
            : "Recording failed.";
        throw new Error(message);
      };
      this.recorder.start();
    } catch (error) {
      this.currentQuestionId = null;
      this.startedAt = null;
      this.recorder = null;
      throw error instanceof Error
        ? error
        : new Error("Unable to start recording.");
    }
  }

  async finishQuestion(
    reason: InterviewRecorderReason,
  ): Promise<RecordedQuestionAnswer> {
    if (!this.recorder || !this.currentQuestionId || this.startedAt === null) {
      throw new Error("No active question to finish.");
    }

    const questionId = this.currentQuestionId;
    const startedAt = new Date(this.startedAt).toISOString();

    const finishedRecorder = this.recorder;
    this.recorder = null;
    this.currentQuestionId = null;
    this.startedAt = null;

    return new Promise<RecordedQuestionAnswer>((resolve, reject) => {
      const finalize = () => {
        const endedAtValue = new Date();
        const mimeType =
          finishedRecorder.mimeType ||
          this.preferredMimeType ||
          getSupportedMimeType() ||
          "video/webm";
        const blob = new Blob(this.chunks, { type: mimeType });

        resolve({
          questionId,
          blob,
          durationMs: Math.max(
            0,
            endedAtValue.getTime() - new Date(startedAt).getTime(),
          ),
          mimeType,
          startedAt,
          endedAt: endedAtValue.toISOString(),
          skipped: reason !== "next",
          reason,
        });
      };

      finishedRecorder.onstop = finalize;

      try {
        if (finishedRecorder.state !== "inactive") {
          finishedRecorder.stop();
        } else {
          finalize();
        }
      } catch (error) {
        reject(
          error instanceof Error
            ? error
            : new Error("Unable to stop the recorder."),
        );
      }
    });
  }

  dispose(): void {
    if (this.recorder && this.recorder.state !== "inactive") {
      try {
        this.recorder.stop();
      } catch {
        // ignore stop errors during cleanup
      }
    }

    this.stream.getTracks().forEach((track) => track.stop());
    this.recorder = null;
    this.currentQuestionId = null;
    this.startedAt = null;
    this.chunks = [];
  }
}

function getSupportedMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") {
    return undefined;
  }

  for (const mimeType of MIME_TYPE_CANDIDATES) {
    if (MediaRecorder.isTypeSupported(mimeType)) {
      return mimeType;
    }
  }

  return undefined;
}
