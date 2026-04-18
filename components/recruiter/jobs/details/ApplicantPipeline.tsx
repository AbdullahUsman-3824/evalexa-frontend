"use client";

export type PipelineStage = "Applied" | "AI Screened" | "Shortlisted" | "Interview" | "Hired";

interface StageStat {
  stage: PipelineStage;
  count: number;
  tone: string;
}

interface ApplicantPipelineProps {
  activeStage: PipelineStage | "All";
  onStageChange: (stage: PipelineStage | "All") => void;
  stats: StageStat[];
}

export default function ApplicantPipeline({
  activeStage,
  onStageChange,
  stats,
}: ApplicantPipelineProps) {
  return (
    <section className="rounded-xl border border-slate/15 bg-white p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-syne text-lg font-semibold text-midnight">Applicant Pipeline</h2>
        {activeStage !== "All" && (
          <button
            type="button"
            onClick={() => onStageChange("All")}
            className="text-sm font-medium text-primary"
          >
            Clear Stage Filter
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        {stats.map((item, index) => {
          const isActive = activeStage === item.stage;
          return (
            <div key={item.stage} className="flex flex-1 items-center gap-2">
              <button
                type="button"
                onClick={() => onStageChange(item.stage)}
                className={`w-full rounded-xl border p-3 text-left transition-all ${
                  isActive
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-slate/15 bg-white hover:border-primary/35"
                }`}
              >
                <p className={`font-syne text-2xl font-bold ${item.tone}`}>{item.count}</p>
                <p className="text-sm font-medium text-midnight">{item.stage}</p>
              </button>
              {index !== stats.length - 1 && (
                <span className="hidden text-slate xl:block" aria-hidden="true">
                  →
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

