"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, MailCheck } from "lucide-react";
import LeftPanel from "@/components/auth/LeftPanel";
import FormInput from "@/components/ui/FormInput";
import Toast from "@/components/ui/Toast";
import {
  loginUser,
  resendVerificationOtp,
  verifyEmailOtp,
} from "@/lib/services/authService";

const PENDING_SIGNUP_KEY = "pending_signup";
const OTP_REGEX = /^\d{6}$/;

type PendingSignup = {
  email: string;
  password: string;
};

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = useMemo(
    () => (searchParams.get("email") ?? "").trim().toLowerCase(),
    [searchParams],
  );

  const [email, setEmail] = useState(emailFromQuery);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }>({
    message: "",
    type: "success",
    isVisible: false,
  });

  useEffect(() => {
    if (emailFromQuery) {
      setEmail(emailFromQuery);
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    const raw = sessionStorage.getItem(PENDING_SIGNUP_KEY);
    if (!raw) {
      return;
    }

    try {
      const pending = JSON.parse(raw) as PendingSignup;
      if (pending.email) {
        setEmail(pending.email.trim().toLowerCase());
      }
    } catch {
      sessionStorage.removeItem(PENDING_SIGNUP_KEY);
    }
  }, [emailFromQuery]);

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }

    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success",
  ) => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const navigateByRole = async (verifiedEmail: string) => {
    if (typeof window === "undefined") {
      router.push("/login");
      return;
    }

    const raw = sessionStorage.getItem(PENDING_SIGNUP_KEY);
    if (!raw) {
      router.push("/login");
      return;
    }

    try {
      const pending = JSON.parse(raw) as PendingSignup;
      const sameEmail =
        pending.email.trim().toLowerCase() ===
        verifiedEmail.trim().toLowerCase();

      if (!sameEmail || !pending.password) {
        sessionStorage.removeItem(PENDING_SIGNUP_KEY);
        router.push("/login");
        return;
      }

      const loginData = await loginUser({
        email: pending.email,
        password: pending.password,
      });

      sessionStorage.removeItem(PENDING_SIGNUP_KEY);

      let dashboardPath = "/candidate/dashboard";
      if (loginData.user.role === "recruiter") {
        dashboardPath =
          loginData.user.companyId === null
            ? "/company-setup"
            : "/recruiter/dashboard";
      }

      router.push(dashboardPath);
    } catch {
      sessionStorage.removeItem(PENDING_SIGNUP_KEY);
      router.push("/login");
    }
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const normalizedOtp = otp.trim();
    if (!email) {
      setError("Email is missing. Please sign up again.");
      return;
    }

    if (!OTP_REGEX.test(normalizedOtp)) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setIsVerifying(true);

    try {
      await verifyEmailOtp({
        email,
        otp: normalizedOtp,
      });

      showToast("Email verified successfully!", "success");
      await navigateByRole(email);
    } catch (verifyError) {
      const message =
        verifyError instanceof Error
          ? verifyError.message
          : "OTP verification failed. Please try again.";
      setError(message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || isResending) {
      return;
    }

    if (!email) {
      setError("Email is missing. Please sign up again.");
      return;
    }

    setError("");
    setIsResending(true);

    try {
      await resendVerificationOtp(email);
      setCountdown(30);
      showToast("OTP resent to your email.", "success");
    } catch (resendError) {
      const message =
        resendError instanceof Error
          ? resendError.message
          : "Could not resend OTP. Please try again.";
      setError(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <LeftPanel
        headline="One quick step left. Verify your email to continue."
        subtext="Enter the 6-digit code we sent to your inbox to activate your Evalexa account."
      />

      <div className="flex-1 bg-surface flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link
              href="/"
              className="lg:hidden inline-flex items-center space-x-1 font-display text-3xl font-bold mb-6"
            >
              <span className="text-midnight">Eval</span>
              <span className="text-primary">exa</span>
            </Link>

            <h1 className="text-3xl font-display font-bold text-midnight mb-3">
              Verify your email
            </h1>
            <p className="text-slate">
              Enter the 6-digit OTP sent to
              <span className="font-semibold text-midnight">
                {" "}
                {email || "your email"}
              </span>
              .
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <form onSubmit={handleVerify} className="space-y-5">
              <FormInput
                label="6-digit OTP"
                type="text"
                name="otp"
                placeholder="Enter OTP"
                icon={MailCheck}
                value={otp}
                onChange={(value) => {
                  const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
                  setOtp(digitsOnly);
                }}
                error={error}
                required
              />

              <motion.button
                type="submit"
                disabled={isVerifying}
                whileHover={{ scale: isVerifying ? 1 : 1.02 }}
                whileTap={{ scale: isVerifying ? 1 : 0.98 }}
                className="w-full h-11 bg-primary text-white font-semibold rounded-lg
                  hover:bg-primary/90 transition-colors duration-200
                  disabled:opacity-70 disabled:cursor-not-allowed
                  flex items-center justify-center space-x-2"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Verify Email</span>
                )}
              </motion.button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={countdown > 0 || isResending}
                className="w-full text-sm text-primary font-semibold hover:text-primary/80 disabled:text-slate disabled:cursor-not-allowed transition-colors"
              >
                {isResending
                  ? "Resending..."
                  : countdown > 0
                    ? `Resend OTP in ${countdown}s`
                    : "Resend OTP"}
              </button>

              <div className="text-center text-sm text-slate">
                Wrong email?{" "}
                <Link
                  href="/signup"
                  className="text-primary font-semibold hover:text-primary/80 transition-colors"
                >
                  Go back to signup
                </Link>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
