"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Download, Sparkles, Star, X } from "lucide-react";
import CandidateCard, {
  type ApplicantCandidate,
  type ApplicantStatus,
} from "@/components/recruiter/applicants/CandidateCard";
import ApplicantFilters, {
  type ApplicantSortOption,
} from "@/components/recruiter/applicants/ApplicantFilters";
import ApplicantTable from "@/components/recruiter/applicants/ApplicantTable";

type StatusFilter = "All" | ApplicantStatus;
type TableSortKey = "name" | "matchScore" | "resumeScore" | "experienceYears" | "appliedDaysAgo";

const allSkills = ["React", "TypeScript", "Node.js", "Next.js", "Tailwind", "GraphQL", "Docker", "AWS"];

const mockCandidates: ApplicantCandidate[] = Array.from({ length: 42 }).map((_, index) => {
  const base = index + 1;
  const score = Math.max(58, 96 - index);
  const status: ApplicantStatus =
    index < 5
      ? "New"
      : index < 18
        ? "AI Screened"
        : index < 28
          ? "Shortlisted"
          : index < 36
            ? "Interview"
            : "Rejected";

  return {
    id: `cand-${base}`,
    name: [
      "Ayesha Khan",
      "Bilal Ahmed",
      "Fatima Noor",
      "Usman Tariq",
      "Sana Rehman",
      "Ali Raza",
      "Mariam Yousuf",
      "Hamza Saeed",
      "Hira Iqbal",
      "Zain Malik",
    ][index % 10] + ` ${base}`,
    title: ["Frontend Engineer", "React Developer", "Software Engineer", "UI Engineer"][index % 4],
    appliedLabel: `${(index % 12) + 1} ${index % 3 === 0 ? "hours" : "days"} ago`,
    appliedDaysAgo: (index % 12) + 1,
    matchScore: score,
    resumeScore: Math.max(52, score - (index % 9)),
    matchedSkills: ["React", "TypeScript", "Node.js", "Next.js", "Tailwind"].slice(0, 3 + (index % 2)),
    missingSkills: [["AWS"], ["Docker"], ["GraphQL"], ["AWS", "Docker"]][index % 4],
    experienceYears: (index % 8) + 1,
    education: ["Bachelor's CS", "Master's CS", "Bachelor's SE"][index % 3],
    status,
    shortlisted: status === "Shortlisted" || status === "Interview",
    bookmarked: index % 5 === 0,
  };
});

function sortByOption(candidates: ApplicantCandidate[], sortBy: ApplicantSortOption) {
  return [...candidates].sort((a, b) => {
    if (sortBy === "AI Match (High→Low)") return b.matchScore - a.matchScore;
    if (sortBy === "Newest") return a.appliedDaysAgo - b.appliedDaysAgo;
    if (sortBy === "Resume Score") return b.resumeScore - a.resumeScore;
    return b.experienceYears - a.experienceYears;
  });
}

