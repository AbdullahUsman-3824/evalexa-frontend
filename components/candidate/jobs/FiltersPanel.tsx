"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  MapPin,
  Search,
  X,
  SlidersHorizontal,
} from "lucide-react";

export interface Filters {
  location: string;
  jobTypes: string[];
  workMode: "All" | "On-site" | "Remote" | "Hybrid";
  experienceLevels: string[];
  salaryRange: { min: number; max: number };
  categories: string[];
  datePosted: "Any" | "Past 24h" | "Past week" | "Past month";
}

interface FiltersPanelProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  activeFilterCount?: number;
  isMobile?: boolean;
  onClose?: () => void;
}

const jobTypeOptions = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
];

const experienceLevelOptions = [
  "Entry Level (0–2 yrs)",
  "Mid Level (2–5 yrs)",
  "Senior Level (5+ yrs)",
];

const categoryOptions = [
  "Technology",
  "Design",
  "Marketing",
  "Finance",
  "HR",
  "Others",
];

export default function FiltersPanel({
  filters,
  onFiltersChange,
  activeFilterCount = 0,
  isMobile = false,
  onClose,
}: FiltersPanelProps) {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    location: true,
    jobType: true,
    workMode: true,
    experience: true,
    salary: true,
    category: true,
    datePosted: true,
  });

  const [categorySearch, setCategorySearch] = useState("");

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleClearAll = () => {
    onFiltersChange({
      location: "",
      jobTypes: [],
      workMode: "All",
      experienceLevels: [],
      salaryRange: { min: 0, max: 500 },
      categories: [],
      datePosted: "Any",
    });
  };

  const handleJobTypeToggle = (type: string) => {
    const newTypes = filters.jobTypes.includes(type)
      ? filters.jobTypes.filter((t) => t !== type)
      : [...filters.jobTypes, type];
    onFiltersChange({ ...filters, jobTypes: newTypes });
  };

  const handleExperienceToggle = (level: string) => {
    const newLevels = filters.experienceLevels.includes(level)
      ? filters.experienceLevels.filter((l) => l !== level)
      : [...filters.experienceLevels, level];
    onFiltersChange({ ...filters, experienceLevels: newLevels });
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const filteredCategories = categoryOptions.filter((cat) =>
    cat.toLowerCase().includes(categorySearch.toLowerCase()),
  );

  return (
    <div
      className={`${
        isMobile
          ? "fixed inset-x-0 bottom-0 top-16 z-50 bg-white"
          : "sticky top-24 h-fit"
      } overflow-y-auto rounded-xl border border-slate/15 bg-white p-5 shadow-sm`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate/10 pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-midnight" />
          <h3 className="font-display text-lg font-semibold text-midnight">
            Filters
          </h3>
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </div>
        <button
          onClick={handleClearAll}
          className="text-sm font-semibold text-primary hover:text-primary/80"
        >
          Clear All
        </button>
        {isMobile && onClose && (
          <button onClick={onClose} className="text-slate hover:text-midnight">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="mt-4 space-y-4">
        {/* Location */}
        <FilterSection
          title="Location"
          isExpanded={expandedSections.location}
          onToggle={() => toggleSection("location")}
        >
          <div className="relative">
            <input
              type="text"
              value={filters.location}
              onChange={(e) =>
                onFiltersChange({ ...filters, location: e.target.value })
              }
              placeholder="City or country..."
              className="w-full rounded-lg border border-slate/20 py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
          </div>
          <button className="mt-2 flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80">
            <MapPin className="h-4 w-4" />
            Use my location
          </button>
        </FilterSection>

        {/* Job Type */}
        <FilterSection
          title="Job Type"
          isExpanded={expandedSections.jobType}
          onToggle={() => toggleSection("jobType")}
        >
          <div className="space-y-2">
            {jobTypeOptions.map((type) => (
              <label
                key={type}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.jobTypes.includes(type)}
                  onChange={() => handleJobTypeToggle(type)}
                  className="h-4 w-4 rounded border-slate/40 text-primary focus:ring-primary"
                />
                <span className="text-sm text-midnight">{type}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Work Mode */}
        <FilterSection
          title="Work Mode"
          isExpanded={expandedSections.workMode}
          onToggle={() => toggleSection("workMode")}
        >
          <div className="grid grid-cols-3 gap-2">
            {(["On-site", "Remote", "Hybrid"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    workMode: filters.workMode === mode ? "All" : mode,
                  })
                }
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  filters.workMode === mode
                    ? "border-primary bg-primary text-white"
                    : "border-slate/20 text-midnight hover:border-primary hover:bg-primary/5"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Experience Level */}
        <FilterSection
          title="Experience Level"
          isExpanded={expandedSections.experience}
          onToggle={() => toggleSection("experience")}
        >
          <div className="space-y-2">
            {experienceLevelOptions.map((level) => (
              <label
                key={level}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.experienceLevels.includes(level)}
                  onChange={() => handleExperienceToggle(level)}
                  className="h-4 w-4 rounded border-slate/40 text-primary focus:ring-primary"
                />
                <span className="text-sm text-midnight">{level}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Salary Range */}
        <FilterSection
          title="Salary Range"
          isExpanded={expandedSections.salary}
          onToggle={() => toggleSection("salary")}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-semibold text-midnight">
              <span>PKR {filters.salaryRange.min}K</span>
              <span>PKR {filters.salaryRange.max}K</span>
            </div>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="500"
                value={filters.salaryRange.min}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    salaryRange: {
                      ...filters.salaryRange,
                      min: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full accent-primary"
              />
              <input
                type="range"
                min="0"
                max="500"
                value={filters.salaryRange.max}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    salaryRange: {
                      ...filters.salaryRange,
                      max: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full accent-primary"
              />
            </div>
          </div>
        </FilterSection>

        {/* Category */}
        <FilterSection
          title="Category"
          isExpanded={expandedSections.category}
          onToggle={() => toggleSection("category")}
        >
          <div className="relative mb-3">
            <input
              type="text"
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full rounded-lg border border-slate/20 py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filteredCategories.map((category) => (
              <label
                key={category}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                  className="h-4 w-4 rounded border-slate/40 text-primary focus:ring-primary"
                />
                <span className="text-sm text-midnight">{category}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Date Posted */}
        <FilterSection
          title="Date Posted"
          isExpanded={expandedSections.datePosted}
          onToggle={() => toggleSection("datePosted")}
        >
          <div className="space-y-2">
            {(["Any", "Past 24h", "Past week", "Past month"] as const).map(
              (period) => (
                <label
                  key={period}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="datePosted"
                    checked={filters.datePosted === period}
                    onChange={() =>
                      onFiltersChange({ ...filters, datePosted: period })
                    }
                    className="h-4 w-4 border-slate/40 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-midnight">{period}</span>
                </label>
              ),
            )}
          </div>
        </FilterSection>
      </div>

      {/* Apply Button */}
      <button className="mt-6 w-full rounded-xl bg-primary py-3 font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary/90">
        Apply Filters
      </button>
    </div>
  );
}

// FilterSection Component
function FilterSection({
  title,
  isExpanded,
  onToggle,
  children,
}: {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-slate/10 pb-4">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left"
      >
        <h4 className="font-semibold text-midnight">{title}</h4>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-slate" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
