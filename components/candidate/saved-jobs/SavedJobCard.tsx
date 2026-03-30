"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Bookmark,
  Calendar,
  DollarSign,
  Briefcase,
  AlertCircle,
  X,
} from "lucide-react";
import { Job } from "@/components/candidate/jobs/JobCard";

interface SavedJobCardProps {
  job: Job & {
    savedDate?: string;
    deadline?: string;
    isClosed?: boolean;
  };
  onRemove?: (jobId: string) => void;
  onApply?: (jobId: string) => void;
  onViewDetails?: (jobId: string) => void;
}

export default function SavedJobCard({
  job,
  onRemove,
  onApply,
  onViewDetails,
}: SavedJobCardProps) {
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const handleRemoveClick = () => {
    setShowRemoveConfirm(true);
  };

  const handleConfirmRemove = () => {
    onRemove?.(job.id);
    setShowRemoveConfirm(false);
  };

  const getDaysUntilDeadline = (deadline?: string) => {
    if (!deadline) return null;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDeadline = getDaysUntilDeadline(job.deadline);

  const getMatchColor = (score: number) => {
    if (score >= 90) return "bg-success/10 text-success border-success/20";
    if (score >= 70) return "bg-primary/10 text-primary border-primary/20";
    return "bg-warning/10 text-warning border-warning/20";
  };

  const workModeColor = {
    Remote: "bg-cyan/10 text-cyan",
    "On-site": "bg-slate/10 text-slate",
    Hybrid: "bg-primary/10 text-primary",
  };

  const visibleSkills = job.skills.slice(0, 3);
  const remainingSkills = job.skills.length - 3;

  return (
    <motion.div
      className={`group relative rounded-xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${
        job.isClosed
          ? "border-slate/20 opacity-60"
          : "border-slate/15 hover:border-primary"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      {/* Closed Overlay Badge */}
      {job.isClosed && (
        <div className="absolute right-4 top-4 rounded-lg bg-slate/90 px-3 py-1 text-xs font-bold text-white">
          Position Closed
        </div>
      )}

      {/* Deadline Badge */}
      {!job.isClosed &&
        daysUntilDeadline !== null &&
        daysUntilDeadline <= 7 && (
          <motion.div
            className={`absolute right-4 top-4 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
              daysUntilDeadline <= 3
                ? "bg-danger/10 text-danger"
                : "bg-warning/10 text-warning"
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            <AlertCircle className="h-3 w-3" />
            Deadline in {daysUntilDeadline}d
          </motion.div>
        )}

      {/* Header: Logo + Title + Remove */}
      <div className="flex items-start gap-3">
        <div
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ backgroundColor: job.companyColor }}
        >
          {job.companyInitials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-base font-semibold text-midnight line-clamp-1">
            {job.title}
          </h3>
          <p className="text-sm text-slate">{job.company}</p>
        </div>
        <motion.button
          onClick={handleRemoveClick}
          className="flex-shrink-0 text-primary hover:text-danger"
          whileTap={{ scale: 0.9 }}
          title="Remove from saved"
        >
          <Bookmark className="h-5 w-5" fill="#1E6FFF" strokeWidth={2} />
        </motion.button>
      </div>

      {/* Location + Work Mode */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 text-xs text-slate">
          <MapPin className="h-3.5 w-3.5" />
          {job.location}
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${workModeColor[job.workMode]}`}
        >
          {job.workMode}
        </span>
      </div>

      {/* Salary + Job Type */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 text-sm font-semibold text-success">
          <DollarSign className="h-4 w-4" />
          {job.salary.currency} {job.salary.min}K - {job.salary.max}K
        </div>
        <span className="rounded-full bg-slate/10 px-2.5 py-1 text-xs font-semibold text-slate">
          {job.jobType}
        </span>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          {job.experienceLevel}
        </span>
      </div>

      {/* Skills */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {visibleSkills.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
          >
            {skill}
          </span>
        ))}
        {remainingSkills > 0 && (
          <span className="text-xs font-medium text-slate">
            +{remainingSkills} more
          </span>
        )}
      </div>

      {/* Match Score + Saved Date + Actions */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate/10 pt-4">
        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold ${getMatchColor(job.matchScore)}`}
          >
            <Briefcase className="h-3 w-3" />
            {job.matchScore}% Match
          </span>
          {job.savedDate && (
            <div className="flex items-center gap-1 text-xs text-slate">
              <Calendar className="h-3 w-3" />
              Saved {job.savedDate}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewDetails?.(job.id)}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 transition"
            disabled={job.isClosed}
          >
            View Details
          </button>
          {!job.isClosed && (
            <button
              onClick={() => onApply?.(job.id)}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90 transition"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>

      {/* Remove Confirmation Modal */}
      <AnimatePresence>
        {showRemoveConfirm && (
          <motion.div
            className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-midnight/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="mx-4 rounded-xl bg-white p-5 shadow-xl">
              <div className="mb-4 flex items-center gap-2 text-midnight">
                <AlertCircle className="h-5 w-5 text-warning" />
                <h4 className="font-semibold">Remove from saved?</h4>
              </div>
              <p className="mb-4 text-sm text-slate">
                This will remove "{job.title}" from your saved jobs.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowRemoveConfirm(false)}
                  className="flex-1 rounded-lg border border-slate/20 px-4 py-2 text-sm font-semibold text-midnight hover:bg-surface transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRemove}
                  className="flex-1 rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white hover:bg-danger/90 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