export default function JobApplicantsPage() {
  const [candidates, setCandidates] = useState<ApplicantCandidate[]>(mockCandidates);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("All");
  const [sortBy, setSortBy] = useState<ApplicantSortOption>("AI Match (High→Low)");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [minMatchScore, setMinMatchScore] = useState(0);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [expRange, setExpRange] = useState<[number, number]>([0, 10]);
  const [education, setEducation] = useState("Any");
  const [location, setLocation] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [tableSortKey, setTableSortKey] = useState<TableSortKey>("matchScore");
  const [tableSortDirection, setTableSortDirection] = useState<"asc" | "desc">("desc");

  const statuses: StatusFilter[] = ["All", "New", "AI Screened", "Shortlisted", "Interview", "Rejected"];

  const filteredSorted = useMemo(() => {
    const searched = candidates.filter((candidate) => {
      const haystack = `${candidate.name} ${candidate.title} ${candidate.matchedSkills.join(" ")}`.toLowerCase();
      const matchesSearch = haystack.includes(search.toLowerCase());
      const matchesStatus = activeStatus === "All" || candidate.status === activeStatus;
      const matchesScore = candidate.matchScore >= minMatchScore;
      const matchesSkills =
        selectedSkills.length === 0 || selectedSkills.every((skill) => candidate.matchedSkills.includes(skill));
      const matchesExp =
        candidate.experienceYears >= Math.min(...expRange) &&
        candidate.experienceYears <= Math.max(...expRange);
      const matchesEducation = education === "Any" || candidate.education.includes(education);
      const matchesLocation = location.trim().length === 0 || "Lahore Remote Karachi".toLowerCase().includes(location.toLowerCase());
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
  }, [candidates, search, activeStatus, minMatchScore, selectedSkills, expRange, education, location, sortBy]);

  const tableRows = useMemo(() => {
    return [...filteredSorted].sort((a, b) => {
      const aVal = a[tableSortKey];
      const bVal = b[tableSortKey];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return tableSortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === "string" && typeof bVal === "string") {
        return tableSortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return 0;
    });
  }, [filteredSorted, tableSortKey, tableSortDirection]);

  const activeFilterCount = [
    minMatchScore > 0,
    selectedSkills.length > 0,
    expRange[0] !== 0 || expRange[1] !== 10,
    education !== "Any",
    location.trim().length > 0,
  ].filter(Boolean).length;

  const countNewToday = candidates.filter((candidate) => candidate.appliedDaysAgo <= 1).length;

  const updateCandidate = (id: string, patch: Partial<ApplicantCandidate>) => {
    setCandidates((prev) => prev.map((candidate) => (candidate.id === id ? { ...candidate, ...patch } : candidate)));
  };

  const handleShortlist = (id: string) => {
    const target = candidates.find((candidate) => candidate.id === id);
    if (!target) return;
    updateCandidate(id, {
      shortlisted: !target.shortlisted,
      status: target.shortlisted ? "AI Screened" : "Shortlisted",
    });
  };

  const handleReject = (id: string) => updateCandidate(id, { status: "Rejected", shortlisted: false });
  const handleUndoReject = (id: string) => updateCandidate(id, { status: "AI Screened" });
  const handleBookmark = (id: string) => {
    const target = candidates.find((candidate) => candidate.id === id);
    if (!target) return;
    updateCandidate(id, { bookmarked: !target.bookmarked });
  };

  const handleBulkShortlist = () => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        selectedIds.includes(candidate.id)
          ? { ...candidate, shortlisted: true, status: "Shortlisted" as ApplicantStatus }
          : candidate,
      ),
    );
  };

  const handleBulkReject = () => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        selectedIds.includes(candidate.id) ? { ...candidate, shortlisted: false, status: "Rejected" as ApplicantStatus } : candidate,
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

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="rounded-xl border border-slate/20 bg-white p-5">
          <Link href="/recruiter/jobs/1" className="text-sm font-medium text-primary">
            ← Frontend Developer
          </Link>
          <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-syne text-2xl font-bold text-midnight">Applicants</h1>
              <p className="mt-1 text-sm text-slate">
                {candidates.length} total applicants · {countNewToday} new today
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg bg-cyan px-3 py-2 text-sm font-semibold text-midnight hover:bg-cyan/90"
              >
                <Sparkles className="h-4 w-4" />
                AI Rank All
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate/20 px-3 py-2 text-sm font-medium text-midnight hover:bg-surface"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
            </div>
          </div>
        </header>

        <ApplicantFilters
          search={search}
          onSearchChange={setSearch}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          statuses={statuses}
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
          sortBy={sortBy}
          onSortChange={setSortBy}
          showAdvanced={showAdvanced}
          onToggleAdvanced={() => setShowAdvanced((prev) => !prev)}
          minMatchScore={minMatchScore}
          onMinMatchScoreChange={setMinMatchScore}
          skills={allSkills}
          selectedSkills={selectedSkills}
          onToggleSkill={(skill) =>
            setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((item) => item !== skill) : [...prev, skill]))
          }
          expRange={expRange}
          onExpRangeChange={(range) => setExpRange([Math.max(0, range[0]), Math.min(10, range[1])])}
          education={education}
          onEducationChange={setEducation}
          location={location}
          onLocationChange={setLocation}
          activeFilterCount={activeFilterCount}
        />

        {viewMode === "cards" ? (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredSorted.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onToggleShortlist={handleShortlist}
                onToggleBookmark={handleBookmark}
                onReject={handleReject}
                onUndoReject={handleUndoReject}
              />
            ))}
          </section>
        ) : (
          <>
            {selectedIds.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3">
                <p className="text-sm font-medium text-primary">{selectedIds.length} selected</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleBulkShortlist}
                    className="inline-flex items-center gap-1 rounded-lg bg-warning px-3 py-1.5 text-sm font-semibold text-white"
                  >
                    <Star className="h-4 w-4" />
                    Shortlist Selected
                  </button>
                  <button
                    type="button"
                    onClick={handleBulkReject}
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
              candidates={tableRows}
              selectedIds={selectedIds}
              onToggleSelect={(id) =>
                setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
              }
              onSelectAllPage={(checked, ids) =>
                setSelectedIds((prev) =>
                  checked ? Array.from(new Set([...prev, ...ids])) : prev.filter((id) => !ids.includes(id)),
                )
              }
              onToggleShortlist={handleShortlist}
              onReject={handleReject}
              page={page}
              pageSize={20}
              onPageChange={setPage}
              sortKey={tableSortKey}
              sortDirection={tableSortDirection}
              onSortChange={handleTableSortChange}
            />
          </>
        )}
      </div>
    </div>
  );
}

