"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type InterviewSecurityViolationReason =
  | "tab_hidden"
  | "window_blur"
  | "fullscreen_exit"
  | "selection_blocked"
  | "shortcut_blocked";

interface UseInterviewSecurityOptions {
  interviewId: string | null;
  enabled?: boolean;
  onWarning?: (reason: string, violationCount: number) => void;
  onTerminate?: (reason: string) => void;
}

/** First violation = warning, second violation = terminate (client side). */
const MAX_VIOLATIONS = 2;

const countKey = (interviewId: string) =>
  `evalexa:interview-violations:${interviewId}`;

function readCount(interviewId: string): number {
  try {
    return Number(window.sessionStorage.getItem(countKey(interviewId)) ?? 0) || 0;
  } catch {
    return 0;
  }
}

function writeCount(interviewId: string, value: number): void {
  try {
    window.sessionStorage.setItem(countKey(interviewId), String(value));
  } catch {
    // ignore
  }
}

export function useInterviewSecurity({
  interviewId,
  enabled = true,
  onWarning,
  onTerminate,
}: UseInterviewSecurityOptions) {
  const [warningOpen, setWarningOpen] = useState(false);
  const [terminationReason, setTerminationReason] = useState<string | null>(null);
  const [isHidden, setIsHidden] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [securityViolationCount, setSecurityViolationCount] = useState(0);

  const ignoreBlurUntilRef = useRef(0);
  const lastViolationAtRef = useRef(0);
  const lastFullscreenChangeRef = useRef(0);
  const countRef = useRef(0);
  const terminatedRef = useRef(false);

  useEffect(() => {
    if (!interviewId) return;
    countRef.current = readCount(interviewId);
    setSecurityViolationCount(countRef.current);
  }, [interviewId]);

  const recordViolation = useCallback(
    (reason: string) => {
      if (!interviewId || terminatedRef.current) return;

      countRef.current += 1;
      writeCount(interviewId, countRef.current);
      setSecurityViolationCount(countRef.current);

      if (countRef.current >= MAX_VIOLATIONS) {
        terminatedRef.current = true;
        setWarningOpen(false);
        setTerminationReason(reason);
        onTerminate?.(reason);
        return;
      }

      setWarningOpen(true);
      onWarning?.(reason, countRef.current);
    },
    [interviewId, onTerminate, onWarning],
  );

  const handleViolation = useCallback(
    (reason: InterviewSecurityViolationReason) => {
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
      recordViolation(reason);
    },
    [recordViolation],
  );

  useEffect(() => {
    if (!enabled || !interviewId) {
      return;
    }

    const handleVisibility = () => {
      const hidden = document.visibilityState === "hidden";
      setIsHidden(hidden);
      if (hidden) handleViolation("tab_hidden");
    };

    const handleBlur = () => {
      if (document.visibilityState === "hidden") return;
      if (Date.now() - (ignoreBlurUntilRef.current || 0) < 1000) return;
      handleViolation("window_blur");
    };

    const handleFullscreen = () => {
      const enteredFullscreen = Boolean(document.fullscreenElement);
      setIsFullscreen(enteredFullscreen);

      if (!enteredFullscreen) {
        lastFullscreenChangeRef.current = Date.now();
        handleViolation("fullscreen_exit");
      }
    };

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      handleViolation("selection_blocked");
    };

    const handlePreventable = (event: Event) => {
      event.preventDefault();
      handleViolation("selection_blocked");
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
        handleViolation("shortcut_blocked");
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
  }, [enabled, handleViolation, interviewId]);

  const requestReturnToFullscreen = useCallback(async () => {
    if (!document.fullscreenEnabled) {
      setWarningOpen(false);
      return;
    }

    try {
      ignoreBlurUntilRef.current = Date.now();
      await document.documentElement.requestFullscreen();
      setWarningOpen(false);
      setIsFullscreen(true);
    } catch {
      // Browser blocked the request; the warning stays visible.
    }
  }, []);

  return {
    warningOpen,
    terminationReason,
    isHidden,
    isFullscreen,
    securityViolationCount,
    requestReturnToFullscreen,
  };
}

export default useInterviewSecurity;