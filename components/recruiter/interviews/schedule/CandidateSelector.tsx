"use client";

import { Search, UserRound, X } from "lucide-react";
import { useMemo, useState } from "react";

export interface CandidateOption {
  id: string;
  name: string;
  jobTitle: string;
  matchScore: number;
  avatar?: string;
}

interface CandidateSelectorProps {
  candidates: CandidateOption[];
  selectedCandidate: CandidateOption | null;
  onSelect: (candidate: CandidateOption) => void;
  onClear: () => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function CandidateSelector({
  candidates,
  selectedCandidate,
  onSelect,
  onClear,
}: CandidateSelectorProps) {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const filteredCandidates = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return candidates.slice(0, 6);

    return candidates
      .filter((candidate) => {
        return (
          candidate.name.toLowerCase().includes(normalized) ||
          candidate.jobTitle.toLowerCase().includes(normalized)
        );
      })
      .slice(0, 6);
  }, [candidates, query]);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-[#0D1B2A]">
        Select Candidate
      </label>

      <div className="relative">
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7A99]">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          placeholder="Search candidate name..."
          value={query}
          onFocus={() => setShowResults(true)}
          onChange={(event) => setQuery(event.target.value)}
          className="h-11 w-full rounded-lg border border-[#6B7A99]/30 bg-white pl-10 pr-3 text-sm text-[#0D1B2A] placeholder:text-[#6B7A99]/70 focus:border-[#1E6FFF] focus:outline-none focus:ring-2 focus:ring-[#1E6FFF]/20"
        />

        {showResults && filteredCandidates.length > 0 && (
          <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-[#6B7A99]/20 bg-white p-2 shadow-lg">
            {filteredCandidates.map((candidate) => (
              <button
                key={candidate.id}
                type="button"
                onClick={() => {
                  onSelect(candidate);
                  setShowResults(false);
                  setQuery(candidate.name);
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-[#F4F7FF]"
              >
                <div>
                  <p className="text-sm font-semibold text-[#0D1B2A]">
                    {candidate.name}
                  </p>
                  <p className="text-xs text-[#6B7A99]">{candidate.jobTitle}</p>
                </div>
                <span className="rounded-full bg-[#00B37E]/15 px-2 py-1 text-xs font-semibold text-[#00B37E]">
                  {candidate.matchScore}% match
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedCandidate && (
        <div className="rounded-xl border border-[#6B7A99]/25 bg-white p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#1E6FFF] to-[#00C2D1] text-sm font-semibold text-white">
                {selectedCandidate.avatar || getInitials(selectedCandidate.name)}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0D1B2A]">
                  {selectedCandidate.name}
                </p>
                <p className="text-xs text-[#6B7A99]">{selectedCandidate.jobTitle}</p>
              </div>
            </div>

            <span className="rounded-full bg-[#00B37E]/15 px-2 py-1 text-xs font-semibold text-[#00B37E]">
              {selectedCandidate.matchScore}% AI Match
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              onClear();
              setQuery("");
              setShowResults(false);
            }}
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#E63946] hover:underline"
          >
            <X className="h-3 w-3" />
            Change
          </button>
        </div>
      )}

      {!selectedCandidate && (
        <div className="flex items-center gap-2 rounded-lg border border-dashed border-[#6B7A99]/30 bg-[#F4F7FF] px-3 py-2 text-xs text-[#6B7A99]">
          <UserRound className="h-4 w-4" />
          Start by selecting a candidate.
        </div>
      )}
    </div>
  );
}

