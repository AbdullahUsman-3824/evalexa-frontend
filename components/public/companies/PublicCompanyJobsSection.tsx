"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getPublicCompany,
  getPublicCompanyJobs,
  type PublicCompany,
  type PublicCompanyJob,
  type PublicCompanyJobsQuery,
  type PublicJobsPagination,
} from "@/lib/services/companyService";

const DEFAULT_LIMIT = 10;

const initialPagination: PublicJobsPagination = {
  page: 1,
  limit: DEFAULT_LIMIT,
  totalItems: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

const sortOptions: Array<NonNullable<PublicCompanyJobsQuery["sort"]>> = [
  "newest",
  "deadline",
];

function formatWorkModel(workModel: PublicCompanyJob["workModel"]): string {
  if (workModel === "ONSITE") return "On-site";
  if (workModel === "REMOTE") return "Remote";
  return "Hybrid";
}

function formatJobType(jobType: PublicCompanyJob["jobType"]): string {
  if (jobType === "FULL_TIME") return "Full-time";
  if (jobType === "PART_TIME") return "Part-time";
  return "Contract";
}

function formatDeadline(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatSalary(job: PublicCompanyJob): string {
  if (job.salaryMin === null || job.salaryMax === null) {
    return "Salary not disclosed";
  }

  return `PKR ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`;
}

type PublicCompanyJobsSectionProps = {
  companySlug: string;
};

export default function PublicCompanyJobsSection({
  companySlug,
}: PublicCompanyJobsSectionProps) {
  const [company, setCompany] = useState<PublicCompany | null>(null);
  const [items, setItems] = useState<PublicCompanyJob[]>([]);
  const [pagination, setPagination] = useState(initialPagination);
  const [search, setSearch] = useState("");
  const [jobType, setJobType] =
    useState<PublicCompanyJobsQuery["jobType"]>(undefined);
  const [workModel, setWorkModel] =
    useState<PublicCompanyJobsQuery["workModel"]>(undefined);
  const [sort, setSort] =
    useState<NonNullable<PublicCompanyJobsQuery["sort"]>>("newest");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadJobs() {
      setLoading(true);
      setError(null);

      try {
        const [companyResponse, jobsResponse] = await Promise.all([
          getPublicCompany(companySlug),
          getPublicCompanyJobs(companySlug, {
            page,
            limit: DEFAULT_LIMIT,
            search,
            jobType,
            workModel,
            sort,
          }),
        ]);

        if (!active) return;

        setCompany(companyResponse);
        setItems(jobsResponse.items);
        setPagination(jobsResponse.pagination);
      } catch (fetchError) {
        if (!active) return;

        setCompany(null);
        setItems([]);
        setPagination(initialPagination);
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load company jobs.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadJobs();

    return () => {
      active = false;
    };
  }, [companySlug, jobType, page, search, sort, workModel]);

  function resetAndUpdate(action: () => void) {
    action();
    setPage(1);
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#F7F9FC_0%,#EEF3FF_100%)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href={`/companies/${companySlug}`}
            className="text-sm font-medium text-slate-600 hover:text-slate-950"
          >
            ← Back to company
          </Link>
          <Link
            href="/companies"
            className="text-sm font-medium text-slate-600 hover:text-slate-950"
          >
            All companies
          </Link>
        </div>

        <section className="rounded-3xl border border-white/70 bg-white p-6 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.22)] sm:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
            {company?.name ?? "Company jobs"}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Open jobs
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Browse public openings and sort them by recency or deadline.
          </p>

          <div className="mt-6 grid gap-3 lg:grid-cols-[1.6fr_1fr_1fr_auto]">
            <label className="block">
              <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Search
              </span>
              <input
                value={search}
                onChange={(event) =>
                  resetAndUpdate(() => setSearch(event.target.value))
                }
                type="search"
                placeholder="Search titles and descriptions"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Job type
              </span>
              <select
                value={jobType ?? ""}
                onChange={(event) =>
                  resetAndUpdate(() =>
                    setJobType(
                      event.target.value === ""
                        ? undefined
                        : (event.target.value as NonNullable<
                            PublicCompanyJobsQuery["jobType"]
                          >),
                    ),
                  )
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              >
                <option value="">All types</option>
                <option value="FULL_TIME">Full-time</option>
                <option value="PART_TIME">Part-time</option>
                <option value="CONTRACT">Contract</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Work model
              </span>
              <select
                value={workModel ?? ""}
                onChange={(event) =>
                  resetAndUpdate(() =>
                    setWorkModel(
                      event.target.value === ""
                        ? undefined
                        : (event.target.value as NonNullable<
                            PublicCompanyJobsQuery["workModel"]
                          >),
                    ),
                  )
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              >
                <option value="">All models</option>
                <option value="ONSITE">On-site</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Sort
              </span>
              <select
                value={sort}
                onChange={(event) =>
                  resetAndUpdate(() =>
                    setSort(
                      event.target.value as NonNullable<
                        PublicCompanyJobsQuery["sort"]
                      >,
                    ),
                  )
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === "newest" ? "Newest" : "Deadline"}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        {error ? (
          <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 px-6 py-5 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="mt-6 grid gap-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-3xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <h2 className="text-xl font-semibold text-slate-950">
              No open jobs found
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Try another filter or come back later.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-5">
              {items.map((job) => (
                <article
                  key={job.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_1px_0_rgba(15,23,42,0.02)]"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-950">
                        {job.title}
                      </h2>
                      <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
                        <span className="rounded-full bg-slate-100 px-3 py-1.5">
                          📍 {job.location}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1.5">
                          💼 {formatWorkModel(job.workModel)}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1.5">
                          🏷 {formatJobType(job.jobType)}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1.5">
                          💰 {formatSalary(job)}
                        </span>
                      </div>
                    </div>

                    <div className="text-sm text-slate-500 md:text-right">
                      <p>Deadline</p>
                      <p className="mt-1 font-medium text-slate-950">
                        {formatDeadline(job.applicationDeadline)}
                      </p>
                    </div>
                  </div>
                </article>
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
