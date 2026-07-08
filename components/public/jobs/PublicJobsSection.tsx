"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MapPin, DollarSign, CalendarDays, Search } from "lucide-react";
import { getPublicJobs } from "@/repositories/job.repository";
import {
  PublicJob,
  PublicJobsPagination,
  PublicJobsQuery,
} from "@/types/job.types";

const DEFAULT_LIMIT = 12;

const initialPagination: PublicJobsPagination = {
  page: 1,
  limit: DEFAULT_LIMIT,
  totalItems: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

const sortOptions: Array<NonNullable<PublicJobsQuery["sort"]>> = [
  "newest",
  "oldest",
  "deadline",
  "salary-high",
  "salary-low",
];

export default function PublicJobsSection() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const employmentType: PublicJobsQuery["employmentType"] | undefined =
    undefined;
  const experienceLevel: PublicJobsQuery["experienceLevel"] | undefined =
    undefined;
  const [sort, setSort] =
    useState<NonNullable<PublicJobsQuery["sort"]>>("newest");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [items, setItems] = useState<PublicJob[]>([]);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadJobs() {
      setLoading(true);
      setError(null);

      try {
        const response = await getPublicJobs({
          page,
          limit,
          search,
          location,
          employmentType,
          experienceLevel,
          sort,
        });

        if (!active) return;

        setItems(response.items);
        setPagination(response.pagination);
      } catch (fetchError) {
        if (!active) return;

        setItems([]);
        setPagination(initialPagination);
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load jobs.",
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadJobs();

    return () => {
      active = false;
    };
  }, [employmentType, experienceLevel, limit, page, search, sort, location]);

  function handleFilterChange(updater: () => void, shouldResetPage = true) {
    updater();

    if (shouldResetPage) {
      setPage(1);
    }
  }

  return (
    <main className="min-h-screen bg-surface px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-5">
        {/* Header Section */}
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate">
            <Search className="h-4 w-4" />
            Browse Jobs
          </p>
          <h1 className="font-display text-3xl font-bold text-midnight sm:text-4xl">
            Discover your next opportunity
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate">
            Search by title, company, skills, location and more. Find roles that
            match your profile.
          </p>
        </div>

        {/* Filters Section */}
        <div className="rounded-xl border border-slate/20 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr_1fr_auto]">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate">
                Search Jobs
              </span>
              <input
                type="search"
                value={search}
                onChange={(event) =>
                  handleFilterChange(() => setSearch(event.target.value))
                }
                placeholder="Job title, keywords, or skills"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-midnight outline-none transition placeholder:text-slate/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate">
                Location
              </span>
              <input
                type="text"
                value={location}
                onChange={(event) =>
                  handleFilterChange(() => setLocation(event.target.value))
                }
                placeholder="City, country, or remote"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-midnight outline-none transition placeholder:text-slate/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate">
                Sort By
              </span>
              <select
                value={sort}
                onChange={(event) =>
                  handleFilterChange(() =>
                    setSort(
                      event.target.value as NonNullable<
                        PublicJobsQuery["sort"]
                      >,
                    ),
                  )
                }
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-midnight outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.replace("-", " ")}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate">
                Per Page
              </span>
              <select
                value={limit}
                onChange={(event) =>
                  handleFilterChange(() => setLimit(Number(event.target.value)))
                }
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-midnight outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {[12, 24, 36, 50].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {error ? (
          <div className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
            <strong>Error:</strong> {error}
          </div>
        ) : null}

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[200px] animate-pulse rounded-xl border border-slate-200 bg-white p-4"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <h2 className="text-lg font-semibold text-midnight">
              No jobs found
            </h2>
            <p className="mt-2 text-sm text-slate">
              Try clearing filters or broadening your search terms.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((job) => (
                <Link
                  href={`/jobs/${job.slug}`}
                  key={job.id}
                  className="group flex h-full flex-col rounded-2xl border border-slate/20 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-midnight">
                        {job.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate">
                        {job.company.name}
                      </p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      {job.jobType}
                    </span>
                  </div>

                  <p className="mb-3 line-clamp-2 text-xs leading-5 text-slate">
                    {job.description}
                  </p>

                  <div className="mt-auto space-y-2 border-t border-slate/10 pt-3">
                    <div className="flex flex-wrap gap-2 text-xs text-slate">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5" />
                        {job.salaryMin && job.salaryMax
                          ? `${job.salaryMin}-${job.salaryMax}`
                          : "Negotiable"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-slate">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {new Date(job.applicationDeadline).toLocaleDateString()}
                      </span>
                      <span className="font-semibold text-primary transition group-hover:translate-x-1">
                        Explore →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-4 rounded-xl border border-slate/20 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-medium text-slate">
                Showing{" "}
                <span className="text-midnight font-semibold">
                  {items.length}
                </span>{" "}
                of{" "}
                <span className="text-midnight font-semibold">
                  {pagination.totalItems}
                </span>{" "}
                jobs
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!pagination.hasPreviousPage}
                  onClick={() =>
                    setPage((currentPage) => Math.max(currentPage - 1, 1))
                  }
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-midnight transition hover:border-primary hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ← Previous
                </button>
                <span className="text-xs font-medium text-slate">
                  Page{" "}
                  <span className="text-midnight font-semibold">
                    {pagination.page}
                  </span>{" "}
                  of{" "}
                  <span className="text-midnight font-semibold">
                    {Math.max(pagination.totalPages, 1)}
                  </span>
                </span>
                <button
                  type="button"
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage((currentPage) => currentPage + 1)}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-midnight transition hover:border-primary hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
