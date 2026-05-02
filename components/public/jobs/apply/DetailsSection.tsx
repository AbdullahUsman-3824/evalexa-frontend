"use client";

import SectionCard from "./SectionCard";
import {
  textareaBaseClass,
  useJobApplicationFormContext,
} from "@/app/(public)/jobs/[jobId]/apply/job-application-form-context";

export default function DetailsSection() {
  const { clearDetailsSection, coverLetter, setCoverLetter } = useJobApplicationFormContext();

  return (
    <SectionCard title="Details" onClear={clearDetailsSection}>
      <label className="mb-1 block text-[13px] text-slate">Cover letter (Optional)</label>
      <textarea
        rows={6}
        value={coverLetter}
        onChange={(event) => setCoverLetter(event.target.value)}
        className={textareaBaseClass}
      />
    </SectionCard>
  );
}