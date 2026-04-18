"use client";

import { motion } from "framer-motion";

interface SkillGapItem {
  skill: string;
  missing: number;
  total: number;
}

interface SkillsGapAnalysisProps {
  data: SkillGapItem[];
}

export default function SkillsGapAnalysis({ data }: SkillsGapAnalysisProps) {
  const max = Math.max(...data.map((item) => item.missing), 1);

  return (
    <section className="rounded-xl border border-slate/15 border-l-4 border-l-cyan bg-white p-5">
      <h2 className="font-syne text-lg font-semibold text-midnight">Skills Gap Across All Candidates</h2>
      <div className="mt-4 space-y-3">
        {data.map((row, idx) => {
          const pct = Math.round((row.missing / row.total) * 100);
          return (
            <div key={row.skill} className="grid grid-cols-[90px_90px_1fr] items-center gap-3 text-sm">
              <span className="font-medium text-midnight">{row.skill}</span>
              <span className="text-slate">
                {row.missing}/{row.total} ({pct}%)
              </span>
              <div className="h-2 rounded-full bg-slate/10">
                <motion.div
                  className="h-2 rounded-full bg-warning"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(row.missing / max) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.5 }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-sm text-slate">
        Consider training top candidates on Docker and AWS — most have matching skills otherwise.
      </p>
    </section>
  );
}

