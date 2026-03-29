"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MailCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface StepCheckEmailProps {
  email: string;
  onResend: () => void;
}

export default function StepCheckEmail({
  email,
  onResend,
}: StepCheckEmailProps) {
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResend = () => {
    if (canResend) {
      setCountdown(60);
      setCanResend(false);
      onResend();
    }
  };

  const handleOpenEmail = () => {
    window.open("https://mail.google.com", "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{
          delay: 0.1,
          duration: 0.5,
          ease: [0.34, 1.56, 0.64, 1],
        }}
        className="flex justify-center mb-6"
      >
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
          <MailCheck className="w-7 h-7 text-success" />
        </div>
      </motion.div>

      {/* Heading */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-midnight mb-3">
          Check your inbox
        </h1>
        <p className="text-sm text-slate leading-relaxed mb-2">
          We've sent a password reset link to:
        </p>
        <p className="text-base font-semibold text-primary">{email}</p>
      </div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6"
      >
        <p className="text-sm text-midnight leading-relaxed">
          Didn't receive the email? Check your spam folder or request a new
          link.
        </p>
      </motion.div>

      {/* Action Buttons */}
      <div className="space-y-3 mb-6">
        {/* Open Email Button */}
        <motion.button
          onClick={handleOpenEmail}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full h-11 bg-primary text-white font-semibold rounded-lg
            hover:bg-primary/90 transition-colors duration-200"
        >
          Open Email App
        </motion.button>

        {/* Resend Email Button */}
        <motion.button
          onClick={handleResend}
          disabled={!canResend}
          whileHover={{ scale: canResend ? 1.02 : 1 }}
          whileTap={{ scale: canResend ? 0.98 : 1 }}
          className="w-full h-11 bg-white border-2 border-primary text-primary font-semibold rounded-lg
            hover:bg-primary/5 transition-colors duration-200
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {canResend ? "Resend Email" : `Resend in ${countdown}s`}
        </motion.button>
      </div>

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
    </motion.div>
  );
}
