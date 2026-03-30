"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ChevronDown,
  Info,
  Target,
  TrendingUp,
  MapPin,
  Award,
} from "lucide-react";
import JobsGrid from "@/components/candidate/jobs/JobsGrid";
import { Job } from "@/components/candidate/jobs/JobCard";

const SORT_OPTIONS = [
  { value: "match", label: "Best Match" },
  { value: "newest", label: "Newest" },
  { value: "salary", label: "Salary" },
];

const FILTER_OPTIONS = ["All", "Full-time", "Remote", "Entry Level"];

const MOCK_JOBS: Job[] = [
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
  },
  {
    id: "4",
    title: "React Native Developer",
    company: "MobileFirst Co.",
    companyInitials: "MF",
    companyColor: "#00C2D1",
    location: "Karachi, Pakistan",
    workMode: "Remote",
    salary: { min: 90, max: 140, currency: "PKR" },
    jobType: "Full-time",
    experienceLevel: "Mid Level",
    skills: ["React Native", "JavaScript", "Redux", "Firebase"],
    matchScore: 85,
    postedDaysAgo: 4,
  },
  {
    id: "5",
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
  },
  {
    id: "6",
    title: "DevOps Engineer",
    company: "CloudNine",
    companyInitials: "CN",
    companyColor: "#6B7A99",
    location: "Islamabad, Pakistan",
    workMode: "Remote",
    salary: { min: 110, max: 170, currency: "PKR" },
    jobType: "Full-time",
    experienceLevel: "Senior Level",
    skills: ["Kubernetes", "AWS", "CI/CD", "Terraform", "Jenkins"],
    matchScore: 78,
    postedDaysAgo: 3,
  },
  {
    id: "7",
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
  },
  {
    id: "8",
    title: "Data Analyst",
    company: "DataInsights",
    companyInitials: "DI",
    companyColor: "#00B37E",
    location: "Lahore, Pakistan",
    workMode: "On-site",
    salary: { min: 70, max: 110, currency: "PKR" },
    jobType: "Full-time",
    experienceLevel: "Entry Level",
    skills: ["Python", "SQL", "Tableau", "Excel", "Statistics"],
    matchScore: 74,
    postedDaysAgo: 7,
  },
  {
    id: "9",
    title: "QA Engineer",
    company: "QualityFirst",
    companyInitials: "QF",
    companyColor: "#FF9500",
    location: "Islamabad, Pakistan",
    workMode: "Remote",
    salary: { min: 75, max: 115, currency: "PKR" },
    jobType: "Full-time",
    experienceLevel: "Mid Level",
    skills: ["Selenium", "Jest", "Cypress", "API Testing"],
    matchScore: 72,
    postedDaysAgo: 8,
  },
];

export default function RecommendedJobsPage() {
  const [sortBy, setSortBy] = useState("match");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isExplanationExpanded, setIsExplanationExpanded] = useState(false);
  const [visibleJobs, setVisibleJobs] = useState(9);

  const handleLoadMore = () => {
    setVisibleJobs((prev) => Math.min(prev + 6, MOCK_JOBS.length));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <motion.div
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan/20"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Sparkles className="h-6 w-6 text-cyan" />
        </motion.div>
        <div>
          <h1 className="font-display text-3xl font-bold text-midnight">
            Recommended For You
          </h1>
          <p className="text-slate">
            AI-matched jobs based on your profile and resume
          </p>
        </div>
      </div>

      {/* AI Match Explanation Banner */}
      <motion.div
        className="rounded-xl border-l-4 border-cyan bg-white p-5 shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => setIsExplanationExpanded(!isExplanationExpanded)}
          className="flex w-full items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-cyan" />
            <h3 className="font-semibold text-midnight">
              How are matches calculated?
            </h3>
          </div>
          <motion.div
            animate={{ rotate: isExplanationExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-5 w-5 text-slate" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isExplanationExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="flex gap-3">
                  <Target className="h-8 w-8 flex-shrink-0 text-cyan" />
                  <div>
                    <h4 className="font-semibold text-midnight">
                      Skills Match
                    </h4>
                    <p className="text-sm text-slate">
                      We analyze your technical skills and match them with job
                      requirements
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Award className="h-8 w-8 flex-shrink-0 text-cyan" />
                  <div>
                    <h4 className="font-semibold text-midnight">
                      Experience Level
                    </h4>
                    <p className="text-sm text-slate">
                      Jobs aligned with your years of experience and seniority
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin className="h-8 w-8 flex-shrink-0 text-cyan" />
                  <div>
                    <h4 className="font-semibold text-midnight">
                      Location Preferences
                    </h4>
                    <p className="text-sm text-slate">
                      Based on your preferred work mode and location settings
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Filter and Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {FILTER_OPTIONS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeFilter === filter
                  ? "bg-primary text-white"
                  : "bg-surface text-midnight hover:bg-primary/10"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-slate/20 bg-white px-3 py-2 text-sm font-medium text-midnight focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      <JobsGrid
        jobs={MOCK_JOBS.slice(0, visibleJobs)}
        onSave={(id) => console.log("Save job:", id)}
        onApply={(id) => console.log("Apply to job:", id)}
        onViewDetails={(id) => console.log("View job details:", id)}
      />

      {/* Load More Button */}
      {visibleJobs < MOCK_JOBS.length && (
        <div className="flex justify-center">
          <motion.button
            onClick={handleLoadMore}
            className="rounded-xl border-2 border-primary bg-white px-8 py-3 font-semibold text-primary transition hover:bg-primary hover:text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Load More Jobs
          </motion.button>
        </div>
      )}

      {/* Stats Footer */}
      <div className="rounded-xl bg-gradient-to-r from-primary/10 via-cyan/10 to-primary/10 p-6 text-center">
        <div className="flex items-center justify-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <p className="text-sm font-medium text-midnight">
            <span className="font-bold">
              {MOCK_JOBS.filter((j) => j.matchScore >= 85).length}
            </span>{" "}
            highly matched jobs •{" "}
            <span className="font-bold">{MOCK_JOBS.length}</span> total
            recommendations
          </p>
        </div>
      </div>
    </div>
  );
}
