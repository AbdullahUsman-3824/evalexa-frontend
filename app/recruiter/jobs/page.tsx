"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  Loader2,
  PlusCircle,
  TriangleAlert,
} from "lucide-react";
import JobFilters, {
  type JobFilterStatus,
  type JobSortOption,
} from "@/components/recruiter/jobs/JobFilters";
import JobPostCard from "@/components/recruiter/jobs/JobPostCard";
import {
  formatJobStatus,
  getJobs,
  type JobRecord,
} from "@/lib/services/jobs-service";

function getStatusCounts(jobs: JobRecord[]) {
  return {
    All: jobs.length,
    Published: jobs.filter((job) => formatJobStatus(job.status) === "Published")
      .length,
    Draft: jobs.filter((job) => formatJobStatus(job.status) === "Draft").length,
    Closed: jobs.filter((job) => formatJobStatus(job.status) === "Closed")
      .length,
  };
}

export default function JobPostsPage() {
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<JobFilterStatus>("All");
  const [sortBy, setSortBy] = useState<JobSortOption>("Newest");

  useEffect(() => {
    let isMounted = true;

    async function loadJobs() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getJobs();
        if (isMounted) {
          setJobs(data);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load jobs.",
          );
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

  const counts = useMemo(() => getStatusCounts(jobs), [jobs]);

  const filteredJobs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const searched = jobs.filter((job) => {
      if (!normalizedSearch) return true;

      const skillText = job.jobSkills
        .map((relation) => relation.skill.name)
        .join(" ");
      const haystack = [
        job.title,
        job.description,
        job.location,
        job.company.name,
        job.company.location ?? "",
        skillText,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });

    const statusFiltered =
      activeStatus === "All"
        ? searched
        : searched.filter(
            (job) => formatJobStatus(job.status) === activeStatus,
          );

    return [...statusFiltered].sort((a, b) => {
      if (sortBy === "Deadline") {
        return (
          new Date(a.applicationDeadline).getTime() -
          new Date(b.applicationDeadline).getTime()
        );
      }

      if (sortBy === "Salary") {
        return b.salaryMax - a.salaryMax;
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [jobs, search, activeStatus, sortBy]);

  const subtitle = `${counts.All} total · ${counts.Published} published · ${counts.Draft} drafts · ${counts.Closed} closed`;
  const hasNoJobs = jobs.length === 0;
  const hasNoResults = !hasNoJobs && filteredJobs.length === 0;

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-syne text-2xl font-bold text-midnight">
              My Job Posts
            </h1>
            <p className="text-slate">{subtitle}</p>
          </div>
          <Link
            href="/recruiter/jobs/post"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            <PlusCircle className="h-4 w-4" />
            Post New Job
          </Link>
        </header>

        {error && (
          <section className="rounded-xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger">
            <div className="flex items-center gap-2">
              <TriangleAlert className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </section>
        )}

        {!hasNoJobs && (
          <JobFilters
            search={search}
            onSearchChange={setSearch}
            activeStatus={activeStatus}
            onStatusChange={setActiveStatus}
            sortBy={sortBy}
            onSortChange={setSortBy}
            counts={counts}
          />
        )}

        {isLoading && (
          <section className="rounded-xl border border-slate/15 bg-white p-10 text-center text-slate">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-3">Loading jobs...</p>
          </section>
        )}

        {!isLoading && hasNoJobs && (
          <section className="rounded-xl border border-slate/15 bg-white p-10 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-surface">
              <div className="relative h-9 w-10 rounded-md border-2 border-primary/50 bg-white">
                <div className="absolute -top-2 left-2 h-2 w-6 rounded-full border-2 border-primary/40 bg-surface" />
              </div>
            </div>
            <h2 className="font-syne text-xl font-semibold text-midnight">
              You haven&apos;t posted any jobs yet
            </h2>
            <p className="mt-1 text-slate">
              Create your first listing to start attracting talent.
            </p>
            <Link
              href="/recruiter/jobs/post"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
            >
              <PlusCircle className="h-4 w-4" />
              Post Your First Job
            </Link>
          </section>
        )}

        {!isLoading && hasNoResults && (
          <section className="rounded-xl border border-slate/15 bg-white p-10 text-center">
            <BriefcaseBusiness className="mx-auto mb-3 h-10 w-10 text-slate" />
            <h3 className="font-syne text-lg font-semibold text-midnight">
              No jobs match this filter
            </h3>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveStatus("All");
              }}
              className="mt-2 text-sm font-medium text-primary"
            >
              Clear filter
            </button>
          </section>
        )}

        {!isLoading && !hasNoJobs && !hasNoResults && (
          <section className="space-y-4">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.25 }}
              >
                <JobPostCard job={job} />
              </motion.div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
