"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import LeftPanel from "@/components/auth/LeftPanel";
import StepIndicator from "@/components/auth/forgot-password/StepIndicator";
import StepEnterEmail from "@/components/auth/forgot-password/StepEnterEmail";
import StepCheckEmail from "@/components/auth/forgot-password/StepCheckEmail";
import StepResetPassword from "@/components/auth/forgot-password/StepResetPassword";
import StepSuccess from "@/components/auth/forgot-password/StepSuccess";
import Toast from "@/components/ui/Toast";
import { forgotPassword, resetPassword } from "@/lib/services/authService";

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const emailFromQuery = (searchParams.get("email") ?? "").trim().toLowerCase();

  const [currentStep, setCurrentStep] = useState(() =>
    emailFromQuery ? 3 : 1,
  );
  const [email, setEmail] = useState(() => emailFromQuery);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }>({
    message: "",
    type: "success",
    isVisible: false,
  });

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success",
  ) => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const handleEmailSubmit = async (submittedEmail: string) => {
    await forgotPassword({ email: submittedEmail });
    setEmail(submittedEmail);
    setCurrentStep(2);
    showToast("OTP sent to your email.", "success");
  };

  const handleResendEmail = async () => {
    if (!email) {
      showToast("Email is missing. Start again.", "error");
      return;
    }

    await forgotPassword({ email });
    showToast("OTP resent successfully.", "success");
  };

  const handleContinueToReset = () => {
    setCurrentStep(3);
  };

  const handleResetPassword = async (payload: {
    email: string;
    otp: string;
    newPassword: string;
  }) => {
    await resetPassword(payload);
    showToast("Password reset successful.", "success");
  };

  const handleResetSuccess = () => {
    setCurrentStep(4);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Dark Branding */}
      <LeftPanel
        headline="No worries. Happens to the best of us."
        subtext="We'll send a secure reset link straight to your inbox. You'll be back to hiring in no time."
      />

      {/* Right Panel - Form */}
      <div className="flex-1 bg-surface flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Step Indicator - Hide on success step */}
          {currentStep !== 4 && (
            <StepIndicator currentStep={currentStep} totalSteps={3} />
          )}

          {/* Step Content with AnimatePresence */}
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <StepEnterEmail key="step1" onSubmitEmail={handleEmailSubmit} />
            )}

            {currentStep === 2 && (
              <StepCheckEmail
                key="step2"
                email={email}
                onResend={handleResendEmail}
                onContinue={handleContinueToReset}
              />
            )}

            {currentStep === 3 && (
              <StepResetPassword
                key="step3"
                email={email}
                onResetPassword={handleResetPassword}
                onSuccess={handleResetSuccess}
              />
            )}

            {currentStep === 4 && <StepSuccess key="step4" />}
          </AnimatePresence>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}
