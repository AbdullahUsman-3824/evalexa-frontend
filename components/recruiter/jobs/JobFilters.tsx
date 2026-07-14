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

export type JobFilterStatus = "All" | "Published" | "Draft" | "Closed";
export type JobSortOption = "Newest" | "Deadline";
export type JobTypeFilter = "All" | "Full Time" | "Part Time" | "Contract";
export type WorkModelFilter = "All" | "On-site" | "Remote" | "Hybrid";
export type DeadlineFilter = "All" | "Open" | "Expired";

interface JobFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  viewMode: "table" | "cards";
  onViewModeChange: (mode: "table" | "cards") => void;
  activeStatus: JobFilterStatus;
  onStatusChange: (status: JobFilterStatus) => void;
  sortBy: JobSortOption;
  onSortChange: (value: JobSortOption) => void;
  counts: Record<JobFilterStatus, number>;
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
  jobType: JobTypeFilter;
  onJobTypeChange: (value: JobTypeFilter) => void;
  workModel: WorkModelFilter;
  onWorkModelChange: (value: WorkModelFilter) => void;
  deadline: DeadlineFilter;
  onDeadlineChange: (value: DeadlineFilter) => void;
  activeFilterCount: number;
  onClearAllFilters?: () => void;
}

const statuses: JobFilterStatus[] = ["All", "Published", "Draft", "Closed"];

// Status color mappings using your palette
const statusColors: Record<JobFilterStatus, string> = {
  All: "bg-surface text-slate hover:bg-[#E2E8F0]",
  Published: "bg-[#DCFCE7] text-success hover:bg-[#BBF7D0]",
  Draft: "bg-[#FEF3C7] text-warning hover:bg-[#FDE68A]",
  Closed: "bg-[#FEE2E2] text-danger hover:bg-[#FECACA]",
};

const statusActiveColors: Record<JobFilterStatus, string> = {
  All: "bg-midnight text-white hover:bg-navy",
  Published: "bg-success text-white hover:bg-[#15803D]",
  Draft: "bg-warning text-white hover:bg-[#D97706]",
  Closed: "bg-danger text-white hover:bg-[#B91C1C]",
};

// Badge count colors for status pills
const statusBadgeColors: Record<JobFilterStatus, string> = {
  All: "bg-navy/10 text-navy",
  Published: "bg-success/20 text-success",
  Draft: "bg-warning/20 text-warning",
  Closed: "bg-danger/20 text-danger",
};

const statusActiveBadgeColors: Record<JobFilterStatus, string> = {
  All: "bg-white/20 text-white",
  Published: "bg-white/20 text-white",
  Draft: "bg-white/20 text-white",
  Closed: "bg-white/20 text-white",
};

export default function JobFilters({
  search,
  onSearchChange,
  viewMode,
  onViewModeChange,
  activeStatus,
  onStatusChange,
  sortBy,
  onSortChange,
  counts,
  showAdvanced,
  onToggleAdvanced,
  jobType,
  onJobTypeChange,
  workModel,
  onWorkModelChange,
  deadline,
  onDeadlineChange,
  activeFilterCount,
  onClearAllFilters,
}: JobFiltersProps) {
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
    jobType !== "All" ||
    workModel !== "All" ||
    deadline !== "All" ||
    activeStatus !== "All";

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
            placeholder="Search jobs... (CTRL+K)"
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
              onChange={(e) => onSortChange(e.target.value as JobSortOption)}
              className="h-10 appearance-none rounded-lg border border-secondary/30 bg-white pl-3 pr-8 text-sm text-midnight outline-none transition-all hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="Newest">Sort: Newest</option>
              <option value="Deadline">Sort: Deadline</option>
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
          const count = counts[status] || 0;

          return (
            <button
              key={status}
              onClick={() => onStatusChange(status)}
              className={`group relative rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 ${
                active ? statusActiveColors[status] : statusColors[status]
              } ${!active && "hover:scale-105"} focus:outline-none focus:ring-2 focus:ring-primary/20`}
            >
              {status}
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                  active
                    ? statusActiveBadgeColors[status]
                    : statusBadgeColors[status]
                }`}
              >
                {count}
              </span>
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
            <div className="grid gap-4 md:grid-cols-3">
              {/* Job Type */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-midnight">
                  Job Type
                </label>
                <select
                  value={jobType}
                  onChange={(e) =>
                    onJobTypeChange(e.target.value as JobTypeFilter)
                  }
                  className="h-10 w-full rounded-lg border border-secondary/30 bg-white px-3 text-sm text-midnight outline-none transition-all hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="All">All Types</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              {/* Work Model */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-midnight">
                  Work Model
                </label>
                <select
                  value={workModel}
                  onChange={(e) =>
                    onWorkModelChange(e.target.value as WorkModelFilter)
                  }
                  className="h-10 w-full rounded-lg border border-secondary/30 bg-white px-3 text-sm text-midnight outline-none transition-all hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="All">All Models</option>
                  <option value="On-site">On-site</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              {/* Deadline */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-midnight">
                  Deadline Status
                </label>
                <select
                  value={deadline}
                  onChange={(e) =>
                    onDeadlineChange(e.target.value as DeadlineFilter)
                  }
                  className="h-10 w-full rounded-lg border border-secondary/30 bg-white px-3 text-sm text-midnight outline-none transition-all hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="All">All Deadlines</option>
                  <option value="Open">Open</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="mt-4 flex items-center justify-end gap-2 border-t border-secondary/20 pt-4">
              <button
                onClick={() => {
                  onJobTypeChange("All");
                  onWorkModelChange("All");
                  onDeadlineChange("All");
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
