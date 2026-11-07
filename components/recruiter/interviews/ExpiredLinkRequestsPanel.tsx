"use client";

import { useState } from "react";
import { Check, Clock3, Loader2, X } from "lucide-react";
import type { ReinviteRequest } from "@/types/interview.types";

interface ExpiredLinkRequestsPanelProps {
  requests: ReinviteRequest[];
  isLoading: boolean;
  onApprove: (request: ReinviteRequest, decisionNote?: string) => void;
  onReject: (request: ReinviteRequest, decisionNote?: string) => void;
}

const statusTone: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-success/10 text-success",
  REJECTED: "bg-danger/10 text-danger",
};

const MAX_NOTE_LENGTH = 2000;

function formatDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ExpiredLinkRequestsPanel({
  requests,
  isLoading,
  onApprove,
  onReject,
}: ExpiredLinkRequestsPanelProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate/15 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading expired link requests...
        </div>
      </div>
    );
  }

  if (!requests.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate/25 bg-white p-5 shadow-sm">
        <p className="text-center text-sm text-slate-600">
          No expired or pending link requests right now.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate/15 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-syne text-lg font-semibold text-midnight">
          Expired link requests
        </h2>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          {requests.length} {requests.length === 1 ? "request" : "requests"}
        </span>
      </div>

      <div className="space-y-3">
        {requests.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            onApprove={onApprove}
            onReject={onReject}
          />
        ))}
      </div>
    </div>
  );
}

function RequestCard({
  request,
  onApprove,
  onReject,
}: {
  request: ReinviteRequest;
  onApprove: (request: ReinviteRequest, decisionNote?: string) => void;
  onReject: (request: ReinviteRequest, decisionNote?: string) => void;
}) {
  const [note, setNote] = useState("");
  const canApprove = request.status === "PENDING";

  return (
    <div className="rounded-xl border border-slate/15 bg-slate-50 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-semibold text-midnight">
            {request.candidate}
          </p>
          <p className="text-sm text-slate-600">
            {request.jobTitle
              ? `Job: ${request.jobTitle}`
              : `Application: ${request.jobApplicationId}`}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" />
              {formatDate(request.requestedAt)}
            </span>
          </div>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone[request.status] ?? "bg-slate-200 text-slate-700"}`}
        >
          {request.status}
        </span>
      </div>

      <div className="mt-3 rounded-lg border border-slate/15 bg-white p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Candidate reason
        </p>
        <p className="mt-2 text-sm text-slate-700">{request.reason}</p>
        {request.status === "REJECTED" && request.reviewerNote ? (
          <>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Recruiter note
            </p>
            <p className="mt-2 text-sm text-slate-700">
              {request.reviewerNote}
            </p>
          </>
        ) : null}
        {request.status === "APPROVED" && request.reviewerNote ? (
          <>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Recruiter note
            </p>
            <p className="mt-2 text-sm text-slate-700">
              {request.reviewerNote}
            </p>
          </>
        ) : null}
      </div>

      {canApprove && (
        <>
          <div className="mt-3">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Decision note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) =>
                setNote(e.target.value.slice(0, MAX_NOTE_LENGTH))
              }
              placeholder="Add a note for the candidate..."
              rows={2}
              maxLength={MAX_NOTE_LENGTH}
              className="mt-1.5 w-full rounded-lg border border-slate/15 bg-white p-2.5 text-sm text-slate-700 outline-none focus:border-primary resize-none"
            />
            <div className="mt-0.5 flex justify-end">
              <span className="text-xs text-slate-400">
                {note.length} / {MAX_NOTE_LENGTH}
              </span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onApprove(request, note.trim() || undefined)}
              className="inline-flex items-center gap-2 rounded-lg bg-success px-3 py-2 text-sm font-semibold text-white hover:bg-success/90"
            >
              <Check className="h-4 w-4" />
              Approve
            </button>

            <button
              type="button"
              onClick={() => onReject(request, note.trim() || undefined)}
              className="inline-flex items-center gap-2 rounded-lg border border-danger/30 bg-white px-3 py-2 text-sm font-semibold text-danger hover:bg-danger/5"
            >
              <X className="h-4 w-4" />
              Reject
            </button>
          </div>
        </>
      )}
    </div>
  );
}
