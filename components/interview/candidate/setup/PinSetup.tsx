"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Lock, Loader2, Mail } from "lucide-react";

interface PINStepProps {
  pin: string;
  onPinChange: (pin: string) => void;
  error: string;
  attempts: number;
  isVerifying: boolean;
  onVerify: () => void;
  isSendingCode: boolean;
  codeSent: boolean;
  emailHint: string | null;
  resendCooldown: number;
  onSendCode: () => void;
}

const LENGTH = 6;

export function PINStep({
  pin,
  onPinChange,
  error,
  attempts,
  isVerifying,
  onVerify,
  isSendingCode,
  codeSent,
  emailHint,
  resendCooldown,
  onSendCode,
}: PINStepProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const digits = Array.from({ length: LENGTH }, (_, i) => pin[i] ?? "");

  useEffect(() => {
    if (codeSent && pin === "") inputsRef.current[0]?.focus();
  }, [pin, codeSent]);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    if (!digit) {
      onPinChange(pin.slice(0, index));
      return;
    }

    onPinChange(pin.slice(0, index) + digit + pin.slice(index + 1));
    if (index < LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      e.preventDefault();
      onPinChange(pin.slice(0, index - 1));
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "Enter" && pin.length === LENGTH) {
      onVerify();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, LENGTH);
    if (!pasted) return;
    onPinChange(pasted);
    inputsRef.current[Math.min(pasted.length, LENGTH - 1)]?.focus();
  };

  // ── Step 1: Send code ───────────────────────────────────────────
  if (!codeSent) {
    return (
      <div>
        <Lock className="text-cyan w-10 h-10 mx-auto mb-4" />
        <h2 className="font-display text-white text-2xl text-center font-bold">
          Verify Your Identity
        </h2>
        <p className="text-slate text-sm text-center mt-1">
          We&apos;ll send a 6-digit verification code to your registered email.
        </p>

        {error && (
          <motion.p
            key={error}
            animate={{ x: [0, -8, 8, -6, 6, 0] }}
            transition={{ duration: 0.4 }}
            className="text-red-400 text-sm text-center mt-3"
          >
            {error}
          </motion.p>
        )}

        <button
          type="button"
          onClick={onSendCode}
          disabled={isSendingCode}
          className="mt-5 w-full h-11 bg-primary rounded-xl text-white font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
        >
          {isSendingCode ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Code"
          )}
        </button>
      </div>
    );
  }

  // ── Step 2: Enter and verify code ─────────────────────────────────
  return (
    <div>
      <Lock className="text-cyan w-10 h-10 mx-auto mb-4" />
      <h2 className="font-display text-white text-2xl text-center font-bold">
        Enter Your Code
      </h2>

      {emailHint && (
        <p className="text-slate text-sm text-center mt-1 flex items-center justify-center gap-1.5">
          <Mail className="w-3.5 h-3.5" />
          Code sent to {emailHint}
        </p>
      )}

      <div className="mt-6 flex justify-center gap-2">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            aria-label={`Code digit ${i + 1}`}
            className="w-12 h-14 bg-white/5 border border-white/20 rounded-xl text-center text-white text-xl font-mono focus:border-primary focus:bg-white/10 focus:outline-none transition"
          />
        ))}
      </div>

      {error && (
        <motion.p
          key={error + attempts}
          animate={{ x: [0, -8, 8, -6, 6, 0] }}
          transition={{ duration: 0.4 }}
          className="text-red-400 text-sm text-center mt-3"
        >
          {error}
        </motion.p>
      )}

      <button
        type="button"
        onClick={onVerify}
        disabled={pin.length < LENGTH || isVerifying}
        className="mt-5 w-full h-11 bg-primary rounded-xl text-white font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isVerifying ? "Verifying..." : "Verify Code"}
      </button>

      <div className="mt-3 text-center">
        {resendCooldown > 0 ? (
          <p className="text-white/40 text-xs">
            Resend code in {resendCooldown}s
          </p>
        ) : (
          <button
            type="button"
            onClick={onSendCode}
            disabled={isSendingCode}
            className="text-cyan text-xs hover:text-cyan/80 disabled:opacity-50"
          >
            Resend code
          </button>
        )}
      </div>
    </div>
  );
}

export default PINStep;
