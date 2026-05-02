"use client";

import { Syne } from "next/font/google";
import { useJobApplicationFormContext } from "@/app/(public)/jobs/[jobId]/apply/job-application-form-context";

const syne = Syne({ subsets: ["latin"], weight: ["700", "800"] });

interface JobOverviewSectionProps {
  jobData: {
    description: string;
    responsibilities: string[];
    requirements: string[];
  };
}

export default function JobOverviewSection({ jobData }: JobOverviewSectionProps) {
  const { switchTab } = useJobApplicationFormContext();

  return (
    <section className="px-0 sm:px-4">
      <div className="rounded-[14px] border border-[#E8ECF4] bg-white p-7 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <div className="mb-5 flex items-center justify-between gap-2">
          <h2
            className={`${syne.className} border-l-4 border-[#1E6FFF] pl-3 text-[20px] font-semibold text-[#0D1B2A]`}
          >
            Description
          </h2>
          <button
            type="button"
            className="flex items-center gap-2 text-[13px] text-[#1E6FFF] hover:underline"
          >
            Share this job ↗
          </button>
        </div>

        <p className="text-[15px] leading-8 text-[#4A5568]">{jobData.description}</p>

        <h3 className="mt-6 border-l-3 border-[#1E6FFF] pl-4 text-[15px] font-semibold text-[#0D1B2A]">
          Responsibilities:
        </h3>
        <ul className="mt-3 space-y-3 pl-4">
          {jobData.responsibilities.map((item) => (
            <li key={item} className="flex items-start gap-3 text-[14px] leading-7 text-[#4A5568]">
              <span className="mt-1 inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#1E6FFF]" />
              <span className="flex-1">{item}</span>
            </li>
          ))}
        </ul>

        <h3 className="mt-6 border-l-3 border-[#1E6FFF] pl-4 text-[15px] font-semibold text-[#0D1B2A]">
          Requirements:
        </h3>
        <ul className="mt-3 space-y-3 pl-4">
          {jobData.requirements.map((item) => (
            <li key={item} className="flex items-start gap-3 text-[14px] leading-7 text-[#4A5568]">
              <span className="mt-1 inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#1E6FFF]" />
              <span className="flex-1">{item}</span>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-[15px] italic leading-7 text-[#4A5568]">
          We encourage all motivated candidates to apply and start their engineering journey with us.
        </p>

        <button
          type="button"
          onClick={() => switchTab("application")}
          className="mt-8 h-13 w-full rounded-lg bg-success text-[15px] font-medium text-white transition hover:bg-[#009E6E]"
        >
          Apply for this job
        </button>
      </div>
    </section>
  );
}