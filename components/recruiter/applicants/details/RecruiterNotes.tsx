"use client";

import { useMemo, useState } from "react";

interface NoteItem {
  id: string;
  text: string;
  createdAt: string;
}

interface RecruiterNotesProps {
  initialNotes: NoteItem[];
}

function nowLabel() {
  return new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function RecruiterNotes({ initialNotes }: RecruiterNotesProps) {
  const [notes, setNotes] = useState<NoteItem[]>(initialNotes);
  const [draft, setDraft] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const canSave = useMemo(() => draft.trim().length > 0, [draft]);

  const handleSave = () => {
    if (!canSave) return;
    const createdAt = nowLabel();
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `note-${Date.now()}`;
    setNotes((prev) => [{ id, text: draft.trim(), createdAt }, ...prev]);
    setDraft("");
    setSavedAt(createdAt);
  };

  return (
    <section className="rounded-xl border border-slate/20 bg-white p-5 shadow-sm">
      <h2 className="font-syne text-xl font-bold text-midnight">Recruiter Notes</h2>
      <p className="mt-1 text-sm text-slate">Private notes visible only to your recruiter team.</p>

      <div className="mt-4">
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Add private notes about this candidate..."
          rows={4}
          className="w-full rounded-lg border border-slate/25 bg-white p-3 text-sm text-midnight outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-slate">{savedAt ? `Last saved: ${savedAt}` : "Not saved yet"}</span>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Save Note
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {notes.map((note) => (
          <article key={note.id} className="rounded-lg border border-slate/15 bg-surface p-3">
            <p className="text-sm text-midnight">{note.text}</p>
            <p className="mt-1 text-xs text-slate">{note.createdAt}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

