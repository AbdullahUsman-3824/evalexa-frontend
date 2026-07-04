"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import JobOverviewSection from "@/components/public/jobs/apply/JobOverviewSection";
import { getPublicJobBySlug } from "@/lib/services/jobs-service";
import JobApplicationForm, { type JobDetailData } from "./JobApplicationForm";

function normalizeResponsibilities(responsibilities?: string | string[]) {
  if (Array.isArray(responsibilities)) {
    return responsibilities.map((item) => item.trim()).filter(Boolean);
  }

  if (typeof responsibilities === "string") {
    return responsibilities
      .split(/\r?\n/)
      .map((item) => item.replace(/^[-*\u2022]\s*/, "").trim())
      .filter(Boolean);
  }

  return [];
}

export default function JobDetailPage() {
  const params = useParams<{ jobSlug: string }>();
  const jobSlug =
    typeof params?.jobSlug === "string" ? params.jobSlug.trim() : "";
  const [activeTab, setActiveTab] = useState<"overview" | "application">(
    "overview",
  );
  const [jobData, setJobData] = useState<JobDetailData | null>(null);
  const [error, setError] = useState("");
  const hasJobSlug = Boolean(jobSlug);

  useEffect(() => {
    if (!jobSlug) return;

    let isMounted = true;

    const loadJob = async () => {
      try {
        const job = await getPublicJobBySlug(jobSlug);
        if (!isMounted) return;

        setJobData({
          jobId: job?.id ?? "",
          companyId: job?.company?.id ?? "",
          description: job?.description ?? "",
          responsibilities: normalizeResponsibilities(job?.responsibilities),
          requirements: [],
        });
      } catch (err: unknown) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Failed to load job.");
      }
    };

    void loadJob();
    return () => {
      isMounted = false;
    };
  }, [jobSlug]);

  if (!hasJobSlug) {
    return (
      <div className="mx-auto max-w-180 px-4 py-10">
        <div className="rounded-[14px] border border-[#E8ECF4] bg-white p-7 text-center shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          Job slug is required.
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-180 px-4 py-10">
        <div className="rounded-[14px] border border-[#E8ECF4] bg-white p-7 text-center shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          {error}
        </div>
      </div>
    );
  }

  if (!jobData) {
    return (
      <div className="mx-auto max-w-180 px-4 py-10">
        <div className="rounded-[14px] border border-[#E8ECF4] bg-white p-7 text-center shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          Loading job details...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="border-b-2 border-[#F0F0F0] bg-white">
        <div className="mx-auto flex w-full max-w-[720px]">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
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
            onClick={() => setActiveTab("application")}
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

      <main className="mx-auto max-w-180 px-4 pb-12 pt-7">
        {activeTab === "overview" ? (
          <div className="mx-auto grid grid-cols-1 gap-8 lg:grid-cols-[1fr,380px]">
            <JobOverviewSection jobData={jobData} />
            <aside />
          </div>
        ) : (
          <JobApplicationForm jobSlug={jobSlug} jobData={jobData} />
        )}
      </main>
    </>
  );
}
