"use client";

import Link from "next/link";
import { BriefcaseBusiness, ArrowRight, Edit, Users } from "lucide-react";
import { formatJobDate, formatJobStatus } from "@/repositories/job.repository";
import { JobRecord } from "@/types/job.types";

interface JobPostCardProps {
  job: JobRecord;
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);
}

function statusClass(status: ReturnType<typeof formatJobStatus>) {
  switch (status) {
    case "Published":
      return "bg-success/10 text-success";
    case "Closed":
      return "bg-danger/10 text-danger";
    default:
      return "bg-slate/15 text-slate";
  }
}

function getApplicationsCount(job: JobRecord) {
  return job._count?.applications ?? 0;
}

export default function JobPostCard({ job }: JobPostCardProps) {
  const status = formatJobStatus(job.status);
  const applicationsCount = getApplicationsCount(job);

  return (
    <article className="rounded-2xl border border-slate/20 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-sm font-bold text-primary">
            {getInitials(job.company.name) || "J"}
          </div>
          <div className="min-w-0">
            <h3 className="font-syne text-lg font-semibold text-midnight">
              {job.title}
            </h3>
            <p className="mt-1 text-sm text-slate">
              Managed by {job.creator.fullName}
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(status)}`}
        >
          {status}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-surface/60 p-4 text-sm text-midnight">
        <div className="flex items-center gap-2">
          <BriefcaseBusiness className="h-4 w-4 text-slate" />
          Deadline {formatJobDate(job.applicationDeadline)}
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-slate" />
          {applicationsCount} application{applicationsCount === 1 ? "" : "s"}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate/10 pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/recruiter/jobs/${job.id}/edit`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/5 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Link>
          <Link
            href={`/recruiter/jobs/${job.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            View Details
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={job.slug ? `/jobs/${job.slug}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!job.slug}
            prefetch={false}
            className={`rounded-lg border border-slate/25 px-3 py-2 text-sm font-medium transition-colors ${
              job.slug
                ? "text-midnight hover:bg-surface"
                : "cursor-not-allowed text-slate/60"
            }`}
          >
            View Public Link
          </Link>
        </div>
      </div>
    </article>
  );
}
