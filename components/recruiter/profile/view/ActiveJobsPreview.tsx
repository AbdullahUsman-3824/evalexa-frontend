"use client";

import { motion } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface Job {
  id: string;
  title: string;
  applicants: number;
}

export default function ActiveJobsPreview() {
  const router = useRouter();

  const activeJobs: Job[] = [
    { id: "1", title: "Senior Frontend Developer", applicants: 42 },
    { id: "2", title: "Product Marketing Manager", applicants: 38 },
    { id: "3", title: "Data Scientist", applicants: 29 },
  ];
"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Loader2, MapPin, Bookmark } from "lucide-react";
import Link from "next/link";
import {
  formatCurrencyRange,
  formatJobStatus,
  formatRelativeDays,
  getJobs,
  type JobRecord,
} from "@/lib/services/jobsService";

export default function ActiveJobsPreview() {
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

  const activeJobs = useMemo(() => jobs.slice(0, 3), [jobs]);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-midnight">Jobs Matched For You</h2>
        <Link
          href="/recruiter/jobs"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-all duration-200 hover:gap-3"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 rounded-xl border border-slate/10 bg-white p-5 text-sm text-slate">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Loading jobs...
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-3 lg:overflow-visible">
          {activeJobs.map((job) => (
            <article key={job.id} className="min-w-70 rounded-xl border border-slate/10 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg lg:min-w-0">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                {job.company.name
                  .split(/\s+/)
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part[0]?.toUpperCase() ?? "")
                  .join("")}
              </div>

              <h3 className="mb-1 font-display text-base font-semibold text-midnight">{job.title}</h3>
              <div className="mb-3 flex items-center gap-2 text-sm text-slate">
                <span>{job.company.name}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{job.location}</span>
                </div>
              </div>

              <div className="mb-3 inline-flex rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
                {formatJobStatus(job.status)}
              </div>

              <div className="mb-4 flex flex-wrap gap-1.5">
                {job.jobSkills.slice(0, 3).map((relation) => (
                  <span key={relation.skillId} className="rounded bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    {relation.skill.name}
                  </span>
                ))}
              </div>

              <p className="mb-4 text-sm font-medium text-slate">{formatCurrencyRange(job.salaryMin, job.salaryMax)}</p>

              <div className="flex items-center justify-between border-t border-slate/10 pt-4">
                <span className="text-xs text-slate">{formatRelativeDays(job.createdAt)}</span>
                <button className="p-2 text-slate transition-colors hover:rounded-lg hover:bg-primary/5 hover:text-primary" aria-label="Save job">
                  <Bookmark className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 text-xs text-slate">
                Deadline {job.applicationDeadline}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
