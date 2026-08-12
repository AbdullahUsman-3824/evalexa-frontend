"use client";

import { Sparkles } from "lucide-react";
import type { JobPostFormData } from "@/types/job.types";

interface Step3AISettingsProps {
  data: JobPostFormData;
  onChange: <K extends keyof JobPostFormData>(
    field: K,
    value: JobPostFormData[K],
  ) => void;
}

function SettingCard({
  title,
  description,
  enabled,
  onToggle,
  children,
  accent = "primary",
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
  accent?: "primary" | "cyan";
}) {
  return (
    <div className="rounded-xl border border-slate/15 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-syne text-lg font-semibold text-midnight">
            {title}
          </h3>
          <p className="mt-1 text-sm text-slate">{description}</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={onToggle}
          className={`relative h-7 w-12 shrink-0 rounded-full transition ${
            enabled
              ? accent === "cyan"
                ? "bg-cyan-500"
                : "bg-primary"
              : "bg-slate/30"
          }`}
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
              enabled ? "left-5" : "left-0.5"
            }`}
          />
        </button>
      </div>

      {enabled && children ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}

function NumberField({
  id,
  label,
  hint,
  value,
  min = 1,
  max,
  onChange,
  accent = "primary",
}: {
  id: string;
  label: string;
  hint?: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  accent?: "primary" | "cyan";
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-midnight" htmlFor={id}>
          {label}
        </label>
        {hint ? <p className="text-xs text-slate">{hint}</p> : null}
      </div>
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const next = Number(e.target.value);
          if (Number.isNaN(next)) return;
          const clamped = Math.max(
            min,
            max !== undefined ? Math.min(max, next) : next,
          );
          onChange(clamped);
        }}
        className={`h-11 w-36 rounded-lg border px-3 text-midnight outline-none focus:ring-2 ${
          accent === "cyan"
            ? "border-cyan/25 focus:border-cyan focus:ring-cyan/20"
            : "border-slate/25 focus:border-primary focus:ring-primary/20"
        }`}
      />
    </div>
  );
}

export default function Step3AISettings({
  data,
  onChange,
}: Step3AISettingsProps) {
  const enableRanking = data.enableRanking;
  const enableAutoShortlist = data.enableAutoShortlisting;
  const shortlistLimit = data.shortlistLimit;
  const minimumMatchScore = data.minimumMatchScore;
  const enableAiInterview = data.enableAiInterview;
  const interviewLimit = data.interviewLimit ?? 5;

  return (
    <div className="space-y-6 text-midnight">
      <div className="rounded-xl bg-gradient-to-br from-white to-surface p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-syne text-xl font-semibold text-midnight">
              AI configuration
            </h2>
            <p className="text-sm text-slate">
              Control ranking, shortlisting, and AI interview behaviour for this
              job.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Ranking */}
        <SettingCard
          title="Candidate ranking"
          description="Score and rank applicants so the strongest matches surface first."
          enabled={enableRanking}
          onToggle={() => onChange("enableRanking", !enableRanking)}
        >
          <NumberField
            id="minimumMatchScore"
            label="Minimum match score"
            hint="Candidates below this score are deprioritised (0–100)."
            value={minimumMatchScore}
            min={0}
            max={100}
            onChange={(value) => onChange("minimumMatchScore", value)}
          />
        </SettingCard>

        {/* Auto-shortlist */}
        <SettingCard
          title="Auto-shortlist"
          description="Let Evalexa automatically shortlist the strongest candidates for recruiter review."
          enabled={enableAutoShortlist}
          onToggle={() =>
            onChange("enableAutoShortlisting", !enableAutoShortlist)
          }
        >
          <NumberField
            id="shortlistLimit"
            label="Shortlist limit"
            hint="Max number of candidates to auto-shortlist."
            value={shortlistLimit}
            min={1}
            onChange={(value) => onChange("shortlistLimit", value)}
          />
        </SettingCard>

        {/* AI interview */}
        <SettingCard
          title="AI interview"
          description="Invite the final candidates to an AI-assisted interview round."
          enabled={enableAiInterview}
          onToggle={() => onChange("enableAiInterview", !enableAiInterview)}
          accent="cyan"
        >
          <NumberField
            id="interviewLimit"
            label="Interview limit"
            hint="Max candidates invited to the AI interview."
            value={interviewLimit}
            min={1}
            onChange={(value) => onChange("interviewLimit", value)}
            accent="cyan"
          />
        </SettingCard>
      </div>
    </div>
  );
}
