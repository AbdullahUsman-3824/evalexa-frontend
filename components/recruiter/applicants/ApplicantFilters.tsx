"use client";

import {
  ChevronDown,
  Search,
  Table2,
  LayoutGrid,
  X,
  Filter,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { ApplicantStatus } from "./CandidateCard";

export type ApplicantSortOption =
  | "AI Match (High→Low)"
  | "Newest"
  | "Resume Score"
  | "Experience";

interface ApplicantFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  viewMode: "cards" | "table";
  onViewModeChange: (mode: "cards" | "table") => void;
  statuses: Array<"All" | ApplicantStatus>;
  activeStatus: "All" | ApplicantStatus;
  onStatusChange: (status: "All" | ApplicantStatus) => void;
  sortBy: ApplicantSortOption;
  onSortChange: (sort: ApplicantSortOption) => void;
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
  minMatchScore: number;
  onMinMatchScoreChange: (value: number) => void;
  skills: string[];
  selectedSkills: string[];
  onToggleSkill: (skill: string) => void;
  expRange: [number, number];
  onExpRangeChange: (range: [number, number]) => void;
  education: string;
  onEducationChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
  activeFilterCount: number;
  onClearAllFilters?: () => void;
}

const educationOptions = ["Any", "Diploma", "Bachelor's", "Master's", "PhD"];

// Status color mappings using your palette
const statusColors: Record<string, string> = {
  All: "bg-surface text-slate hover:bg-[#E2E8F0]",
  New: "bg-primary/10 text-primary hover:bg-primary/20",
  "AI Screened": "bg-cyan/10 text-cyan hover:bg-cyan/20",
  Shortlisted: "bg-warning/15 text-warning hover:bg-warning/25",
  Interview: "bg-success/10 text-success hover:bg-success/20",
  Rejected: "bg-danger/10 text-danger hover:bg-danger/20",
};

const statusActiveColors: Record<string, string> = {
  All: "bg-midnight text-white hover:bg-navy",
  New: "bg-primary text-white hover:bg-primary-dark",
  "AI Screened": "bg-cyan text-white hover:bg-cyan/80",
  Shortlisted: "bg-warning text-white hover:bg-warning/80",
  Interview: "bg-success text-white hover:bg-success/80",
  Rejected: "bg-danger text-white hover:bg-danger/80",
};

