"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Banknote,
  Briefcase,
  Building2,
  Calendar,
  GraduationCap,
  Globe,
  MapPin,
  TrendingUp,
  Users,
} from "lucide-react";
import JobApplyHeader from "@/components/public/jobs/apply/JobApplyHeader";
import JobOverviewSection from "@/components/public/jobs/apply/JobOverviewSection";
import { getPublicJobBySlug } from "@/repositories/job.repository";
import { type PublicJob } from "@/types/job.types";
import {
  formatEducationLevel,
  formatExperienceLevel,
  formatJobType,
  formatSalary,
  formatWorkMode,
  normalizeResponsibilities,
  timeAgo,
} from "./helpers";
import JobApplicationForm, { type JobDetailData } from "./JobApplicationForm";

export default function JobDetailPage() {
  const params = useParams<{ jobSlug: string }>();
  const jobSlug =
    typeof params?.jobSlug === "string" ? params.jobSlug.trim() : "";

  const [activeTab, setActiveTab] = useState<"overview" | "application">("overview");
  const [job, setJob] = useState<PublicJob | null>(null);
  const [jobData, setJobData] = useState<JobDetailData | null>(null);
  const [error, setError] = useState("");

  const hasJobSlug = Boolean(jobSlug);

  useEffect(() => {
    if (!jobSlug) return;
    let isMounted = true;

    const loadJob = async () => {
      try {
        const fetched = (await getPublicJobBySlug(jobSlug)) as unknown as PublicJob;
        if (!isMounted) return;
        setJob(fetched);
        setJobData({
          jobId: fetched.id ?? "",
          companyId: fetched.company?.id ?? "",
          description: fetched.description ?? "",
          responsibilities: normalizeResponsibilities(fetched.responsibilities),
          requirements: [],
        });
      } catch (err: unknown) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Failed to load job.");
      }
    };

    void loadJob();
    return () => { isMounted = false; };
  }, [jobSlug]);

  if (!hasJobSlug) {
    return (
      <div className="px-4 py-10">
        <div className="rounded-[14px] border border-[#E8ECF4] bg-white p-7 text-center shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          Job slug is required.
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-10">
        <div className="rounded-[14px] border border-[#E8ECF4] bg-white p-7 text-center shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          {error}
        </div>
      </div>
    );
  }

  if (!job || !jobData) {
    return (
      <div className="px-4 py-10">
        <div className="rounded-[14px] border border-[#E8ECF4] bg-white p-7 text-center shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          Loading job details...
        </div>
      </div>
    );
  }

  const deadline = new Date(job.applicationDeadline).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const iconClass = "h-4 w-4 shrink-0 text-[#9BA3B2]";

  const jobDetailRows = [
    { label: "Salary",     value: formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod), icon: <Banknote className={iconClass} /> },
    { label: "Type",       value: formatJobType(job.jobType),                 icon: <Briefcase className={iconClass} /> },
    { label: "Mode",       value: formatWorkMode(job.workModel),              icon: <Building2 className={iconClass} /> },
    { label: "Experience", value: formatExperienceLevel(job.experienceLevel), icon: <TrendingUp className={iconClass} /> },
    { label: "Education",  value: formatEducationLevel(job.educationLevel),   icon: <GraduationCap className={iconClass} /> },
    { label: "Department", value: job.department,                             icon: <Users className={iconClass} /> },
    { label: "Location",   value: job.location,                               icon: <MapPin className={iconClass} /> },
    { label: "Openings",   value: String(job.totalOpenings),                  icon: <Users className={iconClass} /> },
    { label: "Deadline",   value: deadline,                                   icon: <Calendar className={iconClass} /> },
  ];

  return (
    <>
      {/* Header */}
      <JobApplyHeader
        companyName={job.company.name}
        applicationDeadline={job.applicationDeadline}
        companyLogo={job.company.logo}
        companyIndustry={job.company.industry}
        companyLocation={job.company.location}
        companyWebsite={job.company.website ?? ""}
        title={job.title}
        workMode={formatWorkMode(job.workModel)}
        jobType={formatJobType(job.jobType)}
        location={job.location}
        department={job.department}
        postedAt={job.createdAt ? timeAgo(job.createdAt) : null}
        totalOpenings={job.totalOpenings}
      />

      {/* Tabs */}
      <div className="border-b-2 border-[#F0F0F0] bg-white">
        <div className="mx-auto flex w-full max-w-6xl px-6">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`w-1/2 border-b-[3px] px-8 py-4 text-[13px] font-semibold tracking-[0.05em] transition ${
              activeTab === "overview"
                ? "mb-[-2px] border-[#1E6FFF] text-[#1E6FFF]"
                : "border-transparent text-[#9BA3B2] hover:text-[#6B7A99]"
            }`}
          >
            OVERVIEW
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("application")}
            className={`w-1/2 border-b-[3px] px-8 py-4 text-[13px] font-semibold tracking-[0.05em] transition ${
              activeTab === "application"
                ? "mb-[-2px] border-[#1E6FFF] text-[#1E6FFF]"
                : "border-transparent text-[#9BA3B2] hover:text-[#6B7A99]"
            }`}
          >
            APPLICATION
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-6 pb-12 pt-7">
        {activeTab === "overview" ? (
          <div className="space-y-4">

            {/* Top grid: About this role + Skills (left) | Job details (right) */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_300px] lg:items-start">

              {/* Left: description + skills */}
              <JobOverviewSection
                description={job.description}
                jobSkills={job.jobSkills}
              />

              {/* Right: Job details card */}
              <div className="flex flex-col gap-4">
                <button
                  type="button"
                  onClick={() => setActiveTab("application")}
                  className="w-full rounded-xl bg-[#1E6FFF] py-3.5 text-[14px] font-semibold text-white transition hover:bg-[#1558d6]"
                >
                  Apply now
                </button>

                <div className="rounded-[14px] border border-[#E8ECF4] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                  <p className="mb-3 text-[15px] font-bold text-[#0D1B2A]">
                    Job details
                  </p>
                  <ul>
                    {jobDetailRows.map(({ label, value, icon }) => (
                      <li
                        key={label}
                        className="flex items-start justify-between gap-3 border-b border-[#F0F0F0] py-3 text-[13px] last:border-0"
                      >
                        <span className="flex shrink-0 items-center gap-2 text-[#9BA3B2]">
                          {icon}
                          {label}
                        </span>
                        <span className="text-right font-semibold text-[#0D1B2A]">
                          {value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Full-width: About the company */}
            <div className="rounded-[14px] border border-[#E8ECF4] bg-white p-7 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              <h2 className="mb-5 border-l-4 border-[#1E6FFF] pl-3 text-[20px] font-semibold text-[#0D1B2A]">
                About the company
              </h2>

              <div className="flex items-start gap-4">
                {job.company.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={job.company.logo}
                    alt={job.company.name}
                    className="h-12 w-12 shrink-0 rounded-lg object-contain"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#EEF3FF] text-[15px] font-bold text-[#1E6FFF]">
                    {job.company.name.slice(0, 2).toUpperCase()}
                  </div>
                )}

                <div>
                  <p className="text-[15px] font-semibold text-[#0D1B2A]">
                    {job.company.name}
                  </p>
                  <p className="mt-0.5 text-[13px] text-[#9BA3B2]">
                    {job.company.industry}
                  </p>
                </div>
              </div>

              {job.company.description && (
                <p className="mt-4 text-[15px] leading-8 text-[#4A5568]">
                  {job.company.description}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-[#6B7A99]">
                {job.company.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-[#9BA3B2]" />
                    {job.company.location}
                  </span>
                )}
                {job.company.website && (
                  <Link
                    href={job.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[#1E6FFF] hover:underline"
                  >
                    <Globe className="h-4 w-4" />
                    {job.company.website.replace(/^https?:\/\//, "")}
                  </Link>
                )}
              </div>
            </div>

          </div>
        ) : (
          <JobApplicationForm jobSlug={jobSlug} jobData={jobData} />
        )}
      </main>
    </>
  );
}
