"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { KeyRound, Lock, ShieldCheck, Loader2 } from "lucide-react";
import FormInput from "@/components/ui/FormInput";
import PasswordStrength from "./PasswordStrength";
import PasswordRequirements, {
  validatePasswordRequirements,
} from "./PasswordRequirements";

interface StepResetPasswordProps {
  onSuccess: () => void;
}

export default function StepResetPassword({
  onSuccess,
}: StepResetPasswordProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const passwordsMatch =
    newPassword && confirmPassword && newPassword === confirmPassword;
  const allRequirementsMet = validatePasswordRequirements(newPassword);
  const isFormValid = passwordsMatch && allRequirementsMet;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors = { newPassword: "", confirmPassword: "" };

    // Validation
    if (!newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (!allRequirementsMet) {
      newErrors.newPassword = "Password doesn't meet all requirements";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (!newErrors.newPassword && !newErrors.confirmPassword) {
      setIsLoading(true);

      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        onSuccess();
      }, 1500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="flex justify-center mb-6"
      >
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <KeyRound className="w-7 h-7 text-primary" />
        </div>
      </motion.div>

      {/* Heading */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-midnight mb-3">
          Set a new password
        </h1>
        <p className="text-sm text-slate leading-relaxed max-w-md mx-auto">
          Your new password must be at least 8 characters and different from
          your previous one.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* New Password Field */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <FormInput
            label="New Password"
            type="password"
            name="newPassword"
            placeholder="Enter new password"
            icon={Lock}
            value={newPassword}
            onChange={setNewPassword}
            error={errors.newPassword}
            showToggle
          />

          {/* Password Strength Indicator */}
          <PasswordStrength password={newPassword} />

          {/* Password Requirements */}
          {newPassword && <PasswordRequirements password={newPassword} />}
        </motion.div>

        {/* Confirm Password Field */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FormInput
            label="Confirm New Password"
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            icon={ShieldCheck}
            value={confirmPassword}
            onChange={setConfirmPassword}
            error={errors.confirmPassword}
            showToggle
          />

          {/* Password Match Indicator */}
          {confirmPassword && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-1.5 text-sm flex items-center space-x-1 ${
                passwordsMatch ? "text-success" : "text-red-500"
              }`}
            >
              {passwordsMatch ? (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Passwords match ✓</span>
                </>
              ) : (
                <span>Passwords do not match</span>
              )}
            </motion.p>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={!isFormValid || isLoading}
          whileHover={{ scale: !isFormValid || isLoading ? 1 : 1.02 }}
          whileTap={{ scale: !isFormValid || isLoading ? 1 : 0.98 }}
          className="w-full h-11 bg-primary text-white font-semibold rounded-lg
            hover:bg-primary/90 transition-colors duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Resetting...</span>
            </>
          ) : (
            <span>Reset Password</span>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
