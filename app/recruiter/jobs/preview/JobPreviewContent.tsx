"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Briefcase,
  CalendarDays,
  Loader2,
  MapPin,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import {
  formatCurrencyRange,
  formatExperienceLevel,
  formatJobDate,
  formatJobStatus,
  formatJobType,
  formatWorkModel,
  getJob,
  getJobs,
  type JobRecord,
} from "@/lib/services/jobsService";

export function JobPreviewContent() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  const [job, setJob] = useState<JobRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPreview() {
      setIsLoading(true);
      setError(null);

      try {
        if (jobId) {
          const data = await getJob(jobId);
          if (isMounted) setJob(data);
        } else {
          const jobs = await getJobs();
          if (isMounted) setJob(jobs[0] ?? null);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load preview.",
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadPreview();

    return () => {
      isMounted = false;
    };
  }, [jobId]);

  const requiredSkills = useMemo(
    () =>
      job?.jobSkills.filter((relation) => relation.importance === "REQUIRED") ??
      [],
    [job],
  );

  const preferredSkills = useMemo(
    () =>
      job?.jobSkills.filter(
        (relation) => relation.importance === "PREFERRED",
      ) ?? [],
    [job],
  );

  return (
    <div className="relative p-6">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="rotate-[-24deg] text-[120px] font-extrabold tracking-[0.25em] text-slate/10">
          PREVIEW
        </span>
      </div>

      <div className="relative mx-auto max-w-5xl space-y-6">
        <div className="rounded-xl border border-warning/30 bg-warning/10 p-4">
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
            <div>
              <p className="font-syne text-lg font-semibold text-midnight">
                Preview Mode
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/recruiter/jobs/create"
                className="rounded-lg border border-primary px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
              >
                Create New
              </Link>
              {job && (
                <Link
                  href={`/recruiter/jobs/${job.id}`}
                  className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90"
                >
                  Open Job
                </Link>
              )}
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="rounded-xl border border-slate/20 bg-white p-8 text-center text-slate shadow-sm">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-3">Loading live preview...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="rounded-xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger">
            <div className="flex items-center gap-2">
              <TriangleAlert className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {job && !isLoading && (
          <article className="rounded-xl border border-slate/20 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate/15 pb-4">
              <div>
                <h1 className="font-syne text-3xl font-bold text-midnight">
                  {job.title}
                </h1>
                <p className="mt-1 text-slate">{job.company.name}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
                    {formatJobType(job.jobType)}
                  </span>
                  <span className="rounded-full bg-slate/15 px-3 py-1 font-semibold text-slate">
                    {formatWorkModel(job.workModel)}
                  </span>
                  <span className="rounded-full bg-success/10 px-3 py-1 font-semibold text-success">
                    {formatExperienceLevel(job.experienceLevel)}
                  </span>
                  <span className="rounded-full bg-warning/10 px-3 py-1 font-semibold text-warning">
                    {formatJobStatus(job.status)}
                  </span>
                </div>
              </div>
              <div className="space-y-2 text-sm text-slate">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {job.location}
                </p>
                <p className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  {formatCurrencyRange(job.salaryMin, job.salaryMax)}
                </p>
                <p className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  Apply before {formatJobDate(job.applicationDeadline)}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[2fr,1fr]">
              <div className="space-y-6">
                <section>
                  <h2 className="mb-2 font-syne text-xl font-semibold text-midnight">
                    Job Description
                  </h2>
                  <p className="text-sm leading-6 text-midnight whitespace-pre-wrap">
                    {job.description}
                  </p>
                </section>

                <section>
                  <h2 className="mb-2 font-syne text-xl font-semibold text-midnight">
                    Job Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {job.jobSkills.map((relation) => (
                      <span
                        key={`${relation.skillId}-${relation.skill.name}`}
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                      >
                        {relation.skill.name} · {relation.importance}
                      </span>
                    ))}
                  </div>
                </section>
              </div>

              <aside className="space-y-5">
                <section className="rounded-lg border border-slate/20 p-4">
                  <h3 className="font-syne text-lg font-semibold text-midnight">
                    Requirements
                  </h3>
                  <div className="mt-2 space-y-1 text-sm text-midnight">
                    <p>
                      <span className="text-slate">Experience:</span>{" "}
                      {formatExperienceLevel(job.experienceLevel)}
                    </p>
                    <p>
                      <span className="text-slate">Work model:</span>{" "}
                      {formatWorkModel(job.workModel)}
                    </p>
                    <p>
                      <span className="text-slate">Deadline:</span>{" "}
                      {formatJobDate(job.applicationDeadline)}
                    </p>
                  </div>
                </section>

                <section className="rounded-lg border border-slate/20 p-4">
                  <h3 className="mb-2 font-syne text-lg font-semibold text-midnight">
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {requiredSkills.length > 0 ? (
                      requiredSkills.map((skill) => (
                        <span
                          key={skill.skillId}
                          className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                        >
                          {skill.skill.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate">
                        None configured
                      </span>
                    )}
                  </div>
                </section>

                <section className="rounded-lg border border-slate/20 p-4">
                  <h3 className="mb-2 font-syne text-lg font-semibold text-midnight">
                    Preferred Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {preferredSkills.length > 0 ? (
                      preferredSkills.map((skill) => (
                        <span
                          key={skill.skillId}
                          className="rounded-full bg-slate/15 px-3 py-1 text-xs font-semibold text-slate"
                        >
                          {skill.skill.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate">
                        None configured
                      </span>
                    )}
                  </div>
                </section>

                <section className="rounded-lg border border-slate/20 p-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-cyan" />
                    <h3 className="font-syne text-lg font-semibold text-midnight">
                      AI Config
                    </h3>
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-midnight">
                    <p>
                      <span className="text-slate">Configured:</span>{" "}
                      {job.aiConfig ? "Yes" : "No"}
                    </p>
                    {job.aiConfig && (
                      <>
                        <p>
                          <span className="text-slate">Min match:</span>{" "}
                          {job.aiConfig.minMatchScore}%
                        </p>
                        <p>
                          <span className="text-slate">Auto shortlist:</span>{" "}
                          {job.aiConfig.enableAutoShortlist
                            ? `At ${job.aiConfig.autoShortlistThreshold}%`
                            : "Off"}
                        </p>
                      </>
                    )}
                  </div>
                </section>
              </aside>
            </div>
          </article>
        )}

        {!job && !isLoading && !error && (
          <div className="rounded-xl border border-slate/20 bg-white p-8 text-center text-slate shadow-sm">
            <p className="font-syne text-lg font-semibold text-midnight">
              No jobs available to preview
            </p>
            <p className="mt-2 text-sm">
              Create a job first or select a job id in the preview URL.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
