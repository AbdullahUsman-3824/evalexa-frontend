"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Star,
  X,
  Eye,
  Briefcase,
  MapPin,
  Clock,
  Search,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import type { ApplicantCandidate, ApplicantStatus } from "./CandidateCard";

type SortKey = "name" | "experienceYears" | "appliedDaysAgo";

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
  New: "bg-primary/10 text-primary border border-primary/20",
  "AI Screened": "bg-cyan/10 text-cyan border border-cyan/20",
  Shortlisted: "bg-warning/15 text-warning border border-warning/20",
  Interview: "bg-success/10 text-success border border-success/20",
  Rejected: "bg-danger/10 text-danger border border-danger/20",
};

const statusDot: Record<ApplicantStatus, string> = {
  New: "bg-primary",
  "AI Screened": "bg-cyan",
  Shortlisted: "bg-warning",
  Interview: "bg-success",
  Rejected: "bg-danger",
};

function sortIcon(active: boolean, direction: "asc" | "desc") {
  if (!active) return <ArrowUpDown className="h-3.5 w-3.5 text-slate" />;
  return direction === "asc" ? (
    <ArrowUp className="h-3.5 w-3.5 text-primary" />
  ) : (
    <ArrowDown className="h-3.5 w-3.5 text-primary" />
  );
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
  const allPageSelected =
    pageRows.length > 0 &&
    pageRows.every((row) => selectedIds.includes(row.id));

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  return (
    <section className="overflow-hidden rounded-xl border border-secondary/20 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="max-h-[560px] overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 z-10 bg-white border-b border-secondary/20">
            <tr className="text-left">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  onChange={(event) =>
                    onSelectAllPage(event.target.checked, pageIds)
                  }
                  className="h-4 w-4 rounded border-secondary/30 text-primary focus:ring-2 focus:ring-primary/20 focus:ring-offset-0 transition-colors"
                  aria-label="Select page rows"
                />
              </th>
              <th className="px-4 py-3 font-medium text-midnight text-xs uppercase tracking-wider">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 hover:text-primary transition-colors group"
                  onClick={() => onSortChange("name")}
                >
                  Candidate
                  <span className="text-slate group-hover:text-primary transition-colors">
                    {sortIcon(sortKey === "name", sortDirection)}
                  </span>
                </button>
              </th>
              <th className="px-4 py-3 font-medium text-midnight text-xs uppercase tracking-wider">
                Skills
              </th>
              <th className="px-4 py-3 font-medium text-midnight text-xs uppercase tracking-wider">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 hover:text-primary transition-colors group"
                  onClick={() => onSortChange("experienceYears")}
                >
                  Experience
                  <span className="text-slate group-hover:text-primary transition-colors">
                    {sortIcon(sortKey === "experienceYears", sortDirection)}
                  </span>
                </button>
              </th>
              <th className="px-4 py-3 font-medium text-midnight text-xs uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 font-medium text-midnight text-xs uppercase tracking-wider">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 hover:text-primary transition-colors group"
                  onClick={() => onSortChange("appliedDaysAgo")}
                >
                  Applied
                  <span className="text-slate group-hover:text-primary transition-colors">
                    {sortIcon(sortKey === "appliedDaysAgo", sortDirection)}
                  </span>
                </button>
              </th>
              <th className="px-4 py-3 font-medium text-midnight text-xs uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((candidate, idx) => {
              const isSelected = selectedSet.has(candidate.id);
              const isRejected = candidate.status === "Rejected";

              return (
                <tr
                  key={candidate.id}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-surface/50"
                  } border-b border-secondary/10 transition-colors hover:bg-surface/80 ${
                    isRejected ? "opacity-60" : ""
                  } ${isSelected ? "bg-primary/5" : ""}`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(candidate.id)}
                      className="h-4 w-4 rounded border-secondary/30 text-primary focus:ring-2 focus:ring-primary/20 focus:ring-offset-0 transition-colors"
                      aria-label={`Select ${candidate.name}`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/recruiter/applicants/${candidate.id}`}
                      className="font-medium text-midnight hover:text-primary transition-colors"
                    >
                      {candidate.name}
                    </Link>
                    <div className="flex flex-col gap-0.5 text-xs text-slate">
                      <span>{candidate.title}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {candidate.location}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {candidate.matchedSkills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success border border-success/20"
                        >
                          {skill}
                        </span>
                      ))}
                      {candidate.matchedSkills.length > 3 && (
                        <span className="text-[11px] text-slate">
                          +{candidate.matchedSkills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5 text-slate" />
                      <span className="text-midnight">
                        {candidate.experienceYears}
                        {candidate.experienceYears >= 10 ? "+" : ""} yrs
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusClass[candidate.status]}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${statusDot[candidate.status]}`}
                      />
                      {candidate.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-slate">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="text-xs">{candidate.appliedLabel}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/recruiter/applicants/${candidate.id}`}
                        className="rounded-lg p-1.5 text-slate transition-all hover:bg-primary/10 hover:text-primary"
                        aria-label="View profile"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => onToggleShortlist(candidate.id)}
                        className={`rounded-lg p-1.5 transition-all ${
                          candidate.shortlisted
                            ? "text-warning hover:bg-warning/10"
                            : "text-slate hover:bg-surface hover:text-warning"
                        }`}
                        aria-label="Shortlist"
                      >
                        <Star
                          className={`h-4 w-4 ${
                            candidate.shortlisted ? "fill-warning" : ""
                          }`}
                        />
                      </button>
                      {!isRejected && (
                        <button
                          type="button"
                          onClick={() => onReject(candidate.id)}
                          className="rounded-lg p-1.5 text-slate transition-all hover:bg-danger/10 hover:text-danger"
                          aria-label="Reject"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {pageRows.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="rounded-full bg-surface p-4 mb-3">
            <Search className="h-6 w-6 text-slate" />
          </div>
          <h3 className="font-medium text-midnight mb-1">
            No candidates found
          </h3>
          <p className="text-sm text-slate">
            Try adjusting your filters or search terms
          </p>
        </div>
      )}

      {/* Pagination */}
      {candidates.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-secondary/20 px-4 py-3 text-sm">
          <p className="text-slate text-xs sm:text-sm order-2 sm:order-1">
            Showing{" "}
            <span className="font-medium text-midnight">{start + 1}</span> to{" "}
            <span className="font-medium text-midnight">
              {Math.min(start + pageSize, candidates.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-midnight">
              {candidates.length}
            </span>{" "}
            candidates
          </p>
          <div className="flex items-center gap-2 order-1 sm:order-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="inline-flex items-center gap-1 rounded-lg border border-secondary/30 px-3 py-1.5 text-midnight transition-all hover:bg-surface hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-40 text-sm"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                if (pageNum < 1 || pageNum > totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`h-8 w-8 rounded-lg text-sm font-medium transition-all ${
                      pageNum === currentPage
                        ? "bg-primary text-white shadow-sm"
                        : "text-midnight hover:bg-surface hover:text-primary"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="inline-flex items-center gap-1 rounded-lg border border-secondary/30 px-3 py-1.5 text-midnight transition-all hover:bg-surface hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-40 text-sm"
            >
              Next
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
