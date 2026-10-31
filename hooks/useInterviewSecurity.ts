"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { interviewSessionService } from "@/services/interview-session.service";

export type InterviewSecurityViolationReason =
  | "tab_hidden"
  | "window_blur"
  | "fullscreen_exit"
  | "selection_blocked"
  | "shortcut_blocked";

interface UseInterviewSecurityOptions {
  sessionId: string | null;
  questionId?: string | null;
  enabled?: boolean;
  onWarning?: (reason: string, violationCount: number) => void;
  onTerminate?: (reason: string) => void;
}

const STORAGE_KEY = "evalexa_interview_security_queue";

export function useInterviewSecurity({
  sessionId,
  questionId,
  enabled = true,
  onWarning,
  onTerminate,
}: UseInterviewSecurityOptions) {
  const [warningOpen, setWarningOpen] = useState(false);
  const [terminationReason, setTerminationReason] = useState<string | null>(
    null,
  );
  const [isHidden, setIsHidden] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [securityViolationCount, setSecurityViolationCount] = useState(0);

  const ignoreBlurUntilRef = useRef(0);
  const lastViolationAtRef = useRef(0);
  const lastFullscreenChangeRef = useRef(0);
  const requestFullscreenRef = useRef(false);

  const queueOfflineEvent = useCallback((event: Record<string, unknown>) => {
    if (typeof window === "undefined") {
      return;
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    const queue = raw ? (JSON.parse(raw) as Record<string, unknown>[]) : [];
    queue.push(event);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  }, []);

  const syncEventCount = useCallback(async () => {
    if (!sessionId) {
      return 0;
    }

    try {
      const events =
        await interviewSessionService.listSecurityEvents(sessionId);
      const count = events.filter((event) =>
        event.type.startsWith("security_"),
      ).length;
      setSecurityViolationCount(count);
      return count;
    } catch {
      return 0;
    }
  }, [sessionId]);

  const recordViolation = useCallback(
    async (reason: string, eventType: string) => {
      if (!sessionId) {
        return;
      }

      const payload = {
        type: eventType,
        questionId: questionId ?? undefined,
        occurredAt: new Date().toISOString(),
        meta: { reason },
      };

      const sendBeacon = () => {
        if (
          typeof navigator !== "undefined" &&
          typeof navigator.sendBeacon === "function"
        ) {
          const blob = new Blob([JSON.stringify(payload)], {
            type: "application/json",
          });
          return navigator.sendBeacon(
            `/interviews/sessions/${sessionId}/events`,
            blob,
          );
        }

        return false;
      };

      try {
        const beaconSent = sendBeacon();
        if (!beaconSent) {
          await interviewSessionService.recordSecurityEvent(sessionId, payload);
        }
      } catch {
        queueOfflineEvent(payload);
      }

      const syncedCount = await syncEventCount();
      const nextCount =
        syncedCount > 0 ? syncedCount : Math.max(1, securityViolationCount + 1);
      setSecurityViolationCount(nextCount);

      if (nextCount >= 2) {
        setWarningOpen(false);
        setTerminationReason(
          `This interview was terminated because the security policy detected ${reason}.`,
        );
        onTerminate?.(reason);
        return;
      }

      setWarningOpen(true);
      onWarning?.(reason, nextCount);
    },
    [
      onTerminate,
      onWarning,
      queueOfflineEvent,
      questionId,
      securityViolationCount,
      sessionId,
      syncEventCount,
    ],
  );

  const handleViolation = useCallback(
    async (reason: InterviewSecurityViolationReason) => {
      const now = Date.now();

      if (reason === "window_blur" && now - ignoreBlurUntilRef.current < 1000) {
        return;
      }

      if (
        reason === "fullscreen_exit" &&
        now - lastFullscreenChangeRef.current < 900
      ) {
        return;
      }

      if (now - lastViolationAtRef.current < 600) {
        return;
      }

      lastViolationAtRef.current = now;
      await recordViolation(reason, "security_violation");
    },
    [recordViolation],
  );

  useEffect(() => {
    if (!enabled || !sessionId) {
      return;
    }

    const refreshCount = async () => {
      await syncEventCount();
    };

    void refreshCount();

    const handleVisibility = () => {
      const hidden = document.visibilityState === "hidden";
      setIsHidden(hidden);
      if (hidden) {
        void handleViolation("tab_hidden");
      }
    };

    const handleBlur = () => {
      if (document.visibilityState === "hidden") {
        return;
      }

      if (Date.now() - (ignoreBlurUntilRef.current || 0) < 1000) {
        return;
      }

      void handleViolation("window_blur");
    };

    const handleFullscreen = () => {
      const enteredFullscreen = Boolean(document.fullscreenElement);
      setIsFullscreen(enteredFullscreen);

      if (!enteredFullscreen) {
        lastFullscreenChangeRef.current = Date.now();
        void handleViolation("fullscreen_exit");
      }
    };

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      void handleViolation("selection_blocked");
    };

    const handlePreventable = (event: Event) => {
      event.preventDefault();
      void handleViolation("selection_blocked");
    };

    const handleKeyboard = (event: KeyboardEvent) => {
      const blockedCombos =
        event.key === "PrintScreen" ||
        event.key === "F12" ||
        (event.ctrlKey &&
          event.shiftKey &&
          ["I", "J", "C"].includes(event.key.toUpperCase())) ||
        (event.ctrlKey && event.key.toLowerCase() === "p");

      if (blockedCombos) {
        event.preventDefault();
        void handleViolation("shortcut_blocked");
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("fullscreenchange", handleFullscreen);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handlePreventable);
    document.addEventListener("cut", handlePreventable);
    document.addEventListener("paste", handlePreventable);
    document.addEventListener("selectstart", handlePreventable);
    document.addEventListener("keydown", handleKeyboard);

    if (document.fullscreenEnabled && !document.fullscreenElement) {
      requestFullscreenRef.current = true;
      void document.documentElement.requestFullscreen().catch(() => undefined);
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("fullscreenchange", handleFullscreen);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handlePreventable);
      document.removeEventListener("cut", handlePreventable);
      document.removeEventListener("paste", handlePreventable);
      document.removeEventListener("selectstart", handlePreventable);
      document.removeEventListener("keydown", handleKeyboard);
    };
  }, [enabled, handleViolation, sessionId, syncEventCount]);

  const dismissWarning = useCallback(() => {
    setWarningOpen(false);
    if (document.fullscreenElement) {
      return;
    }

    if (document.fullscreenEnabled) {
      ignoreBlurUntilRef.current = Date.now();
      void document.documentElement.requestFullscreen().catch(() => undefined);
    }
  }, []);

  const requestReturnToFullscreen = useCallback(async () => {
    if (!document.fullscreenEnabled) {
      return;
    }

    try {
      await document.documentElement.requestFullscreen();
      setWarningOpen(false);
      setIsFullscreen(true);
    } catch {
      // Ignore if the browser blocks the request; the warning remains visible.
    }
  }, []);

  return {
    warningOpen,
    terminationReason,
    isHidden,
    isFullscreen,
    securityViolationCount,
    requestReturnToFullscreen,
    dismissWarning,
    syncEventCount,
  };
}

export default useInterviewSecurity;
