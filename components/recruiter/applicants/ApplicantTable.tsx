"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CalendarPlus,
  Crown,
  Medal,
  Star,
  X,
} from "lucide-react";
import type { ApplicantCandidate, ApplicantStatus } from "./CandidateCard";

type SortKey = "name" | "matchScore" | "resumeScore" | "experienceYears" | "appliedDaysAgo";

interface ApplicantTableProps {
  candidates: ApplicantCandidate[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAllPage: (checked: boolean, ids: string[]) => void;
  onToggleShortlist: (id: string) => void;
  onReject: (id: string) => void;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  sortKey: SortKey;
  sortDirection: "asc" | "desc";
  onSortChange: (key: SortKey) => void;
}

const statusClass: Record<ApplicantStatus, string> = {
  New: "bg-primary/10 text-primary",
  "AI Screened": "bg-cyan/10 text-cyan",
  Shortlisted: "bg-warning/15 text-warning",
  Interview: "bg-success/10 text-success",
  Rejected: "bg-danger/10 text-danger",
};

function sortIcon(active: boolean, direction: "asc" | "desc") {
  if (!active) return <ArrowUpDown className="h-3.5 w-3.5" />;
  return direction === "asc" ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />;
}

function rankBadge(index: number) {
  if (index === 0) return <Crown className="h-4 w-4 text-warning" />;
  if (index === 1) return <Medal className="h-4 w-4 text-slate" />;
  if (index === 2) return <Medal className="h-4 w-4 text-amber-700" />;
  return null;
}

export default function ApplicantTable({
  candidates,
  selectedIds,
  onToggleSelect,
  onSelectAllPage,
  onToggleShortlist,
  onReject,
  page,
  pageSize,
  onPageChange,
  sortKey,
  sortDirection,
  onSortChange,
}: ApplicantTableProps) {
  const totalPages = Math.max(1, Math.ceil(candidates.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = candidates.slice(start, start + pageSize);
  const pageIds = pageRows.map((row) => row.id);
  const allPageSelected = pageRows.length > 0 && pageRows.every((row) => selectedIds.includes(row.id));

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  return (
    <section className="overflow-hidden rounded-xl border border-slate/20 bg-white">
      <div className="max-h-[560px] overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="border-b border-slate/10 text-left text-slate">
              <th className="w-10 px-3 py-3">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  onChange={(event) => onSelectAllPage(event.target.checked, pageIds)}
                  aria-label="Select page rows"
                />
              </th>
              <th className="px-3 py-3 font-medium">Candidate</th>
              <th className="px-3 py-3 font-medium">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 hover:text-midnight"
                  onClick={() => onSortChange("matchScore")}
                >
                  Match %
                  {sortIcon(sortKey === "matchScore", sortDirection)}
                </button>
              </th>
              <th className="px-3 py-3 font-medium">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 hover:text-midnight"
                  onClick={() => onSortChange("resumeScore")}
                >
                  Resume Score
                  {sortIcon(sortKey === "resumeScore", sortDirection)}
                </button>
              </th>
              <th className="px-3 py-3 font-medium">Skills</th>
              <th className="px-3 py-3 font-medium">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 hover:text-midnight"
                  onClick={() => onSortChange("experienceYears")}
                >
                  Experience
                  {sortIcon(sortKey === "experienceYears", sortDirection)}
                </button>
              </th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="px-3 py-3 font-medium">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 hover:text-midnight"
                  onClick={() => onSortChange("appliedDaysAgo")}
                >
                  Applied
                  {sortIcon(sortKey === "appliedDaysAgo", sortDirection)}
                </button>
              </th>
              <th className="px-3 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((candidate, idx) => (
              <tr
                key={candidate.id}
                className={`${idx % 2 === 0 ? "bg-white" : "bg-surface/70"} border-b border-slate/10`}
              >
                <td className="px-3 py-3">
                  <input
                    type="checkbox"
                    checked={selectedSet.has(candidate.id)}
                    onChange={() => onToggleSelect(candidate.id)}
                    aria-label={`Select ${candidate.name}`}
                  />
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    {rankBadge(start + idx)}
                    <div>
                      <p className="font-medium text-midnight">{candidate.name}</p>
                      <p className="text-xs text-slate">{candidate.title}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                    {candidate.matchScore}%
                  </span>
                </td>
                <td className="px-3 py-3 text-cyan">{candidate.resumeScore}</td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-1">
                    {candidate.matchedSkills.slice(0, 2).map((skill) => (
                      <span key={skill} className="rounded-full bg-success/10 px-2 py-0.5 text-[11px] text-success">
                        {skill}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-3 text-midnight">{candidate.experienceYears} yrs</td>
                <td className="px-3 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusClass[candidate.status]}`}>
                    {candidate.status}
                  </span>
                </td>
                <td className="px-3 py-3 text-slate">{candidate.appliedLabel}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/recruiter/applicants/${candidate.id}`} className="text-primary hover:underline">
                      View
                    </Link>
                    <button
                      type="button"
                      onClick={() => onToggleShortlist(candidate.id)}
                      className="rounded p-1 text-warning hover:bg-warning/10"
                      aria-label="Shortlist"
                    >
                      <Star className={`h-4 w-4 ${candidate.shortlisted ? "fill-warning" : ""}`} />
                    </button>
                    <button
                      type="button"
                      className="rounded p-1 text-success hover:bg-success/10"
                      aria-label="Schedule interview"
                    >
                      <CalendarPlus className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onReject(candidate.id)}
                      className="rounded p-1 text-danger hover:bg-danger/10"
                      aria-label="Reject"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate/10 px-4 py-3 text-sm">
        <p className="text-slate">
          Showing {start + 1}-{Math.min(start + pageSize, candidates.length)} of {candidates.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="rounded-lg border border-slate/20 px-3 py-1.5 text-midnight disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-midnight">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="rounded-lg border border-slate/20 px-3 py-1.5 text-midnight disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}

