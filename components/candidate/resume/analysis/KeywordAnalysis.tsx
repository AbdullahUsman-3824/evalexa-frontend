"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Info, XCircle } from "lucide-react";

interface TopKeyword {
  keyword: string;
  importance: "High" | "Medium" | "Low";
  guidance: string;
}

interface KeywordAnalysisProps {
  found: string[];
  missing: string[];
  topMissing: TopKeyword[];
}

const pillVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

const importanceColor: Record<TopKeyword["importance"], string> = {
  High: "text-danger",
  Medium: "text-warning",
  Low: "text-success",
};

export default function KeywordAnalysis({
  found,
  missing,
  topMissing,
}: KeywordAnalysisProps) {
  return (
    <section className="rounded-3xl border border-cyan/40 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-3 border-l-4 border-cyan pl-4">
        <p className="font-display text-2xl text-midnight">Keyword Analysis</p>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-full border border-cyan/40 px-3 py-1 text-xs font-semibold text-cyan"
          title="Evalexa compares your resume to target job descriptions to surface missing keywords."
        >
          <Info className="h-3.5 w-3.5" />
          How it works
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-success">
            Found Keywords
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {found.map((keyword, index) => (
              <motion.span
                key={keyword}
                className="inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 text-sm font-semibold text-success"
                variants={pillVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <CheckCircle2 className="h-4 w-4" />
                {keyword}
              </motion.span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-danger">
            Missing Keywords
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {missing.map((keyword, index) => (
              <motion.span
                key={keyword}
                className="inline-flex items-center gap-2 rounded-full bg-danger/10 px-4 py-2 text-sm font-semibold text-danger"
                variants={pillVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <XCircle className="h-4 w-4" />
                {keyword}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-slate/15">
        <div className="border-b border-slate/10 bg-surface px-5 py-3 text-sm font-semibold text-midnight">
          Top Missing Keywords for Your Target Role
        </div>
        <div className="divide-y divide-slate/10">
          {topMissing.map((item) => (
            <div
              key={item.keyword}
              className="grid gap-3 px-5 py-4 text-sm text-midnight lg:grid-cols-[1fr,120px,1.4fr]"
            >
              <p className="font-semibold">{item.keyword}</p>
              <span className={`font-semibold ${importanceColor[item.importance]}`}>
                {item.importance} importance
              </span>
              <p className="text-slate">{item.guidance}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
