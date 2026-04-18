"use client";

import { motion } from "framer-motion";
import type { RecommendationCategory } from "./RankedCandidateRow";

interface RankingSummaryCardsProps {
  counts: Record<RecommendationCategory, number>;
  activeFilter: RecommendationCategory | "All";
  onSelect: (filter: RecommendationCategory | "All") => void;
}

const cardMeta: { key: RecommendationCategory; tone: string; border: string }[] = [
  { key: "Highly Recommended", tone: "text-success", border: "border-l-success" },
  { key: "Recommended", tone: "text-primary", border: "border-l-primary" },
  { key: "Consider", tone: "text-warning", border: "border-l-warning" },
  { key: "Not Recommended", tone: "text-danger", border: "border-l-danger" },
];

export default function RankingSummaryCards({
  counts,
  activeFilter,
  onSelect,
}: RankingSummaryCardsProps) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cardMeta.map((card, idx) => {
        const isActive = activeFilter === card.key;
        return (
          <motion.button
            key={card.key}
            type="button"
            onClick={() => onSelect(card.key)}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: idx * 0.07, duration: 0.35 }}
            className={`rounded-xl border border-slate/15 border-l-4 ${card.border} bg-white p-4 text-left transition hover:-translate-y-0.5 ${
              isActive ? "ring-2 ring-primary/35" : ""
            }`}
          >
            <p className={`font-syne text-[28px] font-bold leading-none ${card.tone}`}>{counts[card.key]}</p>
            <p className="mt-2 text-sm text-slate">{card.key}</p>
          </motion.button>
        );
      })}
    </section>
  );
}

