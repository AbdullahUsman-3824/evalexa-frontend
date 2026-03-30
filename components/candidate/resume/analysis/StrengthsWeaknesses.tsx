"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

interface InsightItem {
  text: string;
  hint?: string;
}

interface StrengthsWeaknessesProps {
  strengths: InsightItem[];
  weaknesses: InsightItem[];
}

export default function StrengthsWeaknesses({
  strengths,
  weaknesses,
}: StrengthsWeaknessesProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <motion.div
        className="rounded-3xl border-l-4 border-success bg-white p-6 shadow-sm"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 text-success">
          <CheckCircle2 className="h-6 w-6" />
          <p className="font-display text-2xl text-midnight">Strengths</p>
        </div>
        <p className="text-sm text-slate">
          What recruiters already love about your resume.
        </p>
        <ul className="mt-6 space-y-4">
          {strengths.map((item) => (
            <li
              key={item.text}
              className="flex items-start gap-3 rounded-2xl bg-surface px-4 py-3"
            >
              <span className="mt-1 rounded-full bg-success/15 p-1 text-success">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <div>
                <p className="font-semibold text-midnight">{item.text}</p>
                {item.hint && (
                  <p className="text-sm text-slate">{item.hint}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        className="rounded-3xl border-l-4 border-danger bg-white p-6 shadow-sm"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center gap-3 text-danger">
          <AlertCircle className="h-6 w-6" />
          <p className="font-display text-2xl text-midnight">Areas to Improve</p>
        </div>
        <p className="text-sm text-slate">
          Targeted fixes that can unlock higher scores.
        </p>
        <ul className="mt-6 space-y-4">
          {weaknesses.map((item) => (
            <li
              key={item.text}
              className="flex items-start gap-3 rounded-2xl bg-surface px-4 py-3"
            >
              <span className="mt-1 rounded-full bg-danger/15 p-1 text-danger">
                <XCircle className="h-4 w-4" />
              </span>
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-midnight">{item.text}</p>
                {item.hint && <p className="text-sm text-slate">{item.hint}</p>}
                <Link
                  href="#"
                  className="text-sm font-semibold text-primary transition hover:opacity-80"
                >
                  Fix this →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