export default function ApplicantFilters({
  search,
  onSearchChange,
  viewMode,
  onViewModeChange,
  statuses,
  activeStatus,
  onStatusChange,
  sortBy,
  onSortChange,
  showAdvanced,
  onToggleAdvanced,
  minMatchScore,
  onMinMatchScoreChange,
  skills,
  selectedSkills,
  onToggleSkill,
  expRange,
  onExpRangeChange,
  education,
  onEducationChange,
  location,
  onLocationChange,
  activeFilterCount,
  onClearAllFilters,
}: ApplicantFiltersProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Ctrl+K or Cmd+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const hasActiveFilters =
    activeStatus !== "All" ||
    selectedSkills.length > 0 ||
    minMatchScore > 0 ||
    expRange[0] > 0 ||
    expRange[1] < 10 ||
    education !== "Any" ||
    location !== "";

  return (
    <div className="space-y-4">
      {/* Main Filter Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-secondary/30 bg-white p-4 shadow-sm transition-shadow hover:shadow-md lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative flex-1 lg:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate transition-colors" />
          <input
            ref={searchInputRef}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search candidates by name or skill... (CTRL+K)"
            className={`h-10 w-full rounded-lg border bg-white pl-10 pr-3 text-sm text-midnight outline-none transition-all duration-200 placeholder:text-slate/60 ${
              searchFocused
                ? "border-primary ring-2 ring-primary/20"
                : "border-secondary/30 hover:border-primary/40"
            }`}
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate transition-colors hover:bg-surface hover:text-midnight"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* View Toggle Group */}
          <div className="flex rounded-lg border border-secondary/30 bg-surface p-0.5">
            <button
              type="button"
              onClick={() => onViewModeChange("cards")}
              className={`rounded-md p-1.5 transition-all ${
                viewMode === "cards"
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate hover:bg-white/50 hover:text-midnight"
              }`}
              aria-label="Card view"
              title="Card view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("table")}
              className={`rounded-md p-1.5 transition-all ${
                viewMode === "table"
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate hover:bg-white/50 hover:text-midnight"
              }`}
              aria-label="Table view"
              title="Table view"
            >
              <Table2 className="h-4 w-4" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) =>
                onSortChange(e.target.value as ApplicantSortOption)
              }
              className="h-10 appearance-none rounded-lg border border-secondary/30 bg-white pl-3 pr-8 text-sm text-midnight outline-none transition-all hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="AI Match (High→Low)">Sort: AI Match</option>
              <option value="Newest">Sort: Newest</option>
              <option value="Resume Score">Sort: Resume Score</option>
              <option value="Experience">Sort: Experience</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
          </div>

          {/* Advanced Filters Toggle */}
          <button
            type="button"
            onClick={onToggleAdvanced}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
              showAdvanced || hasActiveFilters
                ? "border-primary/40 bg-primary/10 text-primary-dark hover:bg-primary/20"
                : "border-secondary/30 bg-white text-slate hover:bg-surface hover:text-midnight"
            }`}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary-dark px-1.5 text-xs font-semibold text-white">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                showAdvanced ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Status Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {statuses.map((status) => {
          const active = activeStatus === status;
          const statusKey = status as string;

          return (
            <button
              key={status}
              onClick={() => onStatusChange(status)}
              className={`group relative rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 ${
                active
                  ? statusActiveColors[statusKey] || statusActiveColors.All
                  : statusColors[statusKey] || statusColors.All
              } ${!active && "hover:scale-105"} focus:outline-none focus:ring-2 focus:ring-primary/20`}
            >
              {status}
              {/* We don't have counts for applicants, but keeping the structure consistent */}
            </button>
          );
        })}

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-slate">
              {activeFilterCount} active filter
              {activeFilterCount > 1 ? "s" : ""}
            </span>
            {onClearAllFilters && (
              <button
                onClick={onClearAllFilters}
                className="text-xs text-primary hover:text-primary-dark hover:underline transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div className="animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="rounded-xl border border-secondary/20 bg-surface/80 p-4 backdrop-blur-sm">
            <div className="space-y-4">
              {/* Match Score Slider */}
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-midnight">
                    Minimum Match Score
                  </span>
                  <span className="text-primary font-semibold">
                    {minMatchScore}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={minMatchScore}
                  onChange={(e) =>
                    onMinMatchScoreChange(Number(e.target.value))
                  }
                  className="w-full h-2 rounded-lg bg-secondary/30 appearance-none cursor-pointer accent-primary"
                  style={{
                    background: `linear-gradient(to right, #60A5FA 0%, #60A5FA ${minMatchScore}%, #C0C6D3 ${minMatchScore}%, #C0C6D3 100%)`,
                  }}
                />
                <div className="mt-1 flex justify-between text-xs text-slate">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Skills */}
              <div>
                <p className="mb-2 text-sm font-medium text-midnight">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => {
                    const selected = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => onToggleSkill(skill)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                          selected
                            ? "bg-cyan text-white shadow-sm hover:bg-cyan/80"
                            : "bg-white text-slate border border-secondary/30 hover:border-primary/40 hover:text-midnight"
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Experience Range */}
                <div>
                  <p className="mb-2 text-sm font-medium text-midnight">
                    Experience Range
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min={0}
                        max={10}
                        value={expRange[0]}
                        onChange={(e) =>
                          onExpRangeChange([
                            Number(e.target.value),
                            expRange[1],
                          ])
                        }
                        className="h-9 w-full rounded-lg border border-secondary/30 bg-white px-3 pr-8 text-sm text-midnight outline-none transition-all hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate">
                        yrs
                      </span>
                    </div>
                    <span className="text-slate font-medium">to</span>
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min={0}
                        max={10}
                        value={expRange[1]}
                        onChange={(e) =>
                          onExpRangeChange([
                            expRange[0],
                            Number(e.target.value),
                          ])
                        }
                        className="h-9 w-full rounded-lg border border-secondary/30 bg-white px-3 pr-8 text-sm text-midnight outline-none transition-all hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate">
                        yrs
                      </span>
                    </div>
                    <span className="text-xs text-slate">(10+ = max)</span>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {/* Education */}
                  <div>
                    <p className="mb-1.5 text-sm font-medium text-midnight">
                      Education
                    </p>
                    <select
                      value={education}
                      onChange={(e) => onEducationChange(e.target.value)}
                      className="h-9 w-full rounded-lg border border-secondary/30 bg-white px-3 text-sm text-midnight outline-none transition-all hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      {educationOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <p className="mb-1.5 text-sm font-medium text-midnight">
                      Location
                    </p>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => onLocationChange(e.target.value)}
                      placeholder="City or remote..."
                      className="h-9 w-full rounded-lg border border-secondary/30 bg-white px-3 text-sm text-midnight outline-none transition-all placeholder:text-slate/60 hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="mt-4 flex items-center justify-end gap-2 border-t border-secondary/20 pt-4">
              <button
                onClick={() => {
                  onMinMatchScoreChange(0);
                  selectedSkills.forEach((skill) => onToggleSkill(skill));
                  onExpRangeChange([0, 10]);
                  onEducationChange("Any");
                  onLocationChange("");
                }}
                className="rounded-lg px-3 py-1.5 text-sm text-slate transition-colors hover:bg-white/50 hover:text-midnight"
              >
                Reset filters
              </button>
              <button
                onClick={onToggleAdvanced}
                className="rounded-lg bg-primary-dark px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-midnight"
              >
                Apply filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
