"use client";

import { useState, useCallback, useRef, useEffect } from "react";

import { interviewSessionService } from "@/services/interview-session.service";
import type { SessionState } from "@/types/interview.types";

export interface Answer {
  questionId: string;
  blob: Blob;
  skipped: boolean;
  uploadStatus: "pending" | "uploading" | "success" | "failed";
}

const STORAGE_PREFIX = "evalexa:interview-session";
const INTERVIEW_ID_STORAGE_KEY = `${STORAGE_PREFIX}:interviewId`;
const INTERVIEW_SESSION_STORAGE_KEY = `${STORAGE_PREFIX}:sessionId`;

export function clearStoredInterviewSession(interviewId?: string): void {
  if (typeof window === "undefined") return;

  const stores: Storage[] = [];
  try {
    stores.push(window.sessionStorage, window.localStorage);
  } catch {
    return;
  }

  for (const store of stores) {
    try {
      if (interviewId) {
        store.removeItem(`${STORAGE_PREFIX}:${interviewId}`);
      } else {
        Object.keys(store)
          .filter((key) => key.startsWith(STORAGE_PREFIX))
          .forEach((key) => store.removeItem(key));
      }
    } catch {
      // ignore storage errors
    }
  }
}

function persistInterviewSession(interviewId: string, sessionId: string): void {
  if (typeof window === "undefined") return;

  window.sessionStorage.setItem(INTERVIEW_ID_STORAGE_KEY, interviewId);
  window.sessionStorage.setItem(INTERVIEW_SESSION_STORAGE_KEY, sessionId);
}

function readStoredInterviewSession(
  interviewId?: string,
): { interviewId: string; sessionId: string } | null {
  if (typeof window === "undefined") return null;

  const resolvedInterviewId =
    interviewId ?? window.sessionStorage.getItem(INTERVIEW_ID_STORAGE_KEY);
  const sessionId = window.sessionStorage.getItem(
    INTERVIEW_SESSION_STORAGE_KEY,
  );

  if (!resolvedInterviewId || !sessionId) {
    return null;
  }

  return { interviewId: resolvedInterviewId, sessionId };
}

type InterviewSessionViewState = "idle" | "loading" | "ready" | "error";

type Question = { id: string; maxDurationSeconds: number };

type QuestionFlowResult = {
  currentIndex: number;
  currentQuestion: Question | undefined;
  isCompleted: boolean;
  isNextCooling: boolean;
  elapsed: number;
  answers: Answer[];
  answeredCount: number;
  skippedCount: number;
  startSession: () => void;
  stopSession: () => void;
  submitAndAdvance: (blob: Blob, skipped?: boolean) => Promise<void>;
};

type SessionFlowResult = {
  sessionId: string | null;
  session: SessionState | null;
  status: InterviewSessionViewState;
  notice: string | null;
  error: string | null;
  isSyncing: boolean;
  isOnline: boolean;
  startInterview: () => Promise<SessionState>;
  syncSession: (targetSessionId?: string) => Promise<SessionState | null>;
  setSession: (
    value: SessionState | null | ((prev: SessionState | null) => SessionState | null),
  ) => void;
  clearSession: () => void;
};

