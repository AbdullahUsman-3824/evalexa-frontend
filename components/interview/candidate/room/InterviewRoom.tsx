"use client";

import { motion } from "framer-motion";
import { Camera, Clock3, Info, LoaderCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SessionStatePanel from "@/components/interview/candidate/session/SessionStatePanel";
import CompletionHoldingScreen from "@/components/interview/candidate/take/CompletionHoldingScreen";
import { useInterviewSecurity } from "@/hooks/useInterviewSecurity";
import { InterviewApiError } from "@/lib/interview-client";
import {
  AnswerSubmissionQueue,
  EMPTY_QUEUE_SNAPSHOT,
  type AnswerQueueSnapshot,
} from "@/lib/interview/answerQueue";
import {
  clearInterviewInfo,
  readInterviewInfo,
  resolveInterviewInfo,
  type StoredInterviewInfo,
} from "@/lib/interview/infoStore";
import { InterviewRecorder } from "@/lib/interview/recorder";
import { interviewSessionService } from "@/services/interview-session.service";
import type { ApiQuestion } from "@/types/interview.types";

type RoomMode =
  | "question"
  | "waiting-next"
  | "holding"
  | "finished"
  | "terminated"
  | "error";

/** The API does not send a per-question limit, so this is a client default. */
const QUESTION_TIME_LIMIT_SECONDS = 120;
/** Prevents submitting an empty recording by double-clicking Next. */
const MIN_ANSWER_SECONDS = 2;

interface InterviewRoomProps {
  interviewId: string;
  stream: MediaStream | null;
  initialQuestion: ApiQuestion;
}

function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, Math.ceil(totalSeconds));
  const minutes = Math.floor(safe / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (safe % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function InterviewRoom({
  interviewId,
  stream,
  initialQuestion,
}: InterviewRoomProps) {
  const [current, setCurrent] = useState<ApiQuestion>(initialQuestion);
  const [mode, setMode] = useState<RoomMode>("question");
  const [error, setError] = useState<string | null>(null);
  const [terminationMessage, setTerminationMessage] = useState<string | null>(
    null,
  );
  const [info, setInfo] = useState<StoredInterviewInfo | null>(() =>
    readInterviewInfo(interviewId),
  );
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [questionSeconds, setQuestionSeconds] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isOnline, setIsOnline] = useState(
    typeof navigator === "undefined" ? true : navigator.onLine,
  );
  const [queueState, setQueueState] = useState<AnswerQueueSnapshot>(
    EMPTY_QUEUE_SNAPSHOT,
  );
  const [nextQuestion, setNextQuestion] = useState<ApiQuestion | null>(null);
  const [noMoreQuestions, setNoMoreQuestions] = useState(false);
  const [nextFetchError, setNextFetchError] = useState<string | null>(null);

  const recorderRef = useRef<InterviewRecorder | null>(null);
  const queueRef = useRef<AnswerSubmissionQueue | null>(null);
  const nextRef = useRef<ApiQuestion | null>(null);
  const noMoreRef = useRef(false);
  const fetchingRef = useRef(false);
  const fetchFailuresRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefetchRef = useRef<(() => Promise<void>) | null>(null);
  const lockRef = useRef(false);
  const disposedRef = useRef(false);
  const questionStartedAtRef = useRef(Date.now());
  const roomStartedAtRef = useRef(Date.now());

  /* ───────── security (client-side policy: warn, then terminate) ───────── */

  const { warningOpen, requestReturnToFullscreen, isHidden } =
    useInterviewSecurity({
      interviewId,
      enabled: mode === "question" || mode === "waiting-next",
      onTerminate: (reason) => {
        recorderRef.current?.dispose();
        recorderRef.current = null;
        setTerminationMessage(
          `This interview was terminated because the security policy detected ${reason.replace(/_/g, " ")}.`,
        );
        setMode("terminated");
      },
    });

  /* ───────── background answer queue ───────── */

  useEffect(() => {
    disposedRef.current = false;
    const queue = new AnswerSubmissionQueue({ interviewId });
    queueRef.current = queue;
    const unsubscribe = queue.subscribe(setQueueState);

    return () => {
      disposedRef.current = true;
      unsubscribe();
      queue.dispose();
      if (queueRef.current === queue) queueRef.current = null;
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    };
  }, [interviewId]);

  /* ───────── interview info (stored, with Session API 1b fallback) ───────── */

  useEffect(() => {
    if (info) return;
    let active = true;

    resolveInterviewInfo(interviewId)
      .then((resolved) => {
        if (active) setInfo(resolved);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [info, interviewId]);

  /* ───────── prefetch the next question in the background ───────── */

  const scheduleRetry = useCallback((delayMs: number) => {
    if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    retryTimerRef.current = setTimeout(() => {
      retryTimerRef.current = null;
      void prefetchRef.current?.();
    }, delayMs);
  }, []);

  const prefetchNext = useCallback(async () => {
    if (
      disposedRef.current ||
      fetchingRef.current ||
      nextRef.current ||
      noMoreRef.current
    ) {
      return;
    }

    fetchingRef.current = true;
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }

    try {
      const result = await interviewSessionService.getNextQuestion(interviewId);
      if (disposedRef.current) return;

      fetchFailuresRef.current = 0;
      setNextFetchError(null);

      if (result.question) {
        nextRef.current = result.question;
        setNextQuestion(result.question);
      } else {
        noMoreRef.current = true;
        setNoMoreQuestions(true);
      }
    } catch (fetchError) {
      if (disposedRef.current) return;

      const status =
        fetchError instanceof InterviewApiError ? fetchError.status : undefined;
      const message = fetchError instanceof Error ? fetchError.message : "";

      if (status === 401) {
        setError(
          "Your interview session has expired. Please open your invitation link again to resume.",
        );
        setMode("error");
        return;
      }

      if (status === 409) {
        // "Wait for the previous question to be submitted…" – retried when the
        // next answer finishes submitting (see effect below).
        if (/previous question/i.test(message)) return;

        // "Please retry in N seconds" (5 second send cooldown)
        const match = message.match(/(\d+)\s*second/i);
        scheduleRetry(((match ? Number(match[1]) : 5) + 0.5) * 1000);
        return;
      }

      fetchFailuresRef.current += 1;
      if (fetchFailuresRef.current <= 5) {
        scheduleRetry(Math.min(2000 * fetchFailuresRef.current, 10000));
      } else {
        setNextFetchError(message || "Could not load the next question.");
      }
    } finally {
      fetchingRef.current = false;
    }
  }, [interviewId, scheduleRetry]);

  useEffect(() => {
    prefetchRef.current = prefetchNext;
  }, [prefetchNext]);

  // First question is already visible → fetch the second one right away.
  // Repeats for every new current question and after every submitted answer.
  useEffect(() => {
    void prefetchNext();
  }, [current.id, queueState.submittedCount, prefetchNext]);

  /* ───────── recording: one audio recording per question ───────── */

  useEffect(() => {
    if (mode !== "question" || !stream) return;

    try {
      if (!recorderRef.current) {
        recorderRef.current = new InterviewRecorder(stream);
      }

      if (!recorderRef.current.isRecordingQuestion(current.id)) {
        recorderRef.current.startQuestion(current.id);
      }
    } catch (recordError) {
      setError(
        recordError instanceof Error
          ? recordError.message
          : "Unable to start recording for this question.",
      );
      setMode("error");
    }
  }, [mode, current.id, stream]);

  useEffect(() => {
    return () => {
      recorderRef.current?.dispose();
      recorderRef.current = null;
    };
  }, []);

  /* ───────── timers ───────── */

  useEffect(() => {
    if (mode !== "question") return;

    const tick = () => {
      setQuestionSeconds(
        Math.floor((Date.now() - questionStartedAtRef.current) / 1000),
      );
      setElapsedSeconds(
        Math.floor((Date.now() - roomStartedAtRef.current) / 1000),
      );
    };

    tick();
    const timer = window.setInterval(tick, 500);
    return () => window.clearInterval(timer);
  }, [mode, current.id]);

  useEffect(() => {
    const handleConnectivity = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", handleConnectivity);
    window.addEventListener("offline", handleConnectivity);
    return () => {
      window.removeEventListener("online", handleConnectivity);
      window.removeEventListener("offline", handleConnectivity);
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (queueRef.current?.hasPending() || lockRef.current) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  /* ───────── moving between questions ───────── */

  const showQuestion = useCallback((question: ApiQuestion) => {
    nextRef.current = null;
    setNextQuestion(null);
    questionStartedAtRef.current = Date.now();
    setQuestionSeconds(0);
    setCurrent(question);
    setMode("question");
  }, []);

  // Candidate pressed Next before the prefetch finished.
  useEffect(() => {
    if (mode !== "waiting-next") return;

    if (nextQuestion) {
      showQuestion(nextQuestion);
    } else if (noMoreQuestions) {
      setMode("holding");
    }
  }, [mode, nextQuestion, noMoreQuestions, showQuestion]);

  const handleAdvance = useCallback(async () => {
    if (lockRef.current || mode !== "question") return;
    lockRef.current = true;

    try {
      const recorder = recorderRef.current;
      const queue = queueRef.current;

      if (!recorder || !queue || !recorder.isRecordingQuestion(current.id)) {
        throw new Error("Recording is not active for this question.");
      }

      const recorded = await recorder.finishQuestion();
      if (recorded.blob.size === 0) {
        throw new Error(
          "No audio was captured. Please check your microphone and try again.",
        );
      }

      // Answer is saved silently in the background (upload → submit).
      queue.enqueue({
        questionId: current.id,
        blob: recorded.blob,
        mimeType: recorded.mimeType,
        durationSeconds: recorded.durationMs / 1000,
      });

      if (nextRef.current) {
        showQuestion(nextRef.current);
      } else if (noMoreRef.current) {
        setMode("holding");
      } else {
        setMode("waiting-next");
      }
    } catch (advanceError) {
      setError(
        advanceError instanceof Error
          ? advanceError.message
          : "Unable to move to the next question.",
      );
      setMode("error");
    } finally {
      lockRef.current = false;
    }
  }, [current.id, mode, showQuestion]);

  useEffect(() => {
    if (mode === "question" && questionSeconds >= QUESTION_TIME_LIMIT_SECONDS) {
      void handleAdvance();
    }
  }, [handleAdvance, mode, questionSeconds]);

  /* ───────── finishing ───────── */

  const handleFinish = useCallback(() => {
    // No API call – purely a frontend step.
    stream?.getTracks().forEach((track) => track.stop());
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => undefined);
    }
    clearInterviewInfo(interviewId);
    setMode("finished");
  }, [interviewId, stream]);

  const retryNextFetch = useCallback(() => {
    fetchFailuresRef.current = 0;
    setNextFetchError(null);
    void prefetchNext();
  }, [prefetchNext]);

  const infoDetails = useMemo(
    () => [
      { label: "Position", value: info?.jobTitle ?? "Loading…" },
      { label: "Company", value: info?.companyName ?? "Loading…" },
      { label: "Candidate", value: info?.candidateName ?? "Loading…" },
      { label: "Interview", value: "AI-assisted video interview" },
    ],
    [info],
  );

  const remainingSeconds = Math.max(
    0,
    QUESTION_TIME_LIMIT_SECONDS - questionSeconds,
  );
  const isCritical = remainingSeconds <= 10;
  const canAdvance = questionSeconds >= MIN_ANSWER_SECONDS;
  const isReadyToFinish =
    queueState.allSubmitted && queueState.lastSubmitCompleted;

  /* ───────── screens ───────── */

  if (mode === "finished") {
    return (
      <SessionStatePanel
        title="Thank you!"
        description="Your interview has been submitted. The recruiter will review your responses and get back to you."
        variant="success"
      />
    );
  }

  if (mode === "holding") {
    return (
      <CompletionHoldingScreen
        isReady={isReadyToFinish}
        hasFailed={queueState.failedCount > 0}
        isFatal={queueState.fatal}
        onFinish={handleFinish}
        onRetry={() => queueRef.current?.retryFailed()}
      />
    );
  }

  if (mode === "terminated") {
    return (
      <SessionStatePanel
        title="Session ended"
        description={
          terminationMessage ??
          "This interview has been terminated by the system."
        }
        variant="danger"
        actionLabel="Exit"
        onAction={() => {
          clearInterviewInfo(interviewId);
          window.location.href = "/";
        }}
      />
    );
  }

  if (mode === "error") {
    return (
      <SessionStatePanel
        title="Something interrupted this session."
        description={error ?? "Unable to continue the interview."}
        actionLabel="Try again"
        onAction={() => window.location.reload()}
        variant="danger"
      />
    );
  }

  if (isHidden) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05070b] px-6 text-white">
        <div className="max-w-md rounded-3xl border border-amber-500/30 bg-amber-500/10 px-8 py-10 text-center shadow-2xl backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">
            Page hidden
          </p>
          <h2 className="mt-4 font-syne text-3xl font-bold text-white">
            Return to the interview
          </h2>
          <p className="mt-3 text-sm text-amber-100">
            Please return to this tab and fullscreen to continue.
          </p>
        </div>
      </main>
    );
  }

  if (mode === "waiting-next") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090b10] px-6 text-white">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/5 px-8 py-8 text-center backdrop-blur-sm">
          {nextFetchError ? (
            <>
              <p className="text-sm text-amber-200">{nextFetchError}</p>
              <button
                type="button"
                onClick={retryNextFetch}
                className="rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Try again
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <LoaderCircle className="h-4 w-4 animate-spin text-cyan-300" />
              Preparing your next question…
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      {!isOnline && (
        <div className="relative z-20 border-b border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center text-sm font-medium text-amber-100">
          Connection lost - your completed answers will be saved when you are
          back online
        </div>
      )}

      {queueState.failedCount > 0 && (
        <div className="relative z-20 flex flex-wrap items-center justify-center gap-3 border-b border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center text-sm font-medium text-amber-100">
          {queueState.fatal
            ? "Your session has expired. Please open your invitation link again."
            : "An earlier answer could not be saved yet."}
          {!queueState.fatal && (
            <button
              type="button"
              onClick={() => queueRef.current?.retryFailed()}
              className="rounded-lg border border-amber-300/40 px-3 py-1 text-xs font-semibold text-amber-50 hover:bg-amber-500/20"
            >
              Retry
            </button>
          )}
        </div>
      )}

      <Dialog
        open={warningOpen}
        onOpenChange={(open) => !open && void requestReturnToFullscreen()}
      >
        <DialogContent className="max-w-md rounded-2xl border border-amber-500/30 bg-slate-950 text-white shadow-2xl">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-left text-lg text-white">
              Warning: return to fullscreen
            </DialogTitle>
            <DialogDescription className="text-left text-sm text-slate-300">
              Leaving the interview screen is not allowed. One more violation
              will end your interview.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={() => void requestReturnToFullscreen()}
              className="rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Return to fullscreen
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="absolute inset-0 opacity-100 blur-[2px]" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at top left, rgba(34, 211, 238, 0.18), transparent 32%), radial-gradient(circle at bottom right, rgba(29, 78, 216, 0.16), transparent 28%), linear-gradient(135deg, #090b10, #0b1017 28%, #0f172a 100%)",
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <header className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/50 px-3 py-2 backdrop-blur-sm">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.9)] animate-pulse" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-red-200">
                REC
              </span>
            </div>
            <div className="rounded-full border border-white/10 bg-slate-950/50 px-3 py-2 backdrop-blur-sm">
              <span className="text-[10px] font-medium tracking-[0.14em] text-slate-200 uppercase">
                Elapsed {formatTime(elapsedSeconds)}
              </span>
            </div>
          </div>

          <Dialog open={isInfoOpen} onOpenChange={setIsInfoOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-950/60 text-slate-100 shadow-lg backdrop-blur-sm transition hover:border-cyan-400/60 hover:text-cyan-200"
                aria-label="Interview details"
              >
                <Info className="h-4 w-4" />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md rounded-2xl border border-white/10 bg-slate-950 text-white shadow-2xl">
              <DialogHeader className="space-y-2">
                <DialogTitle className="text-left text-lg text-white">
                  Interview details
                </DialogTitle>
                <DialogDescription className="text-left text-sm text-slate-300">
                  Candidate, role, and company for this interview.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-3">
                {infoDetails.map((detail) => (
                  <div
                    key={detail.label}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5"
                  >
                    <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      {detail.label}
                    </span>
                    <span className="text-sm font-medium text-slate-100">
                      {detail.value}
                    </span>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </header>

        <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 pb-44 pt-6 sm:pb-16">
          <div className="relative w-full max-w-4xl">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative rounded-[30px] border border-white/10 bg-slate-900/70 p-4 shadow-[0_28px_80px_rgba(2,6,23,0.8)] backdrop-blur-xl sm:p-5"
            >
              <div className="absolute left-1/2 -top-3 z-20 -translate-x-1/2 rounded-full border border-cyan-400/40 bg-cyan-500/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-100 shadow-lg shadow-cyan-500/10">
                Q{current.order}
              </div>

              <div className="min-h-[260px] rounded-[22px] border border-white/10 bg-slate-950/60 p-4 sm:min-h-[300px] sm:p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                    <Clock3
                      className={`h-3.5 w-3.5 ${isCritical ? "text-red-300" : "text-cyan-300"}`}
                    />
                    <span
                      className={isCritical ? "text-red-200" : "text-slate-200"}
                    >
                      {current.category ?? "Question"}
                    </span>
                  </div>
                  <div
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                      isCritical
                        ? "border-red-500/40 bg-red-500/10 text-red-100"
                        : "border-cyan-500/30 bg-cyan-500/10 text-cyan-100"
                    }`}
                  >
                    {formatTime(remainingSeconds)}
                  </div>
                </div>

                <div className="max-h-[44vh] overflow-y-auto pr-1">
                  <p className="font-syne text-xl font-bold leading-relaxed text-white sm:text-2xl">
                    {current.questionText}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    disabled={!canAdvance}
                    onClick={() => void handleAdvance()}
                    className="rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Next
                  </button>
                </div>
              </div>
            </motion.div>

            <div className="fixed bottom-6 right-6 z-30 flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border border-cyan-400/30 bg-slate-950/80 shadow-[0_14px_40px_rgba(34,211,238,0.12)] backdrop-blur-sm sm:h-32 sm:w-32">
              {stream ? (
                <video
                  ref={(element) => {
                    if (element && element.srcObject !== stream) {
                      element.srcObject = stream;
                      void element.play().catch(() => undefined);
                    }
                  }}
                  autoPlay
                  muted
                  playsInline
                  className="h-full w-full scale-x-[-1] object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-slate-300">
                  <Camera className="h-5 w-5 text-cyan-300" />
                  <span>Camera</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}