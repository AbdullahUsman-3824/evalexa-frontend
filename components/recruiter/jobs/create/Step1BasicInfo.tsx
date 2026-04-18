"use client";

import type { JobPostFormData, JobType, WorkMode } from "./types";
import LivePreviewCard from "./LivePreviewCard";

interface Step1BasicInfoProps {
  data: JobPostFormData;
  onChange: <K extends keyof JobPostFormData>(
    field: K,
    value: JobPostFormData[K],
  ) => void;
}

const DEPARTMENTS = [
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Operations",
  "Other",
];

const JOB_TYPES: JobType[] = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
];

const WORK_MODES: WorkMode[] = ["On-site", "Remote", "Hybrid"];

export default function Step1BasicInfo({ data, onChange }: Step1BasicInfoProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="space-y-6 lg:col-span-3">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <label className="mb-2 block text-sm font-semibold text-midnight">
            Job Title *
          </label>
          <input
            value={data.jobTitle}
            onChange={(e) => onChange("jobTitle", e.target.value.slice(0, 80))}
            placeholder="e.g. Senior Frontend Developer"
            className="h-11 w-full rounded-lg border border-slate/25 px-4 text-midnight outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <p className="mt-1 text-right text-xs text-slate">{data.jobTitle.length}/80</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <label className="mb-2 block text-sm font-semibold text-midnight">
            Department *
          </label>
          <select
            value={data.department}
            onChange={(e) => onChange("department", e.target.value)}
            className="h-11 w-full rounded-lg border border-slate/25 px-4 text-midnight outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {DEPARTMENTS.map((dep) => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-midnight">Job Type *</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {JOB_TYPES.map((type) => {
              const selected = data.jobType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => onChange("jobType", type)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                    selected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-slate/20 text-midnight hover:border-primary/40"
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-midnight">Work Mode *</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {WORK_MODES.map((mode) => {
              const selected = data.workMode === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onChange("workMode", mode)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                    selected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-slate/20 text-midnight hover:border-primary/40"
                  }`}
                >
                  {mode}
                </button>
              );
            })}
          </div>
        </div>

        {data.workMode !== "Remote" && (
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <label className="mb-2 block text-sm font-semibold text-midnight">
              Location *
            </label>
            <input
              value={data.location}
              onChange={(e) => onChange("location", e.target.value)}
              placeholder="City, country"
              className="h-11 w-full rounded-lg border border-slate/25 px-4 text-midnight outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        )}

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <label className="mb-2 block text-sm font-semibold text-midnight">
            Application Deadline *
          </label>
          <input
            type="date"
            value={data.applicationDeadline}
            onChange={(e) => onChange("applicationDeadline", e.target.value)}
            className="h-11 w-full rounded-lg border border-slate/25 px-4 text-midnight outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          <div className="mt-4 flex items-center justify-between rounded-lg border border-slate/20 p-3">
            <div>
              <p className="text-sm font-medium text-midnight">Urgent</p>
              <p className="text-xs text-slate">Adds an Urgently Hiring badge</p>
            </div>
            <button
              type="button"
              onClick={() => onChange("urgentHiring", !data.urgentHiring)}
              className={`relative h-6 w-11 rounded-full transition ${
                data.urgentHiring ? "bg-warning" : "bg-slate/30"
              }`}
              aria-label="Toggle urgent hiring"
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                  data.urgentHiring ? "left-5" : "left-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="sticky top-20">
          <LivePreviewCard data={data} />
        </div>
      </div>
    </div>
  );
}

