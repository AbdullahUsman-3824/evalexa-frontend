"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Bookmark,
  Calendar,
  DollarSign,
  Briefcase,
} from "lucide-react";

export interface Job {
  id: string;
  title: string;
  company: string;
  companyInitials: string;
  companyColor: string;
  location: string;
  workMode: "Remote" | "On-site" | "Hybrid";
  salary: { min: number; max: number; currency: string };
  jobType: "Full-time" | "Part-time" | "Contract" | "Internship";
  experienceLevel: "Entry Level" | "Mid Level" | "Senior Level";
  skills: string[];
  matchScore: number;
  postedDaysAgo: number;
  saved?: boolean;
}

interface JobCardProps {
  job: Job;
  onSave?: (jobId: string) => void;
  onApply?: (jobId: string) => void;
  onViewDetails?: (jobId: string) => void;
}

export default function JobCard({
  job,
  onSave,
  onApply,
  onViewDetails,
}: JobCardProps) {
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

  const workModeColor = {
    Remote: "bg-cyan/10 text-cyan",
    "On-site": "bg-slate/10 text-slate",
    Hybrid: "bg-primary/10 text-primary",
  };

  const visibleSkills = job.skills.slice(0, 3);
  const remainingSkills = job.skills.length - 3;

  return (
    <motion.div
      className="group relative rounded-xl border border-slate/15 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
    >
      {/* Header: Logo + Title + Bookmark */}
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
          onClick={handleSaveToggle}
          className="flex-shrink-0 text-slate hover:text-primary"
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={{ scale: isSaved ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Bookmark
              className="h-5 w-5"
              fill={isSaved ? "#1E6FFF" : "none"}
              strokeWidth={2}
            />
          </motion.div>
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

      {/* Match Score + Posted Date + Actions */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate/10 pt-4">
        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold ${getMatchColor(job.matchScore)}`}
          >
            <Briefcase className="h-3 w-3" />
            {job.matchScore}% Match
          </span>
          <div className="flex items-center gap-1 text-xs text-slate">
            <Calendar className="h-3 w-3" />
            {job.postedDaysAgo}d ago
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewDetails?.(job.id)}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 transition"
          >
            View Details
          </button>
          <button
            onClick={() => onApply?.(job.id)}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90 transition"
          >
            Apply Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}
