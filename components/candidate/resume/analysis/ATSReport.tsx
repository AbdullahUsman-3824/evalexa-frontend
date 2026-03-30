"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, XCircle } from "lucide-react";

interface ChecklistItem {
  label: string;
  passed: boolean;
}

interface ATSReportProps {
  checklist: ChecklistItem[];
  score: number;
}

export default function ATSReport({ checklist, score }: ATSReportProps) {
  return (
    <section className="rounded-3xl border border-slate/15 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate/10 pb-4">
        <div>
          <div className="flex items-center gap-3 text-midnight">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <p className="font-display text-2xl">ATS Compatibility Check</p>
          </div>
          <p className="text-sm text-slate">
            Will your resume pass Applicant Tracking Systems?
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 text-sm font-semibold text-success">
          Overall ATS Score: {score}/100
        </div>
      </div>

      <ul className="mt-6 space-y-4">
        {checklist.map((item, index) => (
          <motion.li
            key={item.label}
            className="flex items-start gap-3 rounded-2xl bg-surface px-4 py-3 text-sm"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: index * 0.05 }}
          >
            {item.passed ? (
              <span className="rounded-full bg-success/15 p-1 text-success">
                <CheckCircle2 className="h-4 w-4" />
              </span>
            ) : (
              <span className="rounded-full bg-danger/15 p-1 text-danger">
                <XCircle className="h-4 w-4" />
              </span>
            )}
            <p
              className={`font-semibold ${
                item.passed ? "text-midnight" : "text-danger"
              }`}
            >
              {item.label}
            </p>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
