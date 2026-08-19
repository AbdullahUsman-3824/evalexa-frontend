"use client";

import { Loader2, RefreshCw, Search } from "lucide-react";
import ApplicantTable from "@/components/recruiter/applicants/ApplicantTable";
import type {
  Application,
  ApplicationListResponse,
  ApplicationListSortBy,
  ApplicationListSortOrder,
  ApplicationStatus,
  JobProcessingStatusResponse,
} from "@/types/job.types";

export type StatusFilter = "All" | ApplicationStatus;
export type TableSortKey = ApplicationListSortBy;

interface RecruiterApplicantsWorkspaceProps {
  selectedJobId: string;
  loadingApplications: boolean;
  applicationsError: string | null;
  retryingFailed: boolean;
  processingStatus: JobProcessingStatusResponse | null;
  onRetryFailed: () => void;
  applications: Application[];
  applicationsMeta: ApplicationListResponse["meta"];
  search: string;
  onSearchChange: (value: string) => void;
  activeStatus: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  sortBy: TableSortKey;
  onSortByChange: (value: TableSortKey) => void;
  sortOrder: ApplicationListSortOrder;
  onSortOrderChange: (value: ApplicationListSortOrder) => void;
  page: number;
  onPageChange: (page: number) => void;
}

function formatProcessingStatus(status: JobProcessingStatusResponse["status"]) {
  switch (status) {
    case "PENDING":
      return "Pending";
    case "RUNNING":
      return "Running";
    case "COMPLETED":
      return "Completed";
    case "FAILED":
      return "Failed";
    case "CANCELLED":
      return "Cancelled";
    case "SKIPPED":
      return "Skipped";
    default:
      return "Idle";
  }
}

function formatProcessingTask(
  task: JobProcessingStatusResponse["currentTask"],
) {
  switch (task) {
    case "RESUME_PARSE":
      return "Resume Parse";
    case "RESUME_ANALYSIS":
      return "Resume Analysis";
    case "RANKING":
      return "Ranking";
    case "SHORTLISTING":
      return "Shortlisting";
    case "AI_INTERVIEW":
      return "AI Interview";
    case "EMAIL_NOTIFICATION":
      return "Email Notification";
    default:
      return "No active task";
  }
}

