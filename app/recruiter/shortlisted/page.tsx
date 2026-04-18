"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarPlus, LayoutGrid, Table2 } from "lucide-react";
import BulkActions from "@/components/recruiter/shortlisted/BulkActions";
import ShortlistedCard, {
  type ShortlistedCandidate,
} from "@/components/recruiter/shortlisted/ShortlistedCard";

type SortOption = "Match Score" | "Shortlisted Date" | "Name";

const candidatesSeed: ShortlistedCandidate[] = [
  {
    id: "sl-1",
    name: "Ayesha Khan",
    role: "Senior Frontend Engineer",
    job: "Frontend Developer",
    shortlistedDate: "Shortlisted March 18",
    matchScore: 91,
    skillsMatched: ["React", "TypeScript", "Next.js"],
    status: "Awaiting Interview",
  },
  {
    id: "sl-2",
    name: "Bilal Ahmed",
    role: "React Engineer",
    job: "Frontend Developer",
    shortlistedDate: "Shortlisted March 15",
    matchScore: 88,
    skillsMatched: ["React", "Tailwind", "REST APIs"],
    status: "Interview Scheduled",
  },
  {
    id: "sl-3",
    name: "Mariam Yousuf",
    role: "UI Engineer",
    job: "Product Designer",
    shortlistedDate: "Shortlisted March 12",
    matchScore: 86,
    skillsMatched: ["Design Systems", "Figma", "Prototyping"],
    status: "Awaiting Interview",
  },
  {
    id: "sl-4",
    name: "Usman Tariq",
    role: "Frontend Developer",
    job: "Frontend Developer",
    shortlistedDate: "Shortlisted March 10",
    matchScore: 84,
    skillsMatched: ["JavaScript", "Next.js", "Testing"],
    status: "Offer Extended",
  },
  {
    id: "sl-5",
    name: "Hira Iqbal",
    role: "Software Engineer",
    job: "Data Engineer",
    shortlistedDate: "Shortlisted March 08",
    matchScore: 82,
    skillsMatched: ["SQL", "Python", "Data Modeling"],
    status: "Interview Scheduled",
  },
];

const allJobs = ["All Jobs", "Frontend Developer", "Product Designer", "Data Engineer"];

function sortCandidates(candidates: ShortlistedCandidate[], sortBy: SortOption) {
  return [...candidates].sort((a, b) => {
    if (sortBy === "Match Score") return b.matchScore - a.matchScore;
    if (sortBy === "Name") return a.name.localeCompare(b.name);
    return b.shortlistedDate.localeCompare(a.shortlistedDate);
  });
}

