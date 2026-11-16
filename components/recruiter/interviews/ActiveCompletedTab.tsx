"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Star,
} from "lucide-react";
import { listInterviewResults } from "@/services/interview.service";
import {
  getAllHiredApplicationIds,
  hireCandidate,
} from "@/services/application.service";
import type { InterviewResult } from "@/types/interview.types";
import HireConfirmModal from "./HireConfirmModal";
import {
  CandidateCell,
  JobCell,
  StatusFilter,
  TableEmpty,
  TableLoading,
  tableWrapperClass,
  tdClass,
  thClass,
} from "./shared/TablePieces";

type Stage = "in_progress" | "processing" | "completed" | "failed";
type StageFilter = "ALL" | Stage;

const FILTER_OPTIONS: { label: string; value: StageFilter }[] = [
  { label: "All interviews", value: "ALL" },
  { label: "In progress", value: "in_progress" },
  { label: "Processing", value: "processing" },
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
];

/** While anything is still running, re-check the list every 15 seconds. */
const POLL_INTERVAL_MS = 15_000;

function getStage(row: InterviewResult): Stage {
  switch (row.processingStatus) {
    case "candidate_in_progress":
      return "in_progress";
    case "transcribing":
    case "evaluating":
      return "processing";
    case "ready":
    case "partial":
      return "completed";
    case "failed":
      return "failed";
    default:
      return row.status === "COMPLETED" ? "processing" : "in_progress";
  }
}

function scoreTone(percentage: number) {
  if (percentage >= 75) {
    return { text: "text-[#0F6E56]", bar: "bg-[#00B37E]", soft: "bg-[#E1F5EE]" };
  }
  if (percentage >= 50) {
    return { text: "text-[#854F0B]", bar: "bg-[#FF9500]", soft: "bg-[#FFF3E0]" };
  }
  return { text: "text-[#B42332]", bar: "bg-[#E63946]", soft: "bg-[#FDECEE]" };
}

function formatDuration(seconds: number | null): string {
  if (seconds == null || seconds < 0) return "—";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${String(minutes).padStart(2, "0")}m`;
  if (minutes > 0) return `${minutes} min`;
  return `${seconds}s`;
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function humanize(value: string): string {
  return value
    .toLowerCase()
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** The most relevant timestamp for the row, with a label. */
function getDateInfo(row: InterviewResult): { label: string; value: string | null } {
  if (row.completedAt) return { label: "Completed", value: row.completedAt };
  if (row.submittedAt) return { label: "Submitted", value: row.submittedAt };
  return { label: "Started", value: row.startedAt };
}

/* ───────────── Single "Result" cell: in progress → processing → score ───────────── */

function ResultCell({ row }: { row: InterviewResult }) {
  const stage = getStage(row);

  if (stage === "completed") {
    if (!row.scores) {
      return (
        <span className="inline-flex items-center rounded-full bg-[#E1F5EE] px-3 py-1 text-xs font-semibold text-[#0F6E56]">
          {row.processingLabel || "Results ready"}
        </span>
      );
    }

    const { overallScore, overallMaxScore, overallPercentage } = row.scores;
    const percentage = Math.max(0, Math.min(100, Math.round(overallPercentage)));
    const tone = scoreTone(percentage);

    return (
      <div className="w-36">
        <div className="flex items-baseline gap-2">
          <span className={`font-syne text-xl font-bold ${tone.text}`}>
            {percentage}%
          </span>
          <span className="text-xs text-slate-500">
            {overallScore}/{overallMaxScore}
          </span>
          {row.processingStatus === "partial" && (
            <span className="rounded-full bg-[#FFF3E0] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#854F0B]">
              Partial
            </span>
          )}
        </div>
        <div className={`mt-1.5 h-1.5 w-full overflow-hidden rounded-full ${tone.soft}`}>
          <div
            className={`h-full rounded-full ${tone.bar}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }

  if (stage === "failed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDECEE] px-3 py-1 text-xs font-semibold text-[#B42332]">
        <AlertTriangle className="h-3.5 w-3.5" />
        {row.processingLabel || "Processing failed"}
      </span>
    );
  }

  if (stage === "processing") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF3E0] px-3 py-1 text-xs font-semibold text-[#854F0B]">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        {row.processingLabel || "Processing"}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[#EEF4FF] px-3 py-1 text-xs font-semibold text-[#1E6FFF]">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1E6FFF] opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#1E6FFF]" />
      </span>
      {row.processingLabel || "In progress"}
    </span>
  );
}

function RecommendationBadge({ value }: { value: string | null }) {
  if (!value) return <span className="text-slate-400">—</span>;

  const upper = value.toUpperCase();
  let tone = "bg-slate-100 text-slate-600";
  let icon: React.ReactNode = null;

  if (upper.includes("NOT")) {
    tone = "bg-[#FDECEE] text-[#B42332]";
    icon = <span className="h-2 w-2 rounded-full bg-[#E63946]" />;
  } else if (upper.includes("STRONG")) {
    tone = "bg-[#E1F5EE] text-[#0F6E56]";
    icon = <Star className="h-3 w-3 fill-current" />;
  } else if (upper.includes("RECOMMEND")) {
    tone = "bg-[#E1F5EE] text-[#0F6E56]";
    icon = <CheckCircle2 className="h-3.5 w-3.5" />;
  } else if (upper.includes("NEUTRAL")) {
    tone = "bg-[#FFF3E0] text-[#854F0B]";
    icon = <span className="h-2 w-2 rounded-full bg-[#FF9500]" />;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}
    >
      {icon}
      {humanize(value)}
    </span>
  );
}

interface ActiveCompletedTabProps {
  onToast: (message: string, type: "success" | "error" | "info") => void;
}