export default function RecruiterApplicantsWorkspace({
  selectedJobId,
  loadingApplications,
  applicationsError,
  retryingFailed,
  processingStatus,
  onRetryFailed,
  applications,
  applicationsMeta,
  search,
  onSearchChange,
  activeStatus,
  onStatusChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  page,
  onPageChange,
}: RecruiterApplicantsWorkspaceProps) {
  const failedCount = processingStatus?.progress.failed ?? 0;
  const processingCount = processingStatus?.progress.processing ?? 0;
  const completedCount = processingStatus?.progress.completed ?? 0;
  const retryCount = processingStatus?.retryCount ?? 0;
  const statusLabel = processingStatus
    ? formatProcessingStatus(processingStatus.status)
    : "Idle";
  const currentTaskLabel = processingStatus
    ? formatProcessingTask(processingStatus.currentTask)
    : "No active task";

  if (!selectedJobId) {
    return (
      <section className="rounded-xl border border-slate/20 bg-white p-8 text-center shadow-sm">
        <h2 className="font-syne text-xl font-semibold text-midnight">
          Choose a job to view applications
        </h2>
        <p className="mt-2 text-sm text-slate">
          Pick a title from the dropdown above to load the matching recruiter
          applications.
        </p>
      </section>
    );
  }

  if (applicationsError) {
    return (
      <section className="rounded-xl border border-danger/20 bg-danger/10 p-6 text-danger">
        <h2 className="font-semibold">Error loading applications</h2>
        <p className="mt-1 text-sm text-danger/80">{applicationsError}</p>
      </section>
    );
  }

  if (loadingApplications && applications.length === 0) {
    return (
      <section className="rounded-xl border border-secondary/20 bg-white p-8 text-center shadow-sm">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <p className="mt-3 text-sm text-slate">Loading applications...</p>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-secondary/20 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-syne text-xl font-semibold text-midnight">
              AI Processing
            </h2>
            <p className="mt-1 text-sm text-slate">Status: {statusLabel}</p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <button
              type="button"
              onClick={onRetryFailed}
              className="inline-flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-sm font-medium text-warning disabled:cursor-not-allowed disabled:opacity-50"
              disabled={failedCount === 0 || retryingFailed}
            >
              {retryingFailed ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {failedCount > 0 ? `Retry ${failedCount} Failed` : "Retry Failed"}
            </button>
            <span className="text-xs text-slate">
              Retry count: {retryCount}
            </span>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-success/20 bg-success/5 p-3">
            <p className="text-xs uppercase tracking-wide text-slate">
              Completed
            </p>
            <p className="mt-2 text-2xl font-bold text-success">
              {completedCount}
            </p>
          </div>
          <div className="rounded-lg border border-warning/20 bg-warning/5 p-3">
            <p className="text-xs uppercase tracking-wide text-slate">
              Processing
            </p>
            <p className="mt-2 text-2xl font-bold text-warning">
              {processingCount}
            </p>
          </div>
          <div className="rounded-lg border border-danger/20 bg-danger/5 p-3">
            <p className="text-xs uppercase tracking-wide text-slate">Failed</p>
            <p className="mt-2 text-2xl font-bold text-danger">{failedCount}</p>
          </div>
        </div>

        <div className="mt-3 text-sm text-slate">
          <span className="font-medium text-midnight">Current Task:</span>{" "}
          {currentTaskLabel}
        </div>
      </section>

      <section className="rounded-xl border border-secondary/20 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 lg:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search candidate name or email..."
              className="h-10 w-full rounded-lg border border-secondary/30 bg-white pl-10 pr-3 text-sm text-midnight outline-none transition-all hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={activeStatus}
              onChange={(event) =>
                onStatusChange(event.target.value as StatusFilter)
              }
              className="h-10 rounded-lg border border-secondary/30 bg-white px-3 text-sm text-midnight outline-none transition-all hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="All">Status: All</option>
              <option value="APPLIED">Applied</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="INTERVIEW">Interview</option>
              <option value="OFFER">Offer</option>
              <option value="HIRED">Hired</option>
              <option value="REJECTED">Rejected</option>
              <option value="WITHDRAWN">Withdrawn</option>
            </select>

            <select
              value={sortBy}
              onChange={(event) =>
                onSortByChange(event.target.value as TableSortKey)
              }
              className="h-10 rounded-lg border border-secondary/30 bg-white px-3 text-sm text-midnight outline-none transition-all hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="rankPosition">Sort: Rank</option>
              <option value="matchScore">Sort: Match Score</option>
              <option value="appliedAt">Sort: Applied</option>
            </select>

            <button
              type="button"
              onClick={() =>
                onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")
              }
              className="inline-flex h-10 items-center justify-center rounded-lg border border-secondary/30 bg-white px-3 text-sm font-medium text-midnight transition-all hover:border-primary/40 hover:bg-surface"
              aria-label="Toggle sort order"
            >
              {sortOrder === "asc" ? "Asc" : "Desc"}
            </button>
          </div>
        </div>
      </section>

      <div className="rounded-xl border border-secondary/20 bg-white shadow-sm">
        <div className="border-b border-secondary/20 px-4 py-3">
          <h2 className="font-syne text-xl font-semibold text-midnight">
            Applications
          </h2>
          <p className="mt-1 text-sm text-slate">
            {applicationsMeta.total} applications loaded from the API.
          </p>
        </div>

        <ApplicantTable
          applications={applications}
          total={applicationsMeta.total}
          totalPages={applicationsMeta.totalPages}
          pageSize={applicationsMeta.limit}
          page={page}
          onPageChange={onPageChange}
          sortKey={sortBy}
          sortDirection={sortOrder}
          onSortChange={onSortByChange}
        />
      </div>
    </div>
  );
}
