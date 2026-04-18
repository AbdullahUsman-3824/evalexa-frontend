"use client";

import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: { reason: string; notifyCandidate: boolean }) => void;
}

export default function CancelModal({ isOpen, onClose, onConfirm }: CancelModalProps) {
  const [reason, setReason] = useState("");
  const [notifyCandidate, setNotifyCandidate] = useState(true);

  if (!isOpen) return null;

  const disabled = !reason.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-syne text-lg font-semibold text-[#0D1B2A]">Cancel Interview</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-[#6B7A99] hover:bg-[#F4F7FF]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#0D1B2A]">Reason *</label>
            <textarea
              rows={4}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Please provide a cancellation reason..."
              className="w-full rounded-lg border border-[#6B7A99]/30 px-3 py-2 text-sm text-[#0D1B2A] placeholder:text-[#6B7A99]/70 focus:border-[#E63946] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-[#6B7A99]/25 bg-[#F4F7FF] px-3 py-2">
            <p className="text-sm font-semibold text-[#0D1B2A]">Notify Candidate</p>
            <button
              type="button"
              onClick={() => setNotifyCandidate((prev) => !prev)}
              className={`relative h-6 w-11 rounded-full transition ${notifyCandidate ? "bg-[#1E6FFF]" : "bg-[#6B7A99]/40"}`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                  notifyCandidate ? "left-5" : "left-0.5"
                }`}
              />
            </button>
          </div>

          <div className="rounded-lg bg-[#E63946]/10 p-3 text-xs text-[#E63946]">
            <div className="flex items-center gap-2 font-semibold">
              <AlertTriangle className="h-4 w-4" />
              This cannot be undone
            </div>
          </div>

          <button
            type="button"
            disabled={disabled}
            onClick={() => onConfirm({ reason: reason.trim(), notifyCandidate })}
            className="h-11 w-full rounded-lg bg-[#E63946] text-sm font-semibold text-white hover:bg-[#d5303f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel Interview
          </button>
        </div>
      </div>
    </div>
  );
}

