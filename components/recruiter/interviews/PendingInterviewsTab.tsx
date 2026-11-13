"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Info, Loader2, Send } from "lucide-react";
import { interviewService } from "@/services/interview.service";
import type {
  EligibleCandidate,
  InvitationDeliveryStatus,
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

type InviteState = "PENDING" | "SENT" | "EXPIRED" | "FAILED";
type PendingFilter = "ALL" | InviteState;

const FILTER_OPTIONS: { label: string; value: PendingFilter }[] = [
  { label: "All statuses", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Sent", value: "SENT" },
  { label: "Expired", value: "EXPIRED" },
  { label: "Failed", value: "FAILED" },
];

/** null / PENDING / NOT_SENT all mean "not sent yet". */
function toInviteState(candidate: EligibleCandidate): InviteState {
  let status: InvitationDeliveryStatus | null | undefined =
    candidate.deliveryStatus;

  // Fallback for the mock service, which only has `inviteStatus`.
  if (status === undefined) {
    status =
      candidate.inviteStatus === "EXPIRED"
        ? "EXPIRED"
        : candidate.inviteStatus === "NOT_SENT"
          ? null
          : "SENT";
  }

  if (status === "SENT" || status === "EXPIRED" || status === "FAILED") {
    return status;
  }
  return "PENDING";
}

function InviteButton({
  state,
  isSending,
  onSend,
}: {
  state: InviteState;
  isSending: boolean;
  onSend: () => void;
}) {
  if (state === "SENT") {
    return (
      <button
        type="button"
        disabled
        className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg bg-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-500"
      >
        <Check className="h-4 w-4" />
        Sent
      </button>
    );
  }

  const isResend = state === "EXPIRED" || state === "FAILED";
  const tone =
    state === "EXPIRED"
      ? "bg-[#FF9500] hover:bg-[#E68600]"
      : state === "FAILED"
        ? "bg-[#E63946] hover:bg-[#CC2F3B]"
        : "bg-[#1E6FFF] hover:bg-[#1557D8]";

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onSend}
        disabled={isSending}
        title={isResend ? "Send a new invitation" : "Send invitation"}
        className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${tone}`}
      >
        {isSending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {isSending ? "Sending…" : isResend ? "Re-Send" : "Send"}
      </button>

      {isResend && (
        <span
          title={state === "EXPIRED" ? "Expired" : "Failed"}
          className={state === "EXPIRED" ? "text-[#FF9500]" : "text-[#E63946]"}
        >
          <Info className="h-4 w-4" />
        </span>
      )}
    </div>
  );
}

interface PendingInterviewsTabProps {
  onToast: (message: string, type: "success" | "error" | "info") => void;
}

export default function PendingInterviewsTab({
  onToast,
}: PendingInterviewsTabProps) {
  const [candidates, setCandidates] = useState<EligibleCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<PendingFilter>("ALL");
  const [sendingIds, setSendingIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let active = true;

    interviewService
      .listEligibleCandidates()
      .then((items) => {
        if (active) setCandidates(items);
      })
      .catch((error: unknown) => {
        if (active) {
          onToast(
            error instanceof Error
              ? error.message
              : "Unable to load interviews.",
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
  }, [onToast]);

  const rows = useMemo(
    () =>
      filter === "ALL"
        ? candidates
        : candidates.filter((item) => toInviteState(item) === filter),
    [candidates, filter],
  );

  async function handleSend(candidate: EligibleCandidate) {
    if (sendingIds[candidate.applicationId]) return;

    setSendingIds((prev) => ({ ...prev, [candidate.applicationId]: true }));
    try {
      // Same endpoint for Send and Re-Send
      await interviewService.sendInvitation(candidate.interviewId);
      setCandidates((prev) =>
        prev.map((item) =>
          item.applicationId === candidate.applicationId
            ? {
                ...item,
                deliveryStatus: "SENT",
                inviteStatus: "SENT",
                invitedAt: new Date().toISOString(),
              }
            : item,
        ),
      );
      onToast(`Invitation sent to ${candidate.name}.`, "success");
    } catch (error) {
      onToast(
        error instanceof Error ? error.message : "Invite failed to send.",
        "error",
      );
    } finally {
      setSendingIds((prev) => ({ ...prev, [candidate.applicationId]: false }));
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <StatusFilter
          value={filter}
          options={FILTER_OPTIONS}
          onChange={setFilter}
        />

        {/* Dummy for now: bulk sending is not built yet. Delete if unwanted. */}
        <button
          type="button"
          onClick={() => onToast("Sending to all is coming soon.", "info")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate/20 bg-white px-3.5 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50"
        >
          <Send className="h-4 w-4" />
          Send to all
        </button>
      </div>

      {isLoading ? (
        <TableLoading label="Loading interviews…" />
      ) : rows.length === 0 ? (
        <TableEmpty label="No applications match this status." />
      ) : (
        <div className={tableWrapperClass}>
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-slate/15 bg-slate-50">
              <tr>
                <th className={thClass}>Candidate</th>
                <th className={thClass}>Job</th>
                <th className={thClass}>Invite</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate/10">
              {rows.map((candidate) => (
                <tr key={candidate.applicationId} className="hover:bg-slate-50/60">
                  <td className={tdClass}>
                    <CandidateCell
                      name={candidate.name}
                      email={candidate.email}
                      applicationId={candidate.applicationId}
                    />
                  </td>
                  <td className={tdClass}>
                    <JobCell title={candidate.jobTitle} jobId={candidate.jobId} />
                  </td>
                  <td className={tdClass}>
                    <InviteButton
                      state={toInviteState(candidate)}
                      isSending={Boolean(sendingIds[candidate.applicationId])}
                      onSend={() => void handleSend(candidate)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}