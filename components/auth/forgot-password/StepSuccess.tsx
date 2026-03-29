"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function StepSuccess() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Countdown timer
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Redirect to login
      router.push("/login");
    }
  }, [countdown, router]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="w-full text-center"
    >
      {/* Animated Checkmark */}
      <div className="flex justify-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.1,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          className="relative w-20 h-20"
        >
          {/* Circle */}
          <svg className="w-20 h-20" viewBox="0 0 100 100">
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#00B37E"
              strokeWidth="4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </svg>

          {/* Checkmark */}
          <svg className="absolute inset-0 w-20 h-20" viewBox="0 0 100 100">
            <motion.path
              d="M30 50 L45 65 L70 35"
              fill="none"
              stroke="#00B37E"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.3,
                ease: "easeOut",
              }}
            />
          </svg>
        </motion.div>
      </div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-display font-bold text-midnight mb-3">
          Password reset!
        </h1>
        <p className="text-sm text-slate leading-relaxed max-w-md mx-auto">
          Your password has been successfully reset. You can now sign in with
          your new password.
        </p>
      </motion.div>

      {/* Back to Sign In Button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        onClick={() => router.push("/login")}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full h-11 bg-primary text-white font-semibold rounded-lg
          hover:bg-primary/90 transition-colors duration-200 mb-4"
      >
        Back to Sign In
      </motion.button>

      {/* Countdown Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-xs text-slate"
      >
        Redirecting to sign in in {countdown}s...
      </motion.p>
    </motion.div>
  );
}
