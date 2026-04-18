"use client";

import { useMemo, useState } from "react";
import { Download, Sparkles } from "lucide-react";
import RankingSummaryCards from "@/components/recruiter/ranking/RankingSummaryCards";
import RankedCandidateRow, {
  type CandidateRanking,
  type RecommendationCategory,
} from "@/components/recruiter/ranking/RankedCandidateRow";
import TopThreePodium from "@/components/recruiter/ranking/TopThreePodium";
import SkillsGapAnalysis from "@/components/recruiter/ranking/SkillsGapAnalysis";
import ScoreDistribution from "@/components/recruiter/ranking/ScoreDistribution";

type RankingFilter = "All" | RecommendationCategory;

const recommendationFlow: RecommendationCategory[] = [
  ...Array.from({ length: 8 }).map(() => "Highly Recommended" as const),
  ...Array.from({ length: 14 }).map(() => "Recommended" as const),
  ...Array.from({ length: 12 }).map(() => "Consider" as const),
  ...Array.from({ length: 8 }).map(() => "Not Recommended" as const),
];

const names = [
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
  "Noor Fatima",
  "Omar Siddiqui",
  "Kiran Bashir",
  "Saad Rahman",
];

function baseScore(idx: number, recommendation: RecommendationCategory) {
  if (idx === 0) return 94;
  if (idx === 1) return 91;
  if (idx === 2) return 88;
  if (recommendation === "Highly Recommended") return 86 - (idx % 6);
  if (recommendation === "Recommended") return 84 - (idx % 8);
  if (recommendation === "Consider") return 76 - (idx % 6);
  return 64 - (idx % 7);
}

const candidatesSeed: CandidateRanking[] = recommendationFlow
  .map((recommendation, idx) => {
    const score = baseScore(idx, recommendation);
    const skill = Math.max(52, score + 2 - (idx % 6));
    const exp = Math.max(48, score - 3 + (idx % 5));
    const edu = Math.max(45, score - 8 + (idx % 7));
    const culture = Math.max(50, score - 4 + (idx % 6));
    const id = `cand-${idx + 1}`;

    return {
      id,
      name: `${names[idx % names.length]} ${idx + 1}`,
      currentRole: ["Frontend Developer", "React Engineer", "UI Engineer", "Software Engineer"][idx % 4],
      matchScore: score,
      recommendation,
      breakdown: { skills: skill, experience: exp, education: edu, culture },
      matchedSkills: ["React", "TypeScript", "Next.js", "Tailwind", "JavaScript"].slice(0, 3 + (idx % 3)),
      missingSkills: ["Docker", "AWS", "GraphQL", "CI/CD", "Unit Testing"].slice(0, 1 + (idx % 3)),
      topStrength: [
        "Strong React experience",
        "Excellent UI craftsmanship",
        "Solid API integration",
        "Fast feature delivery",
      ][idx % 4],
      keyGap: ["Missing Docker", "Limited AWS exposure", "GraphQL basics needed", "Testing depth needed"][idx % 4],
      strengths: [
        "Strong React and TypeScript fundamentals",
        "Built scalable UI components in production",
        "Good communication with product/design",
        "Writes maintainable frontend architecture",
        "Consistent delivery across sprints",
      ],
      skillGaps: [
        "Hands-on Docker workflow",
        "Cloud deployment on AWS",
        "GraphQL schema/query optimization",
        "Advanced CI/CD pipeline ownership",
        "Unit testing depth on edge cases",
      ],
      aiReasoning:
        "This candidate is highly recommended because their technical profile strongly aligns with the role requirements, especially in React, TypeScript, and modern frontend architecture. They demonstrate a high probability of fast onboarding with targeted upskilling on the listed gaps.",
    };
  })
  .sort((a, b) => b.matchScore - a.matchScore);

const categoryCounts: Record<RecommendationCategory, number> = {
  "Highly Recommended": 8,
  Recommended: 14,
  Consider: 12,
  "Not Recommended": 8,
};

