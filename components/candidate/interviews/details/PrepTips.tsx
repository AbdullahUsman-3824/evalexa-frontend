"use client";

import { motion } from "framer-motion";
import { Sparkles, CheckCircle } from "lucide-react";

interface PrepTipsProps {
  tips: string[];
}

export default function PrepTips({ tips }: PrepTipsProps) {
  return (
    <motion.div
      className="rounded-xl border-l-4 border-cyan bg-white p-6 shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan/10">
          <Sparkles className="h-5 w-5 text-cyan" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-midnight">
            AI Preparation Tips
          </h3>
          <p className="text-sm text-slate">Personalized for this role</p>
        </div>
      </div>

      <ul className="space-y-3">
        {tips.map((tip, index) => (
          <motion.li
            key={index}
            className="flex gap-3 rounded-lg border border-slate/10 bg-surface p-3 text-sm text-midnight"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyan" />
            <span>{tip}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
