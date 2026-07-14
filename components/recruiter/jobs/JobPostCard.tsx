"use client";

import Link from "next/link";
import { BriefcaseBusiness, ArrowRight, Edit, Users } from "lucide-react";
import { formatJobDate, formatJobStatus } from "@/repositories/job.repository";
import { JobListRecord } from "@/types/job.types";

interface JobPostCardProps {
  job: JobListRecord;
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

export default function JobPostCard({ job }: JobPostCardProps) {
  const status = formatJobStatus(job.status);

  return (
    <article className="rounded-2xl border border-slate/20 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-syne text-lg font-semibold text-midnight">
            {job.title}
          </h3>
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
          {job.applications} application{job.applications === 1 ? "" : "s"}
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
        </div>
      </div>
    </article>
  );
}
