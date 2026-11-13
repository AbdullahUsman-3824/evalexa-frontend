"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { interviewService } from "@/services/interview.service";
import type {
  ExtensionRequest,
  ExtensionRequestStatus,
} from "@/types/interview.types";
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

type RequestFilter = "ALL" | ExtensionRequestStatus;

const FILTER_OPTIONS: { label: string; value: RequestFilter }[] = [
  { label: "All statuses", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

const PREVIEW_WORDS = 5;

function ReasonCell({
  reason,
  onOpen,
}: {
  reason: string;
  onOpen: () => void;
}) {
  const words = reason.trim().split(/\s+/);
  const preview = words.slice(0, PREVIEW_WORDS).join(" ");
  const isTruncated = words.length > PREVIEW_WORDS;

  return (
    <button
      type="button"
      onClick={onOpen}
      title="View full reason"
      className="max-w-[260px] text-left text-sm text-slate-600 underline underline-offset-2 hover:text-[#1E6FFF]"
    >
      {preview}
      {isTruncated ? "…" : ""}
    </button>
  );
}

function ReasonModal({
  request,
  onClose,
}: {
  request: ExtensionRequest;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate/15 bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-syne text-lg font-semibold text-[#0D1B2A]">
              Extension reason
            </h3>
            <p className="text-xs text-slate-500">
              {request.candidateName} · {request.jobTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-4 max-h-64 overflow-y-auto whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700">
          {request.reason}
        </p>
      </div>
    </div>
  );
}

interface ExtensionRequestsTabProps {
  onToast: (message: string, type: "success" | "error" | "info") => void;
}

export default function ExtensionRequestsTab({
  onToast,
}: ExtensionRequestsTabProps) {
  const [requests, setRequests] = useState<ExtensionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<RequestFilter>("ALL");
  const [busyIds, setBusyIds] = useState<Record<string, boolean>>({});
  const [reasonRequest, setReasonRequest] = useState<ExtensionRequest | null>(
    null,
  );

  const fetchRequests = useCallback(async (status: RequestFilter) => {
    const result = await interviewService.listExtensionRequests(
      status === "ALL" ? undefined : { status },
    );
    return result.items;
  }, []);

  useEffect(() => {
    let active = true;

    fetchRequests(filter)
      .then((items) => {
        if (active) setRequests(items);
      })
      .catch((error: unknown) => {
        if (active) {
          onToast(
            error instanceof Error ? error.message : "Unable to load requests.",
            "error",
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [filter, fetchRequests, onToast]);

  function handleFilterChange(next: RequestFilter) {
    setIsLoading(true);
    setFilter(next);
  }

  async function decide(request: ExtensionRequest, action: "approve" | "reject") {
    if (busyIds[request.id]) return;

    setBusyIds((prev) => ({ ...prev, [request.id]: true }));
    try {
      // decisionNote is intentionally not sent (it's optional)
      if (action === "approve") {
        await interviewService.approveExtensionRequest(
          request.interviewId,
          request.id,
        );
        onToast("Approved. A new invitation has been sent.", "success");
      } else {
        await interviewService.rejectExtensionRequest(
          request.interviewId,
          request.id,
        );
        onToast("Request rejected.", "info");
      }
      setRequests(await fetchRequests(filter));
    } catch (error) {
      onToast(
        error instanceof Error
          ? error.message
          : action === "approve"
            ? "Approval failed."
            : "Rejection failed.",
        "error",
      );
    } finally {
      setBusyIds((prev) => ({ ...prev, [request.id]: false }));
    }
  }

  return (
    <div className="space-y-3">
      <StatusFilter
        value={filter}
        options={FILTER_OPTIONS}
        onChange={handleFilterChange}
      />

      {isLoading ? (
        <TableLoading label="Loading extension requests…" />
      ) : requests.length === 0 ? (
        <TableEmpty label="No extension requests match this status." />
      ) : (
        <div className={tableWrapperClass}>
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-slate/15 bg-slate-50">
              <tr>
                <th className={thClass}>Candidate</th>
                <th className={thClass}>Job</th>
                <th className={thClass}>Reason</th>
                <th className={thClass}>Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate/10">
              {requests.map((request) => {
                const isBusy = Boolean(busyIds[request.id]);

                return (
                  <tr key={request.id} className="hover:bg-slate-50/60">
                    <td className={tdClass}>
                      <CandidateCell
                        name={request.candidateName}
                        email={request.candidateEmail}
                        applicationId={request.applicationId}
                      />
                    </td>
                    <td className={tdClass}>
                      <JobCell title={request.jobTitle} jobId={request.jobId} />
                    </td>
                    <td className={tdClass}>
                      <ReasonCell
                        reason={request.reason}
                        onOpen={() => setReasonRequest(request)}
                      />
                    </td>
                    <td className={tdClass}>
                      {request.status === "PENDING" ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => void decide(request, "approve")}
                            disabled={isBusy}
                            title="Approve and send invite"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#16A34A] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#15803D] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isBusy ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => void decide(request, "reject")}
                            disabled={isBusy}
                            title="Reject"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#DC2626] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#B91C1C] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <X className="h-4 w-4" />
                            Reject
                          </button>
                        </div>
                      ) : request.status === "APPROVED" ? (
                        <span className="rounded-full bg-[#16A34A]/10 px-3 py-1 text-xs font-semibold text-[#16A34A]">
                          Approved
                        </span>
                      ) : (
                        <span className="rounded-full bg-[#DC2626]/10 px-3 py-1 text-xs font-semibold text-[#DC2626]">
                          Rejected
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {reasonRequest && (
        <ReasonModal
          request={reasonRequest}
          onClose={() => setReasonRequest(null)}
        />
      )}
    </div>
  );
}