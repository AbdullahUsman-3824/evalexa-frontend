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
  type JobTypeFilter,
  type WorkModelFilter,
  type DeadlineFilter,
} from "@/components/recruiter/jobs/JobFilters";
import JobsTable from "@/components/recruiter/jobs/JobsTable";
import JobsCardList from "@/components/recruiter/jobs/JobsCardList";
import { formatJobStatus, getJobs } from "@/repositories/job.repository";
import {
  JobListRecord,
  JobQuery,
  BackendJobType,
  BackendWorkModel,
  JobSortBy,
} from "@/types/job.types";

// UI label -> backend enum mappings (JobListRecord/backend don't speak "Full Time")
const jobTypeMap: Record<Exclude<JobTypeFilter, "All">, BackendJobType> = {
  "Full Time": "FULL_TIME",
  "Part Time": "PART_TIME",
  Contract: "CONTRACT",
};

const workModelMap: Record<
  Exclude<WorkModelFilter, "All">,
  BackendWorkModel
> = {
  "On-site": "ONSITE",
  Remote: "REMOTE",
  Hybrid: "HYBRID",
};

const sortMap: Record<JobSortOption, JobSortBy> = {
  Newest: "newest",
  Deadline: "deadline",
};

function getStatusCounts(jobs: JobListRecord[]) {
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
  const [jobs, setJobs] = useState<JobListRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [activeStatus, setActiveStatus] = useState<JobFilterStatus>("All");
  const [sortBy, setSortBy] = useState<JobSortOption>("Newest");

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [jobType, setJobType] = useState<JobTypeFilter>("All");
  const [workModel, setWorkModel] = useState<WorkModelFilter>("All");
  const [deadlineFilter, setDeadlineFilter] = useState<DeadlineFilter>("All");

  // view mode: table on desktop, cards on mobile, overridable by user
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [userOverrodeViewMode, setUserOverrodeViewMode] = useState(false);

  useEffect(() => {
    if (userOverrodeViewMode) return;

    const mql = window.matchMedia("(min-width: 1024px)");
    const applyDefault = () => setViewMode(mql.matches ? "table" : "cards");

    applyDefault();
    mql.addEventListener("change", applyDefault);
    return () => mql.removeEventListener("change", applyDefault);
  }, [userOverrodeViewMode]);

  const handleViewModeChange = (mode: "table" | "cards") => {
    setViewMode(mode);
    setUserOverrodeViewMode(true);
  };

  // debounce search so we don't refetch on every keystroke
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timeout);
  }, [search]);

  // build the backend query — status/deadline are NOT included here,
  // they're applied client-side below so status counts stay accurate
  const backendQuery: JobQuery = useMemo(
    () => ({
      search: debouncedSearch.trim() || undefined,
      jobType: jobType !== "All" ? jobTypeMap[jobType] : undefined,
      workModel: workModel !== "All" ? workModelMap[workModel] : undefined,
      sortBy: sortMap[sortBy],
    }),
    [debouncedSearch, jobType, workModel, sortBy],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadJobs() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getJobs(backendQuery);

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
  }, [backendQuery]);

  // counts reflect the current search/jobType/workModel filters,
  // broken down by status — same pattern as before
  const counts = useMemo(() => getStatusCounts(jobs), [jobs]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (jobType !== "All") count += 1;
    if (workModel !== "All") count += 1;
    if (deadlineFilter !== "All") count += 1;
    return count;
  }, [jobType, workModel, deadlineFilter]);

  // status + deadline are applied here, client-side, on top of the
  // already backend-filtered `jobs`. Backend already sorted the list,
  // so no re-sort needed.
  const filteredJobs = useMemo(() => {
    const statusFiltered =
      activeStatus === "All"
        ? jobs
        : jobs.filter((job) => formatJobStatus(job.status) === activeStatus);

    if (deadlineFilter === "All") return statusFiltered;

    const now = new Date();
    return statusFiltered.filter((job) => {
      const isExpired = new Date(job.applicationDeadline) < now;
      return deadlineFilter === "Expired" ? isExpired : !isExpired;
    });
  }, [jobs, activeStatus, deadlineFilter]);

  const hasActiveFilters =
    search.trim() !== "" ||
    activeStatus !== "All" ||
    jobType !== "All" ||
    workModel !== "All" ||
    deadlineFilter !== "All";

  const hasNoJobs = !hasActiveFilters && jobs.length === 0;
  const hasNoResults =
    filteredJobs.length === 0 && (hasActiveFilters || jobs.length > 0);

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-syne text-2xl font-bold text-midnight">
              My Job Posts
            </h1>
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
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            activeStatus={activeStatus}
            onStatusChange={setActiveStatus}
            sortBy={sortBy}
            onSortChange={setSortBy}
            counts={counts}
            showAdvanced={showAdvanced}
            onToggleAdvanced={() => setShowAdvanced((prev) => !prev)}
            jobType={jobType}
            onJobTypeChange={setJobType}
            workModel={workModel}
            onWorkModelChange={setWorkModel}
            deadline={deadlineFilter}
            onDeadlineChange={setDeadlineFilter}
            activeFilterCount={activeFilterCount}
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
                setJobType("All");
                setWorkModel("All");
                setDeadlineFilter("All");
              }}
              className="mt-2 text-sm font-medium text-primary"
            >
              Clear filter
            </button>
          </section>
        )}

        {!isLoading && !hasNoJobs && !hasNoResults && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {viewMode === "table" ? (
              <JobsTable jobs={filteredJobs} />
            ) : (
              <JobsCardList jobs={filteredJobs} />
            )}
          </motion.section>
        )}
      </div>
    </div>
  );
}
