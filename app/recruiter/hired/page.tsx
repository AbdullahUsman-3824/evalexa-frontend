"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Briefcase,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Mail,
  RefreshCw,
} from "lucide-react";
import Toast from "@/components/ui/Toast";
import {
  TableEmpty,
  TableLoading,
  tableWrapperClass,
  tdClass,
  thClass,
} from "@/components/recruiter/interviews/shared/TablePieces";
import { getJobs } from "@/services/job.service";
import { shouldUseMockInterviews } from "@/services/mock/interview.mock";
import { mockJobList } from "@/services/mock/hiring.mock";
import { getHiredCandidates } from "@/services/application.service";
import type { JobListRecord } from "@/types/job.types";
import type {
  HiredCandidate,
  HiredPagination,
} from "@/types/hiring.types";

const PAGE_LIMIT = 20;

type ToastType = "success" | "error" | "info";

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy approach below
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

function ScoreCell({ score }: { score: number | null }) {
  if (score == null) return <span className="text-slate-400">—</span>;

  const percentage = Math.max(0, Math.min(100, Math.round(score)));
  const tone = scoreTone(percentage);

  return (
    <div className="w-32">
      <span className={`font-syne text-lg font-bold ${tone.text}`}>
        {percentage}%
      </span>
      <div className={`mt-1 h-1.5 w-full overflow-hidden rounded-full ${tone.soft}`}>
        <div
          className={`h-full rounded-full ${tone.bar}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function HiredCandidatesPage() {
  const [jobs, setJobs] = useState<JobListRecord[]>([]);
  const [jobId, setJobId] = useState("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<HiredCandidate[]>([]);
  const [pagination, setPagination] = useState<HiredPagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    visible: boolean;
  }>({ message: "", type: "success", visible: false });

  const requestIdRef = useRef(0);
  const copiedTimerRef = useRef<number | null>(null);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type, visible: true });
  }, []);

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  // ── Job dropdown (same API as the Applications / Shortlisted screens) ──
  useEffect(() => {
    let active = true;

    const jobsRequest = shouldUseMockInterviews() ? mockJobList() : getJobs();

    jobsRequest
      .then((data) => {
        if (active) setJobs(data);
      })
      .catch((error) => {
        if (!active) return;
        showToast(
          error instanceof Error ? error.message : "Unable to load jobs.",
          "error",
        );
      });

    return () => {
      active = false;
    };
  }, [showToast]);

  // ── Hired candidates ───────────────────────────────────────────────
  const load = useCallback(
    async (mode: "initial" | "manual") => {
      const requestId = ++requestIdRef.current;
      if (mode === "manual") setIsRefreshing(true);
      else setIsLoading(true);

      try {
        const response = await getHiredCandidates({
          jobId: jobId || undefined,
          page,
          limit: PAGE_LIMIT,
        });
        if (requestId !== requestIdRef.current) return;

        const data = Array.isArray(response?.data) ? response.data : [];
        setItems(data);
        setPagination(
          response?.pagination ?? {
            page,
            limit: PAGE_LIMIT,
            total: data.length,
            totalPages: 1,
          },
        );
      } catch (error) {
        if (requestId !== requestIdRef.current) return;
        showToast(
          error instanceof Error
            ? error.message
            : "Unable to load hired candidates.",
          "error",
        );
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    },
    [jobId, page, showToast],
  );

  useEffect(() => {
    void load("initial");
  }, [load]);

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) window.clearTimeout(copiedTimerRef.current);
    };
  }, []);

  const handleJobChange = (value: string) => {
    setJobId(value);
    setPage(1);
  };

  const handleCopyEmail = async (applicationId: string, email: string) => {
    const ok = await copyText(email);
    if (!ok) {
      showToast("Unable to copy the email address.", "error");
      return;
    }

    setCopiedId(applicationId);
    showToast("Email copied to clipboard.", "success");
    if (copiedTimerRef.current) window.clearTimeout(copiedTimerRef.current);
    copiedTimerRef.current = window.setTimeout(() => setCopiedId(null), 1500);
  };

  const total = pagination?.total ?? items.length;
  const currentPage = pagination?.page ?? page;
  const limit = pagination?.limit ?? PAGE_LIMIT;
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);
  const rangeStart = items.length === 0 ? 0 : (currentPage - 1) * limit + 1;
  const rangeEnd = items.length === 0 ? 0 : rangeStart + items.length - 1;

  return (
    <div className="min-h-screen bg-[#F4F7FF] p-6">
      <div className="mx-auto max-w-6xl space-y-5">
        <div>
          <h1 className="font-syne text-2xl font-bold text-[#0D1B2A]">
            Hired Candidates
          </h1>
          <p className="mt-1 text-sm text-[#6B7A99]">
            Candidates selected by your team
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full sm:w-64">
            <Briefcase className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={jobId}
              onChange={(event) => handleJobChange(event.target.value)}
              aria-label="Filter by job"
              className="h-9 w-full appearance-none rounded-lg border border-slate/20 bg-white pl-9 pr-8 text-sm text-slate-600 outline-none focus:border-[#1E6FFF]"
            >
              <option value="">All Jobs</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>

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
          <TableLoading label="Loading hired candidates…" />
        ) : items.length === 0 ? (
          <TableEmpty
            label={
              jobId
                ? "No hired candidates for this job yet."
                : "No candidates have been hired yet."
            }
          />
        ) : (
          <div className={tableWrapperClass}>
            <table className="w-full min-w-[820px] text-sm">
              <thead className="border-b border-slate/15 bg-slate-50">
                <tr>
                  <th className={thClass}>Candidate</th>
                  <th className={thClass}>Job</th>
                  <th className={thClass}>Hired date</th>
                  <th className={thClass}>Match score</th>
                  <th className={thClass}>Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate/10">
                {items.map((item) => (
                  <tr key={item.applicationId} className="hover:bg-slate-50/60">
                    <td className={tdClass}>
                      <p className="font-medium text-[#0D1B2A]">
                        {item.candidate.fullName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.candidate.email}
                      </p>
                    </td>
                    <td className={`${tdClass} text-[#0D1B2A]`}>
                      {item.job.title}
                    </td>
                    <td className={`${tdClass} text-slate-600`}>
                      {formatDate(item.hiredAt)}
                    </td>
                    <td className={tdClass}>
                      <ScoreCell score={item.matchScore} />
                    </td>
                    <td className={tdClass}>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            void handleCopyEmail(
                              item.applicationId,
                              item.candidate.email,
                            )
                          }
                          aria-label={`Copy email of ${item.candidate.fullName}`}
                          title="Copy email"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate/20 bg-white text-slate-600 hover:bg-slate-50"
                        >
                          {copiedId === item.applicationId ? (
                            <Check className="h-4 w-4 text-[#0F6E56]" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(item.candidate.email)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#1E6FFF]/40 bg-[#EEF4FF] px-3 text-xs font-semibold text-[#1E6FFF] hover:bg-[#E0EBFF]"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          Contact
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate/15 px-5 py-3 text-sm text-slate-500">
              <span>
                Showing {rangeStart}-{rangeEnd} of {total} candidate
                {total === 1 ? "" : "s"}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage <= 1}
                  aria-label="Previous page"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate/20 bg-white text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-[#1E6FFF] px-2 text-xs font-semibold text-white">
                  {currentPage}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage >= totalPages}
                  aria-label="Next page"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate/20 bg-white text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={closeToast}
      />
    </div>
  );
}