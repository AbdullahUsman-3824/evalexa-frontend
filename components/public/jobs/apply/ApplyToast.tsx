"use client";

import { useJobApplicationFormContext } from "@/app/(public)/jobs/[jobSlug]/apply/job-application-form-context";

export default function ApplyToast() {
  const { toastMessage, setToastMessage } = useJobApplicationFormContext();

  if (!toastMessage) return null;

  return (
    <div className="fixed right-6 top-6 z-50 w-[340px]">
      <div className="rounded-lg bg-white/95 p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-[#1E6FFF]" />
          <p className="flex-1 text-sm text-[#0D1B2A]">{toastMessage}</p>
          <button type="button" onClick={() => setToastMessage("")}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
