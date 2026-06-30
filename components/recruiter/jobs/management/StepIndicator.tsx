"use client";

import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
}

const STEPS = [
  { id: 1, label: "Basic info" },
  { id: 2, label: "Requirements" },
  { id: 3, label: "AI settings" },
  { id: 4, label: "Review & post" },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0 py-4 w-full">
      {STEPS.map((step, index) => {
        const isActive = currentStep === step.id;
        const isComplete = currentStep > step.id;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`
                  flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-all
                  ${isComplete
                    ? "bg-success/15 text-success"
                    : isActive
                      ? "bg-primary text-white"
                      : "bg-muted border border-border text-muted-foreground"
                  }
                `}
              >
                {isComplete ? <Check className="h-3 w-3" /> : step.id}
              </div>
              <span
                className={`
                  text-sm whitespace-nowrap transition-colors
                  ${isActive
                    ? "text-primary font-medium"
                    : isComplete
                      ? "text-success"
                      : "text-muted-foreground"
                  }
                `}
              >
                {step.label}
              </span>
            </div>

            {index < STEPS.length - 1 && (
              <div
                className={`
                  mx-2 h-px w-10 rounded-full transition-colors
                  ${isComplete ? "bg-success/40" : "bg-border"}
                `}
                aria-hidden
              />
            )}
          </div>
        );
      })}
    </div>
  );
}