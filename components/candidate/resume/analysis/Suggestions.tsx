"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";

type ImpactLevel = "High" | "Medium" | "Low";

interface SuggestionItem {
  id: string;
  title: string;
  description: string;
  impact: ImpactLevel;
  points: number;
}

interface SuggestionsProps {
  suggestions: SuggestionItem[];
  totalImprovements: number;
  baseCompleted: number;
  baseScore: number;
  targetScore: number;
}

const impactStyles: Record<ImpactLevel, string> = {
  High: "bg-danger/15 text-danger",
  Medium: "bg-warning/15 text-warning",
  Low: "bg-success/15 text-success",
};

export default function Suggestions({
  suggestions,
  totalImprovements,
  baseCompleted,
  baseScore,
  targetScore,
}: SuggestionsProps) {
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});

  const completedSuggestions = useMemo(
    () =>
      Object.values(completedMap).reduce(
        (count, value) => count + (value ? 1 : 0),
        0
      ),
    [completedMap]
  );

  const progressCount = Math.min(
    totalImprovements,
    baseCompleted + completedSuggestions
  );
  const progressPercent = (progressCount / totalImprovements) * 100;
  const completionRatio =
    suggestions.length === 0 ? 0 : completedSuggestions / suggestions.length;
  const estimatedScore = Math.round(
    baseScore + (targetScore - baseScore) * completionRatio
  );

  const toggleSuggestion = (id: string) => {
    setCompletedMap((previous) => ({
      ...previous,
      [id]: !previous[id],
    }));
  };

  return (
    <section
      id="suggestions"
      className="rounded-3xl border border-slate/15 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-display text-2xl text-midnight">
            AI Suggestions to Boost Your Score
          </p>
          <p className="text-sm text-slate">
            Work through these quick wins and watch your score climb.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-cyan/10 px-4 py-2 text-sm font-semibold text-cyan">
          <BadgeCheck className="h-4 w-4" />
          Smart recommendations
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {suggestions.map((suggestion, index) => {
          const isCompleted = completedMap[suggestion.id];
          return (
            <motion.div
              key={suggestion.id}
              className="rounded-3xl border border-slate/10 bg-surface px-5 py-4"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex flex-wrap items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-midnight text-white">
                    {index + 1}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span
                      className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${impactStyles[suggestion.impact]}`}
                    >
                      {suggestion.impact} Impact
                    </span>
                    <p
                      className={`font-semibold text-midnight transition ${
                        isCompleted ? "text-slate line-through opacity-70" : ""
                      }`}
                    >
                      {suggestion.title}
                    </p>
                    <p
                      className={`text-sm text-slate transition ${
                        isCompleted ? "line-through opacity-70" : ""
                      }`}
                    >
                      {suggestion.description}
                    </p>
                  </div>
                </div>
                <div className="ml-auto flex flex-col items-end gap-2 text-sm font-semibold text-cyan">
                  <span className="rounded-full bg-cyan/10 px-3 py-1">
                    +{suggestion.points} pts
                  </span>
                  <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold uppercase tracking-wide text-midnight">
                    <input
                      type="checkbox"
                      checked={Boolean(isCompleted)}
                      onChange={() => toggleSuggestion(suggestion.id)}
                      className="h-4 w-4 rounded border-slate/40 text-primary focus:ring-primary"
                    />
                    Mark as done
                  </label>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 space-y-3 rounded-2xl border border-slate/10 bg-white px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-semibold text-midnight">
          <p>
            {progressCount}/{totalImprovements} improvements completed
          </p>
          <span className="text-cyan">
            Estimated new score: {estimatedScore}/100
          </span>
        </div>
        <div className="h-2 rounded-full bg-surface">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>
    </section>
  );
}
