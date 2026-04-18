"use client";

import { CalendarPlus, Download, MessageSquare } from "lucide-react";

interface BulkActionsProps {
  selectedCount: number;
  allSelected: boolean;
  onToggleAll: (checked: boolean) => void;
  onScheduleInterviews: () => void;
  onSendBulkMessage: () => void;
  onExportList: () => void;
}

export default function BulkActions({
  selectedCount,
  allSelected,
  onToggleAll,
  onScheduleInterviews,
  onSendBulkMessage,
  onExportList,
}: BulkActionsProps) {
  return (
    <div className="rounded-xl border border-primary/20 bg-primary/10 p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex items-center gap-2 text-sm font-medium text-primary">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={(event) => onToggleAll(event.target.checked)}
          />
          Select all
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-white">
            {selectedCount} selected
          </span>
          <button
            type="button"
            onClick={onScheduleInterviews}
            className="inline-flex items-center gap-1.5 rounded-lg bg-success px-3 py-2 text-sm font-semibold text-white hover:bg-success/90"
          >
            <CalendarPlus className="h-4 w-4" />
            Schedule Interviews
          </button>
          <button
            type="button"
            onClick={onSendBulkMessage}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90"
          >
            <MessageSquare className="h-4 w-4" />
            Send Bulk Message
          </button>
          <button
            type="button"
            onClick={onExportList}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate/25 bg-white px-3 py-2 text-sm font-medium text-midnight hover:bg-surface"
          >
            <Download className="h-4 w-4" />
            Export List
          </button>
        </div>
      </div>
    </div>
  );
}

