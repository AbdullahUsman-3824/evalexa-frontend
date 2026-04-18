"use client";

import { useMemo, useState } from "react";
import RejectedRow, {
  type RejectedCandidate,
} from "@/components/recruiter/rejected/RejectedRow";

type DateRangeFilter = "This Week" | "This Month" | "All Time";
type SortFilter = "Rejected Date" | "Match Score";

const rejectedSeed: RejectedCandidate[] = [
  {
    id: "rj-1",
    name: "Noor Fatima",
    role: "Frontend Engineer",
    job: "Frontend Developer",
    rejectedDate: "Rejected March 20",
    reason: "Missing required skills: advanced testing and Docker experience.",
    matchScore: 67,
  },
  {
    id: "rj-2",
    name: "Saad Rahman",
    role: "UI Developer",
    job: "Frontend Developer",
    rejectedDate: "Rejected March 19",
    reason: "Low match score",
    matchScore: 58,
  },
  {
    id: "rj-3",
    name: "Kiran Bashir",
    role: "Product Designer",
    job: "Product Designer",
    rejectedDate: "Rejected March 17",
    reason: "Position filled",
    matchScore: 73,
  },
  {
    id: "rj-4",
    name: "Omar Siddiqui",
    role: "Data Analyst",
    job: "Data Engineer",
    rejectedDate: "Rejected March 14",
    reason: "Custom reason: role requires stronger backend ownership.",
    matchScore: 62,
  },
];

const jobs = ["All Jobs", "Frontend Developer", "Product Designer", "Data Engineer"];

function sortRejected(candidates: RejectedCandidate[], sortBy: SortFilter) {
  return [...candidates].sort((a, b) => {
    if (sortBy === "Match Score") return b.matchScore - a.matchScore;
    return b.rejectedDate.localeCompare(a.rejectedDate);
  });
}

