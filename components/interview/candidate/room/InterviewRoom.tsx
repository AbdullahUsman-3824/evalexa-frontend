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
import { clearStoredInterviewSession } from "@/hooks/useInterviewSession";
import { useInterviewSecurity } from "@/hooks/useInterviewSecurity";
import { InterviewRecorder } from "@/lib/interview/recorder";
import {
  InterviewUploadQueue,
  type UploadQueueEvent,
} from "@/lib/interview/uploadQueue";
import { interviewSessionService } from "@/services/interview-session.service";
import type { SessionState } from "@/types/interview.types";

type RoomMode =
  | "loading"
  | "question"
  | "transitioning"
  | "finishing"
  | "terminated"
  | "error";

type AdvanceReason = "next" | "skip" | "timeout";

interface InterviewRoomProps {
  interviewId: string;
  sessionId: string;
  stream: MediaStream | null;
  candidateName?: string;
  jobTitle?: string;
}

function formatTime(milliseconds: number): string {
  if (!Number.isFinite(milliseconds)) {
    return "00:00";
  }

  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function getRemainingMs(session: SessionState | null): number | null {
  if (!session) {
    return null;
  }

  const serverNow = new Date(session.serverTime).getTime();
  const clientNow = Date.now();
  const offset = serverNow - clientNow;
  const deadline =
    new Date(session.currentQuestion.deadlineAt).getTime() + offset;

  return deadline - Date.now();
}

function getElapsedMs(
  session: SessionState | null,
  fallbackStartAtMs: number,
): number | null {
  if (!session) {
    return null;
  }

  if (session.startedAt) {
    const serverNow = new Date(session.serverTime).getTime();
    const clientNow = Date.now();
    const offset = serverNow - clientNow;
    const startedAtClientClock = new Date(session.startedAt).getTime() - offset;
    return Math.max(0, Date.now() - startedAtClientClock);
  }

  return Math.max(0, Date.now() - fallbackStartAtMs);
}

export default function InterviewRoom({
  sessionId,
  stream,
  candidateName = "Candidate",
  jobTitle = "AI Interview",
}: InterviewRoomProps) {
  const [session, setSession] = useState<SessionState | null>(null);
  const [mode, setMode] = useState<RoomMode>("loading");
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [remainingMs, setRemainingMs] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("Ready");
  const [isActionLocked, setIsActionLocked] = useState(false);
  const [transitionHint, setTransitionHint] = useState<string | null>(null);
  const [shouldRenderPreview, setShouldRenderPreview] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof navigator === "undefined" ? true : navigator.onLine,
  );
  const [terminationMessage, setTerminationMessage] = useState<string | null>(
    null,
  );
  const [pendingUploadCount, setPendingUploadCount] = useState(0);
  const [failedUploadCount, setFailedUploadCount] = useState(0);

  const { warningOpen, requestReturnToFullscreen, isHidden } =
    useInterviewSecurity({
      sessionId,
      questionId: session?.currentQuestion?.id ?? null,
      enabled: mode === "question",
      onTerminate: async (reason) => {
        try {
          recorderRef.current?.dispose();
          await queueRef.current?.flush();
        } catch {
          // Ignore cleanup failures; the session is already being terminated.
        }

        try {
          await interviewSessionService.terminateSession(sessionId);
        } catch {
          // Ignore termination failures here; this is still a security-driven stop.
        }

        setTerminationMessage(
          `This interview was terminated because the security policy detected ${reason}.`,
        );
        setError(reason);
        setMode("terminated");
      },
    });

  const recorderRef = useRef<InterviewRecorder | null>(null);
  const queueRef = useRef<InterviewUploadQueue | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastQuestionIdRef = useRef<string | null>(null);
  const lastAdvanceTimeRef = useRef<number>(0);
  const fallbackStartAtMsRef = useRef<number>(Date.now());

  const syncUploadQueueState = useCallback(() => {
    const queue = queueRef.current;
    if (!queue) {
      setPendingUploadCount(0);
      setFailedUploadCount(0);
      return;
    }

    const items = queue.getItems();
    setPendingUploadCount(
      items.filter(
        (item) => item.status === "queued" || item.status === "uploading",
      ).length,
    );
    setFailedUploadCount(
      items.filter((item) => item.status === "failed").length,
    );
  }, []);

  const queueReady = useCallback(() => {
    if (queueRef.current) {
      return queueRef.current;
    }

    const queue = new InterviewUploadQueue({
      sessionId,
      concurrency: 1,
      maxRetries: 4,
      baseDelayMs: 1500,
      maxDelayMs: 12000,
      uploadRequest: async (item) => {
        await new Promise((resolve) => {
          setTimeout(resolve, 700 + Math.random() * 600);
        });

        if (Math.random() < 0.15) {
          throw new Error(`Upload failed for ${item.questionId}.`);
        }
      },
    });

    queueRef.current = queue;
    syncUploadQueueState();
    return queue;
  }, [sessionId, syncUploadQueueState]);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      try {
        const nextSession =
          await interviewSessionService.getSessionState(sessionId);
        if (!active) {
          return;
        }

        setSession(nextSession);
        setRemainingMs(getRemainingMs(nextSession));
        setElapsedMs(getElapsedMs(nextSession, fallbackStartAtMsRef.current));

        if (nextSession.status === "TERMINATED") {
          setMode("terminated");
          return;
        }

        if (nextSession.status === "COMPLETED") {
          setMode("finishing");
          return;
        }

        setMode("question");
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load the active interview.",
        );
        setMode("error");
      }
    }

    void loadSession();

    return () => {
      active = false;
    };
  }, [sessionId]);

  useEffect(() => {
    if (!stream) {
      return;
    }

    const recorder = new InterviewRecorder({
      stream,
      videoBitsPerSecond: 700000,
      audioBitsPerSecond: 96000,
    });

    recorderRef.current = recorder;

    return () => {
      recorder.dispose();
      recorderRef.current = null;
    };
  }, [stream]);

  useEffect(() => {
    if (!stream || !videoRef.current) {
      return;
    }

    videoRef.current.srcObject = stream;
    videoRef.current.muted = true;
    videoRef.current.playsInline = true;
    videoRef.current.play().catch(() => undefined);
    setShouldRenderPreview(true);
  }, [stream]);

  useEffect(() => {
    if (!queueRef.current) {
      queueReady();
    }

    const queue = queueReady();
    const unsubscribe = queue.subscribe((event: UploadQueueEvent) => {
      if (event.type === "uploading") {
        setUploadStatus("Uploading previous answer…");
      }
      if (event.type === "retrying") {
        setUploadStatus(`Retrying previous answer… (attempt ${event.attempt})`);
      }
      if (event.type === "failed") {
        setUploadStatus(`Upload failed: ${event.error}`);
      }
      if (event.type === "uploaded") {
        setUploadStatus("Answer uploaded");
      }

      syncUploadQueueState();
    });

    syncUploadQueueState();

    return () => {
      unsubscribe();
    };
  }, [queueReady, syncUploadQueueState]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleConnectivity = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", handleConnectivity);
    window.addEventListener("offline", handleConnectivity);

    return () => {
      window.removeEventListener("online", handleConnectivity);
      window.removeEventListener("offline", handleConnectivity);
    };
  }, []);

  useEffect(() => {
    if (!session || !stream || !recorderRef.current) {
      return;
    }

    const questionId = session.currentQuestion.id;
    if (lastQuestionIdRef.current === questionId) {
      return;
    }

    lastQuestionIdRef.current = questionId;

    recorderRef.current.startQuestion(questionId).catch((startError) => {
      setError(
        startError instanceof Error
          ? startError.message
          : "Unable to start camera recording for this question.",
      );
      setMode("error");
    });
  }, [session, stream]);

  useEffect(() => {
    if (!session) {
      return;
    }

    const updateTime = () => {
      setRemainingMs(getRemainingMs(session));
      setElapsedMs(getElapsedMs(session, fallbackStartAtMsRef.current));
    };

    updateTime();
    const timer = window.setInterval(updateTime, 250);

    return () => {
      window.clearInterval(timer);
    };
  }, [session]);

  const criticalSeconds =
    remainingMs == null ? 0 : Math.max(0, remainingMs / 1000);
  const isCritical = criticalSeconds <= 10;
  const blinkDuration =
    criticalSeconds <= 1 ? 0.25 : criticalSeconds <= 3 ? 0.5 : 0.75;
  const displayTime = remainingMs == null ? "00:00" : formatTime(remainingMs);
  const elapsedDisplayTime =
    elapsedMs == null ? "00:00" : formatTime(elapsedMs);

  const currentQuestion = session?.currentQuestion ?? null;
  const questionNumber = currentQuestion?.order ?? 1;

  const handleAdvance = useCallback(
    async (reason: AdvanceReason) => {
      if (!session || isActionLocked || mode !== "question") {
        return;
      }

      const currentQuestionId = session.currentQuestion.id;
      const now = Date.now();
      if (now - lastAdvanceTimeRef.current < 700) {
        return;
      }

      lastAdvanceTimeRef.current = now;
      setIsActionLocked(true);
      setMode("transitioning");
      setTransitionHint(
        reason === "skip"
          ? "Skipping question and uploading the recording…"
          : reason === "timeout"
            ? "Time expired — uploading the final recording…"
            : "Submitting your answer and preparing the next question…",
      );
      setError(null);

      try {
        if (recorderRef.current) {
          const result = await recorderRef.current.finishQuestion(reason);
          const queue = queueReady();
          await queue.enqueue(currentQuestionId, result.blob, result.mimeType, {
            strategy: "multipart",
          });
        }

        const updatedSession = await interviewSessionService.answerQuestion(
          sessionId,
          currentQuestionId,
          "",
        );

        const sessionState =
          updatedSession.currentQuestion.order >=
          updatedSession.currentQuestion.total
            ? await interviewSessionService.submitSession(sessionId)
            : updatedSession;

        if (sessionState.status === "COMPLETED") {
          setSession(sessionState);
          setMode("finishing");
          return;
        }

        setSession(sessionState);
        setMode("question");
      } catch (advanceError) {
        setError(
          advanceError instanceof Error
            ? advanceError.message
            : "Unable to move to the next question.",
        );
        setMode("error");
      } finally {
        setTransitionHint(null);
        setIsActionLocked(false);
      }
    },
    [isActionLocked, mode, queueReady, session, sessionId],
  );

  useEffect(() => {
    if (!session || mode !== "question") {
      return;
    }

    if (remainingMs === null) {
      return;
    }

    if (remainingMs <= 0) {
      void handleAdvance("timeout");
    }
  }, [handleAdvance, mode, remainingMs, session]);

  useEffect(() => {
    if (mode === "finishing") {
      return;
    }

    if (session && session.status === "TERMINATED") {
      setMode("terminated");
    }
  }, [mode, session]);

  const retryFailedUploads = useCallback(async () => {
    const queue = queueRef.current;
    if (!queue) {
      return;
    }

    const failedItems = queue
      .getItems()
      .filter((item) => item.status === "failed");

    for (const item of failedItems) {
      await queue.retryQuestion(item.questionId);
    }

    syncUploadQueueState();
  }, [syncUploadQueueState]);

  const handleExitInterview = useCallback(() => {
    clearStoredInterviewSession();
    window.location.href = "/";
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (pendingUploadCount > 0 || mode === "transitioning") {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [mode, pendingUploadCount]);

  const infoDetails = useMemo(
    () => [
      { label: "Position", value: jobTitle },
      { label: "Candidate", value: candidateName },
      { label: "Interview", value: "AI-assisted video interview" },
      { label: "Session", value: sessionId.slice(0, 10) },
    ],
    [candidateName, jobTitle, sessionId],
  );

  if (mode === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090b10] px-6 text-white">
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 backdrop-blur-sm">
          <LoaderCircle className="h-4 w-4 animate-spin text-cyan-300" />
          Loading interview…
        </div>
      </main>
    );
  }

  if (mode === "terminated" || mode === "finishing") {
    const isStillUploading = pendingUploadCount > 0;
    const uploadTitle = isStillUploading
      ? `Still uploading ${pendingUploadCount} answer${pendingUploadCount === 1 ? "" : "s"}`
      : "All answers uploaded - interview submitted";

    const descriptionText = isStillUploading
      ? "Keep this tab open until the upload finishes. Leaving now may interrupt the final submission."
      : "Your final responses have been recorded and submitted.";

    return (
      <SessionStatePanel
        title={mode === "terminated" ? "Session ended" : uploadTitle}
        description={
          mode === "terminated"
            ? (terminationMessage ??
              "This interview has been terminated by the system.")
            : descriptionText
        }
        variant={
          mode === "terminated"
            ? "danger"
            : isStillUploading
              ? "warning"
              : "success"
        }
        actionLabel={
          !isStillUploading && failedUploadCount > 0
            ? "Retry upload"
            : mode === "terminated"
              ? "Review next step"
              : undefined
        }
        onAction={
          !isStillUploading && failedUploadCount > 0
            ? () => {
                void retryFailedUploads();
              }
            : mode === "terminated"
              ? () => {
                  window.location.href = "/";
                }
              : undefined
        }
        secondaryActionLabel="Exit interview"
        onSecondaryAction={handleExitInterview}
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
            The interview is paused while the page is not visible. Please return
            to fullscreen to continue.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      {!isOnline && (
        <div className="relative z-20 border-b border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center text-sm font-medium text-amber-100">
          Connection lost - your completed answers are safe
        </div>
      )}

      <Dialog
        open={warningOpen}
        onOpenChange={(open) => !open && requestReturnToFullscreen()}
      >
        <DialogContent className="max-w-md rounded-2xl border border-amber-500/30 bg-slate-950 text-white shadow-2xl">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-left text-lg text-white">
              Return to fullscreen
            </DialogTitle>
            <DialogDescription className="text-left text-sm text-slate-300">
              This interview requires focus. Returning to fullscreen is required
              to continue.
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

      <div
        className={`absolute inset-0 ${mode === "question" ? "opacity-100 blur-[2px]" : "opacity-80 blur-[1px]"}`}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at top left, rgba(34, 211, 238, 0.18), transparent 32%), radial-gradient(circle at bottom right, rgba(29, 78, 216, 0.16), transparent 28%), linear-gradient(135deg, #090b10, #0b1017 28%, #0f172a 100%)",
          }}
        />
        <div className="absolute left-1/2 top-1/2 h-105 w-105 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/20 bg-cyan-500/5 shadow-[0_0_80px_rgba(34,211,238,0.12)]" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-[28%] border border-white/10 bg-slate-950/60 shadow-2xl shadow-black/40" />
        <div className="absolute left-1/2 top-[50%] h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-[30%] border border-cyan-400/20 bg-slate-900/70">
          <div className="absolute left-1/2 top-[22%] h-4 w-4 -translate-x-1/2 rounded-full bg-cyan-300/80" />
          <div className="absolute left-[30%] top-[52%] h-10 w-4 rounded-full bg-slate-700" />
          <div className="absolute right-[30%] top-[52%] h-10 w-4 rounded-full bg-slate-700" />
          <div className="absolute left-1/2 top-[58%] h-7 w-14 -translate-x-1/2 rounded-full bg-slate-700" />
        </div>
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
                Elapsed {elapsedDisplayTime}
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
                  Candidate, role, and session context for this AI interview.
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

        <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 pb-16 pt-6">
          <div className="relative w-full max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative overflow-hidden rounded-[30px] border border-white/10 bg-slate-900/70 p-4 shadow-[0_28px_80px_rgba(2,6,23,0.8)] backdrop-blur-xl sm:p-5"
            >
              <div className="absolute left-1/2 -top-3 z-20 -translate-x-1/2 rounded-full border border-cyan-400/40 bg-cyan-500/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-100 shadow-lg shadow-cyan-500/10">
                Q{questionNumber}
              </div>

              <div className="rounded-[22px] border border-white/10 bg-slate-950/60 p-4 sm:p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                    <Clock3
                      className={`h-3.5 w-3.5 ${isCritical ? "text-red-300" : "text-cyan-300"}`}
                    />
                    <span
                      className={isCritical ? "text-red-200" : "text-slate-200"}
                    >
                      {currentQuestion?.category ?? "Question"}
                    </span>
                  </div>
                  <div
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                      isCritical
                        ? "critical-timer border-red-500/40 bg-red-500/10 text-red-100"
                        : "border-cyan-500/30 bg-cyan-500/10 text-cyan-100"
                    }`}
                    style={
                      isCritical
                        ? {
                            animationDuration: `${Math.max(0.25, blinkDuration)}s`,
                          }
                        : undefined
                    }
                  >
                    {displayTime}
                  </div>
                </div>

                <div className="max-h-[44vh] overflow-y-auto pr-1">
                  <p className="font-syne text-xl font-bold leading-relaxed text-white sm:text-2xl">
                    {currentQuestion?.text ?? "Loading question…"}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    disabled={isActionLocked || mode !== "question"}
                    onClick={() => void handleAdvance("skip")}
                    className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Skip
                  </button>
                  <button
                    type="button"
                    disabled={isActionLocked || mode !== "question"}
                    onClick={() => void handleAdvance("next")}
                    className="rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Next
                  </button>
                </div>

                <div className="mt-4 min-h-5.5 text-right text-[11px] tracking-[0.12em] text-slate-300 uppercase">
                  {mode === "transitioning" && transitionHint ? (
                    <span className="inline-flex items-center gap-2">
                      <LoaderCircle className="h-3.5 w-3.5 animate-spin text-cyan-300" />
                      {transitionHint}
                    </span>
                  ) : (
                    <span>{uploadStatus}</span>
                  )}
                </div>
              </div>
            </motion.div>

            <div className="absolute -bottom-3 right-3 flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border border-cyan-400/30 bg-slate-950/80 shadow-[0_14px_40px_rgba(34,211,238,0.12)] backdrop-blur-sm sm:h-32 sm:w-32">
              {shouldRenderPreview && stream ? (
                <video
                  ref={videoRef}
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
