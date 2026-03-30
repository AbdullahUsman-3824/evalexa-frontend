"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Bookmark,
  DollarSign,
  Briefcase,
  Calendar,
} from "lucide-react";
import { Job } from "./JobCard";

interface JobListItemProps {
  job: Job;
  onSave?: (jobId: string) => void;
  onApply?: (jobId: string) => void;
  onViewDetails?: (jobId: string) => void;
}

export default function JobListItem({
  job,
  onSave,
  onApply,
  onViewDetails,
}: JobListItemProps) {
  const [isSaved, setIsSaved] = useState(job.saved || false);

  const handleSaveToggle = () => {
    setIsSaved(!isSaved);
    onSave?.(job.id);
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return "bg-success/10 text-success border-success/20";
    if (score >= 70) return "bg-primary/10 text-primary border-primary/20";
    return "bg-warning/10 text-warning border-warning/20";
  };

  return (
    <motion.div
      className="group flex items-center gap-4 rounded-xl border border-slate/15 bg-white p-4 transition-all hover:border-primary hover:shadow-md"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
    >
      {/* Company Logo */}
      <div
        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
        style={{ backgroundColor: job.companyColor }}
      >
        {job.companyInitials}
      </div>

      {/* Main Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-sm font-semibold text-midnight line-clamp-1">
              {job.title}
            </h3>
            <p className="text-xs text-slate">{job.company}</p>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1 text-slate">
            <MapPin className="h-3 w-3" />
            {job.location}
          </div>
          <div className="flex items-center gap-1 font-semibold text-success">
            <DollarSign className="h-3 w-3" />
            {job.salary.currency} {job.salary.min}K-{job.salary.max}K
          </div>
          <span className="rounded-full bg-slate/10 px-2 py-0.5 font-medium text-slate">
            {job.jobType}
          </span>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
            {job.workMode}
          </span>
        </div>
      </div>

      {/* Match Score */}
      <div className="flex items-center gap-3">
        <span
          className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold ${getMatchColor(job.matchScore)}`}
        >
          <Briefcase className="h-3 w-3" />
          {job.matchScore}%
        </span>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <motion.button
            onClick={handleSaveToggle}
            className="text-slate hover:text-primary"
            whileTap={{ scale: 0.9 }}
          >
            <Bookmark
              className="h-4 w-4"
              fill={isSaved ? "#1E6FFF" : "none"}
              strokeWidth={2}
            />
          </motion.button>
          <button
            onClick={() => onViewDetails?.(job.id)}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 transition"
          >
            Details
          </button>
          <button
            onClick={() => onApply?.(job.id)}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90 transition"
          >
            Apply
          </button>
        </div>
      </div>
    </motion.div>
  );
}
