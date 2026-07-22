"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Bookmark,
  BookmarkCheck,
  CalendarPlus,
  CheckCircle2,
  MoreVertical,
  Star,
  X,
  XCircle,
  MapPin,
  Clock,
  Eye,
} from "lucide-react";

export type ApplicantStatus =
  | "New"
  | "AI Screened"
  | "Shortlisted"
  | "Interview"
  | "Rejected";

export interface ApplicantCandidate {
  id: string;
  candidateId: string;
  name: string;
  title: string; // applied job role, e.g. "Frontend Developer"
  location: string;
  appliedLabel: string;
  appliedDaysAgo: number;
  matchScore: number | null;
  resumeScore: number | null;
  matchedSkills: string[];
  missingSkills: string[];
  experienceYears: number;
  education: string;
  status: ApplicantStatus;
  shortlisted: boolean;
  bookmarked: boolean;
}

interface CandidateCardProps {
  candidate: ApplicantCandidate;
  onToggleShortlist: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onReject: (id: string) => void;
  onUndoReject: (id: string) => void;
}

function statusConfig(status: ApplicantStatus) {
  const configs = {
    New: {
      bg: "bg-primary/10",
      text: "text-primary",
      border: "border-primary/20",
    },
    "AI Screened": {
      bg: "bg-cyan/10",
      text: "text-cyan",
      border: "border-cyan/20",
    },
    Shortlisted: {
      bg: "bg-warning/15",
      text: "text-warning",
      border: "border-warning/20",
    },
    Interview: {
      bg: "bg-success/10",
      text: "text-success",
      border: "border-success/20",
    },
    Rejected: {
      bg: "bg-danger/10",
      text: "text-danger",
      border: "border-danger/20",
    },
  };
  return configs[status] || configs.New;
}

export default function CandidateCard({
  candidate,
  onToggleShortlist,
  onToggleBookmark,
  onReject,
  onUndoReject,
}: CandidateCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isRejected = candidate.status === "Rejected";
  const status = statusConfig(candidate.status);
  console.log(candidate)

  return (
    <article
      className={`relative rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${
        candidate.shortlisted
          ? "border-warning/40 border-l-4"
          : "border-secondary/30"
      } ${isRejected ? "opacity-60" : ""}`}
    >
      {/* Tier 1: Name + status + bookmark — the primary identity row */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate font-syne text-base font-semibold text-midnight">
            {candidate.name}
          </h3>
          <p className="text-sm text-slate">{candidate.title}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium border ${status.bg} ${status.text} ${status.border}`}
          >
            {candidate.status}
          </span>
          <button
            type="button"
            onClick={() => onToggleBookmark(candidate.id)}
            className="rounded-lg p-1.5 text-slate hover:bg-surface hover:text-primary"
            aria-label="Bookmark candidate"
          >
            {candidate.bookmarked ? (
              <BookmarkCheck className="h-4 w-4 text-primary fill-primary/20" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Tier 2: single-line meta — everything factual, low visual weight */}
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate">
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {candidate.location}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Applied {candidate.appliedLabel}
        </span>
        <span>{candidate.experienceYears} yrs exp</span>
        <span>{candidate.education}</span>
      </div>

      {/* Tier 3: skills — only real, present-day data */}
      {(candidate.matchedSkills.length > 0 ||
        candidate.missingSkills.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {candidate.matchedSkills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success"
            >
              <CheckCircle2 className="h-3 w-3" />
              {skill}
            </span>
          ))}
          {candidate.missingSkills.slice(0, 2).map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 rounded-full bg-danger/10 px-2 py-0.5 text-xs font-medium text-danger"
            >
              <XCircle className="h-3 w-3" />
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Tier 4: actions — icon-only, expand on hover */}
      <div className="mt-4 flex items-center gap-2 border-t border-secondary/15 pt-3">
        <Link
          href={`/recruiter/applicants/${candidate.candidateId}`}
          className="group flex shrink-0 items-center overflow-hidden rounded-lg bg-primary-dark px-2.5 py-2 text-white transition-all duration-300 ease-out hover:px-4"
        >
          <Eye className="h-4 w-4 shrink-0" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-300 ease-out group-hover:ml-2 group-hover:max-w-[120px] group-hover:opacity-100">
            View Profile
          </span>
        </Link>

        <button
          type="button"
          onClick={() => onToggleShortlist(candidate.id)}
          className={`group flex shrink-0 items-center overflow-hidden rounded-lg border px-2.5 py-2 transition-all duration-300 ease-out hover:px-4 ${
            candidate.shortlisted
              ? "border-warning/40 bg-warning/15 text-warning"
              : "border-secondary/30 text-midnight hover:bg-surface"
          }`}
        >
          <Star
            className={`h-4 w-4 shrink-0 ${candidate.shortlisted ? "fill-warning" : ""}`}
          />
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-300 ease-out group-hover:ml-2 group-hover:max-w-[100px] group-hover:opacity-100">
            Shortlist
          </span>
        </button>

        {isRejected ? (
          <button
            type="button"
            onClick={() => onUndoReject(candidate.id)}
            className="shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-primary hover:underline"
          >
            Undo Reject
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onReject(candidate.id)}
            className="group flex shrink-0 items-center overflow-hidden rounded-lg border border-danger/25 px-2.5 py-2 text-danger transition-all duration-300 ease-out hover:px-4 hover:bg-danger/5"
          >
            <X className="h-4 w-4 shrink-0" />
            <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-300 ease-out group-hover:ml-2 group-hover:max-w-[100px] group-hover:opacity-100">
              Reject
            </span>
          </button>
        )}

        {/* Everything not built yet lives here, out of the main sightline */}
        <div className="relative ml-auto">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="rounded-lg p-2 text-slate hover:bg-surface hover:text-midnight"
            aria-label="More actions"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-10 z-20 w-60 rounded-lg border border-secondary/20 bg-white py-1 text-sm shadow-lg">
              <button
                type="button"
                disabled
                className="flex w-full items-center justify-between whitespace-nowrap px-4 py-2 text-left text-slate/50 cursor-not-allowed"
              >
                <span className="flex items-center gap-2">
                  <CalendarPlus className="h-4 w-4" />
                  Schedule Interview
                </span>
                <span className="shrink-0 rounded-full bg-slate/10 px-1.5 py-0.5 text-[10px]">
                  Soon
                </span>
              </button>
              <button
                type="button"
                disabled
                className="flex w-full items-center justify-between px-4 py-2 text-left text-slate/50 cursor-not-allowed"
              >
                Send Message
                <span className="shrink-0 rounded-full bg-slate/10 px-1.5 py-0.5 text-[10px]">
                  Soon
                </span>
              </button>
              <button
                type="button"
                disabled
                className="flex w-full items-center justify-between px-4 py-2 text-left text-slate/50 cursor-not-allowed"
              >
                Download Resume
                <span className="shrink-0 rounded-full bg-slate/10 px-1.5 py-0.5 text-[10px]">
                  Soon
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