const gapData = [
  { skill: "Docker", missing: 28, total: 42 },
  { skill: "AWS", missing: 24, total: 42 },
  { skill: "GraphQL", missing: 18, total: 42 },
  { skill: "CI/CD", missing: 15, total: 42 },
  { skill: "Unit Testing", missing: 12, total: 42 },
];

const distributionData = [
  { label: "90–100%", count: 8, tone: "bg-success" },
  { label: "80–89%", count: 14, tone: "bg-primary" },
  { label: "70–79%", count: 12, tone: "bg-cyan" },
  { label: "60–69%", count: 6, tone: "bg-warning" },
  { label: "Below 60%", count: 2, tone: "bg-danger" },
];

export default function JobRankingPage() {
  const [filter, setFilter] = useState<RankingFilter>("All");
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notesByCandidate, setNotesByCandidate] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    if (filter === "All") return candidatesSeed;
    return candidatesSeed.filter((candidate) => candidate.recommendation === filter);
  }, [filter]);

  const topThree = useMemo(() => candidatesSeed.slice(0, 3), []);

  const averageScore = Math.round(
    candidatesSeed.reduce((acc, candidate) => acc + candidate.matchScore, 0) / candidatesSeed.length,
  );

  const tabs: RankingFilter[] = [
    "All",
    "Highly Recommended",
    "Recommended",
    "Consider",
    "Not Recommended",
  ];

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="rounded-xl bg-midnight p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="relative mt-0.5">
                <Sparkles className="h-6 w-6 text-cyan" />
                <span className="absolute inset-0 animate-ping rounded-full bg-cyan/30" />
              </div>
              <div>
                <h1 className="font-syne text-2xl font-bold text-white">AI Candidate Ranking</h1>
                <p className="mt-1 text-sm text-slate">Frontend Developer — 42 candidates analyzed</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-cyan/70 px-3 py-2 text-sm font-semibold text-cyan hover:bg-cyan/10"
              >
                <Sparkles className="h-4 w-4" />
                Re-run AI Analysis
              </button>
              <span className="text-xs text-slate">Last analyzed: 2 hours ago</span>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate hover:bg-white/5"
              >
                <Download className="h-4 w-4" />
                Export Rankings
              </button>
            </div>
          </div>
        </header>

        <RankingSummaryCards counts={categoryCounts} activeFilter={filter} onSelect={setFilter} />

        <TopThreePodium
          topThree={topThree}
          shortlistedIds={shortlistedIds}
          onToggleShortlist={(id) =>
            setShortlistedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
          }
        />

        <section className="rounded-xl border border-slate/15 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-syne text-lg font-semibold text-midnight">All Candidates — Ranked by AI</h2>
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilter(tab)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    filter === tab ? "bg-primary text-white" : "bg-surface text-slate hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {filtered.map((candidate) => {
              const rank = candidatesSeed.findIndex((row) => row.id === candidate.id) + 1;
              return (
                <RankedCandidateRow
                  key={candidate.id}
                  candidate={candidate}
                  rank={rank}
                  expanded={expandedId === candidate.id}
                  shortlisted={shortlistedIds.includes(candidate.id)}
                  note={notesByCandidate[candidate.id] ?? ""}
                  onToggleExpand={() => setExpandedId((prev) => (prev === candidate.id ? null : candidate.id))}
                  onToggleShortlist={() =>
                    setShortlistedIds((prev) =>
                      prev.includes(candidate.id) ? prev.filter((item) => item !== candidate.id) : [...prev, candidate.id],
                    )
                  }
                  onReject={() => setFilter("Not Recommended")}
                  onNoteChange={(value) =>
                    setNotesByCandidate((prev) => ({
                      ...prev,
                      [candidate.id]: value,
                    }))
                  }
                />
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <SkillsGapAnalysis data={gapData} />
          <ScoreDistribution data={distributionData} averageScore={averageScore} />
        </div>
      </div>
    </div>
  );
}

