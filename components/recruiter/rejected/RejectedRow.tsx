"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";

export type RejectionReason =
  | "Low match score"
  | "Missing required skills"
  | "Position filled"
  | "Custom reason";

export interface RejectedCandidate {
  id: string;
  name: string;
  role: string;
  job: string;
  rejectedDate: string;
  reason: string;
  matchScore: number;
}

interface RejectedRowProps {
  candidate: RejectedCandidate;
  selected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onReconsider: (candidate: RejectedCandidate) => void;
  onViewProfile: (candidate: RejectedCandidate) => void;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function RejectedRow({
  candidate,
  selected,
  onSelect,
  onReconsider,
  onViewProfile,
}: RejectedRowProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <article className="relative rounded-xl border border-danger/25 border-l-4 border-l-danger bg-white p-4 opacity-80">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={(event) => onSelect(candidate.id, event.target.checked)}
            aria-label={`Select ${candidate.name}`}
            className="mt-1"
          />
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate/20 text-sm font-semibold text-slate grayscale">
            {initials(candidate.name)}
          </div>
          <div>
            <h3 className="font-syne text-[16px] font-semibold text-midnight">
              {candidate.name}
            </h3>
            <p className="text-sm text-slate">{candidate.role}</p>
            <p className="text-xs text-slate">{candidate.job}</p>
          </div>
        </div>

        <span className="rounded-full bg-slate/20 px-2.5 py-1 text-xs font-semibold text-slate">
          {candidate.matchScore}%
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate">
        <span>{candidate.rejectedDate}</span>
        <span
          className="relative cursor-help italic underline decoration-dotted"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {candidate.reason}
          {showTooltip && (
            <span className="absolute left-0 top-6 z-20 w-64 rounded-lg border border-slate/25 bg-midnight p-2 text-xs normal-case text-white shadow-lg">
              {candidate.reason}
            </span>
          )}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onReconsider(candidate)}
          className="inline-flex items-center gap-1 rounded-lg border border-primary/25 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/5"
        >
          <RotateCcw className="h-4 w-4" />
          Reconsider
        </button>
        <button
          type="button"
          onClick={() => onViewProfile(candidate)}
          className="rounded-lg border border-slate/25 px-3 py-2 text-sm font-medium text-midnight hover:bg-surface"
        >
          View Profile
        </button>
      </div>
    </article>
  );
}

