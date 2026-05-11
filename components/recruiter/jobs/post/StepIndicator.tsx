"use client";

import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
}

const STEPS = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Requirements" },
  { id: 3, label: "AI Settings" },
  { id: 4, label: "Review & Post" },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3 md:gap-4">
        {STEPS.map((step, index) => {
          const isActive = currentStep === step.id;
          const isComplete = currentStep > step.id;

          return (
            <div key={step.id} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition ${
                    isComplete
                      ? "bg-success text-white"
                      : isActive
                        ? "bg-primary text-white"
                        : "bg-slate/20 text-slate"
                  }`}
                >
                  {isComplete ? <Check className="h-4 w-4" /> : step.id}
                </div>
                <span
                  className={`text-sm font-medium ${
                    isActive
                      ? "text-primary"
                      : isComplete
                        ? "text-success"
                        : "text-slate"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <span className="text-slate/60" aria-hidden>
                  →
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

