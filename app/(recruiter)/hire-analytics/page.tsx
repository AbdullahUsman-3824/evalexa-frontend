"use client";

import { useState } from "react";
import KPICards from "@/components/recruiter/analytics/KPICards";
import ApplicationVolumeChart from "@/components/recruiter/analytics/ApplicationVolumeChart";
import PerJobChart from "@/components/recruiter/analytics/PerJobChart";
import SkillsPool from "@/components/recruiter/analytics/SkillsPool";
import JobPerformanceTable from "@/components/recruiter/analytics/JobPerformanceTable";
import AIScreeningPerf from "@/components/recruiter/analytics/AIScreeningPerf";

type RangeOption =
  | "Last 7 days"
  | "Last 30 days"
  | "Last 3 months"
  | "This Year"
  | "Custom range";

type StageBreakdown = {
  stage: string;
  days: number;
  automated?: boolean;
};

function TimeToHireBreakdown() {
  const stages: StageBreakdown[] = [
    { stage: "Application Review", days: 2.1 },
    { stage: "AI Screening", days: 0.3, automated: true },
    { stage: "Shortlisting", days: 1.8 },
    { stage: "Scheduling", days: 1.5 },
    { stage: "Interview", days: 1.2 },
    { stage: "Decision", days: 1.5 },
  ];

  const total = stages.reduce((sum, s) => sum + s.days, 0);
  const scale = 28 / total;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="font-syne text-xl font-semibold text-midnight">
        Time to Hire — Stage Breakdown
      </h3>
      <p className="mt-1 text-sm text-slate">Average days spent in each stage</p>

      <div className="mt-6 space-y-4">
        {stages.map((stage) => {
          const widthUnits = Math.max(1, Math.round(stage.days * scale));
          return (
            <div
              key={stage.stage}
              className="grid grid-cols-[160px_55px_1fr] items-center gap-3 md:grid-cols-[220px_70px_1fr]"
            >
              <p className="text-sm font-medium text-midnight">{stage.stage}</p>
              <p className="text-xs font-semibold text-slate">{stage.days.toFixed(1)}</p>
              <div className="h-4 rounded-full bg-surface px-0.5 py-0.5">
                <div
                  className={`h-full rounded-full ${
                    stage.automated ? "bg-cyan" : "bg-primary"
                  }`}
                  style={{ width: `${Math.min(100, (widthUnits / 28) * 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-5 text-sm font-semibold text-midnight">Total: 8.4 days</p>
    </div>
  );
}

export default function HiringAnalyticsPage() {
  const rangeOptions: RangeOption[] = [
    "Last 7 days",
    "Last 30 days",
    "Last 3 months",
    "This Year",
    "Custom range",
  ];
  const [selectedRange, setSelectedRange] = useState<RangeOption>("Last 30 days");

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-[1600px] space-y-6 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-syne text-2xl font-bold text-midnight">Hiring Analytics</h1>
            <p className="mt-1 text-sm text-slate">
              Data-driven insights for smarter hiring
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {rangeOptions.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedRange(option)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  selectedRange === option
                    ? "bg-primary text-white"
                    : "bg-white text-slate hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <KPICards />

        <ApplicationVolumeChart />

        <PerJobChart />

        <SkillsPool />

        <JobPerformanceTable />

        <AIScreeningPerf />

        <TimeToHireBreakdown />
      </div>
    </div>
  );
}

