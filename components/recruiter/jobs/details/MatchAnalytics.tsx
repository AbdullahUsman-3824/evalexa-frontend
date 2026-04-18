import { Sparkles } from "lucide-react";

interface DistributionRow {
  range: string;
  count: number;
}

interface MatchAnalyticsProps {
  averageScore: number;
  distribution: DistributionRow[];
  topSkills: { name: string; count: number }[];
  skillGaps: { name: string; count: number }[];
}

export default function MatchAnalytics({
  averageScore,
  distribution,
  topSkills,
  skillGaps,
}: MatchAnalyticsProps) {
  const max = Math.max(...distribution.map((item) => item.count), 1);

  return (
    <section className="rounded-xl border border-slate/15 border-l-4 border-l-cyan bg-white p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-cyan" />
          <h2 className="font-syne text-lg font-semibold text-midnight">AI Match Analytics</h2>
        </div>
        <p className="font-syne text-2xl font-bold text-cyan">{averageScore}%</p>
      </div>

      <div className="space-y-3">
        {distribution.map((row) => (
          <div key={row.range} className="grid grid-cols-[88px_1fr_auto] items-center gap-3 text-sm">
            <span className="text-slate">{row.range}</span>
            <div className="h-2 rounded-full bg-surface">
              <div
                className="h-2 rounded-full bg-cyan"
                style={{ width: `${Math.max(8, (row.count / max) * 100)}%` }}
              />
            </div>
            <span className="text-midnight">{row.count} candidates</span>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-midnight">Top matched skills</h3>
          <div className="flex flex-wrap gap-2">
            {topSkills.map((skill) => (
              <span
                key={skill.name}
                className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
              >
                {skill.name} ({skill.count})
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-midnight">Skill gaps</h3>
          <div className="flex flex-wrap gap-2">
            {skillGaps.map((skill) => (
              <span
                key={skill.name}
                className="rounded-full bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger"
              >
                {skill.name} ({skill.count})
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

