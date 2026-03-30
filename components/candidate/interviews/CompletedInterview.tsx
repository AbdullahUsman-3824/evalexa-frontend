"use client";

import { motion } from "framer-motion";
import { Calendar, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import Link from "next/link";

export interface CompletedInterviewData {
  id: string;
  company: string;
  companyInitials: string;
  companyColor: string;
  jobTitle: string;
  completedDate: string;
  result: "Passed" | "Pending Result" | "Not Selected";
  hasFeedback: boolean;
}

interface CompletedInterviewProps {
  interview: CompletedInterviewData;
}

export default function CompletedInterview({
  interview,
}: CompletedInterviewProps) {
  const getResultBadge = () => {
    switch (interview.result) {
      case "Passed":
        return {
          icon: CheckCircle,
          color: "bg-success/10 text-success border-success/30",
          label: "Passed",
        };
      case "Not Selected":
        return {
          icon: XCircle,
          color: "bg-danger/10 text-danger border-danger/30",
          label: "Not Selected",
        };
      case "Pending Result":
        return {
          icon: Clock,
          color: "bg-warning/10 text-warning border-warning/30",
          label: "Pending Result",
        };
    }
  };

  const resultBadge = getResultBadge();
  const ResultIcon = resultBadge.icon;

  return (
    <motion.div
      className="rounded-xl border-t-4 border-slate/30 bg-white p-5 shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ backgroundColor: interview.companyColor }}
        >
          {interview.companyInitials}
        </div>
        <div className="flex-1">
          <h3 className="font-display text-lg font-semibold text-midnight">
            {interview.jobTitle}
          </h3>
          <p className="text-sm text-slate">{interview.company}</p>
        </div>
        <span
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${resultBadge.color}`}
        >
          <ResultIcon className="h-3.5 w-3.5" />
          {resultBadge.label}
        </span>
      </div>

      {/* Completed Date */}
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate">
          Completed On
        </p>
        <p className="mt-1 flex items-center gap-2 text-sm text-midnight">
          <Calendar className="h-4 w-4 text-slate" />
          {interview.completedDate}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={`/interviews/${interview.id}`}
          className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-primary/90"
        >
          View Details
        </Link>
        {interview.hasFeedback && (
          <button className="flex items-center gap-1.5 rounded-lg border border-slate/20 bg-white px-4 py-2.5 text-sm font-semibold text-midnight transition hover:bg-surface">
            <Eye className="h-4 w-4" />
            View Feedback
          </button>
        )}
      </div>
    </motion.div>
  );
}
