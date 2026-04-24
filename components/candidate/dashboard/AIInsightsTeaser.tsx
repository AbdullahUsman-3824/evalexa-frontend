"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AIInsightsTeaser() {
  const score = 78;
  const insights = [
    "Missing: Docker skills",
    "Add measurable achievements",
    "Optimize for ATS keywords",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white rounded-xl p-6 border-l-4 border-l-cyan border-y border-r border-slate/10"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-cyan/10 flex items-center justify-center">
          <Sparkles size={20} className="text-cyan" />
        </div>
        <h2 className="font-display text-lg font-semibold text-midnight">
          AI Resume Insights
        </h2>
      </div>

      {/* Score bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-midnight">{score}/100</span>
          <span className="text-sm font-medium text-slate">
            Good — Room to improve
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative h-3 bg-slate/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan to-primary rounded-full"
          />
        </div>
      </div>

      {/* Insight pills */}
      <div className="space-y-2 mb-4">
        <p className="text-xs font-medium text-slate uppercase tracking-wide">
          Quick Insights
        </p>
        <div className="flex flex-wrap gap-2">
          {insights.map((insight, index) => (
            <motion.div
              key={insight}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
              className="px-3 py-1.5 bg-surface text-slate text-sm rounded-full border border-slate/10"
            >
              {insight}
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Link */}
      <Link
        href="/candidate/resume/analysis"
        className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:gap-3 transition-all duration-200"
      >
        View Full Analysis
        <ArrowRight size={16} />
      </Link>
    </motion.div>
  );
}
