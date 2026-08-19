"use client";

import { Syne } from "next/font/google";

const syne = Syne({ subsets: ["latin"], weight: ["700", "800"] });

interface JobApplyHeaderProps {
  companyName: string;
  companyLogo: string | null;
  companyIndustry: string;
  companyLocation: string;
  companyWebsite: string;
  title: string;
  workMode: string;
  jobType: string;
  location: string;
  department: string;
  postedAt: string | null;
  totalOpenings: number;
  applicationDeadline: string;
}

export default function JobApplyHeader({
  companyName,
  companyLogo,
  companyIndustry,
  companyLocation,
  title,
  workMode,
  jobType,
  location,
  department,
  postedAt,
  totalOpenings,
  applicationDeadline,
}: JobApplyHeaderProps) {
  const deadline = new Date(applicationDeadline).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const isExpired = new Date(applicationDeadline) < new Date();

  return (
    <header className="w-full border-b border-[rgba(255,255,255,0.08)] bg-[#0D1B2A] px-4 pb-8 pt-8 text-center">
      <div className="mx-auto max-w-3xl">

        {/* Evalexa brand */}
        <p className={`${syne.className} mb-5 text-[26px] font-bold tracking-tight`}>
          <span className="text-white">Eval</span>
          <span className="text-[#1E6FFF]">exa</span>
        </p>

        {/* Company logo + name */}
        <div className="mb-4 flex flex-col items-center gap-2">
          {companyLogo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={companyLogo}
              alt={companyName}
              className="h-10 w-auto rounded object-contain"
            />
          )}
          <p className="text-[15px] font-semibold text-[#00C2D1]">{companyName}</p>
          <p className="text-[12px] text-white/40">
            {companyIndustry}
            {companyLocation ? ` · ${companyLocation}` : ""}
          </p>
        </div>

        {/* Job title */}
        <h1 className={`${syne.className} text-[26px] font-bold text-white`}>
          {title}
        </h1>

        {/* Meta row: posted + openings + deadline */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[12px] text-white/40">
          {postedAt && <span>{postedAt}</span>}
          {totalOpenings > 0 && (
            <span>{totalOpenings} opening{totalOpenings > 1 ? "s" : ""}</span>
          )}
          <span className={isExpired ? "text-red-400" : "text-white/40"}>
            {isExpired ? "Closed" : `Apply by ${deadline}`}
          </span>
        </div>

      </div>
    </header>
  );
}