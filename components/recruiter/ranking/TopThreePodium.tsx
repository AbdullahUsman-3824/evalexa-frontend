"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Medal, Star, Crown } from "lucide-react";
import type { CandidateRanking } from "./RankedCandidateRow";

interface TopThreePodiumProps {
  topThree: CandidateRanking[];
  shortlistedIds: string[];
  onToggleShortlist: (id: string) => void;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function TopThreePodium({ topThree, shortlistedIds, onToggleShortlist }: TopThreePodiumProps) {
  if (topThree.length < 3) return null;

  const first = topThree[0];
  const second = topThree[1];
  const third = topThree[2];

  const podiums = [
    {
      candidate: second,
      place: 2 as const,
      orderClass: "order-1",
      height: "h-28",
      avatar: "h-14 w-14 text-sm",
      bg: "from-slate/70 to-slate/35",
      icon: <Medal className="h-5 w-5 text-slate" />,
      delay: 0.2,
    },
    {
      candidate: first,
      place: 1 as const,
      orderClass: "order-2",
      height: "h-36",
      avatar: "h-16 w-16 text-base",
      bg: "from-warning/75 to-warning/30",
      icon: <Crown className="h-6 w-6 text-warning" />,
      delay: 0.4,
    },
    {
      candidate: third,
      place: 3 as const,
      orderClass: "order-3",
      height: "h-24",
      avatar: "h-[52px] w-[52px] text-sm",
      bg: "from-amber-700/70 to-amber-700/30",
      icon: <Medal className="h-5 w-5 text-amber-700" />,
      delay: 0,
    },
  ];

  return (
    <section className="rounded-xl border border-slate/15 bg-white p-5">
      <h2 className="font-syne text-lg font-semibold text-midnight">Top 3 Candidates</h2>
      <div className="mt-6 flex flex-wrap items-end justify-center gap-4 lg:gap-6">
        {podiums.map((podium) => {
          const isFirst = podium.place === 1;
          const shortlisted = shortlistedIds.includes(podium.candidate.id);
          return (
            <motion.div
              key={podium.candidate.id}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 12, delay: podium.delay }}
              className={`${podium.orderClass} flex w-[200px] flex-col items-center`}
            >
              <div className="mb-2 flex items-center gap-1.5">
                {podium.icon}
                <span className="text-xs font-semibold text-slate">#{podium.place}</span>
              </div>

              <div className={`flex ${podium.avatar} items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan font-bold text-white`}>
                {initials(podium.candidate.name)}
              </div>
              <p className="mt-2 text-center font-syne text-sm font-semibold text-midnight">{podium.candidate.name}</p>
              <p className={`mt-1 font-syne ${isFirst ? "text-2xl text-warning" : "text-lg text-midnight"} font-bold`}>
                {podium.candidate.matchScore}%
              </p>
              <span className="mt-1 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                {podium.candidate.recommendation}
              </span>

              {isFirst && (
                <div className="mt-3 flex items-center gap-2">
                  <Link
                    href={`/recruiter/applicants/${podium.candidate.id}`}
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90"
                  >
                    View Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => onToggleShortlist(podium.candidate.id)}
                    className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                      shortlisted ? "border-warning/30 bg-warning/15 text-warning" : "border-warning/35 text-warning"
                    }`}
                  >
                    <Star className={`h-3.5 w-3.5 ${shortlisted ? "fill-warning" : ""}`} />
                    Shortlist
                  </button>
                </div>
              )}

              <div className={`mt-4 w-full rounded-t-lg bg-gradient-to-b ${podium.bg} ${podium.height}`} />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

