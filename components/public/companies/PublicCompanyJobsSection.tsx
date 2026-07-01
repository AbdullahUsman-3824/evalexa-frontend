"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  CalendarDays,
} from "lucide-react";
import {
  getPublicCompany,
  getPublicCompanyJobs,
  type PublicCompany,
  type PublicCompanyJob,
  type PublicCompanyJobsQuery,
  type PublicJobsPagination,
} from "@/lib/services/company-service";

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
    <main className="min-h-screen bg-surface px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <div className="flex items-center justify-between gap-4">
          <Link
            href={`/companies/${companySlug}`}
            className="text-sm font-medium text-slate hover:text-midnight"
          >
            ← Back to company
          </Link>
          <Link
            href="/companies"
            className="text-sm font-medium text-slate hover:text-midnight"
          >
            All companies
          </Link>
        </div>

        <section className="rounded-xl border border-slate/20 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">
            {company?.name ?? "Company jobs"}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-midnight">Open jobs</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate">
            Browse public openings and sort them by recency or deadline.
          </p>

          <div className="mt-6 grid gap-3 lg:grid-cols-[1.6fr_1fr_1fr_auto]">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate">
                Search
              </span>
              <input
                value={search}
                onChange={(event) =>
                  resetAndUpdate(() => setSearch(event.target.value))
                }
                type="search"
                placeholder="Search titles and descriptions"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-midnight outline-none transition placeholder:text-slate/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate">
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
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-midnight outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">All types</option>
                <option value="FULL_TIME">Full-time</option>
                <option value="PART_TIME">Part-time</option>
                <option value="CONTRACT">Contract</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate">
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
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-midnight outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">All models</option>
                <option value="ONSITE">On-site</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate">
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
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-midnight outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
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
          <div className="rounded-xl border border-danger/20 bg-danger/5 px-6 py-5 text-sm text-danger">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="mt-6 grid gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <h2 className="text-lg font-semibold text-midnight">
              No open jobs found
            </h2>
            <p className="mt-2 text-sm text-slate">
              Try another filter or come back later.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-4">
              {items.map((job) => (
                <Link
                  href={`/jobs/${job.slug}`}
                  key={job.id}
                  className="group rounded-2xl border border-slate/20 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="text-sm font-semibold text-midnight">
                        {job.title}
                      </h2>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-primary">
                          <MapPin className="h-3.5 w-3.5" />
                          {job.location}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-cyan/10 px-2.5 py-1 text-cyan">
                          <Briefcase className="h-3.5 w-3.5" />
                          {formatWorkModel(job.workModel)}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate/10 px-2.5 py-1 text-slate">
                          <Clock className="h-3.5 w-3.5" />
                          {formatJobType(job.jobType)}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-success">
                          <DollarSign className="h-3.5 w-3.5" />
                          {formatSalary(job)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-3 md:items-end md:pt-2">
                      <div className="text-xs text-slate flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        <p className="font-semibold text-midnight">
                          {formatDeadline(job.applicationDeadline)}
                        </p>
                      </div>
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
