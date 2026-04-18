"use client";

import { FileText, PauseCircle, PlayCircle, Copy } from "lucide-react";

interface JobActionsProps {
  paused: boolean;
  onTogglePause: () => void;
}

export default function JobActions({ paused, onTogglePause }: JobActionsProps) {
  return (
    <aside className="rounded-xl border border-slate/15 bg-white p-4 lg:sticky lg:top-20">
      <h2 className="font-syne text-lg font-semibold text-midnight">Job Management</h2>
      <div className="mt-4 space-y-2">
        <button
          type="button"
          className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white"
        >
          Edit Job Post
        </button>
        <button
          type="button"
          onClick={onTogglePause}
          className={`inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-white ${
            paused ? "bg-success" : "bg-warning"
          }`}
        >
          {paused ? <PlayCircle className="h-4 w-4" /> : <PauseCircle className="h-4 w-4" />}
          {paused ? "Resume Applications" : "Pause Applications"}
        </button>
        <button
          type="button"
          className="w-full rounded-lg bg-danger px-3 py-2 text-sm font-semibold text-white"
        >
          Close Job
        </button>
        <button
          type="button"
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate/25 px-3 py-2 text-sm font-medium text-midnight"
        >
          <Copy className="h-4 w-4" />
          Duplicate Job
        </button>
        <button
          type="button"
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate/25 px-3 py-2 text-sm font-medium text-midnight"
        >
          <FileText className="h-4 w-4" />
          Download Applicants Report
        </button>
      </div>
    </aside>
  );
}