export default function ActiveCompletedTab({ onToast }: ActiveCompletedTabProps) {
  const [rows, setRows] = useState<InterviewResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<StageFilter>("ALL");
  const [hiredIds, setHiredIds] = useState<Set<string>>(() => new Set());
  const [hireTarget, setHireTarget] = useState<InterviewResult | null>(null);
  const [isHiring, setIsHiring] = useState(false);

  const load = useCallback(
    async (mode: "initial" | "manual" | "poll") => {
      if (mode === "manual") setIsRefreshing(true);

      try {
        // Polling only refreshes the results; the hired list is re-checked on
        // initial load / manual refresh. A failure there must never block the table.
        const [items, hired] = await Promise.all([
          listInterviewResults(),
          mode === "poll"
            ? Promise.resolve<Set<string> | null>(null)
            : getAllHiredApplicationIds().catch(() => null),
        ]);

        setRows(items);
        if (hired) {
          setHiredIds((prev) => {
            const next = new Set(prev);
            hired.forEach((id) => next.add(id));
            return next;
          });
        }
      } catch (error) {
        // Silent polling should not spam the recruiter with toasts.
        if (mode !== "poll") {
          onToast(
            error instanceof Error
              ? error.message
              : "Unable to load interview results.",
            "error",
          );
        }
      } finally {
        if (mode === "initial") setIsLoading(false);
        if (mode === "manual") setIsRefreshing(false);
      }
    },
    [onToast],
  );

  useEffect(() => {
    void load("initial");
  }, [load]);

  const hasRunning = useMemo(
    () =>
      rows.some((row) => {
        const stage = getStage(row);
        return stage === "in_progress" || stage === "processing";
      }),
    [rows],
  );

  useEffect(() => {
    if (!hasRunning) return;
    const timer = window.setInterval(() => void load("poll"), POLL_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [hasRunning, load]);

  // Hired candidates live on the "Hired Candidates" page, not in this list.
  const visibleRows = useMemo(() => {
    const notHired = rows.filter((row) => !hiredIds.has(row.applicationId));
    return filter === "ALL"
      ? notHired
      : notHired.filter((row) => getStage(row) === filter);
  }, [rows, hiredIds, filter]);

  const handleCancelHire = useCallback(() => {
    setHireTarget(null);
  }, []);

  const handleConfirmHire = useCallback(
    async (sendEmail: boolean) => {
      if (!hireTarget || isHiring) return;

      setIsHiring(true);
      try {
        await hireCandidate(hireTarget.applicationId, sendEmail);

        const hiredApplicationId = hireTarget.applicationId;
        setHiredIds((prev) => {
          const next = new Set(prev);
          next.add(hiredApplicationId);
          return next;
        });
        onToast(`${hireTarget.candidateName} has been marked as hired.`, "success");
        setHireTarget(null);
      } catch (error) {
        onToast(
          error instanceof Error
            ? error.message
            : "Unable to hire this candidate.",
          "error",
        );
      } finally {
        setIsHiring(false);
      }
    },
    [hireTarget, isHiring, onToast],
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <StatusFilter
          value={filter}
          options={FILTER_OPTIONS}
          onChange={setFilter}
        />

        <button
          type="button"
          onClick={() => void load("manual")}
          disabled={isRefreshing || isLoading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate/20 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <TableLoading label="Loading interview results…" />
      ) : visibleRows.length === 0 ? (
        <TableEmpty
          label={
            rows.length === 0
              ? "No interviews have been started yet."
              : filter === "ALL"
                ? "No interviews to show. Hired candidates are listed under Hired Candidates."
                : "No interviews match this filter."
          }
        />
      ) : (
        <div className={tableWrapperClass}>
          <table className="w-full min-w-[900px] text-sm">
            <thead className="border-b border-slate/15 bg-slate-50">
              <tr>
                <th className={thClass}>Candidate</th>
                <th className={thClass}>Job</th>
                <th className={thClass}>Time taken</th>
                <th className={thClass}>Date</th>
                <th className={thClass}>Result</th>
                <th className={thClass}>Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate/10">
              {visibleRows.map((row) => {
                const dateInfo = getDateInfo(row);

                return (
                  <tr key={row.interviewId} className="hover:bg-slate-50/60">
                    <td className={tdClass}>
                      <CandidateCell
                        name={row.candidateName}
                        email={row.candidateEmail}
                        applicationId={row.applicationId}
                      />
                    </td>
                    <td className={tdClass}>
                      <JobCell title={row.jobTitle} jobId={row.jobId} />
                    </td>
                    <td className={`${tdClass} text-slate-600`}>
                      {formatDuration(row.timeTakenSeconds)}
                    </td>
                    <td className={tdClass}>
                      <p className="text-[11px] uppercase tracking-wide text-slate-400">
                        {dateInfo.label}
                      </p>
                      <p className="text-sm text-slate-600">
                        {formatDate(dateInfo.value)}
                      </p>
                    </td>
                    <td className={tdClass}>
                      <ResultCell row={row} />
                    </td>
                    <td className={tdClass}>
                      {getStage(row) === "completed" ? (
                        <div className="flex w-40 flex-col items-start gap-2">
                          <RecommendationBadge value={row.recommendation} />
                          <button
                            type="button"
                            onClick={() => setHireTarget(row)}
                            className="w-full rounded-lg bg-[#0F8F5F] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#0B7A50]"
                          >
                            Hire
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {hireTarget && (
        <HireConfirmModal
          key={hireTarget.applicationId}
          candidateName={hireTarget.candidateName}
          jobTitle={hireTarget.jobTitle}
          isSubmitting={isHiring}
          onCancel={handleCancelHire}
          onConfirm={(sendEmail) => void handleConfirmHire(sendEmail)}
        />
      )}
    </div>
  );
}