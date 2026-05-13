"use client";

import { Download, Loader2, Star, X } from "lucide-react";
import ApplicantFilters, {
  type ApplicantSortOption,
} from "@/components/recruiter/applicants/ApplicantFilters";
import ApplicantTable from "@/components/recruiter/applicants/ApplicantTable";
import CandidateCard, {
  type ApplicantCandidate,
  type ApplicantStatus,
} from "@/components/recruiter/applicants/CandidateCard";

export type StatusFilter = "All" | ApplicantStatus;
export type TableSortKey =
  | "name"
  | "matchScore"
  | "resumeScore"
  | "experienceYears"
  | "appliedDaysAgo";

interface RecruiterApplicantsWorkspaceProps {
  selectedJobId: string;
  loadingApplications: boolean;
  applicationsError: string | null;
  candidates: ApplicantCandidate[];
  viewMode: "cards" | "table";
  onViewModeChange: (mode: "cards" | "table") => void;
  search: string;
  onSearchChange: (value: string) => void;
  activeStatus: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  sortBy: ApplicantSortOption;
  onSortByChange: (value: ApplicantSortOption) => void;
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
  minMatchScore: number;
  onMinMatchScoreChange: (value: number) => void;
  selectedSkills: string[];
  onToggleSkill: (skill: string) => void;
  expRange: [number, number];
  onExpRangeChange: (range: [number, number]) => void;
  education: string;
  onEducationChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
  activeFilterCount: number;
  filteredSortedCandidates: ApplicantCandidate[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAllPage: (checked: boolean, ids: string[]) => void;
  onToggleShortlist: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onReject: (id: string) => void;
  onUndoReject: (id: string) => void;
  onBulkShortlist: () => void;
  onBulkReject: () => void;
  page: number;
  onPageChange: (page: number) => void;
  sortKey: TableSortKey;
  sortDirection: "asc" | "desc";
  onSortChange: (key: TableSortKey) => void;
}

const allSkills = [
  "React",
  "TypeScript",
  "Node.js",
  "Next.js",
  "Tailwind",
  "GraphQL",
  "Docker",
  "AWS",
];

export default function RecruiterApplicantsWorkspace({
  selectedJobId,
  loadingApplications,
  applicationsError,
  viewMode,
  onViewModeChange,
  search,
  onSearchChange,
  activeStatus,
  onStatusChange,
  sortBy,
  onSortByChange,
  showAdvanced,
  onToggleAdvanced,
  minMatchScore,
  onMinMatchScoreChange,
  selectedSkills,
  onToggleSkill,
  expRange,
  onExpRangeChange,
  education,
  onEducationChange,
  location,
  onLocationChange,
  activeFilterCount,
  filteredSortedCandidates,
  selectedIds,
  onToggleSelect,
  onSelectAllPage,
  onToggleShortlist,
  onToggleBookmark,
  onReject,
  onUndoReject,
  onBulkShortlist,
  onBulkReject,
  page,
  onPageChange,
  sortKey,
  sortDirection,
  onSortChange,
}: RecruiterApplicantsWorkspaceProps) {
  if (!selectedJobId) {
    return (
      <section className="rounded-xl border border-slate/20 bg-white p-8 text-center shadow-sm">
        <h2 className="font-syne text-xl font-semibold text-midnight">
          Choose a job to view applications
        </h2>
        <p className="mt-2 text-sm text-slate">
          Pick a title from the dropdown above to load the matching recruiter
          applications.
        </p>
      </section>
    );
  }

  if (applicationsError) {
    return (
      <section className="rounded-xl border border-danger/20 bg-danger/10 p-6 text-danger">
        <h2 className="font-semibold">Error loading applications</h2>
        <p className="mt-1 text-sm text-danger/80">{applicationsError}</p>
      </section>
    );
  }

  if (loadingApplications) {
    return (
      <section className="flex items-center justify-center rounded-xl border border-slate/20 bg-white p-12 shadow-sm">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-slate">Loading applications...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <ApplicantFilters
        search={search}
        onSearchChange={onSearchChange}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        statuses={[
          "All",
          "New",
          "AI Screened",
          "Shortlisted",
          "Interview",
          "Rejected",
        ]}
        activeStatus={activeStatus}
        onStatusChange={onStatusChange}
        sortBy={sortBy}
        onSortChange={onSortByChange}
        showAdvanced={showAdvanced}
        onToggleAdvanced={onToggleAdvanced}
        minMatchScore={minMatchScore}
        onMinMatchScoreChange={onMinMatchScoreChange}
        skills={allSkills}
        selectedSkills={selectedSkills}
        onToggleSkill={onToggleSkill}
        expRange={expRange}
        onExpRangeChange={onExpRangeChange}
        education={education}
        onEducationChange={onEducationChange}
        location={location}
        onLocationChange={onLocationChange}
        activeFilterCount={activeFilterCount}
      />

      {viewMode === "cards" ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredSortedCandidates.length > 0 ? (
            filteredSortedCandidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onToggleShortlist={onToggleShortlist}
                onToggleBookmark={onToggleBookmark}
                onReject={onReject}
                onUndoReject={onUndoReject}
              />
            ))
          ) : (
            <div className="rounded-xl border border-slate/20 bg-white p-8 text-center text-slate shadow-sm md:col-span-2 xl:col-span-3">
              No applications match the current filters.
            </div>
          )}
        </section>
      ) : (
        <>
          {selectedIds.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3">
              <p className="text-sm font-medium text-primary">
                {selectedIds.length} selected
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onBulkShortlist}
                  className="inline-flex items-center gap-1 rounded-lg bg-warning px-3 py-1.5 text-sm font-semibold text-white"
                >
                  <Star className="h-4 w-4" />
                  Shortlist Selected
                </button>
                <button
                  type="button"
                  onClick={onBulkReject}
                  className="inline-flex items-center gap-1 rounded-lg border border-danger/30 px-3 py-1.5 text-sm font-medium text-danger"
                >
                  <X className="h-4 w-4" />
                  Reject Selected
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-lg border border-slate/20 px-3 py-1.5 text-sm font-medium text-midnight"
                >
                  <Download className="h-4 w-4" />
                  Export Selected
                </button>
              </div>
            </div>
          )}

          <ApplicantTable
            candidates={filteredSortedCandidates}
            selectedIds={selectedIds}
            onToggleSelect={onToggleSelect}
            onSelectAllPage={onSelectAllPage}
            onToggleShortlist={onToggleShortlist}
            onReject={onReject}
            page={page}
            pageSize={20}
            onPageChange={onPageChange}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSortChange={onSortChange}
          />
        </>
      )}
    </>
  );
}