export default function ShortlistedPage() {
  const [candidates, setCandidates] = useState<ShortlistedCandidate[]>(candidatesSeed);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [jobFilter, setJobFilter] = useState("All Jobs");
  const [sortBy, setSortBy] = useState<SortOption>("Match Score");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [removeTarget, setRemoveTarget] = useState<ShortlistedCandidate | null>(null);

  const filtered = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    const searched = candidates.filter((candidate) => {
      const haystack = `${candidate.name} ${candidate.role} ${candidate.job}`.toLowerCase();
      return haystack.includes(normalized);
    });
    const byJob =
      jobFilter === "All Jobs"
        ? searched
        : searched.filter((candidate) => candidate.job === jobFilter);
    return sortCandidates(byJob, sortBy);
  }, [candidates, jobFilter, search, sortBy]);

  const allSelected = filtered.length > 0 && filtered.every((candidate) => selectedIds.includes(candidate.id));

  const activeJobs = useMemo(
    () => Array.from(new Set(candidates.map((candidate) => candidate.job))),
    [candidates],
  );

  const subtitle = `${Math.max(candidates.length, 38)} candidates across ${Math.max(
    activeJobs.length,
    5,
  )} active jobs`;

  const handleSelect = (id: string, selected: boolean) => {
    setSelectedIds((prev) =>
      selected ? Array.from(new Set([...prev, id])) : prev.filter((item) => item !== id),
    );
  };

  const handleToggleAll = (checked: boolean) => {
    const visibleIds = filtered.map((candidate) => candidate.id);
    setSelectedIds((prev) =>
      checked
        ? Array.from(new Set([...prev, ...visibleIds]))
        : prev.filter((id) => !visibleIds.includes(id)),
    );
  };

  const openRemoveModal = (candidate: ShortlistedCandidate) => {
    setRemoveTarget(candidate);
  };

  const confirmRemove = () => {
    if (!removeTarget) return;
    setCandidates((prev) => prev.filter((candidate) => candidate.id !== removeTarget.id));
    setSelectedIds((prev) => prev.filter((id) => id !== removeTarget.id));
    setRemoveTarget(null);
  };

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-syne text-2xl font-bold text-midnight">Shortlisted Candidates</h1>
            <p className="mt-1 text-slate">{subtitle}</p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-success px-4 py-2 text-sm font-semibold text-white hover:bg-success/90"
          >
            <CalendarPlus className="h-4 w-4" />
            Schedule Bulk Interviews
          </button>
        </header>

        <section className="rounded-xl border border-slate/20 bg-white p-4">
          <div className="grid gap-3 lg:grid-cols-4">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or job..."
              className="h-10 rounded-lg border border-slate/25 px-3 text-sm text-midnight outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 lg:col-span-2"
            />
            <select
              value={jobFilter}
              onChange={(event) => setJobFilter(event.target.value)}
              className="h-10 rounded-lg border border-slate/25 px-3 text-sm text-midnight outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {[...allJobs, ...activeJobs.filter((job) => !allJobs.includes(job))].map((job) => (
                <option key={job}>{job}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortOption)}
                className="h-10 w-full rounded-lg border border-slate/25 px-3 text-sm text-midnight outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option>Match Score</option>
                <option>Shortlisted Date</option>
                <option>Name</option>
              </select>
              <div className="flex items-center gap-1 rounded-lg border border-slate/25 p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("cards")}
                  className={`rounded p-1.5 ${viewMode === "cards" ? "bg-primary text-white" : "text-slate"}`}
                  aria-label="Cards view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`rounded p-1.5 ${viewMode === "table" ? "bg-primary text-white" : "text-slate"}`}
                  aria-label="Table view"
                >
                  <Table2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {selectedIds.length > 0 && (
          <BulkActions
            selectedCount={selectedIds.length}
            allSelected={allSelected}
            onToggleAll={handleToggleAll}
            onScheduleInterviews={() => undefined}
            onSendBulkMessage={() => undefined}
            onExportList={() => undefined}
          />
        )}

        {filtered.length === 0 ? (
          <section className="rounded-xl border border-slate/15 bg-white p-12 text-center">
            <div className="mx-auto mb-4 h-16 w-16">
              <div className="relative h-full w-full">
                <div className="absolute inset-0 rounded-full bg-warning/15" />
                <div className="absolute left-2 top-2 h-10 w-10 rounded-full border-2 border-warning/50" />
                <div className="absolute right-1 top-1 h-2 w-2 rounded-full bg-warning" />
              </div>
            </div>
            <h3 className="font-syne text-lg font-semibold text-midnight">No shortlisted candidates yet</h3>
            <Link href="/recruiter/applicants" className="mt-2 inline-block text-sm font-medium text-primary">
              Go to Applicants →
            </Link>
          </section>
        ) : viewMode === "cards" ? (
          <section className="grid gap-4 md:grid-cols-2">
            {filtered.map((candidate) => (
              <ShortlistedCard
                key={candidate.id}
                candidate={candidate}
                selected={selectedIds.includes(candidate.id)}
                onSelect={handleSelect}
                onSchedule={() => undefined}
                onMessage={() => undefined}
                onViewProfile={() => undefined}
                onRemove={openRemoveModal}
              />
            ))}
          </section>
        ) : (
          <section className="overflow-hidden rounded-xl border border-slate/20 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-surface text-left text-slate">
                <tr>
                  <th className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={(event) => handleToggleAll(event.target.checked)}
                      aria-label="Select all shortlisted"
                    />
                  </th>
                  <th className="px-3 py-3 font-medium">Candidate</th>
                  <th className="px-3 py-3 font-medium">Job</th>
                  <th className="px-3 py-3 font-medium">Shortlisted</th>
                  <th className="px-3 py-3 font-medium">AI Match</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((candidate, idx) => (
                  <tr
                    key={candidate.id}
                    className={`${idx % 2 === 0 ? "bg-white" : "bg-surface/50"} border-t border-slate/10`}
                  >
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(candidate.id)}
                        onChange={(event) => handleSelect(candidate.id, event.target.checked)}
                        aria-label={`Select ${candidate.name}`}
                      />
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-medium text-midnight">{candidate.name}</p>
                      <p className="text-xs text-slate">{candidate.role}</p>
                    </td>
                    <td className="px-3 py-3 text-midnight">{candidate.job}</td>
                    <td className="px-3 py-3 text-slate">{candidate.shortlistedDate}</td>
                    <td className="px-3 py-3">
                      <span className="rounded-full bg-success px-2.5 py-1 text-xs font-semibold text-white">
                        {candidate.matchScore}%
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate">{candidate.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {removeTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-5">
              <h3 className="font-syne text-lg font-semibold text-midnight">Remove from shortlist?</h3>
              <p className="mt-2 text-sm text-slate">
                This will move <span className="font-semibold text-midnight">{removeTarget.name}</span> to rejected.
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRemoveTarget(null)}
                  className="rounded-lg border border-slate/25 px-3 py-2 text-sm font-medium text-midnight"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmRemove}
                  className="rounded-lg bg-danger px-3 py-2 text-sm font-semibold text-white"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
