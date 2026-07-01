"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import {
  formatCurrencyRange,
  formatJobStatus,
  formatWorkModel,
  getJobs,
  type JobRecord,
} from "@/lib/services/jobs-service";

export default function ActiveJobsOverview() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadJobs() {
      try {
        const data = await getJobs({ sortBy: "newest" });
        if (isMounted) {
          setJobs(data);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadJobs();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleJobs = useMemo(() => jobs.slice(0, 4), [jobs]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-syne text-xl font-semibold text-midnight">
          Active Job Posts
        </h2>
        <button
          onClick={() => router.push("/recruiter/jobs")}
          className="flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-blue-600"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-slate">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Loading active jobs...
        </div>
      ) : visibleJobs.length > 0 ? (
        <div className="space-y-4">
          {visibleJobs.map((job) => (
            <div
              key={job.id}
              className="rounded-lg border border-gray-200 p-4 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-syne text-base font-semibold text-midnight">
                      {job.title}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        formatJobStatus(job.status) === "Published"
                          ? "bg-success/10 text-success"
                          : formatJobStatus(job.status) === "Closed"
                            ? "bg-danger/10 text-danger"
                            : "bg-slate/10 text-slate"
                      }`}
                    >
                      {formatJobStatus(job.status)}
                    </span>
                  </div>
                  <p className="text-sm text-slate">
                    {job.company.name} · {job.location} ·{" "}
                    {formatWorkModel(job.workModel)}
                  </p>
                  <p className="text-sm font-medium text-midnight">
                    {formatCurrencyRange(job.salaryMin, job.salaryMax)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => router.push(`/recruiter/jobs/${job.id}`)}
                    className="rounded-lg bg-surface px-4 py-2 text-sm font-medium text-midnight transition-colors hover:bg-gray-200"
                  >
                    View
                  </button>
                  <button
                    onClick={() => router.push(`/recruiter/jobs/${job.id}`)}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                  >
                    Manage
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate">No active jobs found.</p>
      )}
    </div>
  );
}
