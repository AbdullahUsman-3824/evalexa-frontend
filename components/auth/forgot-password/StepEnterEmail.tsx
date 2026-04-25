"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import FormInput from "@/components/ui/FormInput";

interface StepEnterEmailProps {
  onSubmitEmail: (email: string) => Promise<void>;
}

export default function StepEnterEmail({ onSubmitEmail }: StepEnterEmailProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      await onSubmitEmail(email.trim().toLowerCase());
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Failed to send reset OTP. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
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
          <Mail className="w-7 h-7 text-primary" />
        </div>
      </motion.div>

      {/* Heading */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-midnight mb-3">
          Forgot your password?
        </h1>
        <p className="text-sm text-slate leading-relaxed max-w-md mx-auto">
          Enter the email address linked to your Evalexa account and we&apos;ll
          send you a reset link.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FormInput
            label="Email Address"
            type="email"
            name="email"
            placeholder="you@company.com"
            icon={Mail}
            value={email}
            onChange={setEmail}
            error={error}
          />
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className="w-full h-11 bg-primary text-white font-semibold rounded-lg
            hover:bg-primary/90 transition-colors duration-200
            disabled:opacity-70 disabled:cursor-not-allowed
            flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <span>Send Reset Link</span>
          )}
        </motion.button>

        {/* Back to Sign In Link */}
        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center space-x-2 text-sm text-slate hover:text-midnight transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </form>
    </motion.div>
  );
}
