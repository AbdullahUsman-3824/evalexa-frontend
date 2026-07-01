"use client";

import Link from "next/link";
import {
  Building2,
  CalendarDays,
  MapPin,
  Sparkles,
  Tag,
  BriefcaseBusiness,
  ArrowRight,
  Edit,
} from "lucide-react";
import {
  type JobRecord,
  formatCurrencyRange,
  formatExperienceLevel,
  formatJobDate,
  formatJobStatus,
  formatJobType,
  formatRelativeDays,
  formatWorkModel,
} from "@/lib/services/jobs-service";

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

export default function JobPostCard({ job }: JobPostCardProps) {
  const status = formatJobStatus(job.status);
  const skills = job.jobSkills.map((relation) => relation.skill.name);
  const topSkills = skills.slice(0, 4);
  const remainingSkills = Math.max(0, skills.length - topSkills.length);

  return (
    <article className="rounded-2xl border border-slate/20 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-sm font-bold text-primary">
            {getInitials(job.company.name) || "J"}
          </div>
          <div>
            <h3 className="font-syne text-lg font-semibold text-midnight">
              {job.title}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate">
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="h-4 w-4" />
                {job.company.name}
              </span>
              <span className="hidden sm:inline">·</span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {job.location}
              </span>
            </div>
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(status)}`}
        >
          {status}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-midnight">
        <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
          {formatJobType(job.jobType)}
        </span>
        <span className="rounded-full bg-slate/15 px-3 py-1 font-medium text-slate">
          {formatWorkModel(job.workModel)}
        </span>
        <span className="rounded-full bg-cyan/10 px-3 py-1 font-medium text-cyan">
          {formatExperienceLevel(job.experienceLevel)}
        </span>
        <span className="rounded-full bg-success/10 px-3 py-1 font-medium text-success">
          {formatCurrencyRange(job.salaryMin, job.salaryMax)}
        </span>
      </div>

      <div className="mt-4 grid gap-3 rounded-xl bg-surface/60 p-4 text-sm text-midnight md:grid-cols-2">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-slate" />
          Posted {formatRelativeDays(job.createdAt)}
        </div>
        <div className="flex items-center gap-2">
          <BriefcaseBusiness className="h-4 w-4 text-slate" />
          Deadline {formatJobDate(job.applicationDeadline)}
        </div>
        <div className="flex items-center gap-2 md:col-span-2">
          <Sparkles className="h-4 w-4 text-slate" />
          AI screening{" "}
          {job.aiConfig
            ? `enabled at ${job.aiConfig.minMatchScore}% match`
            : "not configured"}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate">
          Skills
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {topSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              <Tag className="h-3.5 w-3.5" />
              {skill}
            </span>
          ))}
          {remainingSkills > 0 && (
            <span className="rounded-full bg-slate/15 px-3 py-1 text-xs font-medium text-slate">
              +{remainingSkills} more
            </span>
          )}
          {topSkills.length === 0 && (
            <span className="text-sm text-slate">No skills configured yet</span>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate/10 pt-4">
        <p className="text-sm text-slate">Managed by {job.creator.fullName}</p>
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
