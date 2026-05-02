"use client";

import { Syne } from "next/font/google";

const syne = Syne({ subsets: ["latin"], weight: ["700", "800"] });

interface JobApplyHeaderProps {
  company: string;
  title: string;
  workMode: string;
  postedBy: string;
  location: string;
}

export default function JobApplyHeader({
  company,
  title,
  workMode,
  postedBy,
  location,
}: JobApplyHeaderProps) {
  return (
    <header className="w-full border-b border-[rgba(255,255,255,0.08)] bg-[#0D1B2A] px-4 pb-7 pt-8 text-center">
      <div className="mx-auto max-w-3xl">
        <p
          className={`${syne.className} mb-3 text-[28px] font-bold tracking-tight`}
        >
          <span className="text-white">Eval</span>
          <span className="text-primary">exa</span>
        </p>
        <p className="mt-1 text-[15px] font-medium text-[#00C2D1]">{company}</p>
        <h1
          className={`${syne.className} mt-2 text-[26px] font-bold text-white`}
        >
          {title}
        </h1>
        <p className="mt-2 text-[13px] text-white/50">
          {workMode} <span className="mx-2">·</span> {postedBy}
          <span className="mx-2">·</span> Other
        </p>
        <p className="mt-1 text-[13px] text-white/40">{location}</p>
      </div>
    </header>
  );
}
