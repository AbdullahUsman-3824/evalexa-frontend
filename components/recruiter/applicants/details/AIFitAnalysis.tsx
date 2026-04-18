import { Sparkles, CheckCircle2, XCircle } from "lucide-react";

interface AIFitAnalysisProps {
  scores: {
    skills: number;
    experience: number;
    education: number;
    culture: number;
    overall: number;
  };
  matchedSkills: string[];
  missingSkills: string[];
}

function recommendation(overall: number) {
  if (overall >= 85) return { label: "Highly Recommended", className: "bg-success text-white" };
  if (overall >= 75) return { label: "Recommended", className: "bg-primary text-white" };
  if (overall >= 60) return { label: "Consider", className: "bg-warning text-white" };
  return { label: "Not Recommended", className: "bg-danger text-white" };
}

function Bar({
  label,
  value,
  barClass,
}: {
  label: string;
  value: number;
  barClass: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-midnight">{label}</span>
        <span className="font-semibold text-midnight">{value}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-surface">
        <div className={`h-2.5 rounded-full ${barClass}`} style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  );
}

export default function AIFitAnalysis({ scores, matchedSkills, missingSkills }: AIFitAnalysisProps) {
  const badge = recommendation(scores.overall);

  return (
    <section className="rounded-xl border border-cyan/40 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 font-syne text-xl font-bold text-midnight">
          <Sparkles className="h-5 w-5 text-cyan" />
          AI Fit Analysis
        </h2>
        <span className={`rounded-full px-3 py-1.5 text-sm font-semibold ${badge.className}`}>{badge.label}</span>
      </div>

      <div className="space-y-3">
        <Bar label="Skills Match" value={scores.skills} barClass="bg-primary" />
        <Bar label="Experience Fit" value={scores.experience} barClass="bg-cyan" />
        <Bar label="Education Match" value={scores.education} barClass="bg-success" />
        <Bar label="Culture Fit" value={scores.culture} barClass="bg-warning" />
      </div>

      <p className="mt-4 font-syne text-3xl font-bold text-midnight">Overall: {scores.overall}%</p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-midnight">Matched Skills</h3>
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-midnight">Missing Skills</h3>
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 rounded-full bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger"
              >
                <XCircle className="h-3.5 w-3.5" />
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

