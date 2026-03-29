"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import LeftPanel from "@/components/auth/LeftPanel";
import StepIndicator from "@/components/auth/forgot-password/StepIndicator";
import StepEnterEmail from "@/components/auth/forgot-password/StepEnterEmail";
import StepCheckEmail from "@/components/auth/forgot-password/StepCheckEmail";
import StepResetPassword from "@/components/auth/forgot-password/StepResetPassword";
import StepSuccess from "@/components/auth/forgot-password/StepSuccess";
import Toast from "@/components/ui/Toast";

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // Start at step 3 if token exists, otherwise step 1
  const [currentStep, setCurrentStep] = useState(token ? 3 : 1);
  const [email, setEmail] = useState("");
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
    // If token is present in URL, go directly to reset password step
    if (token) {
      setCurrentStep(3);
    }
  }, [token]);

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success",
  ) => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const handleEmailSuccess = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setCurrentStep(2);
    showToast("Reset email sent successfully!");
  };

  const handleResendEmail = () => {
    showToast("Email resent!", "success");
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
              <StepEnterEmail key="step1" onSuccess={handleEmailSuccess} />
            )}

            {currentStep === 2 && (
              <StepCheckEmail
                key="step2"
                email={email}
                onResend={handleResendEmail}
              />
            )}

            {currentStep === 3 && (
              <StepResetPassword key="step3" onSuccess={handleResetSuccess} />
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
