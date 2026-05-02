"use client";

import { Loader2 } from "lucide-react";
import AutofillImportBar from "./AutofillImportBar";
import DetailsSection from "./DetailsSection";
import PersonalInformationSection from "./PersonalInformationSection";
import ProfileSection from "./ProfileSection";
import { useJobApplicationFormContext } from "@/app/(public)/jobs/[jobId]/apply/job-application-form-context";

export default function ApplicationTab() {
  const { handleSubmit, requiredFilled, submitting } = useJobApplicationFormContext();

  return (
    <section className="space-y-4 px-0 sm:px-4">
      <AutofillImportBar />

      <p className="mb-4 mt-1 flex items-center gap-2 px-1 text-[13px] text-[#9BA3B2]">
        <span className="text-danger">*</span> Required fields
      </p>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <PersonalInformationSection />
        <ProfileSection />
        <DetailsSection />

        <button
          type="submit"
          disabled={!requiredFilled || submitting}
          className="flex h-13.5 w-full items-center justify-center gap-2 rounded-xl bg-success text-[15px] font-semibold text-white shadow-[0_4px_16px_rgba(0,179,126,0.35)] transition hover:bg-[#009E6E] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit application"
          )}
        </button>
      </form>

      <footer className="mt-8 px-4 pb-10 pt-8 text-center text-[13px] text-[#9BA3B2]">
        <div className="flex flex-wrap items-center justify-center gap-5 text-[13px] text-[#9BA3B2]">
          <a href="#" className="hover:underline">
            View website
          </a>
          <span className="text-[#D0D5DD]">·</span>
          <a href="#" className="hover:underline">
            View all jobs
          </a>
          <span className="text-[#D0D5DD]">·</span>
          <a href="#" className="hover:underline">
            Help ↗
          </a>
        </div>

        <p className="mt-3 text-[12px] text-[#B0B8CC]">
          Powered by <span className="font-medium text-primary">Evalexa</span> · Cookie settings · Accessibility
        </p>
      </footer>
    </section>
  );
}