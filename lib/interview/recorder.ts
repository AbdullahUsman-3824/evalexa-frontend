/**
 * Records the candidate's microphone for one question at a time.
 *
 * The camera stays on for the candidate (live preview) but only the AUDIO
 * track is recorded, because the backend currently accepts audio only.
 */

export type RecordedAnswer = {
  blob: Blob;
  /** Bare MIME type without codec parameters, e.g. "audio/webm". */
  mimeType: string;
  durationMs: number;
};

const AUDIO_MIME_CANDIDATES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
  "audio/ogg;codecs=opus",
];

export function normalizeMimeType(mimeType: string): string {
  return mimeType.split(";")[0].trim().toLowerCase();
}

function pickAudioMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  return AUDIO_MIME_CANDIDATES.find((type) => MediaRecorder.isTypeSupported(type));
}

export class InterviewRecorder {
  private readonly audioStream: MediaStream;
  private recorder: MediaRecorder | null = null;
  private questionId: string | null = null;
  private startedAt = 0;
  private chunks: BlobPart[] = [];

  constructor(stream: MediaStream) {
    if (typeof MediaRecorder === "undefined") {
      throw new Error("Recording is not supported in this browser.");
    }

    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      throw new Error("No microphone found. Please check your microphone.");
    }

    this.audioStream = new MediaStream(audioTracks);
  }

  isRecordingQuestion(questionId: string): boolean {
    return (
      this.questionId === questionId &&
      this.recorder !== null &&
      this.recorder.state !== "inactive"
    );
  }

  startQuestion(questionId: string): void {
    if (this.recorder && this.recorder.state !== "inactive") {
      throw new Error("A question is already being recorded.");
    }

    const mimeType = pickAudioMimeType();
    const recorder = new MediaRecorder(
      this.audioStream,
      mimeType ? { mimeType } : undefined,
    );

    this.chunks = [];
    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) this.chunks.push(event.data);
    };

    this.recorder = recorder;
    this.questionId = questionId;
    this.startedAt = Date.now();
    recorder.start(1000);
  }

  finishQuestion(): Promise<RecordedAnswer> {
    const recorder = this.recorder;
    if (!recorder || !this.questionId) {
      return Promise.reject(new Error("No active recording to finish."));
    }

    const startedAt = this.startedAt;
    this.recorder = null;
    this.questionId = null;

    return new Promise<RecordedAnswer>((resolve, reject) => {
      const finalize = () => {
        const rawType = recorder.mimeType || pickAudioMimeType() || "audio/webm";
        const mimeType = normalizeMimeType(rawType);
        resolve({
          blob: new Blob(this.chunks, { type: mimeType }),
          mimeType,
          durationMs: Math.max(0, Date.now() - startedAt),
        });
        this.chunks = [];
      };

      recorder.onstop = finalize;
      recorder.onerror = () => reject(new Error("Recording failed."));

      try {
        if (recorder.state !== "inactive") {
          recorder.stop();
        } else {
          finalize();
        }
      } catch (error) {
        reject(
          error instanceof Error ? error : new Error("Unable to stop recording."),
        );
      }
    });
  }

  /** Stops recording. Does NOT stop the camera/mic tracks (shared stream). */
  dispose(): void {
    if (this.recorder && this.recorder.state !== "inactive") {
      try {
        this.recorder.ondataavailable = null;
        this.recorder.stop();
      } catch {
        // ignore
      }
    }
    this.recorder = null;
    this.questionId = null;
    this.chunks = [];
  }
}