"use client";

import { Sparkles, Trophy, Users, Video } from "lucide-react";
import type { JobPostFormData } from "@/types/job.types";

interface Step3AISettingsProps {
  data: JobPostFormData;
  onChange: <K extends keyof JobPostFormData>(
    field: K,
    value: JobPostFormData[K],
  ) => void;
}

function Toggle({
  enabled,
  onToggle,
  accent = "primary",
}: {
  enabled: boolean;
  onToggle: () => void;
  accent?: "primary" | "cyan";
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={onToggle}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
        enabled
          ? accent === "cyan"
            ? "bg-cyan-500"
            : "bg-primary"
          : "bg-slate/25"
      }`}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-all ${
          enabled ? "left-5" : "left-0.5"
        }`}
      />
    </button>
  );
}

function NumberField({
  id,
  label,
  hint,
  value,
  min = 0,
  max,
  onChange,
  suffix,
}: {
  id: string;
  label: string;
  hint?: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  suffix?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-midnight">
          {label}
        </label>
        {hint ? <span className="text-xs text-slate">{hint}</span> : null}
      </div>
      <div className="relative">
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
          className="h-11 w-full rounded-lg border border-slate/20 bg-white px-3 pr-12 text-sm text-midnight outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate">
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function SettingCard({
  icon,
  title,
  description,
  enabled,
  onToggle,
  accent = "primary",
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  accent?: "primary" | "cyan";
  children?: React.ReactNode;
}) {
  const accentRing =
    accent === "cyan"
      ? "ring-cyan-500/20 border-cyan-500/30"
      : "ring-primary/20 border-primary/30";
  const iconBg =
    accent === "cyan"
      ? enabled
        ? "bg-cyan-500/15 text-cyan-600"
        : "bg-slate/10 text-slate"
      : enabled
        ? "bg-primary/15 text-primary"
        : "bg-slate/10 text-slate";

  return (
    <div
      className={`flex h-full flex-col rounded-2xl border bg-white p-5 shadow-sm transition ${
        enabled ? `ring-1 ${accentRing}` : "border-slate/15 opacity-95"
      }`}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${iconBg}`}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-syne text-base font-semibold text-midnight">
              {title}
            </h3>
            <Toggle enabled={enabled} onToggle={onToggle} accent={accent} />
          </div>
          <p className="mt-1 text-sm leading-relaxed text-slate">
            {description}
          </p>
        </div>
      </div>

      {/* Body – only when enabled */}
      {enabled && children ? (
        <div className="mt-5 border-t border-slate/10 pt-5">{children}</div>
      ) : (
        <div className="mt-5 flex flex-1 items-end">
          <p className="text-xs text-slate/70">Turn on to configure options</p>
        </div>
      )}
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
      {/* Page intro */}
      <div className="rounded-2xl border border-slate/10 bg-gradient-to-br from-white via-white to-surface/80 p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-syne text-xl font-semibold text-midnight">
              AI configuration
            </h2>
            <p className="mt-0.5 text-sm text-slate">
              Ranking, shortlisting, and interview limits for this job.
            </p>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <SettingCard
          icon={<Trophy className="h-5 w-5" />}
          title="Candidate ranking"
          description="Score applicants so the strongest matches surface first."
          enabled={enableRanking}
          onToggle={() => onChange("enableRanking", !enableRanking)}
        >
          <NumberField
            id="minimumMatchScore"
            label="Minimum match score"
            hint="0–100"
            value={minimumMatchScore}
            min={0}
            max={100}
            suffix="pts"
            onChange={(value) => onChange("minimumMatchScore", value)}
          />
        </SettingCard>

        <SettingCard
          icon={<Users className="h-5 w-5" />}
          title="Auto-shortlist"
          description="Automatically shortlist top candidates for recruiter review."
          enabled={enableAutoShortlist}
          onToggle={() =>
            onChange("enableAutoShortlisting", !enableAutoShortlist)
          }
        >
          <NumberField
            id="shortlistLimit"
            label="Shortlist limit"
            hint="Max candidates"
            value={shortlistLimit}
            min={1}
            suffix="max"
            onChange={(value) => onChange("shortlistLimit", value)}
          />
        </SettingCard>

        <SettingCard
          icon={<Video className="h-5 w-5" />}
          title="AI interview"
          description="Invite finalists to an AI-assisted interview round."
          enabled={enableAiInterview}
          onToggle={() => onChange("enableAiInterview", !enableAiInterview)}
          accent="cyan"
        >
          <NumberField
            id="interviewLimit"
            label="Interview limit"
            hint="Max invites"
            value={interviewLimit}
            min={1}
            suffix="max"
            onChange={(value) => onChange("interviewLimit", value)}
          />
        </SettingCard>
      </div>
    </div>
  );
}
