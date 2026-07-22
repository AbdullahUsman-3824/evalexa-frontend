"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import RecruiterApplicantsHeader from "@/components/recruiter/applicants/RecruiterApplicantsHeader";
import RecruiterApplicantsWorkspace, {
  type StatusFilter,
  type TableSortKey,
} from "@/components/recruiter/applicants/RecruiterApplicantsWorkspace";
import {
  type ApplicantCandidate,
  type ApplicantStatus,
} from "@/components/recruiter/applicants/CandidateCard";
import {
  getApplicationsForJob,
  getJobTitles,
} from "@/repositories/job.repository";
import { Application, JobTitleRecord } from "@/types/job.types";
import type { ApplicantSortOption } from "@/components/recruiter/applicants/ApplicantFilters";

function formatAppliedLabel(daysAgo: number): string {
  if (daysAgo <= 1) return "Today";
  if (daysAgo <= 7) return `${daysAgo} days ago`;
  const weeksAgo = Math.floor(daysAgo / 7);
  return weeksAgo === 1 ? "1 week ago" : `${weeksAgo} weeks ago`;
}

function mapApplicationToCandidate(app: Application): ApplicantCandidate {
  const appliedDate = new Date(app.appliedAt);
  const now = new Date();
  const diffMs = now.getTime() - appliedDate.getTime();
  const appliedDaysAgo = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  const statusMap: Record<Application["status"], ApplicantStatus> = {
    APPLIED: "New",
    SCREENING: "AI Screened",
    SHORTLISTED: "Shortlisted",
    INTERVIEW: "Interview",
    OFFER: "Shortlisted",
    REJECTED: "Rejected",
    HIRED: "Shortlisted",
  };

  const experienceYears = Math.max(
    0,
    Math.round(app.resume.extractedExperience / 12),
  );

  return {
    id: app.id,
    candidateId: app.candidate.id,
    name: app.candidate.fullName,
    title: app.resume.extractedEducation || "Not specified",
    location: app.candidate.location || "Not specified",
    appliedLabel: formatAppliedLabel(appliedDaysAgo),
    appliedDaysAgo,
    matchScore: app.matchScore, // still null until AI screening ships — already hidden from UI
    resumeScore: null, // no separate resume-score field exists yet, don't fake it
    matchedSkills: [],
    missingSkills: [],
    experienceYears,
    education: app.resume.extractedEducation || "Not specified",
    status: statusMap[app.status],
    shortlisted:
      app.status === "SHORTLISTED" ||
      app.status === "INTERVIEW" ||
      app.status === "OFFER" ||
      app.status === "HIRED",
    bookmarked: false,
  };
}

function sortByOption(
  candidates: ApplicantCandidate[],
  sortBy: ApplicantSortOption,
) {
  return [...candidates].sort((a, b) => {
    if (sortBy === "Newest") return a.appliedDaysAgo - b.appliedDaysAgo;
    return b.experienceYears - a.experienceYears; // "Experience" fallback
  });
}

