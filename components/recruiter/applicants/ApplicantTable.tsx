"use client";

import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { Eye } from "lucide-react";
import type {
  Application,
  ApplicationListSortBy,
  ApplicationListSortOrder,
} from "@/types/job.types";
import {
  formatAppliedDate,
  formatAiStatus,
  statusTone,
  matchLabel,
  scoreTone,
} from "./helpers";

interface ApplicantTableProps {
  applications: Application[];
  total: number;
  totalPages: number;
  pageSize: number;
  page: number;
  onPageChange: (page: number) => void;
  sortKey: ApplicationListSortBy;
  sortDirection: ApplicationListSortOrder;
  onSortChange: (key: ApplicationListSortBy) => void;
}

function sortIcon(active: boolean, direction: ApplicationListSortOrder) {
  if (!active) return <ArrowUpDown className="h-3.5 w-3.5 text-slate" />;
  return direction === "asc" ? (
    <ArrowUp className="h-3.5 w-3.5 text-primary" />
  ) : (
    <ArrowDown className="h-3.5 w-3.5 text-primary" />
  );
}

export default function ApplicantTable({
  applications,
  total,
  totalPages,
  pageSize,
  page,
  onPageChange,
  sortKey,
  sortDirection,
  onSortChange,
}: ApplicantTableProps) {
  const currentPage = Math.min(page, totalPages);
  const start = total === 0 ? 0 : (currentPage - 1) * pageSize;

  const firstItem = total === 0 ? 0 : start + 1;
  const lastItem =
    total === 0 ? 0 : Math.min(start + applications.length, total);

  return (
    <section className="overflow-hidden rounded-xl border border-secondary/20 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="max-h-140 overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 z-10 bg-white border-b border-secondary/20">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium text-midnight text-xs uppercase tracking-wider">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 hover:text-primary transition-colors group"
                  onClick={() => onSortChange("rankPosition")}
                >
                  Candidate
                  <span className="text-slate group-hover:text-primary transition-colors">
                    {sortIcon(sortKey === "rankPosition", sortDirection)}
                  </span>
                </button>
              </th>
              <th className="px-4 py-3 font-medium text-midnight text-xs uppercase tracking-wider">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 hover:text-primary transition-colors group"
                  onClick={() => onSortChange("appliedAt")}
                >
                  Experience
                  <span className="text-slate group-hover:text-primary transition-colors">
                    {sortIcon(sortKey === "appliedAt", sortDirection)}
                  </span>
                </button>
              </th>
              <th className="px-4 py-3 font-medium text-midnight text-xs uppercase tracking-wider">
                AI Status
              </th>
              <th className="px-4 py-3 font-medium text-midnight text-xs uppercase tracking-wider">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 hover:text-primary transition-colors group"
                  onClick={() => onSortChange("matchScore")}
                >
                  Score
                  <span className="text-slate group-hover:text-primary transition-colors">
                    {sortIcon(sortKey === "matchScore", sortDirection)}
                  </span>
                </button>
              </th>
              <th className="px-4 py-3 font-medium text-midnight text-xs uppercase tracking-wider">
                Match
              </th>
              <th className="px-4 py-3 font-medium text-midnight text-xs uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application, idx) => {
              const score = application.matchScore;
              const rank = application.rankPosition;

              return (
                <tr
                  key={application.id}
                  className={`${idx % 2 === 0 ? "bg-white" : "bg-surface/50"} border-b border-secondary/10 transition-colors hover:bg-surface/80`}
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/recruiter/applicants/${application.id}`}
                      className="font-medium text-midnight hover:text-primary transition-colors"
                    >
                      {application.candidate.fullName}
                    </Link>
                    <div className="text-xs text-slate">
                      {application.candidate.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-midnight">
                    {formatAppliedDate(application.appliedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusTone(application.screeningStage)}`}
                    >
                      {formatAiStatus(application.screeningStage)}
                    </span>
                  </td>
                  <td className={`px-4 py-3 font-semibold ${scoreTone(score)}`}>
                    {score === null ? "--" : `${Math.round(score)}`}
                  </td>
                  <td className="px-4 py-3 text-midnight">
                    {matchLabel(score)}
                    {rank !== null && rank !== undefined && (
                      <span className="ml-2 text-xs text-slate">#{rank}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/recruiter/applicants/${application.id}`}
                        className="rounded-lg p-1.5 text-slate transition-all hover:bg-primary/10 hover:text-primary"
                        aria-label="View profile"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {applications.length === 0 && (
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

      {total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-secondary/20 px-4 py-3 text-sm">
          <p className="text-slate text-xs sm:text-sm order-2 sm:order-1">
            Showing{" "}
            <span className="font-medium text-midnight">{firstItem}</span> to{" "}
            <span className="font-medium text-midnight">{lastItem}</span> of{" "}
            <span className="font-medium text-midnight">{total}</span>{" "}
            applications
          </p>
          <div className="flex items-center gap-2 order-1 sm:order-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="inline-flex items-center gap-1 rounded-lg border border-secondary/30 px-3 py-1.5 text-midnight transition-all hover:bg-surface hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-40 text-sm"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = index + 1;
                } else if (currentPage <= 3) {
                  pageNumber = index + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + index;
                } else {
                  pageNumber = currentPage - 2 + index;
                }

                if (pageNumber < 1 || pageNumber > totalPages) return null;

                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => onPageChange(pageNumber)}
                    className={`h-8 w-8 rounded-lg text-sm font-medium transition-all ${pageNumber === currentPage ? "bg-primary text-white shadow-sm" : "text-midnight hover:bg-surface hover:text-primary"}`}
                  >
                    {pageNumber}
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
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
