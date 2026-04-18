"use client";

import { X } from "lucide-react";
import { useState } from "react";

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: {
    reason: string;
    date: string;
    hour: string;
    minute: string;
    notifyCandidate: boolean;
  }) => void;
}

const reasons = ["Candidate request", "Recruiter unavailable", "Technical issue", "Other"];

export default function RescheduleModal({ isOpen, onClose, onConfirm }: RescheduleModalProps) {
  const [reason, setReason] = useState("");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [notifyCandidate, setNotifyCandidate] = useState(true);

  if (!isOpen) return null;

  const disabled = !reason || !date || !hour || !minute;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-syne text-lg font-semibold text-[#0D1B2A]">Reschedule Interview</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-[#6B7A99] hover:bg-[#F4F7FF]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#0D1B2A]">Reason *</label>
            <select
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="h-11 w-full rounded-lg border border-[#6B7A99]/30 px-3 text-sm text-[#0D1B2A] focus:border-[#1E6FFF] focus:outline-none"
            >
              <option value="">Select reason</option>
              {reasons.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#0D1B2A]">New Date</label>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="h-11 w-full rounded-lg border border-[#6B7A99]/30 px-3 text-sm text-[#0D1B2A] focus:border-[#1E6FFF] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#0D1B2A]">New Time</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={hour}
                  onChange={(event) => setHour(event.target.value)}
                  className="h-11 rounded-lg border border-[#6B7A99]/30 px-2 text-sm text-[#0D1B2A] focus:border-[#1E6FFF] focus:outline-none"
                >
                  <option value="">HH</option>
                  {Array.from({ length: 24 }, (_, index) => String(index).padStart(2, "0")).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
                <select
                  value={minute}
                  onChange={(event) => setMinute(event.target.value)}
                  className="h-11 rounded-lg border border-[#6B7A99]/30 px-2 text-sm text-[#0D1B2A] focus:border-[#1E6FFF] focus:outline-none"
                >
                  <option value="">MM</option>
                  {["00", "15", "30", "45"].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
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

          <button
            type="button"
            disabled={disabled}
            onClick={() =>
              onConfirm({
                reason,
                date,
                hour,
                minute,
                notifyCandidate,
              })
            }
            className="h-11 w-full rounded-lg bg-[#1E6FFF] text-sm font-semibold text-white hover:bg-[#1557D8] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Confirm Reschedule
          </button>
        </div>
      </div>
    </div>
  );
}

