"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, ArrowRight } from "lucide-react";
import Link from "next/link";
import SavedJobCard from "@/components/candidate/saved-jobs/SavedJobCard";
import { Job } from "@/components/candidate/jobs/JobCard";

const SORT_OPTIONS = [
  { value: "recent", label: "Recent" },
  { value: "match", label: "Match %" },
  { value: "deadline", label: "Deadline" },
];

const FILTER_TABS = ["All", "Still Open", "Deadline Soon", "Closed"];

// Mock saved jobs data
const MOCK_SAVED_JOBS: (Job & {
  savedDate: string;
  deadline?: string;
  isClosed?: boolean;
})[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    companyInitials: "TC",
    companyColor: "#1E6FFF",
    location: "Karachi, Pakistan",
    workMode: "Remote",
    salary: { min: 120, max: 180, currency: "PKR" },
    jobType: "Full-time",
    experienceLevel: "Senior Level",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL"],
    matchScore: 94,
    postedDaysAgo: 2,
    savedDate: "2 days ago",
    deadline: "2026-04-05",
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    company: "Digital Solutions",
    companyInitials: "DS",
    companyColor: "#00B37E",
    location: "Lahore, Pakistan",
    workMode: "Hybrid",
    salary: { min: 100, max: 150, currency: "PKR" },
    jobType: "Full-time",
    experienceLevel: "Mid Level",
    skills: ["Node.js", "React", "MongoDB", "AWS", "Docker"],
    matchScore: 89,
    postedDaysAgo: 3,
    savedDate: "5 days ago",
    deadline: "2026-04-10",
  },
  {
    id: "3",
    title: "UI/UX Designer",
    company: "CreativeHub",
    companyInitials: "CH",
    companyColor: "#FF9500",
    location: "Islamabad, Pakistan",
    workMode: "On-site",
    salary: { min: 80, max: 120, currency: "PKR" },
    jobType: "Full-time",
    experienceLevel: "Mid Level",
    skills: ["Figma", "Adobe XD", "User Research", "Prototyping"],
    matchScore: 87,
    postedDaysAgo: 1,
    savedDate: "1 week ago",
    deadline: "2026-04-12",
  },
  {
    id: "4",
    title: "Backend Developer",
    company: "ServerTech",
    companyInitials: "ST",
    companyColor: "#E63946",
    location: "Lahore, Pakistan",
    workMode: "Hybrid",
    salary: { min: 95, max: 145, currency: "PKR" },
    jobType: "Full-time",
    experienceLevel: "Mid Level",
    skills: ["Python", "Django", "PostgreSQL", "Redis", "Docker"],
    matchScore: 82,
    postedDaysAgo: 5,
    savedDate: "1 week ago",
    isClosed: true,
  },
  {
    id: "5",
    title: "Product Designer",
    company: "DesignStudio",
    companyInitials: "DS",
    companyColor: "#1E6FFF",
    location: "Karachi, Pakistan",
    workMode: "Hybrid",
    salary: { min: 85, max: 130, currency: "PKR" },
    jobType: "Full-time",
    experienceLevel: "Mid Level",
    skills: ["Sketch", "Figma", "Design Systems", "User Testing"],
    matchScore: 76,
    postedDaysAgo: 6,
    savedDate: "2 weeks ago",
    deadline: "2026-04-08",
  },
];

export default function SavedJobsPage() {
  const [sortBy, setSortBy] = useState("recent");
  const [activeTab, setActiveTab] = useState("All");
  const [jobs, setJobs] = useState(MOCK_SAVED_JOBS);

  const handleRemoveJob = (jobId: string) => {
    setJobs((prev) => prev.filter((job) => job.id !== jobId));
  };

  const filteredJobs = jobs.filter((job) => {
    if (activeTab === "All") return true;
    if (activeTab === "Still Open") return !job.isClosed;
    if (activeTab === "Closed") return job.isClosed;
    if (activeTab === "Deadline Soon") {
      if (!job.deadline || job.isClosed) return false;
      const deadlineDate = new Date(job.deadline);
      const today = new Date();
      const diffDays = Math.ceil(
        (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );
      return diffDays <= 7;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-midnight">
            Saved Jobs
          </h1>
          <p className="text-slate">{jobs.length} saved jobs</p>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-lg border border-slate/20 bg-white px-4 py-2 text-sm font-medium text-midnight focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              Sort by: {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl bg-white p-3 shadow-sm">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === tab
                ? "bg-primary text-white"
                : "text-midnight hover:bg-surface"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Jobs Grid or Empty State */}
      {filteredJobs.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <SavedJobCard
                job={job}
                onRemove={handleRemoveJob}
                onApply={(id) => console.log("Apply to job:", id)}
                onViewDetails={(id) => console.log("View details:", id)}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-xl bg-white p-12 text-center shadow-sm"
        >
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
            <Bookmark className="h-12 w-12 text-primary" />
          </div>
          <h3 className="mb-2 font-display text-2xl font-semibold text-midnight">
            No {activeTab.toLowerCase()} jobs
          </h3>
          <p className="mb-6 text-slate">
            {activeTab === "All"
              ? "Start saving jobs to keep track of opportunities"
              : `No jobs match the "${activeTab}" filter`}
          </p>
          <Link
            href="/jobs/explore"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary/90"
          >
            Explore Jobs
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      )}
    </div>
  );
}
