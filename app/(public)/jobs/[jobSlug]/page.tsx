"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import JobApplyHeader from "@/components/public/jobs/apply/JobApplyHeader";
import JobOverviewSection from "@/components/public/jobs/apply/JobOverviewSection";
import { getPublicJobBySlug } from "@/repositories/job.repository";
import JobApplicationForm, { type JobDetailData } from "./JobApplicationForm";

function normalizeResponsibilities(responsibilities?: string | string[]) {
  if (Array.isArray(responsibilities)) {
    return responsibilities.map((item) => item.trim()).filter(Boolean);
  }
  if (typeof responsibilities === "string") {
    return responsibilities
      .split(/\r?\n/)
      .map((item) => item.replace(/^[-*\u2022]\s*/, "").trim())
      .filter(Boolean);
  }
  return [];
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const past = new Date(dateStr);
  const diffMs = now.getTime() - past.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Posted today";
  if (diffDays === 1) return "Posted 1 day ago";
  if (diffDays < 7) return `Posted ${diffDays} days ago`;
  if (diffDays < 14) return "Posted 1 week ago";
  if (diffDays < 30) return `Posted ${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 60) return "Posted 1 month ago";
  return `Posted ${Math.floor(diffDays / 30)} months ago`;
}

function formatWorkMode(workModel: string): string {
  switch (workModel) {
    case "ONSITE": return "On-site";
    case "REMOTE": return "Remote";
    case "HYBRID": return "Hybrid";
    default: return workModel;
  }
}

function formatJobType(jobType: string): string {
  switch (jobType) {
    case "FULL_TIME": return "Full-time";
    case "PART_TIME": return "Part-time";
    case "CONTRACT": return "Contract";
    default: return jobType;
  }
}

function formatExperienceLevel(level: string): string {
  switch (level) {
    case "JUNIOR": return "Junior";
    case "MID": return "Mid-level";
    case "SENIOR": return "Senior";
    case "LEAD": return "Lead";
    default: return level;
  }
}

function formatEducationLevel(level: string): string {
  switch (level) {
    case "BACHELOR": return "Bachelor's degree";
    case "MASTER": return "Master's degree";
    case "PHD": return "PhD";
    case "HIGH_SCHOOL": return "High school";
    default: return level;
  }
}

function formatSalary(
  min: number,
  max: number,
  currency: string,
  period: string,
): string {
  const fmt = (n: number) => n.toLocaleString();
  const per = period === "MONTHLY" ? "/mo" : "/yr";
  return `${currency} ${fmt(min)} – ${fmt(max)}${per}`;
}

/* ---------- Icons for job detail rows ---------- */
const DetailIcon = ({ path }: { path: string }) => (
  <svg
    className="h-4 w-4 shrink-0 text-[#9BA3B2]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={path} />
  </svg>
);

const ICONS = {
  salary: "M2 8h20M2 8v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8M2 8l2-4h16l2 4M8 14h.01",
  type: "M8 2v3M16 2v3M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z",
  mode: "M4 22V8l8-5 8 5v14M4 22h16M9 22v-6h6v6M9 12h.01M15 12h.01M9 16h.01M15 16h.01",
  experience: "M3 21h18M6 21V10M12 21V6M18 21v-8",
  education: "M22 10 12 5 2 10l10 5 10-5zM6 12v5c0 1 3 3 6 3s6-2 6-3v-5",
  department: "M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  location: "M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  openings: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  deadline: "M8 2v3M16 2v3M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z",
};

interface PublicJob {
  id: string;
  title: string;
  slug: string;
  department: string;
  description: string;
  responsibilities?: string | string[];
  jobType: string;
  experienceLevel: string;
  educationLevel: string;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  salaryPeriod: string;
  location: string;
  workModel: string;
  applicationDeadline: string;
  totalOpenings: number;
  createdAt?: string;
  company: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    banner: string | null;
    industry: string;
    size: string;
    type: string;
    website: string;
    location: string;
    description: string;
  };
  jobSkills: {
    importance: string;
    weight: number;
    skill: {
      id: string;
      name: string;
      category: string;
    };
  }[];
}

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

  const jobDetailRows = [
    { label: "Salary", value: formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod), icon: ICONS.salary },
    { label: "Type", value: formatJobType(job.jobType), icon: ICONS.type },
    { label: "Mode", value: formatWorkMode(job.workModel), icon: ICONS.mode },
    { label: "Experience", value: formatExperienceLevel(job.experienceLevel), icon: ICONS.experience },
    { label: "Education", value: formatEducationLevel(job.educationLevel), icon: ICONS.education },
    { label: "Department", value: job.department, icon: ICONS.department },
    { label: "Location", value: job.location, icon: ICONS.location },
    { label: "Openings", value: String(job.totalOpenings), icon: ICONS.openings },
    { label: "Deadline", value: deadline, icon: ICONS.deadline },
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
        companyWebsite={job.company.website}
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
                          <DetailIcon path={icon} />
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
                    <DetailIcon path={ICONS.location} />
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
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
                    </svg>
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