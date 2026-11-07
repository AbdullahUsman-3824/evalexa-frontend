"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface ExpiredInvitationStepProps {
  jobTitle: string;
  companyName: string;
  isSubmitting: boolean;
  isSuccess: boolean;
  errorMessage: string | null;
  onRequest: (reason: string) => void;
}

const MAX_REASON_LENGTH = 2000;

export function ExpiredInvitationStep({
  jobTitle,
  companyName,
  isSubmitting,
  isSuccess,
  errorMessage,
  onRequest,
}: ExpiredInvitationStepProps) {
  const [reason, setReason] = useState("");

  const trimmed = reason.trim();
  const canSubmit = trimmed.length > 0 && trimmed.length <= MAX_REASON_LENGTH && !isSubmitting;

  return (
    <div>
      <div className="text-4xl text-center mb-4">⏰</div>

      <h2 className="font-display text-white text-2xl font-bold text-center">
        Invitation Expired
      </h2>
      <p className="text-white/60 text-center text-sm mt-2">
        Your interview invitation for{" "}
        <span className="text-cyan">{jobTitle}</span> at{" "}
        <span className="text-cyan">{companyName}</span> has expired.
      </p>

      {isSuccess ? (
        <div className="mt-6 bg-success/10 rounded-xl border border-success/30 p-5 text-center">
          <CheckCircle2 className="text-success w-10 h-10 mx-auto mb-3" />
          <p className="text-white font-semibold">
            Your request has been submitted.
          </p>
          <p className="text-white/60 text-sm mt-1">
            The recruiter will review your request and send a new invitation if
            approved.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6">
            <label className="text-white text-sm font-semibold mb-2 block">
              Reason for requesting a new invitation
              <span className="text-red-400 ml-0.5">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, MAX_REASON_LENGTH))}
              placeholder="Explain why you were unable to complete the interview before the invitation expired."
              rows={5}
              maxLength={MAX_REASON_LENGTH}
              className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white text-sm focus:border-primary focus:bg-white/10 focus:outline-none transition resize-none placeholder:text-white/30"
            />
            <div className="flex justify-end mt-1">
              <span className="text-white/40 text-xs">
                {reason.length} / {MAX_REASON_LENGTH}
              </span>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-3 flex items-start gap-2 bg-red-500/10 rounded-lg border border-red-500/30 p-3">
              <AlertCircle className="text-red-400 w-4 h-4 shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{errorMessage}</p>
            </div>
          )}

          <button
            type="button"
            onClick={() => onRequest(reason)}
            disabled={!canSubmit}
            className="mt-5 w-full h-12 bg-primary rounded-xl font-display font-semibold text-white hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Request New Invitation"
            )}
          </button>
        </>
      )}
    </div>
  );
}

export default ExpiredInvitationStep;
