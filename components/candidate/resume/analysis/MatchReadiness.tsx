"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Briefcase } from "lucide-react";

interface ReadinessLevel {
  label: string;
  value: number;
  color: string;
  ringColor: string;
}

interface BestMatch {
  role: string;
  company: string;
  matchScore: number;
  summary: string;
  ctaLabel?: string;
}

interface MatchReadinessProps {
  levels: ReadinessLevel[];
  bestMatch: BestMatch;
}

const MINI_RADIUS = 26;
const MINI_CIRCUMFERENCE = 2 * Math.PI * MINI_RADIUS;

export default function MatchReadiness({
  levels,
  bestMatch,
}: MatchReadinessProps) {
  return (
    <section className="rounded-3xl border border-slate/15 bg-white p-6 shadow-sm">
      <div className="border-l-4 border-primary pl-5">
        <p className="font-display text-2xl text-midnight">
          Job Match Readiness
        </p>
        <p className="text-slate">
          How ready is your resume for top job matches?
        </p>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {levels.map((level) => (
          <motion.div
            key={level.label}
            className="rounded-2xl border border-slate/15 bg-surface p-5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="relative h-20 w-20">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 64 64">
                  <circle
                    cx="32"
                    cy="32"
                    r={MINI_RADIUS}
                    stroke="#DBE4FF"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="32"
                    cy="32"
                    r={MINI_RADIUS}
                    stroke={level.ringColor}
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="transparent"
                    strokeDasharray={MINI_CIRCUMFERENCE}
                    initial={{ strokeDashoffset: MINI_CIRCUMFERENCE }}
                    whileInView={{
                      strokeDashoffset:
                        MINI_CIRCUMFERENCE -
                        (level.value / 100) * MINI_CIRCUMFERENCE,
                    }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-xl text-midnight">
                    {level.value}%
                  </span>
                </div>
              </div>
              <p className={`text-center text-sm font-semibold ${level.color}`}>
                {level.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-6 flex flex-col gap-4 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-white to-white p-6 lg:flex-row lg:items-center"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex w-full flex-col gap-2 text-midnight">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Briefcase className="h-4 w-4" />
            Best Match
          </div>
          <p className="font-display text-2xl">
            {bestMatch.role} at {bestMatch.company}
          </p>
          <p className="text-sm text-slate">{bestMatch.summary}</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-slate">
              Match
            </p>
            <p className="font-display text-4xl text-midnight">
              {bestMatch.matchScore}%
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-white shadow-primary/30 transition hover:bg-primary/90">
            {bestMatch.ctaLabel ?? "Apply"}
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </section>
  );
}
