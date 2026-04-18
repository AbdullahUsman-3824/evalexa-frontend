"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import ApplicantPipeline, {
  type PipelineStage,
} from "@/components/recruiter/jobs/details/ApplicantPipeline";
import JobActions from "@/components/recruiter/jobs/details/JobActions";
import MatchAnalytics from "@/components/recruiter/jobs/details/MatchAnalytics";
import QuickStats from "@/components/recruiter/jobs/details/QuickStats";

interface ApplicantRow {
  id: string;
  name: string;
  score: number;
  status: PipelineStage;
  applied: string;
}

const pipelineStats: { stage: PipelineStage; count: number; tone: string }[] = [
  { stage: "Applied", count: 42, tone: "text-primary" },
  { stage: "AI Screened", count: 38, tone: "text-cyan" },
  { stage: "Shortlisted", count: 8, tone: "text-warning" },
  { stage: "Interview", count: 3, tone: "text-success" },
  { stage: "Hired", count: 1, tone: "text-success" },
];

const applicants: ApplicantRow[] = [
  { id: "1", name: "Ayesha Khan", score: 93, status: "Shortlisted", applied: "2d ago" },
  { id: "2", name: "Usman Tariq", score: 88, status: "Interview", applied: "3d ago" },
  { id: "3", name: "Sana Rehman", score: 84, status: "AI Screened", applied: "4d ago" },
  { id: "4", name: "Bilal Ahmed", score: 79, status: "Applied", applied: "5d ago" },
  { id: "5", name: "Noor Fatima", score: 95, status: "Hired", applied: "6d ago" },
];

const scoreDistribution = [
  { range: "90-100%", count: 8 },
  { range: "70-89%", count: 18 },
  { range: "50-69%", count: 12 },
  { range: "Below 50%", count: 4 },
];

const sourceBreakdown = [
  { source: "Direct", percentage: 45 },
  { source: "LinkedIn", percentage: 30 },
  { source: "Indeed", percentage: 15 },
  { source: "Other", percentage: 10 },
];

function statusTone(status: PipelineStage) {
  if (status === "Hired") return "bg-success/10 text-success";
  if (status === "Interview") return "bg-cyan/10 text-cyan";
  if (status === "Shortlisted") return "bg-warning/10 text-warning";
  if (status === "AI Screened") return "bg-primary/10 text-primary";
  return "bg-slate/15 text-slate";
}

export default function JobDetailsPage() {
  const [activeStage, setActiveStage] = useState<PipelineStage | "All">("All");
  const [paused, setPaused] = useState(false);

  const filteredApplicants = useMemo(() => {
    if (activeStage === "All") return applicants;
    return applicants.filter((candidate) => candidate.status === activeStage);
  }, [activeStage]);

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="rounded-xl border border-slate/15 bg-white p-5">
          <Link href="/recruiter/jobs" className="text-sm font-medium text-primary">
            ← My Jobs
          </Link>
          <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-syne text-2xl font-bold text-midnight">Senior Frontend Engineer</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                  Published
                </span>
                <button
                  type="button"
                  className="rounded-lg border border-slate/25 px-3 py-1.5 text-sm font-medium text-midnight"
                >
                  Edit
                </button>
                <Link href="/recruiter/jobs/preview" className="text-sm font-medium text-primary">
                  View as Candidate
                </Link>
              </div>
            </div>
            <div className="text-right text-sm text-slate">
              <p>Published March 15, 2025</p>
              <p className="font-medium text-danger">Deadline April 30</p>
            </div>
          </div>
        </header>

        <QuickStats totalApplicants={42} aiScreened={38} shortlisted={8} interviews={3} />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px]">
          <div className="space-y-5">
            <ApplicantPipeline
              activeStage={activeStage}
              onStageChange={setActiveStage}
              stats={pipelineStats}
            />

            <MatchAnalytics
              averageScore={84}
              distribution={scoreDistribution}
              topSkills={[
                { name: "React", count: 25 },
                { name: "TypeScript", count: 22 },
                { name: "Next.js", count: 18 },
                { name: "Tailwind", count: 15 },
              ]}
              skillGaps={[
                { name: "System Design", count: 16 },
                { name: "Testing", count: 12 },
                { name: "GraphQL", count: 9 },
              ]}
            />

            <section className="rounded-xl border border-slate/15 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-syne text-lg font-semibold text-midnight">Recent Applicants</h2>
                {activeStage !== "All" && (
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    Filtered: {activeStage}
                  </span>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate/10 text-left text-slate">
                      <th className="py-2 pr-4 font-medium">Candidate</th>
                      <th className="py-2 pr-4 font-medium">Score</th>
                      <th className="py-2 pr-4 font-medium">Status</th>
                      <th className="py-2 pr-4 font-medium">Applied</th>
                      <th className="py-2 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplicants.slice(0, 5).map((candidate) => (
                      <tr key={candidate.id} className="border-b border-slate/10">
                        <td className="py-3 pr-4 text-midnight">{candidate.name}</td>
                        <td className="py-3 pr-4">
                          <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                            {candidate.score}%
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${statusTone(candidate.status)}`}
                          >
                            {candidate.status}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-slate">{candidate.applied}</td>
                        <td className="py-3">
                          <button type="button" className="text-sm font-medium text-primary">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Link
                href="/recruiter/applicants"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
              >
                View All Applicants →
              </Link>
            </section>

            <section className="rounded-xl border border-slate/15 bg-white p-5">
              <h2 className="font-syne text-lg font-semibold text-midnight">Job Performance</h2>
              <div className="mt-3 grid gap-3 text-sm text-midnight md:grid-cols-3">
                <p>
                  Views: <span className="font-semibold">234</span>
                </p>
                <p>
                  Applications: <span className="font-semibold">42</span>
                </p>
                <p>
                  Conversion: <span className="font-semibold">18%</span>
                </p>
              </div>

              <div className="mt-4 space-y-3">
                {sourceBreakdown.map((item) => (
                  <div key={item.source}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-slate">{item.source}</span>
                      <span className="font-medium text-midnight">{item.percentage}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface">
                      <div className="h-2 rounded-full bg-primary" style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-5">
            <JobActions paused={paused} onTogglePause={() => setPaused((prev) => !prev)} />
            <section className="rounded-xl border border-slate/15 bg-white p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan" />
                <h3 className="text-sm font-semibold text-midnight">AI Insights</h3>
              </div>
              <p className="mt-2 text-sm text-slate">
                Candidates with React + TypeScript scores above 85% are 2.4x more likely to reach interview.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

