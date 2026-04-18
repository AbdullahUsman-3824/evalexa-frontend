"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Star, X } from "lucide-react";

export type RecommendationCategory =
  | "Highly Recommended"
  | "Recommended"
  | "Consider"
  | "Not Recommended";

export interface CandidateRanking {
  id: string;
  name: string;
  currentRole: string;
  matchScore: number;
  recommendation: RecommendationCategory;
  breakdown: {
    skills: number;
    experience: number;
    education: number;
    culture: number;
  };
  matchedSkills: string[];
  missingSkills: string[];
  topStrength: string;
  keyGap: string;
  strengths: string[];
  skillGaps: string[];
  aiReasoning: string;
}

interface RankedCandidateRowProps {
  candidate: CandidateRanking;
  rank: number;
  expanded: boolean;
  shortlisted: boolean;
  note: string;
  onToggleExpand: () => void;
  onToggleShortlist: () => void;
  onReject: () => void;
  onNoteChange: (value: string) => void;
}

const recommendationTone: Record<RecommendationCategory, string> = {
  "Highly Recommended": "bg-success/12 text-success border border-success/25",
  Recommended: "bg-primary/10 text-primary border border-primary/20",
  Consider: "bg-warning/12 text-warning border border-warning/25",
  "Not Recommended": "bg-danger/10 text-danger border border-danger/20",
};

function rankTone(rank: number) {
  if (rank === 1) return "text-warning text-2xl";
  if (rank === 2) return "text-slate text-2xl";
  if (rank === 3) return "text-amber-700 text-2xl";
  return "text-slate/80 text-xl";
}

export default function RankedCandidateRow({
  candidate,
  rank,
  expanded,
  shortlisted,
  note,
  onToggleExpand,
  onToggleShortlist,
  onReject,
  onNoteChange,
}: RankedCandidateRowProps) {
  const shownMatched = candidate.matchedSkills.slice(0, 3);
  const shownMissing = candidate.missingSkills.slice(0, 2);
  const moreSkills = Math.max(0, candidate.matchedSkills.length + candidate.missingSkills.length - 5);
  const ringProgress = Math.max(0.08, candidate.matchScore / 100);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.35, delay: Math.min(rank * 0.06, 0.8) }}
      className="overflow-hidden rounded-xl border border-slate/15 bg-white"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onToggleExpand}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onToggleExpand();
          }
        }}
        className="w-full cursor-pointer p-4 text-left transition hover:bg-surface/45"
      >
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_1.45fr_1.1fr]">
          <div className="flex items-center gap-3">
            <p className={`min-w-11 font-syne font-bold leading-none ${rankTone(rank)}`}>#{rank}</p>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan font-semibold text-white">
              {candidate.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <h3 className="font-syne text-[15px] font-semibold text-midnight">{candidate.name}</h3>
              <p className="text-[13px] text-slate">{candidate.currentRole}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[82px_1fr]">
            <div className="flex justify-center sm:justify-start">
              <div className="relative h-[60px] w-[60px]">
                <svg className="h-[60px] w-[60px] -rotate-90">
                  <circle cx="30" cy="30" r="25" stroke="rgba(30,111,255,0.16)" strokeWidth="6" fill="none" />
                  <motion.circle
                    cx="30"
                    cy="30"
                    r="25"
                    stroke="#1E6FFF"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={157}
                    initial={{ strokeDashoffset: 157 }}
                    whileInView={{ strokeDashoffset: 157 * (1 - ringProgress) }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                  />
                </svg>
                <p className="absolute inset-0 flex items-center justify-center text-sm font-bold text-midnight">
                  {candidate.matchScore}%
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {Object.entries(candidate.breakdown).map(([label, value]) => (
                <div key={label} className="grid grid-cols-[70px_1fr_auto] items-center gap-2 text-xs">
                  <span className="text-slate capitalize">{label}</span>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate/15">
                    <motion.div
                      className="h-1.5 rounded-full bg-cyan"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.55 }}
                    />
                  </div>
                  <span className="text-midnight">{value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {shownMatched.map((skill) => (
                <span key={skill} className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                  {skill}
                </span>
              ))}
              {shownMissing.map((skill) => (
                <span key={skill} className="rounded-full bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger">
                  {skill}
                </span>
              ))}
              {moreSkills > 0 && (
                <span className="text-xs font-medium text-primary">+{moreSkills} more skills</span>
              )}
            </div>

            <div className="grid gap-1 text-xs sm:grid-cols-2">
              <p className="text-success">Top strength: {candidate.topStrength}</p>
              <p className="text-warning">Key gap: {candidate.keyGap}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <motion.span
                initial={{ scale: 0.85, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${recommendationTone[candidate.recommendation]}`}
              >
                {candidate.recommendation}
              </motion.span>
              <Link
                href={`/recruiter/applicants/${candidate.id}`}
                onClick={(event) => event.stopPropagation()}
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90"
              >
                View Profile
              </Link>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleShortlist();
                }}
                className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${
                  shortlisted
                    ? "border-warning/35 bg-warning/12 text-warning"
                    : "border-slate/20 text-midnight hover:bg-surface"
                }`}
              >
                <Star className={`h-3.5 w-3.5 ${shortlisted ? "fill-warning" : ""}`} />
                Shortlist
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onReject();
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-danger/30 px-2.5 py-1.5 text-xs font-semibold text-danger hover:bg-danger/5"
              >
                <X className="h-3.5 w-3.5" />
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="border-t border-slate/10 bg-surface/45"
          >
            <div className="grid gap-4 p-4 lg:grid-cols-[1.05fr_1fr]">
              <div className="space-y-4">
                <div className="rounded-lg border border-slate/15 bg-white p-3">
                  <h4 className="mb-2 text-sm font-semibold text-midnight">Detailed score breakdown</h4>
                  <table className="w-full text-left text-xs">
                    <tbody>
                      {Object.entries(candidate.breakdown).map(([key, value]) => (
                        <tr key={key} className="border-b border-slate/10 last:border-none">
                          <td className="py-1.5 text-slate capitalize">{key}</td>
                          <td className="py-1.5 font-medium text-midnight">{value}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg border border-success/20 bg-white p-3">
                    <h4 className="mb-2 text-sm font-semibold text-success">Full strengths</h4>
                    <ul className="space-y-1 text-xs text-midnight">
                      {candidate.strengths.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg border border-warning/25 bg-white p-3">
                    <h4 className="mb-2 text-sm font-semibold text-warning">Full skill gaps</h4>
                    <ul className="space-y-1 text-xs text-midnight">
                      {candidate.skillGaps.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-3 rounded-lg border border-cyan/20 bg-white p-3">
                <h4 className="text-sm font-semibold text-midnight">AI reasoning</h4>
                <p className="text-sm leading-relaxed text-slate">{candidate.aiReasoning}</p>
                <div>
                  <label htmlFor={`note-${candidate.id}`} className="mb-1 block text-xs font-medium text-midnight">
                    Quick notes
                  </label>
                  <textarea
                    id={`note-${candidate.id}`}
                    value={note}
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event) => onNoteChange(event.target.value)}
                    rows={3}
                    placeholder="Add interview reminders..."
                    className="w-full rounded-lg border border-slate/20 bg-white px-3 py-2 text-sm text-midnight outline-none ring-primary/20 placeholder:text-slate focus:ring-2"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

