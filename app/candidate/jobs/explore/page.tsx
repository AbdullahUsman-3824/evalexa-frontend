"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Grid3x3,
  List,
  SlidersHorizontal,
  X,
  Briefcase,
  Search as SearchIcon,
} from "lucide-react";
import SearchBar from "@/components/candidate/jobs/SearchBar";
import FiltersPanel, {
  Filters,
} from "@/components/candidate/jobs/FiltersPanel";
import JobsGrid from "@/components/candidate/jobs/JobsGrid";
import JobListItem from "@/components/candidate/jobs/JobListItem";
import { Job } from "@/components/candidate/jobs/JobCard";

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest" },
  { value: "salary_high", label: "Salary ↑" },
  { value: "salary_low", label: "Salary ↓" },
];

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
  {
    id: "10",
    title: "Mobile App Developer",
    company: "AppWorks",
    companyInitials: "AW",
    companyColor: "#00C2D1",
    location: "Karachi, Pakistan",
    workMode: "Remote",
    salary: { min: 100, max: 160, currency: "PKR" },
    jobType: "Full-time",
    experienceLevel: "Senior Level",
    skills: ["Swift", "Kotlin", "Flutter", "Firebase"],
    matchScore: 80,
    postedDaysAgo: 4,
  },
  {
    id: "11",
    title: "Front-End Intern",
    company: "StartupXYZ",
    companyInitials: "SX",
    companyColor: "#FF9500",
    location: "Lahore, Pakistan",
    workMode: "On-site",
    salary: { min: 30, max: 50, currency: "PKR" },
    jobType: "Internship",
    experienceLevel: "Entry Level",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    matchScore: 68,
    postedDaysAgo: 2,
  },
  {
    id: "12",
    title: "Project Manager",
    company: "Enterprise Solutions",
    companyInitials: "ES",
    companyColor: "#1E6FFF",
    location: "Islamabad, Pakistan",
    workMode: "Hybrid",
    salary: { min: 130, max: 200, currency: "PKR" },
    jobType: "Full-time",
    experienceLevel: "Senior Level",
    skills: ["Agile", "Scrum", "JIRA", "Stakeholder Management"],
    matchScore: 71,
    postedDaysAgo: 5,
  },
];

export default function ExploreJobsPage() {
  const [filters, setFilters] = useState<Filters>({
    location: "",
    jobTypes: [],
    workMode: "All",
    experienceLevels: [],
    salaryRange: { min: 0, max: 500 },
    categories: [],
    datePosted: "Any",
  });

  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 12;

  // Calculate active filter count
  const activeFilterCount =
    (filters.location ? 1 : 0) +
    filters.jobTypes.length +
    (filters.workMode !== "All" ? 1 : 0) +
    filters.experienceLevels.length +
    (filters.salaryRange.min > 0 || filters.salaryRange.max < 500 ? 1 : 0) +
    filters.categories.length +
    (filters.datePosted !== "Any" ? 1 : 0);

  // Pagination
  const totalJobs = MOCK_JOBS.length;
  const totalPages = Math.ceil(totalJobs / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = Math.min(startIndex + jobsPerPage, totalJobs);
  const currentJobs = MOCK_JOBS.slice(startIndex, endIndex);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    console.log("Search query:", query);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="rounded-xl bg-gradient-to-r from-primary/5 via-cyan/5 to-primary/5 p-6">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Layout: Filters Sidebar + Results */}
      <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block">
          <FiltersPanel
            filters={filters}
            onFiltersChange={setFilters}
            activeFilterCount={activeFilterCount}
          />
        </div>

        {/* Results Area */}
        <div className="space-y-4">
          {/* Results Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-lg font-semibold text-midnight">
                {totalJobs} jobs found
              </h2>
              {searchQuery && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  for "{searchQuery}"
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="flex items-center gap-2 rounded-lg border border-slate/20 bg-white px-3 py-2 text-sm font-medium text-midnight lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort Dropdown */}
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

              {/* View Toggle */}
              <div className="flex rounded-lg border border-slate/20 bg-white p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded p-1.5 transition ${
                    viewMode === "grid"
                      ? "bg-primary text-white"
                      : "text-slate hover:text-midnight"
                  }`}
                >
                  <Grid3x3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded p-1.5 transition ${
                    viewMode === "list"
                      ? "bg-primary text-white"
                      : "text-slate hover:text-midnight"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Jobs Display */}
          <AnimatePresence mode="wait">
            {currentJobs.length > 0 ? (
              <motion.div
                key={viewMode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {viewMode === "grid" ? (
                  <JobsGrid
                    jobs={currentJobs}
                    onSave={(id) => console.log("Save job:", id)}
                    onApply={(id) => console.log("Apply to job:", id)}
                    onViewDetails={(id) => console.log("View details:", id)}
                  />
                ) : (
                  <div className="space-y-3">
                    {currentJobs.map((job) => (
                      <JobListItem
                        key={job.id}
                        job={job}
                        onSave={(id) => console.log("Save job:", id)}
                        onApply={(id) => console.log("Apply to job:", id)}
                        onViewDetails={(id) => console.log("View details:", id)}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center rounded-xl bg-white p-12 text-center"
              >
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate/10">
                  <SearchIcon className="h-10 w-10 text-slate" />
                </div>
                <h3 className="mb-2 font-display text-xl font-semibold text-midnight">
                  No jobs found
                </h3>
                <p className="mb-6 text-slate">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={() => {
                    setFilters({
                      location: "",
                      jobTypes: [],
                      workMode: "All",
                      experienceLevels: [],
                      salaryRange: { min: 0, max: 500 },
                      categories: [],
                      datePosted: "Any",
                    });
                    setSearchQuery("");
                  }}
                  className="rounded-lg bg-primary px-6 py-2 font-semibold text-white hover:bg-primary/90"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
              <p className="text-sm text-slate">
                Showing {startIndex + 1}–{endIndex} of {totalJobs} jobs
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-slate/20 px-4 py-2 text-sm font-medium text-midnight transition hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                        currentPage === page
                          ? "bg-primary text-white"
                          : "border border-slate/20 text-midnight hover:bg-surface"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-slate/20 px-4 py-2 text-sm font-medium text-midnight transition hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 z-40 bg-midnight/50 lg:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 top-16 z-50 lg:hidden"
            >
              <FiltersPanel
                filters={filters}
                onFiltersChange={setFilters}
                activeFilterCount={activeFilterCount}
                isMobile
                onClose={() => setShowMobileFilters(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
