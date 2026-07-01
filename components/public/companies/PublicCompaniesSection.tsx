"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Building2, MapPin, Users } from "lucide-react";
import {
  getPublicCompanies,
  type PublicCompany,
  type PublicCompaniesPagination,
  type PublicCompaniesQuery,
} from "@/lib/services/company-service";

const DEFAULT_LIMIT = 12;

const initialPagination: PublicCompaniesPagination = {
  page: 1,
  limit: DEFAULT_LIMIT,
  totalItems: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

const sortOptions: Array<NonNullable<PublicCompaniesQuery["sort"]>> = [
  "newest",
  "name-asc",
  "name-desc",
  "jobs-high",
  "jobs-low",
];

function getCompanyInitials(company: PublicCompany): string {
  if (company.logo?.trim()) {
    return company.logo.trim().slice(0, 2).toUpperCase();
  }

  return company.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatSortLabel(
  sort: NonNullable<PublicCompaniesQuery["sort"]>,
): string {
  switch (sort) {
    case "newest":
      return "Newest";
    case "name-asc":
      return "Name: A to Z";
    case "name-desc":
      return "Name: Z to A";
    case "jobs-high":
      return "Most open jobs";
    case "jobs-low":
      return "Fewest open jobs";
  }
}

export default function PublicCompaniesSection() {
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("");
  const [sort, setSort] =
    useState<NonNullable<PublicCompaniesQuery["sort"]>>("newest");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [items, setItems] = useState<PublicCompany[]>([]);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadCompanies() {
      setLoading(true);
      setError(null);

      try {
        const response = await getPublicCompanies({
          page,
          limit,
          search,
          industry,
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
            : "Unable to load companies.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadCompanies();

    return () => {
      active = false;
    };
  }, [industry, limit, page, search, sort]);

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
            <Building2 className="h-4 w-4" />
            Browse Companies
          </p>
          <h1 className="font-display text-3xl font-bold text-midnight sm:text-4xl">
            Discover teams hiring right now
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate">
            Browse public companies, filter by industry, and sort by the signals
            that matter most to you.
          </p>
        </div>

        {/* Filters Section */}
        <div className="rounded-xl border border-slate/20 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr_1fr_auto]">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate">
                Search
              </span>
              <input
                type="search"
                value={search}
                onChange={(event) =>
                  handleFilterChange(() => setSearch(event.target.value))
                }
                placeholder="Company name, location, or description"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-midnight outline-none transition placeholder:text-slate/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate">
                Industry
              </span>
              <input
                type="text"
                value={industry}
                onChange={(event) =>
                  handleFilterChange(() => setIndustry(event.target.value))
                }
                placeholder="Software, Design, AI/ML"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-midnight outline-none transition placeholder:text-slate/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate">
                Sort
              </span>
              <select
                value={sort}
                onChange={(event) =>
                  handleFilterChange(() =>
                    setSort(
                      event.target.value as NonNullable<
                        PublicCompaniesQuery["sort"]
                      >,
                    ),
                  )
                }
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-midnight outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {formatSortLabel(option)}
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
              No companies found
            </h2>
            <p className="mt-2 text-sm text-slate">
              Try clearing filters or broadening your search terms.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((company) => (
                <Link
                  href={`/companies/${company.slug}`}
                  key={company.id}
                  className="group flex h-full flex-col rounded-2xl border border-slate/20 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                      {getCompanyInitials(company)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-sm font-semibold text-midnight">
                        {company.name}
                      </h2>
                      <p className="mt-0.5 text-xs text-slate">
                        {company.industry}
                      </p>
                    </div>
                  </div>

                  <p className="mb-3 line-clamp-2 text-xs leading-5 text-slate">
                    {company.description}
                  </p>

                  <div className="mt-auto space-y-2 border-t border-slate/10 pt-3 text-xs text-slate">
                    <p className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5" />
                      {company.location}
                    </p>
                    <p className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5" />
                      {company.companySize}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        {company.openJobsCount} jobs
                      </span>
                      <span className="font-semibold text-primary transition group-hover:translate-x-1">
                        View →
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
                companies
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
