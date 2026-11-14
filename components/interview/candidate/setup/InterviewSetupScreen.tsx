"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import InterviewRoom from "@/components/interview/candidate/room/InterviewRoom";
import { InterviewApiError } from "@/lib/interview-client";
import { saveInterviewInfo } from "@/lib/interview/infoStore";
import { interviewSessionService } from "@/services/interview-session.service";
import type {
  ApiQuestion,
  InterviewPreview,
  InvitationExpiredPreview,
} from "@/types/interview.types";
import { WelcomeStep } from "./WelcomeSetup";
import { PINStep } from "./PinSetup";
import { DeviceStep, type DeviceStatus } from "./DeviceSetup";
import { ReadyStep } from "./ReadySetup";
import { ExpiredInvitationStep } from "./ExpiredInvitationStep";

type Step = "welcome" | "pin" | "device" | "start" | "expired";

interface InterviewSetupScreenProps {
  interviewId: string;
  token: string;
}

const STEPS: { key: Step; label: string }[] = [
  { key: "welcome", label: "Welcome" },
  { key: "pin", label: "PIN" },
  { key: "device", label: "Device" },
  { key: "start", label: "Ready" },
];

const INITIAL_STATUS: DeviceStatus = {
  cameraPermission: "pending",
  cameraWorking: "pending",
  micPermission: "pending",
  micWorking: "pending",
};

