"use client";

import { useJobApplicationFormContext } from "@/app/(public)/jobs/[jobId]/apply/job-application-form-context";

export default function JobApplyTabs() {
  const { activeTab, switchTab } = useJobApplicationFormContext();

  return (
    <div className="border-b-2 border-[#F0F0F0] bg-white">
      <div className="mx-auto flex w-full max-w-[720px]">
        <button
          type="button"
          onClick={() => switchTab("overview")}
          className={`w-1/2 border-b-[3px] px-8 py-4 text-[13px] font-semibold tracking-[0.05em] transition ${
            activeTab === "overview"
              ? "mb-[-2px] border-[#1E6FFF] text-[#1E6FFF]"
              : "border-transparent text-[#9BA3B2] hover:text-[#6B7A99]"
          }`}
        >
          OVERVIEW
        </button>
        <button
          type="button"
          onClick={() => switchTab("application")}
          className={`w-1/2 border-b-[3px] px-8 py-4 text-[13px] font-semibold tracking-[0.05em] transition ${
            activeTab === "application"
              ? "mb-[-2px] border-[#1E6FFF] text-[#1E6FFF]"
              : "border-transparent text-[#9BA3B2] hover:text-[#6B7A99]"
          }`}
        >
          APPLICATION
        </button>
      </div>
    </div>
  );
}
