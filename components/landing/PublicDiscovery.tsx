"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Building2, MapPin } from "lucide-react";
import { useGetPublicCompaniesQuery } from "@/store/api/companyApi";
import type { PublicCompany } from "@/types/company.types";

function getCompanyInitials(company: PublicCompany): string {
  return company.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function PublicDiscovery() {
  const { data, isLoading } = useGetPublicCompaniesQuery({
    limit: 3,
    sort: "jobs-high",
  });

  const companies = data?.items.slice(0, 3) ?? [];

  return (
    <section className="bg-midnight px-4 pb-6 pt-2 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan">
              Explore Opportunities
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
              See who is hiring before you log in.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-secondary">
              Browse public companies and their open positions to get a feel for
              the marketplace without leaving the landing page.
            </p>
          </div>

          <Link
            href="/companies"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:text-white"
          >
            View all companies <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-36 animate-pulse rounded-2xl border border-white/10 bg-white/5 sm:h-40"
              />
            ))
          ) : companies.length > 0 ? (
            companies.map((company) => (
              <Link
                key={company.id}
                href={`/companies/${company.slug}`}
                className="group rounded-2xl border border-white/10 bg-[#0f1726] p-4 transition hover:-translate-y-1 hover:border-primary/40 hover:bg-[#111a2b] sm:p-5"
              >
                <div className="mb-4 flex items-start gap-3 sm:gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/15 text-sm font-bold text-primary sm:h-12 sm:w-12">
                    {company.logo?.trim() ? (
                      <Image
                        src={company.logo}
                        alt={`${company.name} logo`}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs sm:text-sm">
                        {getCompanyInitials(company) || (
                          <Building2 className="h-5 w-5" />
                        )}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-white sm:text-base">
                      {company.name}
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-secondary sm:text-sm">
                      <MapPin className="h-3.5 w-3.5" />
                      {company.location}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 border-t border-white/10 pt-4 text-xs text-secondary sm:flex-row sm:items-center sm:justify-between sm:text-sm">
                  <span>{company.openJobsCount} open positions</span>
                  <span className="font-medium text-primary transition group-hover:translate-x-1">
                    Explore →
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-secondary md:col-span-3">
              Public companies will appear here once they are available.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
