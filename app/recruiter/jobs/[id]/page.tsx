"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Loader2,
  Save,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import {
  formatCurrencyRange,
  formatExperienceLevel,
  formatJobDate,
  formatJobStatus,
  formatJobType,
  formatRelativeDays,
  formatWorkModel,
  getJob,
  updateJob,
} from "@/repositories/job.repository";
import { BackendJobStatus, JobRecord } from "@/types/job.types";

const STATUS_OPTIONS: { value: BackendJobStatus; label: string }[] = [
  { value: "OPEN", label: "Published" },
  { value: "DRAFT", label: "Draft" },
  { value: "CLOSED", label: "Closed" },
];

export default function JobDetailsPage() {
  const params = useParams<{ id: string }>();
  const jobId = params?.id;
  const [job, setJob] = useState<JobRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] =
    useState<BackendJobStatus>("DRAFT");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadJob() {
      if (!jobId) {
        if (isMounted) {
          setError("Invalid job id.");
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await getJob(jobId);
        if (isMounted) {
          setJob(data);
          setSelectedStatus(data.status);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load this job.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadJob();

    return () => {
      isMounted = false;
    };
  }, [jobId]);

  const skills = useMemo(() => job?.jobSkills ?? [], [job]);

  const handleSaveStatus = async () => {
    if (!job) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const updatedJob = await updateJob(job.id, { status: selectedStatus });
      setJob(updatedJob);
      setSelectedStatus(updatedJob.status);
      setSaveMessage("Job status updated.");
    } catch (requestError) {
      setSaveMessage(
        requestError instanceof Error
          ? requestError.message
          : "Unable to update job.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="rounded-2xl border border-slate/15 bg-white p-5 shadow-sm">
          <Link
            href="/recruiter/jobs"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            My Jobs
          </Link>

          {isLoading && (
            <div className="mt-6 flex items-center gap-3 text-slate">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              Loading job details...
            </div>
          )}

          {error && !isLoading && (
            <div className="mt-6 rounded-xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger">
              <div className="flex items-center gap-2">
                <TriangleAlert className="h-4 w-4" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {job && !isLoading && (
            <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-syne text-2xl font-bold text-midnight">
                    {job.title}
                  </h1>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${formatJobStatus(job.status) === "Published" ? "bg-success/10 text-success" : formatJobStatus(job.status) === "Closed" ? "bg-danger/10 text-danger" : "bg-slate/15 text-slate"}`}
                  >
                    {formatJobStatus(job.status)}
                  </span>
                </div>

                <p className="mt-2 text-slate">
                  {job.company.name} · {job.location} ·{" "}
                  {formatJobType(job.jobType)} ·{" "}
                  {formatWorkModel(job.workModel)}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/recruiter/jobs/preview?jobId=${job.id}`}
                    className="rounded-lg border border-primary px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
                  >
                    Preview as Candidate
                  </Link>
                  <Link
                    href={`/recruiter/jobs/${job.id}/edit`}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate/25 px-3 py-2 text-sm font-semibold text-midnight hover:bg-surface"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Job
                  </Link>
                  <button
                    type="button"
                    onClick={() => void handleSaveStatus()}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? "Saving..." : "Save Status"}
                  </button>
                </div>
              </div>

              <div className="min-w-60 rounded-xl border border-slate/15 bg-surface p-4 text-sm text-midnight">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate">
                  Job Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(event) =>
                    setSelectedStatus(event.target.value as BackendJobStatus)
                  }
                  className="h-11 w-full rounded-lg border border-slate/25 bg-white px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="mt-3 text-xs text-slate">
                  Updated {formatRelativeDays(job.updatedAt)} · Deadline{" "}
                  {formatJobDate(job.applicationDeadline)}
                </p>
                {saveMessage && (
                  <p className="mt-2 text-xs font-medium text-primary">
                    {saveMessage}
                  </p>
                )}
              </div>
            </div>
          )}
        </header>

        {job && !isLoading && (
          <div className="grid gap-5 lg:grid-cols-[1.5fr,1fr]">
            <div className="space-y-5">
              <section className="rounded-2xl border border-slate/15 bg-white p-5 shadow-sm">
                <h2 className="font-syne text-lg font-semibold text-midnight">
                  Job Overview
                </h2>
                <div className="mt-4 space-y-5">
                  <div className="grid gap-3 text-sm text-midnight sm:grid-cols-2">
                    <p>
                      <span className="text-slate">Company:</span>{" "}
                      {job.company.name}
                    </p>
                    <p>
                      <span className="text-slate">Created by:</span>{" "}
                      {job.creator.fullName}
                    </p>
                    <p>
                      <span className="text-slate">Salary:</span>{" "}
                      {formatCurrencyRange(job.salaryMin, job.salaryMax)}
                    </p>
                    <p>
                      <span className="text-slate">Experience:</span>{" "}
                      {formatExperienceLevel(job.experienceLevel)}
                    </p>
                    <p>
                      <span className="text-slate">Work model:</span>{" "}
                      {formatWorkModel(job.workModel)}
                    </p>
                    <p>
                      <span className="text-slate">Posted:</span>{" "}
                      {formatJobDate(job.createdAt)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-surface/60 p-4">
                    <h3 className="text-sm font-semibold text-midnight">
                      Description
                    </h3>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-midnight">
                      {job.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-midnight">
                      Skills
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {skills.length > 0 ? (
                        skills.map((relation) => (
                          <span
                            key={`${relation.skillId}-${relation.skill.name}`}
                            className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                          >
                            {relation.skill.name} · {relation.importance} ·{" "}
                            {relation.skill.category}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate">
                          No skills configured.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <aside className="space-y-5">
              <section className="rounded-2xl border border-slate/15 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan" />
                  <h2 className="font-syne text-lg font-semibold text-midnight">
                    AI Settings
                  </h2>
                </div>

                {job.aiConfig ? (
                  <div className="mt-4 space-y-2 text-sm text-midnight">
                    <p>
                      <span className="text-slate">Min match:</span>{" "}
                      {job.aiConfig.minMatchScore}%
                    </p>
                    <p>
                      <span className="text-slate">Auto shortlist:</span>{" "}
                      {job.aiConfig.enableAutoShortlist
                        ? `On at ${job.aiConfig.autoShortlistThreshold}%`
                        : "Off"}
                    </p>
                    <p>
                      <span className="text-slate">AI interview:</span>{" "}
                      {job.aiConfig.enableAiInterview
                        ? `On at ${job.aiConfig.aiInterviewThreshold}%`
                        : "Off"}
                    </p>
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-slate">
                    No AI configuration found for this job.
                  </p>
                )}
                <div className="mt-5 border-t border-slate/10 pt-4">
                  <h3 className="font-syne text-base font-semibold text-midnight">
                    Ownership
                  </h3>
                  <div className="mt-3 space-y-2 text-sm text-midnight">
                    <p>
                      <span className="text-slate">Company ID:</span>{" "}
                      {job.companyId}
                    </p>
                    <p>
                      <span className="text-slate">Creator email:</span>{" "}
                      {job.creator.email}
                    </p>
                    <p>
                      <span className="text-slate">Updated:</span>{" "}
                      {formatJobDate(job.updatedAt)}
                    </p>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
