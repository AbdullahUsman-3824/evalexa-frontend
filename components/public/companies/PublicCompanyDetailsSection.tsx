"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getPublicCompany,
  type PublicCompanyDetails,
} from "@/lib/services/companyService";

type PublicCompanyDetailsSectionProps = {
  companySlug: string;
};

function getCompanyInitials(company: PublicCompanyDetails): string {
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

export default function PublicCompanyDetailsSection({
  companySlug,
}: PublicCompanyDetailsSectionProps) {
  const [company, setCompany] = useState<PublicCompanyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadCompany() {
      setLoading(true);
      setError(null);

      try {
        const response = await getPublicCompany(companySlug);

        if (!active) return;

        setCompany(response);
      } catch (fetchError) {
        if (!active) return;

        setCompany(null);
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load company details.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadCompany();

    return () => {
      active = false;
    };
  }, [companySlug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#F7F9FC_0%,#EEF3FF_100%)] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8">
          <div className="h-8 w-48 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-6 h-32 animate-pulse rounded-3xl bg-slate-100" />
        </div>
      </main>
    );
  }

  if (error || !company) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#F7F9FC_0%,#EEF3FF_100%)] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-rose-200 bg-rose-50 px-6 py-10 text-sm text-rose-700">
          <p>{error ?? "Company not found."}</p>
          <Link
            href="/companies"
            className="mt-4 inline-block font-medium text-rose-800 underline"
          >
            Back to companies
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#F7F9FC_0%,#EEF3FF_100%)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/companies"
          className="mb-6 inline-flex text-sm font-medium text-slate-600 hover:text-slate-950"
        >
          ← Back to companies
        </Link>

        <section className="overflow-hidden rounded-3xl border border-white/70 bg-white shadow-[0_20px_60px_-24px_rgba(15,23,42,0.28)]">
          <div className="border-b border-slate-100 bg-[linear-gradient(135deg,rgba(15,23,42,0.04),rgba(14,165,233,0.08))] p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-950 via-slate-800 to-sky-700 text-2xl font-semibold text-white shadow-lg shadow-slate-200">
                {getCompanyInitials(company)}
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
                  Public company
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                  {company.name}
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  {company.industry} • {company.location}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4 sm:p-8">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Location
              </p>
              <p className="mt-2 font-semibold text-slate-950">
                {company.location}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Industry
              </p>
              <p className="mt-2 font-semibold text-slate-950">
                {company.industry}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Company size
              </p>
              <p className="mt-2 font-semibold text-slate-950">
                {company.companySize}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Open jobs
              </p>
              <p className="mt-2 font-semibold text-slate-950">
                {company.openJobsCount}
              </p>
            </div>
          </div>

          <div className="px-6 pb-6 sm:px-8 sm:pb-8">
            <p className="max-w-3xl text-sm leading-7 text-slate-600">
              {company.description ?? "No company description available."}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {company.website ? (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Visit website
                </a>
              ) : null}

              <Link
                href={`/companies/${company.slug}/jobs`}
                className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                View open jobs
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
