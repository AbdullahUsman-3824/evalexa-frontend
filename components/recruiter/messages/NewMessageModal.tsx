"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface CandidateOption {
  id: string;
  name: string;
}

interface NewMessageModalProps {
  open: boolean;
  onClose: () => void;
  jobTitle: string;
  candidates: CandidateOption[];
  onSend: (payload: { candidateId: string; subject: string; message: string }) => void;
}

export default function NewMessageModal({
  open,
  onClose,
  jobTitle,
  candidates,
  onSend,
}: NewMessageModalProps) {
  const [candidateQuery, setCandidateQuery] = useState("");
  const [candidateId, setCandidateId] = useState(candidates[0]?.id ?? "");
  const [subject, setSubject] = useState(`Re: ${jobTitle}`);
  const [message, setMessage] = useState("");

  if (!open) return null;

  const filteredCandidates = candidates.filter((candidate) =>
    candidate.name.toLowerCase().includes(candidateQuery.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate/15 p-4">
          <h3 className="font-syne text-lg font-semibold text-midnight">New Message</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate transition hover:bg-surface"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-midnight">Search candidate</label>
            <input
              value={candidateQuery}
              onChange={(event) => setCandidateQuery(event.target.value)}
              placeholder="Search candidate..."
              className="w-full rounded-lg border border-slate/25 px-3 py-2 text-sm text-midnight placeholder:text-slate/70 focus:border-primary focus:outline-none"
            />
            <select
              value={candidateId}
              onChange={(event) => setCandidateId(event.target.value)}
              className="w-full rounded-lg border border-slate/25 px-3 py-2 text-sm text-midnight focus:border-primary focus:outline-none"
            >
              {filteredCandidates.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-midnight">Subject</label>
            <input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className="w-full rounded-lg border border-slate/25 px-3 py-2 text-sm text-midnight focus:border-primary focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-midnight">Message</label>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={5}
              className="w-full resize-none rounded-lg border border-slate/25 px-3 py-2 text-sm text-midnight focus:border-primary focus:outline-none"
              placeholder="Type your message..."
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate/15 p-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate/25 px-4 py-2 text-sm font-semibold text-midnight transition hover:bg-surface"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (!candidateId || !message.trim()) return;
              onSend({ candidateId, subject, message: message.trim() });
              setMessage("");
              onClose();
            }}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

