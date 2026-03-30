"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, LineChart } from "lucide-react";

interface HistoryPoint {
  label: string;
  value: number;
}

interface ImprovementHistoryProps {
  history: HistoryPoint[];
}

export default function ImprovementHistory({
  history,
}: ImprovementHistoryProps) {
  const [isOpen, setIsOpen] = useState(true);

  const maxValue = Math.max(...history.map((point) => point.value));
  const minValue = Math.min(...history.map((point) => point.value));
  const range = maxValue - minValue || 1;

  const points = history
    .map((point, index) => {
      const x = (index / (history.length - 1 || 1)) * 100;
      const normalized = (point.value - minValue) / range;
      const y = 100 - normalized * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <section className="rounded-3xl border border-slate/15 bg-white p-6 shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        className="flex w-full items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3 text-midnight">
          <LineChart className="h-6 w-6 text-primary" />
          <div>
            <p className="font-display text-2xl">Improvement History</p>
            <p className="text-sm text-slate">
              Keep improving to reach 90+
            </p>
          </div>
        </div>
        <span
          className={`rounded-full border border-slate/20 p-2 transition ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <ChevronDown className="h-4 w-4 text-midnight" />
        </span>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-6"
        >
          <div className="relative h-48 rounded-2xl bg-surface p-4">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="h-full w-full"
            >
              <polyline
                fill="none"
                stroke="#1E6FFF"
                strokeWidth="2"
                points={points}
              />
              {history.map((point, index) => {
                const x = (index / (history.length - 1 || 1)) * 100;
                const normalized = (point.value - minValue) / range;
                const y = 100 - normalized * 100;
                return (
                  <g key={point.label}>
                    <circle cx={x} cy={y} r="2.2" fill="#1E6FFF" />
                  </g>
                );
              })}
            </svg>
            <div className="absolute inset-x-0 bottom-3 flex justify-between px-6 text-xs font-semibold text-slate">
              {history.map((point) => (
                <span key={point.label}>{point.label}</span>
              ))}
            </div>
          </div>
          <p className="rounded-2xl bg-primary/5 px-4 py-3 text-sm font-semibold text-primary">
            Keep going — at this pace you can hit a 90+ score within two more
            iterations.
          </p>
        </motion.div>
      )}
    </section>
  );
}