export default function RecruiterApplicantsPage() {
  const [jobTitles, setJobTitles] = useState<JobTitleRecord[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [candidates, setCandidates] = useState<ApplicantCandidate[]>([]);
  const [loadingTitles, setLoadingTitles] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [titlesError, setTitlesError] = useState<string | null>(null);
  const [applicationsError, setApplicationsError] = useState<string | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("All");
  const [sortBy, setSortBy] = useState<ApplicantSortOption>("Newest");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [minMatchScore, setMinMatchScore] = useState(0);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [expRange, setExpRange] = useState<[number, number]>([0, 10]);
  const [education, setEducation] = useState("Any");
  const [location, setLocation] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [tableSortKey, setTableSortKey] =
    useState<TableSortKey>("appliedDaysAgo");
  const [tableSortDirection, setTableSortDirection] = useState<"asc" | "desc">(
    "desc",
  );

  useEffect(() => {
    let isMounted = true;

    async function loadJobTitles() {
      try {
        setLoadingTitles(true);
        setTitlesError(null);
        const titles = await getJobTitles();
        if (!isMounted) return;
        setJobTitles(titles);
        setSelectedJobId((current) => {
          if (!current) return "";
          return titles.some((title) => title.id === current) ? current : "";
        });
      } catch (requestError) {
        if (!isMounted) return;
        setTitlesError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load job titles.",
        );
      } finally {
        if (isMounted) setLoadingTitles(false);
      }
    }

    void loadJobTitles();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedJobId) {
      setCandidates([]);
      setApplicationsError(null);
      setLoadingApplications(false);
      return;
    }

    let isMounted = true;

    async function loadApplications() {
      try {
        setLoadingApplications(true);
        setApplicationsError(null);
        const applications = await getApplicationsForJob(selectedJobId);
        if (!isMounted) return;
        setCandidates(applications.map(mapApplicationToCandidate));
        setSelectedIds([]);
        setPage(1);
      } catch (requestError) {
        if (!isMounted) return;
        setApplicationsError(
          requestError instanceof Error
            ? requestError.message
            : "Failed to load applications.",
        );
        setCandidates([]);
      } finally {
        if (isMounted) setLoadingApplications(false);
      }
    }

    void loadApplications();

    return () => {
      isMounted = false;
    };
  }, [selectedJobId]);

  const selectedJob = useMemo(
    () => jobTitles.find((jobTitle) => jobTitle.id === selectedJobId) ?? null,
    [jobTitles, selectedJobId],
  );

  const filteredSortedCandidates = useMemo(() => {
    const searched = candidates.filter((candidate) => {
      const haystack =
        `${candidate.name} ${candidate.title} ${candidate.matchedSkills.join(" ")}`.toLowerCase();
      const matchesSearch = haystack.includes(search.toLowerCase());
      const matchesStatus =
        activeStatus === "All" || candidate.status === activeStatus;
      const matchesScore =
        candidate.matchScore === null || candidate.matchScore >= minMatchScore;
      const matchesSkills =
        selectedSkills.length === 0 ||
        selectedSkills.every((skill) =>
          candidate.matchedSkills.includes(skill),
        );
      const matchesExp =
        candidate.experienceYears >= Math.min(...expRange) &&
        candidate.experienceYears <= Math.max(...expRange);
      const matchesEducation =
        education === "Any" || candidate.education.includes(education);
      const matchesLocation =
        location.trim().length === 0 ||
        candidate.location.toLowerCase().includes(location.toLowerCase());
      return (
        matchesSearch &&
        matchesStatus &&
        matchesScore &&
        matchesSkills &&
        matchesExp &&
        matchesEducation &&
        matchesLocation
      );
    });

    return sortByOption(searched, sortBy);
  }, [
    candidates,
    search,
    activeStatus,
    minMatchScore,
    selectedSkills,
    expRange,
    education,
    location,
    sortBy,
  ]);

  const tableRows = useMemo(() => {
    return [...filteredSortedCandidates].sort((a, b) => {
      const aVal = a[tableSortKey];
      const bVal = b[tableSortKey];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return tableSortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === "string" && typeof bVal === "string") {
        return tableSortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return 0;
    });
  }, [filteredSortedCandidates, tableSortKey, tableSortDirection]);

  const activeFilterCount = [
    minMatchScore > 0,
    selectedSkills.length > 0,
    expRange[0] !== 0 || expRange[1] !== 10,
    education !== "Any",
    location.trim().length > 0,
  ].filter(Boolean).length;

  const resetViewState = () => {
    setSelectedIds([]);
    setPage(1);
    setSearch("");
    setActiveStatus("All");
    setSortBy("Newest");
    setShowAdvanced(false);
    setMinMatchScore(0);
    setSelectedSkills([]);
    setExpRange([0, 10]);
    setEducation("Any");
    setLocation("");
    setTableSortKey("appliedDaysAgo");
    setTableSortDirection("desc");
  };

  const handleJobChange = (jobId: string) => {
    setSelectedJobId(jobId);
    resetViewState();
  };

  const updateCandidate = (id: string, patch: Partial<ApplicantCandidate>) => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === id ? { ...candidate, ...patch } : candidate,
      ),
    );
  };

  const handleShortlist = (id: string) => {
    const target = candidates.find((candidate) => candidate.id === id);
    if (!target) return;
    updateCandidate(id, {
      shortlisted: !target.shortlisted,
      status: target.shortlisted ? "AI Screened" : "Shortlisted",
    });
  };

  const handleReject = (id: string) =>
    updateCandidate(id, { status: "Rejected", shortlisted: false });
  const handleUndoReject = (id: string) =>
    updateCandidate(id, { status: "AI Screened" });
  const handleBookmark = (id: string) => {
    const target = candidates.find((candidate) => candidate.id === id);
    if (!target) return;
    updateCandidate(id, { bookmarked: !target.bookmarked });
  };

  const handleBulkShortlist = () => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        selectedIds.includes(candidate.id)
          ? {
              ...candidate,
              shortlisted: true,
              status: "Shortlisted" as ApplicantStatus,
            }
          : candidate,
      ),
    );
  };

  const handleBulkReject = () => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        selectedIds.includes(candidate.id)
          ? {
              ...candidate,
              shortlisted: false,
              status: "Rejected" as ApplicantStatus,
            }
          : candidate,
      ),
    );
  };

  const handleTableSortChange = (key: TableSortKey) => {
    if (tableSortKey === key) {
      setTableSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setTableSortKey(key);
    setTableSortDirection("desc");
  };

  if (loadingTitles) {
    return (
      <div className="min-h-screen bg-surface p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center rounded-xl border border-slate/20 bg-white p-12">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-slate">Loading job titles...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (titlesError) {
    return (
      <div className="min-h-screen bg-surface p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl border border-danger/20 bg-danger/10 p-6">
            <h2 className="font-semibold text-danger">
              Error loading job titles
            </h2>
            <p className="mt-1 text-sm text-danger/80">{titlesError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <RecruiterApplicantsHeader
          jobTitles={jobTitles}
          selectedJobId={selectedJobId}
          selectedJobTitle={selectedJob?.title ?? null}
          applicationCount={candidates.length}
          loadingApplications={loadingApplications}
          onJobChange={handleJobChange}
        />

        <RecruiterApplicantsWorkspace
          selectedJobId={selectedJobId}
          loadingApplications={loadingApplications}
          applicationsError={applicationsError}
          candidates={candidates}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          search={search}
          onSearchChange={setSearch}
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          showAdvanced={showAdvanced}
          onToggleAdvanced={() => setShowAdvanced((prev) => !prev)}
          minMatchScore={minMatchScore}
          onMinMatchScoreChange={setMinMatchScore}
          selectedSkills={selectedSkills}
          onToggleSkill={(skill) =>
            setSelectedSkills((prev) =>
              prev.includes(skill)
                ? prev.filter((item) => item !== skill)
                : [...prev, skill],
            )
          }
          expRange={expRange}
          onExpRangeChange={(range) =>
            setExpRange([Math.max(0, range[0]), Math.min(10, range[1])])
          }
          education={education}
          onEducationChange={setEducation}
          location={location}
          onLocationChange={setLocation}
          activeFilterCount={activeFilterCount}
          filteredSortedCandidates={tableRows}
          selectedIds={selectedIds}
          onToggleSelect={(id) =>
            setSelectedIds((prev) =>
              prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id],
            )
          }
          onSelectAllPage={(checked, ids) =>
            setSelectedIds((prev) =>
              checked
                ? Array.from(new Set([...prev, ...ids]))
                : prev.filter((id) => !ids.includes(id)),
            )
          }
          onToggleShortlist={handleShortlist}
          onToggleBookmark={handleBookmark}
          onReject={handleReject}
          onUndoReject={handleUndoReject}
          onBulkShortlist={handleBulkShortlist}
          onBulkReject={handleBulkReject}
          page={page}
          onPageChange={setPage}
          sortKey={tableSortKey}
          sortDirection={tableSortDirection}
          onSortChange={handleTableSortChange}
        />
      </div>
    </div>
  );
}
