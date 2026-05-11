"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getPublicJobs,
  getPublicFeaturedJobs,
  type PublicJob,
  type PublicJobsPagination,
  type PublicJobsQuery,
} from "@/lib/services/jobsService";

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
  const [featured, setFeatured] = useState<PublicJob[] | null>(null);

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

  useEffect(() => {
    let active = true;

    async function loadFeatured() {
      try {
        const resp = await getPublicFeaturedJobs();
        if (!active) return;
        setFeatured(resp);
      } catch {
        // ignore featured errors
      }
    }

    void loadFeatured();

    return () => {
      active = false;
    };
  }, []);

  function handleFilterChange(updater: () => void, shouldResetPage = true) {
    updater();

    if (shouldResetPage) {
      setPage(1);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#F7F9FC_0%,#EEF3FF_100%)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.18)] backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                Jobs
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Find jobs open to external applicants.
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                Search by title, company, skills, location and more.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4 lg:min-w-[420px]">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-slate-500">Results</div>
                <div className="mt-1 text-lg font-semibold text-slate-950">
                  {loading ? "..." : pagination.totalItems}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-slate-500">Page</div>
                <div className="mt-1 text-lg font-semibold text-slate-950">
                  {pagination.page}/{Math.max(pagination.totalPages, 1)}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-slate-500">Sort</div>
                <div className="mt-1 text-lg font-semibold text-slate-950">
                  {sort}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-slate-500">Featured</div>
                <div className="mt-1 text-lg font-semibold text-slate-950">
                  {featured ? featured.length : "—"}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-[1.6fr_1fr_1fr_auto]">
            <label className="block">
              <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Search
              </span>
              <input
                type="search"
                value={search}
                onChange={(event) =>
                  handleFilterChange(() => setSearch(event.target.value))
                }
                placeholder="Job title, keywords, or skills"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Location
              </span>
              <input
                type="text"
                value={location}
                onChange={(event) =>
                  handleFilterChange(() => setLocation(event.target.value))
                }
                placeholder="City, country, or remote"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Sort
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
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Page size
              </span>
              <select
                value={limit}
                onChange={(event) =>
                  handleFilterChange(() => setLimit(Number(event.target.value)))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
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
          <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-5 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[160px] animate-pulse rounded-3xl border border-slate-200 bg-white p-6"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <h2 className="text-xl font-semibold text-slate-950">
              No jobs found
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Try clearing filters or broadening your search terms.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {items.map((job) => (
                <Link
                  href={`/jobs/${job.slug}`}
                  key={job.id}
                  className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_1px_0_rgba(15,23,42,0.02)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_20px_40px_-18px_rgba(15,23,42,0.22)]"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-950">
                        {job.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {job.company.name} • {job.location}
                      </p>
                    </div>
                    <div className="text-sm text-slate-500">{job.jobType}</div>
                  </div>

                  <p className="mb-4 line-clamp-3 text-sm leading-6 text-slate-600">
                    {job.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5 text-sm text-slate-600">
                    <span>
                      📅 Apply by{" "}
                      {new Date(job.applicationDeadline).toLocaleDateString()}
                    </span>
                    <span className="font-medium text-slate-900">View job</span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                Showing {items.length} of {pagination.totalItems} jobs
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={!pagination.hasPreviousPage}
                  onClick={() =>
                    setPage((currentPage) => Math.max(currentPage - 1, 1))
                  }
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-sm text-slate-500">
                  Page {pagination.page} of {Math.max(pagination.totalPages, 1)}
                </span>
                <button
                  type="button"
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage((currentPage) => currentPage + 1)}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