export default function RejectedPage() {
  const [candidates, setCandidates] = useState<RejectedCandidate[]>(rejectedSeed);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [jobFilter, setJobFilter] = useState("All Jobs");
  const [dateRange, setDateRange] = useState<DateRangeFilter>("All Time");
  const [sortBy, setSortBy] = useState<SortFilter>("Rejected Date");
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [reconsiderTarget, setReconsiderTarget] = useState<RejectedCandidate | null>(null);
  const [reconsideredIds, setReconsideredIds] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const searched = candidates.filter((candidate) => {
      const haystack = `${candidate.name} ${candidate.role} ${candidate.job} ${candidate.reason}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
    const byJob =
      jobFilter === "All Jobs"
        ? searched
        : searched.filter((candidate) => candidate.job === jobFilter);

    const byDate =
      dateRange === "All Time"
        ? byJob
        : byJob.filter((candidate) =>
            dateRange === "This Week"
              ? candidate.rejectedDate.includes("March 20") || candidate.rejectedDate.includes("March 19")
              : candidate.rejectedDate.includes("March"),
          );

    return sortRejected(byDate, sortBy);
  }, [candidates, dateRange, jobFilter, search, sortBy]);

  const subtitle = `${Math.max(candidates.length, 24)} rejected across all jobs`;

  const allSelected = filtered.length > 0 && filtered.every((candidate) => selectedIds.includes(candidate.id));

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

  const confirmReconsider = () => {
    if (!reconsiderTarget) return;
    setCandidates((prev) => prev.filter((candidate) => candidate.id !== reconsiderTarget.id));
    setSelectedIds((prev) => prev.filter((id) => id !== reconsiderTarget.id));
    setReconsideredIds((prev) => [...prev, reconsiderTarget.id]);
    setReconsiderTarget(null);
  };

  const handleDeleteSelected = () => {
    setCandidates((prev) => prev.filter((candidate) => !selectedIds.includes(candidate.id)));
    setSelectedIds([]);
  };

  const handleReconsiderSelected = () => {
    setCandidates((prev) => prev.filter((candidate) => !selectedIds.includes(candidate.id)));
    setReconsideredIds((prev) => [...prev, ...selectedIds]);
    setSelectedIds([]);
  };

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-syne text-2xl font-bold text-midnight">Rejected Candidates</h1>
            <p className="mt-1 text-slate">{subtitle}</p>
            <p className="mt-1 text-xs text-slate">Rejection history is kept for 90 days</p>
          </div>
          <button
            type="button"
            onClick={() => setClearModalOpen(true)}
            className="rounded-lg border border-danger/25 px-3 py-2 text-sm font-medium text-danger hover:bg-danger/5"
          >
            Clear History
          </button>
        </header>

        <section className="rounded-xl border border-slate/20 bg-white p-4">
          <div className="grid gap-3 lg:grid-cols-4">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by candidate, role, or reason..."
              className="h-10 rounded-lg border border-slate/25 px-3 text-sm text-midnight outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 lg:col-span-2"
            />
            <select
              value={jobFilter}
              onChange={(event) => setJobFilter(event.target.value)}
              className="h-10 rounded-lg border border-slate/25 px-3 text-sm text-midnight outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {jobs.map((job) => (
                <option key={job}>{job}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <select
                value={dateRange}
                onChange={(event) => setDateRange(event.target.value as DateRangeFilter)}
                className="h-10 w-full rounded-lg border border-slate/25 px-3 text-sm text-midnight outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option>This Week</option>
                <option>This Month</option>
                <option>All Time</option>
              </select>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortFilter)}
                className="h-10 w-full rounded-lg border border-slate/25 px-3 text-sm text-midnight outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option>Rejected Date</option>
                <option>Match Score</option>
              </select>
            </div>
          </div>
        </section>

        {selectedIds.length > 0 && (
          <section className="rounded-xl border border-primary/20 bg-primary/10 p-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(event) => handleToggleAll(event.target.checked)}
                />
                Select all
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-white">
                  {selectedIds.length} selected
                </span>
                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  className="rounded-lg bg-danger px-3 py-2 text-sm font-semibold text-white hover:bg-danger/90"
                >
                  Delete Selected
                </button>
                <button
                  type="button"
                  onClick={handleReconsiderSelected}
                  className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90"
                >
                  Reconsider Selected
                </button>
              </div>
            </div>
          </section>
        )}

        {reconsideredIds.length > 0 && (
          <section className="rounded-xl border border-primary/20 bg-white p-3 text-sm text-primary">
            {reconsideredIds.length} candidate(s) moved back to Applicants with{" "}
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold">
              Reconsidered
            </span>{" "}
            badge.
          </section>
        )}

        {filtered.length === 0 ? (
          <section className="rounded-xl border border-slate/15 bg-white p-12 text-center">
            <h3 className="font-syne text-lg font-semibold text-midnight">No rejected candidates</h3>
            <p className="mt-1 text-slate">Your rejection history will appear here</p>
          </section>
        ) : (
          <section className="space-y-3">
            {filtered.map((candidate) => (
              <RejectedRow
                key={candidate.id}
                candidate={candidate}
                selected={selectedIds.includes(candidate.id)}
                onSelect={handleSelect}
                onReconsider={(target) => setReconsiderTarget(target)}
                onViewProfile={() => undefined}
              />
            ))}
          </section>
        )}

        {clearModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-5">
              <h3 className="font-syne text-lg font-semibold text-midnight">Clear rejection history?</h3>
              <p className="mt-2 text-sm text-slate">
                This will permanently remove all rejected candidates from history.
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setClearModalOpen(false)}
                  className="rounded-lg border border-slate/25 px-3 py-2 text-sm font-medium text-midnight"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCandidates([]);
                    setSelectedIds([]);
                    setClearModalOpen(false);
                  }}
                  className="rounded-lg bg-danger px-3 py-2 text-sm font-semibold text-white"
                >
                  Clear History
                </button>
              </div>
            </div>
          </div>
        )}

        {reconsiderTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-5">
              <h3 className="font-syne text-lg font-semibold text-midnight">Move back to Applicants?</h3>
              <p className="mt-2 text-sm text-slate">
                <span className="font-semibold text-midnight">{reconsiderTarget.name}</span> will
                be restored and marked as reconsidered.
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReconsiderTarget(null)}
                  className="rounded-lg border border-slate/25 px-3 py-2 text-sm font-medium text-midnight"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmReconsider}
                  className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white"
                >
                  Reconsider
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
