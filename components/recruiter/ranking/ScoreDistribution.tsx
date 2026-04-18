"use client";

import { motion } from "framer-motion";

interface DistributionItem {
  label: string;
  count: number;
  tone: string;
}

interface ScoreDistributionProps {
  data: DistributionItem[];
  averageScore: number;
}

export default function ScoreDistribution({ data, averageScore }: ScoreDistributionProps) {
  const max = Math.max(...data.map((item) => item.count), 1);
  const avgPct = Math.min(100, Math.max(0, averageScore));

  return (
    <section className="rounded-xl border border-slate/15 bg-white p-5">
      <h2 className="font-syne text-lg font-semibold text-midnight">Match Score Distribution</h2>

      <div className="relative mt-4 space-y-3">
        <div className="pointer-events-none absolute bottom-0 top-0 hidden md:block" style={{ left: `${avgPct}%` }}>
          <div className="h-full border-l border-dashed border-slate/35" />
          <span className="absolute -top-5 -translate-x-1/2 rounded bg-midnight px-2 py-0.5 text-[10px] font-semibold text-white">
            Avg: {averageScore}%
          </span>
        </div>

        {data.map((row, idx) => (
          <div key={row.label} className="grid grid-cols-[84px_42px_1fr] items-center gap-3 text-sm">
            <span className="text-slate">{row.label}</span>
            <span className="font-medium text-midnight">{row.count}</span>
            <div className="h-2 rounded-full bg-slate/10">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${(row.count / max) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className={`h-2 rounded-full ${row.tone}`}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

