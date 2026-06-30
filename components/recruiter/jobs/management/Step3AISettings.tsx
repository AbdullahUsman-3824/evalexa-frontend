"use client";

import { Sparkles } from "lucide-react";
import type { JobPostFormData } from "./types";

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
  countLabel,
  countValue,
  onCountChange,
  accent = "primary",
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  countLabel: string;
  countValue: number;
  onCountChange: (value: number) => void;
  accent?: "primary" | "cyan";
}) {
  return (
    <div className="rounded-xl border border-slate/15 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-syne text-lg font-semibold text-midnight">{title}</h3>
          <p className="mt-1 text-sm text-slate">{description}</p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className={`relative h-7 w-12 rounded-full transition ${enabled ? "bg-primary" : "bg-slate/30"}`}
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${enabled ? "left-5" : "left-0.5"}`}
          />
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-midnight" htmlFor={title}>
            {countLabel}
          </label>
          <p className="text-xs text-slate">
            This is sent directly to the backend as part of the job AI config.
          </p>
        </div>
        <input
          id={title}
          type="number"
          min={1}
          value={countValue}
          onChange={(event) => onCountChange(Math.max(1, Number(event.target.value) || 1))}
          className={`h-11 w-36 rounded-lg border px-3 text-midnight outline-none focus:ring-2 focus:ring-primary/20 ${accent === "cyan" ? "border-cyan/25 focus:border-cyan" : "border-slate/25 focus:border-primary"}`}
        />
      </div>
    </div>
  );
}

export default function Step3AISettings({
  data,
  onChange,
}: Step3AISettingsProps) {
  const enableAutoShortlist = data.enableAutoShortlist ?? data.autoShortlistEnabled ?? true;
  const enableAiInterview = data.enableAiInterview ?? data.aiInterviewEnabled ?? true;
  const resumeSelectionCount = data.resumeSelectionCount ?? 20;
  const interviewSelectionCount = data.interviewSelectionCount ?? 5;

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
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SettingCard
          title="Auto-shortlist"
          description="Let Evalexa automatically shortlist the strongest candidates for recruiter review."
          enabled={enableAutoShortlist}
          onToggle={() => onChange("enableAutoShortlist", !enableAutoShortlist)}
          countLabel="Resume selection count"
          countValue={resumeSelectionCount}
          onCountChange={(value) => onChange("resumeSelectionCount", value)}
        />

        <SettingCard
          title="AI interview"
          description="Invite the final candidates to an AI-assisted interview round."
          enabled={enableAiInterview}
          onToggle={() => onChange("enableAiInterview", !enableAiInterview)}
          countLabel="Interview selection count"
          countValue={interviewSelectionCount}
          onCountChange={(value) => onChange("interviewSelectionCount", value)}
          accent="cyan"
        />
      </div>
    </div>
  );
}