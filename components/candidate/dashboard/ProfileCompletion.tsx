"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ChecklistItem {
  label: string;
  completed: boolean;
  link?: string;
}

export default function ProfileCompletion() {
  const [mounted, setMounted] = useState(false);
  const completionPercentage = 72;

  const checklist: ChecklistItem[] = [
    { label: "Basic Info", completed: true },
    { label: "Education", completed: true },
    { label: "Upload Resume", completed: false, link: "/candidate/resume" },
    { label: "Add Skills", completed: false, link: "/candidate/profile/edit" },
    {
      label: "Portfolio Link",
      completed: false,
      link: "/candidate/profile/edit",
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  // SVG circle calculations
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (completionPercentage / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-xl p-6 lg:p-8 border border-slate/10"
    >
      <h2 className="font-display text-lg font-semibold text-midnight mb-6">
        Complete your profile
      </h2>

      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
        {/* Progress Ring */}
        <div className="relative flex-shrink-0">
          <svg width="160" height="160" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#E2E8F0"
              strokeWidth="12"
              fill="none"
            />
            {/* Progress circle */}
            <motion.circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#1E6FFF"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{
                strokeDashoffset: mounted ? strokeDashoffset : circumference,
              }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            />
          </svg>

          {/* Percentage text in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-4xl font-bold text-midnight"
            >
              {completionPercentage}%
            </motion.span>
          </div>
        </div>

        {/* Checklist */}
        <div className="flex-1 w-full">
          <div className="space-y-3">
            {checklist.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                {/* Checkbox icon */}
                <div
                  className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                    item.completed
                      ? "bg-success text-white"
                      : "bg-slate/20 text-slate"
                  }`}
                >
                  {item.completed ? <Check size={14} /> : <X size={14} />}
                </div>

                {/* Label */}
                {item.link && !item.completed ? (
                  <Link
                    href={item.link}
                    className="text-sm text-slate hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={`text-sm ${
                      item.completed
                        ? "text-midnight font-medium"
                        : "text-slate"
                    }`}
                  >
                    {item.label}
                  </span>
                )}
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.1 }}
            className="mt-6"
          >
            <Link
              href="/candidate/profile/edit"
              className="inline-block px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Complete Profile
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
