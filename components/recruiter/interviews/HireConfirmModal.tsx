"use client";

import { useEffect, useState } from "react";
import { Loader2, UserCheck, X } from "lucide-react";

interface HireConfirmModalProps {
  candidateName: string;
  jobTitle: string;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: (sendEmail: boolean) => void;
}

/**
 * Confirmation popup shown when the recruiter clicks "Hire".
 * Render it only while a candidate is selected (give it a `key` per candidate)
 * so the checkbox state resets every time it opens.
 */
export default function HireConfirmModal({
  candidateName,
  jobTitle,
  isSubmitting,
  onCancel,
  onConfirm,
}: HireConfirmModalProps) {
  const [sendEmail, setSendEmail] = useState(true);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) onCancel();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isSubmitting, onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={() => {
        if (!isSubmitting) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="hire-confirm-title"
        className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E1F5EE]">
              <UserCheck className="h-4 w-4 text-[#0F6E56]" />
            </div>
            <h2
              id="hire-confirm-title"
              className="font-syne text-lg font-semibold text-[#0D1B2A]"
            >
              Confirm Hiring Decision
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            aria-label="Close"
            className="rounded-lg p-1 text-[#6B7A99] hover:bg-[#F4F7FF] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-sm text-[#6B7A99]">
          Are you sure you want to mark{" "}
          <span className="font-semibold text-[#0D1B2A]">{candidateName}</span>{" "}
          as hired for{" "}
          <span className="font-semibold text-[#0D1B2A]">{jobTitle}</span>?
        </p>

        <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-lg border border-[#6B7A99]/25 bg-[#F4F7FF] px-3 py-3">
          <input
            type="checkbox"
            checked={sendEmail}
            disabled={isSubmitting}
            onChange={(event) => setSendEmail(event.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#1E6FFF]"
          />
          <span>
            <span className="block text-sm font-semibold text-[#0D1B2A]">
              Send an email notification to the candidate
            </span>
            <span className="mt-1 block text-xs text-[#6B7A99]">
              The candidate will receive a notification that they have been
              selected and that the recruitment team will contact them
              regarding the next steps.
            </span>
          </span>
        </label>

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="h-10 rounded-lg border border-[#6B7A99]/30 bg-white px-4 text-sm font-semibold text-[#6B7A99] hover:bg-[#F4F7FF] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(sendEmail)}
            disabled={isSubmitting}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0F8F5F] px-4 text-sm font-semibold text-white hover:bg-[#0B7A50] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Confirm Hire
          </button>
        </div>
      </div>
    </div>
  );
}