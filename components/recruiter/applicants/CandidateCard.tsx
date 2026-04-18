"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Bookmark,
  BookmarkCheck,
  CalendarPlus,
  CheckCircle2,
  MoreVertical,
  Sparkles,
  Star,
  X,
  XCircle,
} from "lucide-react";

export type ApplicantStatus =
  | "New"
  | "AI Screened"
  | "Shortlisted"
  | "Interview"
  | "Rejected";

export interface ApplicantCandidate {
  id: string;
  name: string;
  title: string;
  appliedLabel: string;
  appliedDaysAgo: number;
  matchScore: number;
  resumeScore: number;
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

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function matchTone(score: number) {
  if (score >= 90) return "bg-success/10 text-success";
  if (score >= 70) return "bg-primary/10 text-primary";
  return "bg-warning/15 text-warning";
}

function statusTone(status: ApplicantStatus) {
  if (status === "Rejected") return "bg-danger/10 text-danger";
  if (status === "Interview") return "bg-success/10 text-success";
  if (status === "Shortlisted") return "bg-warning/15 text-warning";
  if (status === "AI Screened") return "bg-cyan/10 text-cyan";
  return "bg-primary/10 text-primary";
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

  return (
    <article
      className={`relative rounded-xl border bg-white p-4 shadow-sm transition ${
        candidate.shortlisted
          ? "border-warning/35 border-l-4"
          : "border-slate/20"
      } ${isRejected ? "opacity-60" : ""}`}
    >
      {isRejected && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="-rotate-12 rounded-lg border-2 border-danger/50 px-4 py-1 font-syne text-lg font-bold tracking-wide text-danger/70">
            Rejected
          </span>
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan text-sm font-semibold text-white">
            {initials(candidate.name)}
          </div>
          <div>
            <h3 className="font-syne text-[15px] font-semibold text-midnight">
              {candidate.name}
            </h3>
            <p className="text-xs text-slate">{candidate.title}</p>
            <p className="text-xs text-slate">
              Applied {candidate.appliedLabel}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onToggleBookmark(candidate.id)}
          className="rounded-lg p-1.5 text-slate transition-colors hover:bg-slate/10 hover:text-midnight"
          aria-label="Bookmark candidate"
        >
          {candidate.bookmarked ? (
            <BookmarkCheck className="h-4 w-4 text-primary" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${matchTone(candidate.matchScore)}`}
        >
          {candidate.matchScore}% AI Match
        </span>
        <span className="rounded-full bg-cyan/10 px-2.5 py-1 text-xs font-medium text-cyan">
          Resume {candidate.resumeScore}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {candidate.matchedSkills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {skill}
          </span>
        ))}
        {candidate.missingSkills.slice(0, 2).map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 rounded-full bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger"
          >
            <XCircle className="h-3.5 w-3.5" />
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate">
        <span>
          {candidate.experienceYears} yrs exp · {candidate.education}
        </span>
        <span
          className={`rounded-full px-2 py-1 font-medium ${statusTone(candidate.status)}`}
        >
          {candidate.status}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Link
          href={`/recruiter/applicants/${candidate.id}`}
          className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          View Profile
        </Link>
        <button
          type="button"
          onClick={() => onToggleShortlist(candidate.id)}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium ${
            candidate.shortlisted
              ? "border-warning/40 bg-warning/15 text-warning"
              : "border-slate/20 text-midnight hover:bg-surface"
          }`}
        >
          <Star
            className={`h-4 w-4 ${candidate.shortlisted ? "fill-warning" : ""}`}
          />
          Shortlist
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate/20 px-3 py-2 text-sm font-medium text-midnight hover:bg-surface"
        >
          <CalendarPlus className="h-4 w-4" />
          Schedule Interview
        </button>
        {isRejected ? (
          <button
            type="button"
            onClick={() => onUndoReject(candidate.id)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-primary underline-offset-2 hover:underline"
          >
            Undo
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onReject(candidate.id)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-danger/25 px-3 py-2 text-sm font-medium text-danger hover:bg-danger/5"
          >
            <X className="h-4 w-4" />
            Reject
          </button>
        )}
        <div className="relative ml-auto">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="rounded-lg p-2 text-slate hover:bg-slate/10 hover:text-midnight"
            aria-label="More actions"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-10 z-20 w-44 rounded-lg border border-slate/20 bg-white py-1 text-sm shadow-lg">
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-midnight hover:bg-surface"
              >
                Send Message
              </button>
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-midnight hover:bg-surface"
              >
                Download Resume
              </button>
              <button
                type="button"
                className="inline-flex w-full items-center gap-1 px-3 py-2 text-left text-midnight hover:bg-surface"
              >
                <Sparkles className="h-4 w-4 text-cyan" />
                View AI Analysis
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