export function useInterviewSession(questions: Question[]): QuestionFlowResult;
export function useInterviewSession(
  options?: { interviewId?: string; sessionId?: string },
): SessionFlowResult;
export function useInterviewSession(
  questionsOrOptions?: unknown,
): QuestionFlowResult | SessionFlowResult {
  const isQuestionFlow = Array.isArray(questionsOrOptions);
  const questions = (isQuestionFlow ? questionsOrOptions : []) as Question[];
  const options = (isQuestionFlow
    ? undefined
    : (questionsOrOptions ?? {})) as {
    interviewId?: string;
    sessionId?: string;
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isNextCooling, setIsNextCooling] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const coolingRef = useRef(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearElapsed = useCallback(() => {
    if (elapsedRef.current) {
      clearInterval(elapsedRef.current);
      elapsedRef.current = null;
    }
  }, []);

  const startSession = useCallback(() => {
    clearElapsed();
    elapsedRef.current = setInterval(() => {
      setElapsed((s) => s + 1);
    }, 1000);
  }, [clearElapsed]);

  const stopSession = useCallback(() => clearElapsed(), [clearElapsed]);

  const submitAndAdvance = useCallback(
    async (blob: Blob, skipped = false) => {
      if (coolingRef.current) return;
      coolingRef.current = true;
      setIsNextCooling(true);

      const questionId = questions[currentIndex]?.id;
      if (!questionId) {
        return;
      }

      setAnswers((prev) => [
        ...prev.filter((a) => a.questionId !== questionId),
        { questionId, blob, skipped, uploadStatus: "uploading" },
      ]);

      timeoutsRef.current.push(
        setTimeout(() => {
          setAnswers((prev) =>
            prev.map((a) =>
              a.questionId === questionId
                ? { ...a, uploadStatus: "success" }
                : a,
            ),
          );
        }, 1500),
      );

      if (currentIndex >= questions.length - 1) {
        clearElapsed();
        setIsCompleted(true);
      } else {
        setCurrentIndex((i) => i + 1);
      }

      timeoutsRef.current.push(
        setTimeout(() => {
          coolingRef.current = false;
          setIsNextCooling(false);
        }, 5000),
      );
    },
    [currentIndex, questions, clearElapsed],
  );

  useEffect(() => {
    const timeouts = timeoutsRef;
    return () => {
      clearElapsed();
      timeouts.current.forEach(clearTimeout);
      timeouts.current = [];
    };
  }, [clearElapsed]);

  const [sessionId, setSessionId] = useState<string | null>(() => {
    if (options?.sessionId) return options.sessionId;
    return readStoredInterviewSession(options?.interviewId)?.sessionId ?? null;
  });
  const [session, setSession] = useState<SessionState | null>(null);
  const [status, setStatus] = useState<InterviewSessionViewState>("idle");
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof navigator === "undefined" ? true : navigator.onLine,
  );

  const syncSession = useCallback(
    async (targetSessionId?: string) => {
      const resolvedSessionId = targetSessionId ?? sessionId;
      if (!resolvedSessionId) {
        return null;
      }

      try {
        setIsSyncing(true);
        setStatus("loading");
        const nextSession =
          await interviewSessionService.getSessionState(resolvedSessionId);
        setSession(nextSession);
        setStatus("ready");
        setNotice("Session synced successfully.");
        return nextSession;
      } catch (requestError) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : "Unable to sync the interview session.";
        setError(message);
        setStatus("error");
        setNotice(null);
        return null;
      } finally {
        setIsSyncing(false);
      }
    },
    [sessionId],
  );

  const startInterview = useCallback(async (): Promise<SessionState> => {
    if (!options?.interviewId) {
      throw new Error("A valid interview ID is required.");
    }

    setStatus("loading");
    setError(null);
    setNotice("Starting your interview securely…");

    const nextSession = await interviewSessionService.startSession(
      options.interviewId,
    );
    persistInterviewSession(options.interviewId, nextSession.sessionId);
    setSessionId(nextSession.sessionId);
    setSession(nextSession);
    setStatus("ready");
    setNotice("Interview started successfully.");

    return nextSession;
  }, [options?.interviewId]);

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(window.navigator.onLine);

    if (typeof window === "undefined") {
      return;
    }

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    void syncSession(sessionId);
  }, [sessionId, syncSession]);

  const answeredCount = answers.filter((a) => !a.skipped).length;
  const skippedCount = answers.filter((a) => a.skipped).length;

  if (isQuestionFlow) {
    return {
      currentIndex,
      currentQuestion: questions[currentIndex],
      isCompleted,
      isNextCooling,
      elapsed,
      answers,
      answeredCount,
      skippedCount,
      startSession,
      stopSession,
      submitAndAdvance,
    };
  }

  return {
    sessionId,
    session,
    status,
    notice,
    error,
    isSyncing,
    isOnline,
    startInterview,
    syncSession,
    setSession,
    clearSession: () => {
      setSessionId(null);
      setSession(null);
      setStatus("idle");
      setNotice(null);
      setError(null);
      clearStoredInterviewSession(options?.interviewId);
    },
  };
}
