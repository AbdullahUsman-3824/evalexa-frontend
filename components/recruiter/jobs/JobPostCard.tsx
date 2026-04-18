"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart2,
  Copy,
  Edit3,
  Eye,
  Link2,
  MoreVertical,
  Sparkles,
  Star,
  Trash2,
  Users,
} from "lucide-react";

export type JobStatus = "Published" | "Draft" | "Closed";

export interface JobPost {
  id: string;
  title: string;
  status: JobStatus;
  department: string;
  jobType: string;
  workMode: string;
  postedDate: string;
  deadline: string;
  applicants: number;
  newToday: number;
  aiScreened: number;
  shortlisted: number;
  avgMatch: number;
  targetApplicants: number;
  viewCount?: number;
  shareUrl?: string;
  missingFields?: string[];
}

interface JobPostCardProps {
  job: JobPost;
  onEdit?: (job: JobPost) => void;
  onPreview?: (job: JobPost) => void;
  onDuplicate?: (job: JobPost) => void;
  onToggleActive?: (job: JobPost) => void;
  onDelete?: (job: JobPost) => void;
}

function getDaysUntil(dateString: string) {
  const today = new Date();
  const date = new Date(dateString);
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  const diffMs = date.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function formatPostedDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatCloseDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
}

export default function JobPostCard({
  job,
  onEdit,
  onPreview,
  onDuplicate,
  onToggleActive,
  onDelete,
}: JobPostCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  const daysUntilClose = useMemo(() => getDaysUntil(job.deadline), [job.deadline]);
  const isClosingSoon = job.status === "Published" && daysUntilClose >= 0 && daysUntilClose < 3;
  const badgeLabel = isClosingSoon ? "Closing Soon" : job.status;
  const badgeClass =
    badgeLabel === "Published"
      ? "bg-success/10 text-success"
      : badgeLabel === "Draft"
        ? "bg-slate/15 text-slate"
        : badgeLabel === "Closed"
          ? "bg-danger/10 text-danger"
          : "bg-warning/10 text-warning";
  const isDeadlineUrgent = daysUntilClose >= 0 && daysUntilClose < 3;
  const progress = Math.min(100, Math.round((job.applicants / job.targetApplicants) * 100));
  const isDraftIncomplete = job.status === "Draft" && (job.missingFields?.length ?? 0) > 0;

  const handleCopy = async () => {
    if (!job.shareUrl) return;
    await navigator.clipboard.writeText(job.shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDelete = () => {
    onDelete?.(job);
    setShowDeleteConfirm(false);
    setMenuOpen(false);
  };

  return (
    <article className="rounded-xl border border-slate/20 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-syne text-base font-semibold text-midnight">{job.title}</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
            {badgeLabel}
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="rounded-lg p-1.5 text-slate transition-colors hover:bg-slate/10 hover:text-midnight"
              aria-label="Job actions"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 z-20 w-44 overflow-hidden rounded-lg border border-slate/20 bg-white shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    onEdit?.(job);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-midnight hover:bg-surface"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Post
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onPreview?.(job);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-midnight hover:bg-surface"
                >
                  <Eye className="h-4 w-4" />
                  Preview Post
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDuplicate?.(job);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-midnight hover:bg-surface"
                >
                  <Copy className="h-4 w-4" />
                  Duplicate
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onToggleActive?.(job);
                    setMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-midnight hover:bg-surface"
                >
                  {job.status === "Closed" ? "Activate" : "Deactivate"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/5"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          {job.department}
        </span>
        <span className="text-slate">
          {job.jobType} · {job.workMode}
        </span>
        <span className="text-slate">Posted {formatPostedDate(job.postedDate)}</span>
        <span className={`font-medium ${isDeadlineUrgent ? "text-danger" : "text-slate"}`}>
          Closes {formatCloseDate(job.deadline)}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-midnight">
          <Users className="h-4 w-4 text-slate" />
          <span className="font-semibold">{job.applicants}</span>
        </div>
        <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
          +{job.newToday} today
        </span>
        <div className="flex items-center gap-1.5 text-cyan">
          <Sparkles className="h-4 w-4" />
          <span>
            {job.aiScreened}/{job.applicants}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-warning">
          <Star className="h-4 w-4" />
          <span>{job.shortlisted}</span>
        </div>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
          {job.avgMatch}%
        </span>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs text-slate">
          <span>
            {job.applicants} of {job.targetApplicants} target applicants
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Link
          href={`/recruiter/applicants?jobId=${job.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
        >
          <Users className="h-4 w-4" />
          View Applicants
        </Link>
        <Link
          href={`/recruiter/jobs/${job.id}`}
          className="rounded-lg border border-slate/25 px-3 py-2 text-sm font-medium text-midnight transition-colors hover:bg-surface"
        >
          Manage
        </Link>
        <Link
          href={`/recruiter/hire-analytics?jobId=${job.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate/25 px-3 py-2 text-sm font-medium text-midnight transition-colors hover:bg-surface"
        >
          <BarChart2 className="h-4 w-4" />
          Analytics
        </Link>
      </div>

      {job.status === "Published" && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate/10 pt-3 text-sm">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80"
          >
            <Link2 className="h-4 w-4" />
            {copied ? "Copied!" : "Copy job link"}
          </button>
          <span className="text-slate">{job.viewCount ?? 0} views</span>
        </div>
      )}

      {job.status === "Draft" && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate/10 pt-3 text-sm">
          {isDraftIncomplete && (
            <span className="rounded-md bg-warning/10 px-2 py-1 text-xs font-semibold text-warning">
              Incomplete
            </span>
          )}
          <Link href={`/recruiter/jobs/create?draft=${job.id}`} className="font-medium text-primary">
            Continue Editing →
          </Link>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <h4 className="font-syne text-lg font-semibold text-midnight">Delete Job Post?</h4>
            <p className="mt-2 text-sm text-slate">
              This will permanently remove <span className="font-medium text-midnight">{job.title}</span>.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-lg border border-slate/25 px-3 py-2 text-sm font-medium text-midnight"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg bg-danger px-3 py-2 text-sm font-medium text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

