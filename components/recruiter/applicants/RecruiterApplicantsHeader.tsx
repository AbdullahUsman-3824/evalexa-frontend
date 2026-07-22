"use client";

import Link from "next/link";
import { Download, Sparkles, Briefcase, Users, ArrowRight } from "lucide-react";
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
    <header className="rounded-xl border border-secondary/20 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-syne text-2xl font-bold text-midnight">
            Applicants
          </h1>
          <p className="mt-1 text-sm text-slate flex items-center gap-2">
            <Users className="h-4 w-4 text-slate/60" />
            Select a job to load its applications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan to-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-md hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            disabled={!selectedJobId || loadingApplications}
          >
            <Sparkles className="h-4 w-4" />
            AI Rank All
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-secondary/30 px-4 py-2 text-sm font-medium text-midnight transition-all hover:bg-surface hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!selectedJobId || loadingApplications}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate">
            Job title
          </span>
          <select
            value={selectedJobId}
            onChange={(event) => onJobChange(event.target.value)}
            className="h-11 w-full rounded-lg border border-secondary/30 bg-white px-3 text-sm text-midnight outline-none transition-all hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
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
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 text-sm font-medium text-primary transition-all hover:bg-primary/10 hover:border-primary/50 hover:shadow-sm"
          >
            <Briefcase className="h-4 w-4" />
            Open Job
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {selectedJobTitle && (
        <div className="mt-4 rounded-xl border border-secondary/15 bg-surface/50 px-4 py-3 text-sm text-midnight transition-all">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-medium text-midnight">
              {selectedJobTitle}
            </span>
            <span className="h-4 w-px bg-secondary/30" />
            <span className="flex items-center gap-1.5 text-slate">
              <Users className="h-4 w-4 text-slate/60" />
              <span className="font-semibold text-midnight">
                {applicationCount}
              </span>
              application{applicationCount !== 1 ? "s" : ""} loaded
            </span>
            {loadingApplications && (
              <>
                <span className="h-4 w-px bg-secondary/30" />
                <span className="flex items-center gap-1.5 text-cyan">
                  <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-cyan border-t-transparent" />
                  Loading...
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Quick Stats when no job selected */}
      {!selectedJobTitle && jobTitles.length > 0 && (
        <div className="mt-4 rounded-xl border border-secondary/15 bg-surface/30 px-4 py-3 text-sm text-slate">
          <div className="flex flex-wrap items-center gap-2">
            <Briefcase className="h-4 w-4 text-slate/60" />
            <span>
              {jobTitles.length} job{jobTitles.length > 1 ? "s" : ""} available
            </span>
            <span className="h-4 w-px bg-secondary/30" />
            <span className="text-slate/60">
              Select one to view applications
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
