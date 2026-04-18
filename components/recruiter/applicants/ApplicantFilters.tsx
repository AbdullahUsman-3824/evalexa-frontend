"use client";

import { Search, SlidersHorizontal, Table2, LayoutGrid, ChevronDown } from "lucide-react";
import type { ApplicantStatus } from "./CandidateCard";

export type ApplicantSortOption = "AI Match (High→Low)" | "Newest" | "Resume Score" | "Experience";

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
}

const educationOptions = ["Any", "Diploma", "Bachelor's", "Master's", "PhD"];

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
}: ApplicantFiltersProps) {
  return (
    <section className="rounded-xl border border-slate/20 bg-white p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block w-full lg:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" />
          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search candidates by name or skill..."
            className="h-10 w-full rounded-lg border border-slate/25 bg-white pl-10 pr-3 text-sm text-midnight outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <div className="flex items-center gap-2 self-end lg:self-auto">
          <button
            type="button"
            onClick={() => onViewModeChange("cards")}
            className={`rounded-lg p-2 ${viewMode === "cards" ? "bg-primary text-white" : "bg-surface text-slate"}`}
            aria-label="Card view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("table")}
            className={`rounded-lg p-2 ${viewMode === "table" ? "bg-primary text-white" : "bg-surface text-slate"}`}
            aria-label="Table view"
          >
            <Table2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => {
            const isActive = status === activeStatus;
            return (
              <button
                key={status}
                type="button"
                onClick={() => onStatusChange(status)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  isActive ? "bg-primary text-white" : "bg-surface text-slate hover:text-midnight"
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value as ApplicantSortOption)}
            className="h-10 rounded-lg border border-slate/25 bg-white px-3 text-sm text-midnight outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option>AI Match (High→Low)</option>
            <option>Newest</option>
            <option>Resume Score</option>
            <option>Experience</option>
          </select>
          <button
            type="button"
            onClick={onToggleAdvanced}
            className="inline-flex items-center gap-2 rounded-lg border border-slate/25 px-3 py-2 text-sm font-medium text-midnight hover:bg-surface"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Advanced
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown className={`h-4 w-4 transition ${showAdvanced ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {showAdvanced && (
        <div className="mt-4 space-y-4 rounded-lg border border-slate/15 bg-surface/60 p-4">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-midnight">Min match score</span>
              <span className="text-primary">{minMatchScore}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={minMatchScore}
              onChange={(event) => onMinMatchScoreChange(Number(event.target.value))}
              className="w-full accent-primary"
            />
          </div>

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
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      selected ? "bg-cyan text-white" : "bg-white text-slate"
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-medium text-midnight">Experience range</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={expRange[0]}
                  onChange={(event) => onExpRangeChange([Number(event.target.value), expRange[1]])}
                  className="h-9 w-20 rounded-lg border border-slate/25 bg-white px-2 text-sm text-midnight outline-none"
                />
                <span className="text-slate">to</span>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={expRange[1]}
                  onChange={(event) => onExpRangeChange([expRange[0], Number(event.target.value)])}
                  className="h-9 w-20 rounded-lg border border-slate/25 bg-white px-2 text-sm text-midnight outline-none"
                />
                <span className="text-xs text-slate">10 means 10+ yrs</span>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-sm font-medium text-midnight">Education</p>
                <select
                  value={education}
                  onChange={(event) => onEducationChange(event.target.value)}
                  className="h-9 w-full rounded-lg border border-slate/25 bg-white px-2 text-sm text-midnight outline-none"
                >
                  {educationOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-midnight">Location</p>
                <input
                  type="text"
                  value={location}
                  onChange={(event) => onLocationChange(event.target.value)}
                  placeholder="City or remote"
                  className="h-9 w-full rounded-lg border border-slate/25 bg-white px-2 text-sm text-midnight outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

