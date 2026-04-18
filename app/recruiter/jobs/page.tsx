"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BriefcaseBusiness, PlusCircle } from "lucide-react";
import JobFilters, {
  type JobFilterStatus,
  type JobSortOption,
} from "@/components/recruiter/jobs/JobFilters";
import JobPostCard, { type JobPost } from "@/components/recruiter/jobs/JobPostCard";

const jobsData: JobPost[] = [
  {
    id: "job-1",
    title: "Senior Frontend Engineer",
    status: "Published",
    department: "Engineering",
    jobType: "Full-time",
    workMode: "Remote",
    postedDate: "2025-03-15",
    deadline: "2025-04-30",
    applicants: 42,
    newToday: 5,
    aiScreened: 38,
    shortlisted: 8,
    avgMatch: 84,
    targetApplicants: 100,
    viewCount: 234,
    shareUrl: "https://evalexa.app/jobs/job-1",
  },
  {
    id: "job-2",
    title: "Product Designer",
    status: "Published",
    department: "Design",
    jobType: "Full-time",
    workMode: "Hybrid",
    postedDate: "2025-03-20",
    deadline: "2025-04-28",
    applicants: 31,
    newToday: 2,
    aiScreened: 28,
    shortlisted: 6,
    avgMatch: 82,
    targetApplicants: 80,
    viewCount: 190,
    shareUrl: "https://evalexa.app/jobs/job-2",
  },
  {
    id: "job-3",
    title: "AI Research Intern",
    status: "Draft",
    department: "AI Lab",
    jobType: "Internship",
    workMode: "On-site",
    postedDate: "2025-03-25",
    deadline: "2025-05-09",
    applicants: 0,
    newToday: 0,
    aiScreened: 0,
    shortlisted: 0,
    avgMatch: 0,
    targetApplicants: 50,
    missingFields: ["Compensation", "Screening Questions"],
  },
  {
    id: "job-4",
    title: "HR Operations Specialist",
    status: "Published",
    department: "HR",
    jobType: "Full-time",
    workMode: "On-site",
    postedDate: "2025-03-11",
    deadline: "2025-04-18",
    applicants: 57,
    newToday: 4,
    aiScreened: 49,
    shortlisted: 13,
    avgMatch: 80,
    targetApplicants: 120,
    viewCount: 301,
    shareUrl: "https://evalexa.app/jobs/job-4",
  },
  {
    id: "job-5",
    title: "Marketing Analyst",
    status: "Draft",
    department: "Marketing",
    jobType: "Full-time",
    workMode: "Remote",
    postedDate: "2025-03-27",
    deadline: "2025-05-15",
    applicants: 0,
    newToday: 0,
    aiScreened: 0,
    shortlisted: 0,
    avgMatch: 0,
    targetApplicants: 70,
    missingFields: ["Job Description"],
  },
  {
    id: "job-6",
    title: "Data Engineer",
    status: "Published",
    department: "Data",
    jobType: "Full-time",
    workMode: "Remote",
    postedDate: "2025-03-16",
    deadline: "2025-04-21",
    applicants: 23,
    newToday: 1,
    aiScreened: 21,
    shortlisted: 4,
    avgMatch: 86,
    targetApplicants: 90,
    viewCount: 158,
    shareUrl: "https://evalexa.app/jobs/job-6",
  },
  {
    id: "job-7",
    title: "Customer Success Lead",
    status: "Closed",
    department: "Operations",
    jobType: "Full-time",
    workMode: "Hybrid",
    postedDate: "2025-02-10",
    deadline: "2025-03-22",
    applicants: 74,
    newToday: 0,
    aiScreened: 70,
    shortlisted: 12,
    avgMatch: 79,
    targetApplicants: 60,
  },
  {
    id: "job-8",
    title: "Mobile Engineer (React Native)",
    status: "Published",
    department: "Engineering",
    jobType: "Full-time",
    workMode: "Remote",
    postedDate: "2025-03-12",
    deadline: "2025-04-17",
    applicants: 36,
    newToday: 3,
    aiScreened: 32,
    shortlisted: 7,
    avgMatch: 85,
    targetApplicants: 95,
    viewCount: 210,
    shareUrl: "https://evalexa.app/jobs/job-8",
  },
];

const getStatusCounts = (jobs: JobPost[]) => {
  return {
    All: jobs.length,
    Published: jobs.filter((job) => job.status === "Published").length,
    Draft: jobs.filter((job) => job.status === "Draft").length,
    Closed: jobs.filter((job) => job.status === "Closed").length,
  };
};

export default function JobPostsPage() {
  const [jobs] = useState<JobPost[]>(jobsData);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<JobFilterStatus>("All");
  const [sortBy, setSortBy] = useState<JobSortOption>("Newest");

  const counts = useMemo(() => getStatusCounts(jobs), [jobs]);

  const filteredJobs = useMemo(() => {
    const searched = jobs.filter((job) =>
      job.title.toLowerCase().includes(search.trim().toLowerCase()),
    );

    const statusFiltered =
      activeStatus === "All"
        ? searched
        : searched.filter((job) => job.status === activeStatus);

    return [...statusFiltered].sort((a, b) => {
      if (sortBy === "Most Applicants") return b.applicants - a.applicants;
      if (sortBy === "Deadline") {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
    });
  }, [jobs, search, activeStatus, sortBy]);

  const subtitle = `${counts.All} total · ${counts.Published} published · ${counts.Draft} drafts · ${counts.Closed} closed`;
  const hasNoJobs = jobs.length === 0;
  const hasNoResults = !hasNoJobs && filteredJobs.length === 0;

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-syne text-2xl font-bold text-midnight">My Job Posts</h1>
            <p className="text-slate">{subtitle}</p>
          </div>
          <Link
            href="/recruiter/jobs/create"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            <PlusCircle className="h-4 w-4" />
            Post New Job
          </Link>
        </header>

        {!hasNoJobs && (
          <JobFilters
            search={search}
            onSearchChange={setSearch}
            activeStatus={activeStatus}
            onStatusChange={setActiveStatus}
            sortBy={sortBy}
            onSortChange={setSortBy}
            counts={counts}
          />
        )}

        {hasNoJobs && (
          <section className="rounded-xl border border-slate/15 bg-white p-10 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-surface">
              <div className="relative h-9 w-10 rounded-md border-2 border-primary/50 bg-white">
                <div className="absolute -top-2 left-2 h-2 w-6 rounded-full border-2 border-primary/40 bg-surface" />
              </div>
            </div>
            <h2 className="font-syne text-xl font-semibold text-midnight">
              You haven&apos;t posted any jobs yet
            </h2>
            <p className="mt-1 text-slate">Create your first listing to start attracting talent.</p>
            <Link
              href="/recruiter/jobs/create"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
            >
              <PlusCircle className="h-4 w-4" />
              Post Your First Job
            </Link>
          </section>
        )}

        {hasNoResults && (
          <section className="rounded-xl border border-slate/15 bg-white p-10 text-center">
            <BriefcaseBusiness className="mx-auto mb-3 h-10 w-10 text-slate" />
            <h3 className="font-syne text-lg font-semibold text-midnight">No jobs match this filter</h3>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveStatus("All");
              }}
              className="mt-2 text-sm font-medium text-primary"
            >
              Clear filter
            </button>
          </section>
        )}

        {!hasNoJobs && !hasNoResults && (
          <section className="space-y-4">
            {filteredJobs.map((job) => (
              <JobPostCard key={job.id} job={job} />
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
