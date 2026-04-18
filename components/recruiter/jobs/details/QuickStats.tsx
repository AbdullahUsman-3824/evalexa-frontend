import { Sparkles, Users, Star, CalendarCheck2 } from "lucide-react";

interface QuickStatsProps {
  totalApplicants: number;
  aiScreened: number;
  shortlisted: number;
  interviews: number;
}

export default function QuickStats({
  totalApplicants,
  aiScreened,
  shortlisted,
  interviews,
}: QuickStatsProps) {
  const screenedPct =
    totalApplicants > 0 ? Math.round((aiScreened / totalApplicants) * 100) : 0;

  const cards = [
    {
      label: "Total Applicants",
      value: totalApplicants,
      icon: Users,
      tone: "text-primary bg-primary/10",
      sub: "",
    },
    {
      label: "AI Screened",
      value: aiScreened,
      icon: Sparkles,
      tone: "text-cyan bg-cyan/10",
      sub: `${screenedPct}%`,
    },
    {
      label: "Shortlisted",
      value: shortlisted,
      icon: Star,
      tone: "text-warning bg-warning/10",
      sub: "",
    },
    {
      label: "Interviews Scheduled",
      value: interviews,
      icon: CalendarCheck2,
      tone: "text-success bg-success/10",
      sub: "",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article key={card.label} className="rounded-xl border border-slate/15 bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate">{card.label}</p>
              <span className={`rounded-lg p-2 ${card.tone}`}>
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 font-syne text-2xl font-bold text-midnight">{card.value}</p>
            {card.sub && <p className="text-xs font-medium text-slate">{card.sub}</p>}
          </article>
        );
      })}
    </section>
  );
}

