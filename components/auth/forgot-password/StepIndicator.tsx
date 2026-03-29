"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({
  currentStep,
  totalSteps,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center space-x-3 mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <div key={stepNumber} className="flex items-center">
            {/* Step Circle */}
            <motion.div
              initial={false}
              animate={{
                backgroundColor: isCompleted
                  ? "#00B37E"
                  : isActive
                    ? "#1E6FFF"
                    : "#E2E8F0",
                scale: isActive ? 1.1 : 1,
              }}
              transition={{ duration: 0.3 }}
              className={`relative w-10 h-10 rounded-full flex items-center justify-center
                ${isCompleted ? "bg-success" : isActive ? "bg-primary" : "bg-slate/30"}`}
            >
              {isCompleted ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Check className="w-5 h-5 text-white" />
                </motion.div>
              ) : (
                <span
                  className={`text-sm font-bold ${isActive ? "text-white" : "text-slate"}`}
                >
                  {stepNumber}
                </span>
              )}
            </motion.div>

            {/* Connecting Line (not shown on last step) */}
            {index < totalSteps - 1 && (
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted ? "#00B37E" : "#E2E8F0",
                }}
                transition={{ duration: 0.3 }}
                className="w-12 h-1 mx-2"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
