"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ScoreBreakdown {
  label: string;
  value: number;
  color: string;
  accent?: string;
}

interface QuickAction {
  label: string;
  icon: LucideIcon;
  description?: string;
  onClick?: () => void;
}

interface ScoreHeroProps {
  score: number;
  lastAnalyzedLabel: string;
  breakdowns: ScoreBreakdown[];
  quickActions: QuickAction[];
}

const STATUS_CONFIG = [
  {
    max: 40,
    label: "Needs Work",
    color: "text-danger",
    accent: "text-danger",
    stroke: "#E63946",
  },
  {
    max: 70,
    label: "Fair",
    color: "text-warning",
    accent: "text-warning",
    stroke: "#FF9500",
  },
  {
    max: 85,
    label: "Good",
    color: "text-primary",
    accent: "text-primary",
    stroke: "#1E6FFF",
  },
  {
    max: 100,
    label: "Excellent",
    color: "text-success",
    accent: "text-success",
    stroke: "#00B37E",
  },
];

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const getStatusMeta = (score: number) =>
  STATUS_CONFIG.find((config) => score <= config.max) ?? STATUS_CONFIG[0];

export default function ScoreHero({
  score,
  lastAnalyzedLabel,
  breakdowns,
  quickActions,
}: ScoreHeroProps) {
  const status = getStatusMeta(score);
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;

  return (
    <section className="rounded-3xl bg-gradient-to-br from-midnight to-[#111E36] p-8 text-white shadow-2xl shadow-midnight/50">
      <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-white/70">
        <p className="font-semibold tracking-wide">AI Resume Score Overview</p>
        <span>{lastAnalyzedLabel}</span>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[320px,1fr,220px]">
        <div className="flex flex-col items-center justify-center">
          <div className="relative h-40 w-40">
            <svg
              width="160"
              height="160"
              viewBox="0 0 120 120"
              className="h-full w-full rotate-[-90deg]"
            >
              <circle
                cx="60"
                cy="60"
                r={RADIUS}
                stroke="#1B2A40"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={CIRCUMFERENCE}
              />
              <motion.circle
                cx="60"
                cy="60"
                r={RADIUS}
                stroke={status.stroke}
                strokeWidth="12"
                strokeLinecap="round"
                fill="transparent"
                strokeDasharray={CIRCUMFERENCE}
                initial={{ strokeDashoffset: CIRCUMFERENCE }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-5xl text-white">{score}</span>
              <span className="text-sm text-white/60">/100</span>
              <p className="mt-3 text-xs uppercase tracking-[0.3em] text-white/60">
                Resume Score
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className={`font-display text-xl ${status.color}`}>
              {status.label}
            </span>
            <p className="mt-2 max-w-[260px] text-center text-sm text-white/70">
              Solid foundation detected. Apply targeted fixes to unlock higher
              match rates.
            </p>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
            Breakdown
          </p>
          <div className="space-y-4">
            {breakdowns.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <p className="font-semibold">{item.label}</p>
                  <span className="text-white/70">{item.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/15">
                  <motion.div
                    className={`h-full rounded-full ${item.color}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
            Quick Actions
          </p>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={action.onClick}
                className="flex w-full items-center justify-between rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/15"
              >
                <div className="flex items-center gap-2">
                  <action.icon className="h-4 w-4 text-cyan" />
                  <div className="flex flex-col">
                    <span>{action.label}</span>
                    {action.description && (
                      <span className="text-xs font-normal text-white/70">
                        {action.description}
                      </span>
                    )}
                  </div>
                </div>
                <svg
                  className="h-4 w-4 text-white/70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
