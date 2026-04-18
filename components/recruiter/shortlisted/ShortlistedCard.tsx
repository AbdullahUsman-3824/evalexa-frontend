"use client";

import { CalendarPlus, MessageSquare, X } from "lucide-react";

export type ShortlistStatus =
  | "Awaiting Interview"
  | "Interview Scheduled"
  | "Offer Extended";

export interface ShortlistedCandidate {
  id: string;
  name: string;
  role: string;
  job: string;
  shortlistedDate: string;
  matchScore: number;
  skillsMatched: string[];
  status: ShortlistStatus;
}

interface ShortlistedCardProps {
  candidate: ShortlistedCandidate;
  selected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onSchedule: (candidate: ShortlistedCandidate) => void;
  onMessage: (candidate: ShortlistedCandidate) => void;
  onViewProfile: (candidate: ShortlistedCandidate) => void;
  onRemove: (candidate: ShortlistedCandidate) => void;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function statusTone(status: ShortlistStatus) {
  if (status === "Offer Extended") return "bg-success/15 text-success";
  if (status === "Interview Scheduled") return "bg-primary/15 text-primary";
  return "bg-warning/15 text-warning";
}

export default function ShortlistedCard({
  candidate,
  selected,
  onSelect,
  onSchedule,
  onMessage,
  onViewProfile,
  onRemove,
}: ShortlistedCardProps) {
  return (
    <article className="rounded-xl border border-warning/30 border-l-4 border-l-warning bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={(event) => onSelect(candidate.id, event.target.checked)}
            aria-label={`Select ${candidate.name}`}
          />
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan text-sm font-semibold text-white">
            {initials(candidate.name)}
          </div>
          <div>
            <h3 className="font-syne text-[16px] font-semibold text-midnight">
              {candidate.name}
            </h3>
            <p className="text-sm text-slate">{candidate.role}</p>
          </div>
        </div>
        <span className="rounded-full bg-success px-3 py-1 text-sm font-semibold text-white">
          {candidate.matchScore}%
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          {candidate.job}
        </span>
        <span className="text-xs text-slate">{candidate.shortlistedDate}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {candidate.skillsMatched.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-3">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusTone(candidate.status)}`}
        >
          {candidate.status}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onSchedule(candidate)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-success px-3 py-2 text-sm font-semibold text-white hover:bg-success/90"
        >
          <CalendarPlus className="h-4 w-4" />
          Schedule Interview
        </button>
        <button
          type="button"
          onClick={() => onMessage(candidate)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90"
        >
          <MessageSquare className="h-4 w-4" />
          Send Message
        </button>
        <button
          type="button"
          onClick={() => onViewProfile(candidate)}
          className="rounded-lg border border-slate/25 px-3 py-2 text-sm font-medium text-midnight hover:bg-surface"
        >
          View Profile
        </button>
        <button
          type="button"
          onClick={() => onRemove(candidate)}
          className="ml-auto inline-flex items-center gap-1 rounded-lg border border-danger/25 px-3 py-2 text-sm font-medium text-danger hover:bg-danger/5"
        >
          <X className="h-4 w-4" />
          Remove from Shortlist
        </button>
      </div>
    </article>
  );
}

