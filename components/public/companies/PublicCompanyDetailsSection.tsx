"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MapPin, Briefcase, Users, Zap } from "lucide-react";
import {
  getPublicCompany,
  type PublicCompanyDetails,
} from "@/lib/services/company-service";

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
      <main className="min-h-screen bg-surface px-6 py-8">
        <div className="mx-auto max-w-6xl rounded-xl border border-slate/20 bg-white p-6 shadow-sm">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-6 h-32 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </main>
    );
  }

  if (error || !company) {
    return (
      <main className="min-h-screen bg-surface px-6 py-8">
        <div className="mx-auto max-w-6xl rounded-xl border border-danger/20 bg-danger/5 px-6 py-10 text-sm text-danger">
          <p>{error ?? "Company not found."}</p>
          <Link
            href="/companies"
            className="mt-4 inline-block font-medium text-danger underline"
          >
            Back to companies
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/companies"
          className="mb-6 inline-flex text-sm font-medium text-slate hover:text-midnight"
        >
          ← Back to companies
        </Link>

        <section className="overflow-hidden rounded-2xl border border-slate/20 bg-white shadow-sm">
          <div className="border-b border-slate/10 bg-surface p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xl font-semibold text-primary">
                {getCompanyInitials(company)}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">
                  Company Profile
                </p>
                <h1 className="mt-2 text-3xl font-bold text-midnight">
                  {company.name}
                </h1>
                <p className="mt-1 text-sm text-slate">
                  {company.industry} • {company.location}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4 sm:p-8">
            <div className="rounded-xl border border-slate/10 bg-surface p-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">
                  Location
                </p>
              </div>
              <p className="mt-2 font-semibold text-midnight">
                {company.location}
              </p>
            </div>
            <div className="rounded-xl border border-slate/10 bg-surface p-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-slate" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">
                  Industry
                </p>
              </div>
              <p className="mt-2 font-semibold text-midnight">
                {company.industry}
              </p>
            </div>
            <div className="rounded-xl border border-slate/10 bg-surface p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-slate" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">
                  Company size
                </p>
              </div>
              <p className="mt-2 font-semibold text-midnight">
                {company.size}
              </p>
            </div>
            <div className="rounded-xl border border-slate/10 bg-surface p-4">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-slate" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">
                  Open jobs
                </p>
              </div>
              <p className="mt-2 font-semibold text-midnight">
                {company.openJobsCount}
              </p>
            </div>
          </div>

          <div className="px-6 pb-6 sm:px-8 sm:pb-8">
            <p className="max-w-3xl text-sm leading-7 text-slate">
              {company.description ?? "No company description available."}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {company.website ? (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
                >
                  Visit website
                </a>
              ) : null}

              <Link
                href={`/companies/${company.slug}/jobs`}
                className="inline-flex items-center rounded-lg border border-slate/20 px-4 py-2 text-sm font-medium text-midnight transition hover:border-primary/30 hover:bg-primary/5"
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
