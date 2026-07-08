"use client";

import Link from "next/link";
import { Download, Sparkles } from "lucide-react";
import { JobTitleRecord } from "@/types/job.types";

interface RecruiterApplicantsHeaderProps {
  jobTitles: JobTitleRecord[];
  selectedJobId: string;
  selectedJobTitle: string | null;
  applicationCount: number;
  loadingApplications: boolean;
  onJobChange: (jobId: string) => void;
}

export default function RecruiterApplicantsHeader({
  jobTitles,
  selectedJobId,
  selectedJobTitle,
  applicationCount,
  loadingApplications,
  onJobChange,
}: RecruiterApplicantsHeaderProps) {
  return (
    <header className="rounded-xl border border-slate/20 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-syne text-2xl font-bold text-midnight">
            Applicants
          </h1>
          <p className="mt-1 text-sm text-slate">
            Select a job to load its applications.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-cyan px-3 py-2 text-sm font-semibold text-midnight hover:bg-cyan/90"
            disabled={!selectedJobId || loadingApplications}
          >
            <Sparkles className="h-4 w-4" />
            AI Rank All
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate/20 px-3 py-2 text-sm font-medium text-midnight hover:bg-surface"
            disabled={!selectedJobId || loadingApplications}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate">
            Job title
          </span>
          <select
            value={selectedJobId}
            onChange={(event) => onJobChange(event.target.value)}
            className="h-11 w-full rounded-lg border border-slate/25 bg-white px-3 text-sm text-midnight outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Select a job</option>
            {jobTitles.map((jobTitle) => (
              <option key={jobTitle.id} value={jobTitle.id}>
                {jobTitle.title}
              </option>
            ))}
          </select>
        </label>

        {selectedJobTitle && selectedJobId && (
          <Link
            href={`/recruiter/jobs/${selectedJobId}`}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-primary/40 bg-primary/5 px-4 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
          >
            Open Job
          </Link>
        )}
      </div>

      {selectedJobTitle && (
        <div className="mt-4 rounded-xl border border-slate/15 bg-surface/50 px-4 py-3 text-sm text-midnight">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">{selectedJobTitle}</span>
            <span className="text-slate">·</span>
            <span className="text-slate">
              {applicationCount} applications loaded
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
