"use client";

import { useState } from "react";
import { ChevronDown, History, RotateCcw, Trash2 } from "lucide-react";

interface ResumeVersion {
  id: string;
  name: string;
  uploadedAtLabel: string;
  score: number;
}

interface VersionHistoryProps {
  versions: ResumeVersion[];
  onRestore: (versionId: string) => void;
  onDelete: (versionId: string) => void;
}

export default function VersionHistory({
  versions,
  onRestore,
  onDelete,
}: VersionHistoryProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded-3xl border border-slate/15 bg-white p-6 shadow-sm">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface">
            <History className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-display text-xl text-midnight">
              Resume Version History
            </p>
            <p className="text-sm text-slate">
              Restore or clean up previous uploads (max 3 stored).
            </p>
          </div>
        </div>
        <ChevronDown
          className={`h-6 w-6 text-slate transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="mt-6 space-y-4">
          {versions.length === 0 && (
            <p className="rounded-2xl border border-dashed border-slate/20 bg-surface px-4 py-6 text-center text-sm text-slate">
              Upload at least 2 resumes to build your version history.
            </p>
          )}

          {versions.map((version) => (
            <div
              key={version.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate/15 bg-surface/60 p-4"
            >
              <div className="flex-1">
                <p className="font-semibold text-midnight">{version.name}</p>
                <p className="text-sm text-slate">{version.uploadedAtLabel}</p>
              </div>
              <span className="rounded-full bg-cyan/10 px-3 py-1 text-sm font-semibold text-cyan">
                Score {version.score}/100
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onRestore(version.id)}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
                >
                  <RotateCcw className="h-4 w-4" />
                  Restore
                </button>
                <button
                  onClick={() => onDelete(version.id)}
                  className="inline-flex items-center gap-2 rounded-full border border-danger/30 px-4 py-2 text-sm font-semibold text-danger transition hover:bg-danger/5"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