export function InterviewSetupScreen({
  interviewId,
  token,
}: InterviewSetupScreenProps) {
  const [step, setStep] = useState<Step>("welcome");
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinAttempts, setPinAttempts] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [emailHint, setEmailHint] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [startError, setStartError] = useState("");
  const [isResume, setIsResume] = useState(false);
  const [firstQuestion, setFirstQuestion] = useState<ApiQuestion | null>(null);
  const [deviceStream, setDeviceStream] = useState<MediaStream | null>(null);
  const [deviceReady, setDeviceReady] = useState(false);
  const [deviceStatus, setDeviceStatus] =
    useState<DeviceStatus>(INITIAL_STATUS);
  const [deviceError, setDeviceError] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [preview, setPreview] = useState<InterviewPreview | null>(null);
  const [expiredPreview, setExpiredPreview] =
    useState<InvitationExpiredPreview | null>(null);
  const [inviteLoading, setInviteLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Expired invitation extension request state
  const [extensionSubmitting, setExtensionSubmitting] = useState(false);
  const [extensionSuccess, setExtensionSuccess] = useState(false);
  const [extensionError, setExtensionError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  // ── Resend cooldown timer ──────────────────────────────────────
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((s) => Math.max(0, s - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  // ── Load preview on mount ──────────────────────────────────────
  useEffect(() => {
    let active = true;

    async function loadPreview() {
      setInviteLoading(true);

      if (!token) {
        setLoadError("This interview link is invalid. Please use the link from your email.");
        setInviteLoading(false);
        return;
      }

      try {
        const result = await interviewSessionService.getPreview(
          interviewId,
          token,
        );

        if (!active) return;

        if ("expired" in result) {
          setExpiredPreview(result);
          setStep("expired");
        } else {
          setPreview(result);

          // Keep these separately so the interview screen can show them even
          // if the preview response is lost (Session API 1b is the fallback).
          saveInterviewInfo({
            interviewId,
            jobTitle: result.jobTitle,
            companyName: result.companyName,
            candidateName: result.candidateName,
          });

          if (result.canResume) {
            // Resume flow: skip welcome + OTP, only the device check is needed
            // (camera/mic stream) before calling start again.
            setIsResume(true);
            setCodeSent(true);
            setStep("device");
          } else if (result.alreadyVerified) {
            setCodeSent(true);
            setStep("device");
          }
        }
      } catch (error) {
        if (!active) return;
        const message =
          error instanceof Error
            ? error.message
            : "Could not load your interview invite.";
        setLoadError(message);
      } finally {
        if (active) {
          setInviteLoading(false);
        }
      }
    }

    void loadPreview();

    return () => {
      active = false;
      stopStream();
    };
  }, [interviewId, token, stopStream]);

  // ── Send code (request OTP) ────────────────────────────────────
  const handleSendCode = useCallback(async () => {
    if (isSendingCode) return;

    setIsSendingCode(true);
    setPinError("");

    try {
      const result = await interviewSessionService.requestOtp(
        interviewId,
        token,
      );
      setEmailHint(result.emailHint);
      setCodeSent(true);
      // Use expiresInSeconds or a 60s cooldown, whichever is the resend cooldown
      setResendCooldown(60);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not send the verification code.";
      setPinError(message);
    } finally {
      setIsSendingCode(false);
    }
  }, [interviewId, token, isSendingCode]);

  // ── Verify code (verify OTP) ───────────────────────────────────
  const handleVerifyPin = useCallback(async () => {
    if (pin.length < 6 || isVerifying) return;

    setIsVerifying(true);
    setPinError("");

    try {
      const verified = await interviewSessionService.verifyOtp(
        interviewId,
        token,
        pin.trim(),
      );

      if (preview) {
        saveInterviewInfo({
          interviewId,
          jobTitle: verified.interview.jobTitle || preview.jobTitle,
          companyName: verified.interview.companyName || preview.companyName,
          candidateName: preview.candidateName,
        });
      }

      setStep("device");
    } catch (error) {
      const attempts = pinAttempts + 1;
      setPinAttempts(attempts);

      const message =
        error instanceof Error
          ? error.message
          : "The code you entered is invalid. Please try again.";

      setPinError(message);
      setPin("");
    } finally {
      setIsVerifying(false);
    }
  }, [interviewId, token, pin, isVerifying, pinAttempts, preview]);

  // ── Start / resume interview (Session API 1) ─────────────────────
  const handleStartInterview = useCallback(async () => {
    if (isStartingSession) return;

    setIsStartingSession(true);
    setStartError("");

    try {
      const result = await interviewSessionService.startInterview(interviewId);

      if (!result.question) {
        setStartError(
          result.isCompleted
            ? "This interview has already been completed."
            : "This interview has no questions to answer.",
        );
        return;
      }

      setFirstQuestion(result.question);
    } catch (error) {
      if (error instanceof InterviewApiError && error.status === 401) {
        // Session cookie missing/expired → verify the OTP again.
        setIsResume(false);
        setCodeSent(false);
        setPin("");
        setPinError(
          "Your verification has expired. Please verify again to continue.",
        );
        setStep("pin");
      } else {
        setStartError(
          error instanceof Error
            ? error.message
            : "Unable to start the interview session.",
        );
      }
    } finally {
      setIsStartingSession(false);
    }
  }, [interviewId, isStartingSession]);

  // ── Request extension (expired invitation) ─────────────────────
  const handleRequestExtension = useCallback(
    async (reason: string) => {
      const trimmed = reason.trim();
      if (!trimmed) {
        setExtensionError("Please provide a reason for your request.");
        return;
      }

      setExtensionSubmitting(true);
      setExtensionError(null);

      try {
        await interviewSessionService.requestExtension(
          interviewId,
          token,
          trimmed,
        );
        setExtensionSuccess(true);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Could not submit your request. Please try again.";
        setExtensionError(message);
      } finally {
        setExtensionSubmitting(false);
      }
    },
    [interviewId, token],
  );

  // ── Device check ────────────────────────────────────────────────
  const handleCheckDevices = useCallback(async () => {
    setIsChecking(true);
    setDeviceError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;
      setDeviceStream(stream);

      const videoTrack = stream.getVideoTracks()[0];
      const audioTrack = stream.getAudioTracks()[0];
      const camOk =
        !!videoTrack && videoTrack.readyState === "live" && videoTrack.enabled;
      const micOk =
        !!audioTrack && audioTrack.readyState === "live" && audioTrack.enabled;

      setDeviceStatus({
        cameraPermission: videoTrack ? "ok" : "fail",
        cameraWorking: camOk ? "ok" : "fail",
        micPermission: audioTrack ? "ok" : "fail",
        micWorking: micOk ? "ok" : "fail",
      });
      setDeviceReady(camOk && micOk);

      if (!camOk || !micOk) {
        setDeviceError("We could not detect a working camera and microphone.");
      }
    } catch {
      setDeviceStatus({
        cameraPermission: "fail",
        cameraWorking: "fail",
        micPermission: "fail",
        micWorking: "fail",
      });
      setDeviceReady(false);
      setDeviceError(
        "Permission denied. Please allow camera and microphone access in your browser, then try again.",
      );
    } finally {
      setIsChecking(false);
    }
  }, []);

  // ── Render interview room when session is active ────────────────
  if (firstQuestion && deviceStream) {
    return (
      <InterviewRoom
        interviewId={interviewId}
        stream={deviceStream}
        initialQuestion={firstQuestion}
      />
    );
  }

  // ── Loading state ───────────────────────────────────────────────
  if (inviteLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F172A] px-4 text-white">
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 px-6 py-5 text-center shadow-2xl">
          <p className="text-lg font-semibold">
            Loading your interview invite…
          </p>
        </div>
      </div>
    );
  }

  // ── Expired invitation screen ───────────────────────────────────
  if (step === "expired" && expiredPreview) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center py-12 px-4 font-sans">
        <div>
          <span className="text-white font-display font-bold text-xl">Eval</span>
          <span className="text-cyan font-display font-bold text-xl">exa</span>
        </div>

        <div className="mt-8 w-full max-w-lg bg-[#111827] rounded-2xl border border-white/10 p-8 shadow-2xl">
          {expiredPreview.canRequestNew ? (
            <ExpiredInvitationStep
              jobTitle={expiredPreview.jobTitle}
              companyName={expiredPreview.companyName}
              isSubmitting={extensionSubmitting}
              isSuccess={extensionSuccess}
              errorMessage={extensionError}
              onRequest={handleRequestExtension}
            />
          ) : (
            <div className="text-center">
              <div className="text-4xl mb-4">⏰</div>
              <h2 className="font-display text-white text-2xl font-bold">
                Invitation Expired
              </h2>
              <p className="text-white/60 text-sm mt-2">
                This interview invitation for{" "}
                <span className="text-cyan">{expiredPreview.jobTitle}</span> at{" "}
                <span className="text-cyan">{expiredPreview.companyName}</span>{" "}
                has expired. Please contact the recruiter for a new invitation.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Load error ───────────────────────────────────────────────────
  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F172A] px-4 text-white">
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 px-6 py-5 text-center shadow-2xl max-w-md">
          <p className="text-lg font-semibold">{loadError}</p>
          <p className="text-white/50 text-sm mt-2">
            If the problem persists, please contact the recruiter.
          </p>
        </div>
      </div>
    );
  }

  const currentIdx = STEPS.findIndex((stepItem) => stepItem.key === step);

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center py-12 px-4 font-sans">
      <div>
        <span className="text-white font-display font-bold text-xl">Eval</span>
        <span className="text-cyan font-display font-bold text-xl">exa</span>
      </div>

      <div className="flex items-center mt-5" aria-label="Progress">
        {STEPS.map((stepItem, index) => {
          const state =
            index < currentIdx
              ? "done"
              : index === currentIdx
                ? "active"
                : "pending";

          return (
            <div key={stepItem.key} className="flex items-center">
              <div
                title={stepItem.label}
                className={
                  state === "active"
                    ? "bg-primary w-6 h-2 rounded-full"
                    : state === "done"
                      ? "bg-success w-2 h-2 rounded-full"
                      : "bg-white/20 w-2 h-2 rounded-full"
                }
              />
              {index < STEPS.length - 1 && (
                <div className="w-8 h-px bg-white/15 mx-1" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 w-full max-w-lg bg-[#111827] rounded-2xl border border-white/10 p-8 shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {step === "welcome" && (
              <WelcomeStep
                candidateName={preview?.candidateName ?? "Candidate"}
                jobTitle={preview?.jobTitle ?? "AI Interview"}
                company={preview?.companyName ?? "Your company"}
                onContinue={() => setStep("pin")}
              />
            )}

            {step === "pin" && (
              <PINStep
                pin={pin}
                onPinChange={setPin}
                error={pinError}
                attempts={pinAttempts}
                isVerifying={isVerifying}
                onVerify={handleVerifyPin}
                isSendingCode={isSendingCode}
                codeSent={codeSent}
                emailHint={emailHint}
                resendCooldown={resendCooldown}
                onSendCode={handleSendCode}
              />
            )}

            {step === "device" && (
              <DeviceStep
                stream={deviceStream}
                status={deviceStatus}
                deviceReady={deviceReady}
                error={deviceError}
                isChecking={isChecking}
                onCheck={handleCheckDevices}
                onContinue={() => setStep("start")}
              />
            )}

            {step === "start" && (
              <ReadyStep
                isResume={isResume}
                isStarting={isStartingSession}
                error={startError}
                onStart={handleStartInterview}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default InterviewSetupScreen;