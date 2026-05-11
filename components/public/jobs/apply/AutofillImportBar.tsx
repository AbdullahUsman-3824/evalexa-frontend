"use client";

import { ChevronDown, Zap } from "lucide-react";
import { useJobApplicationFormContext } from "@/app/(public)/jobs/[jobSlug]/apply/job-application-form-context";

export default function AutofillImportBar() {
  const {
    autofillInputRef,
    handleAutofillImport,
    handleImportSourceSelect,
    isImportMenuOpen,
    setIsImportMenuOpen,
  } = useJobApplicationFormContext();

  return (
    <div className="mb-5 flex items-center justify-between rounded-lg border-[1.5px] border-primary bg-white p-4 shadow-[0_2px_12px_rgba(30,111,255,0.08)]">
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#EEF4FF]">
            <Zap size={16} className="text-primary" />
          </span>
          <div>
            <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-primary">
              AUTOFILL APPLICATION
            </div>
            <p className="mt-2 text-[13px] text-slate">
              Save time by importing your resume in one of the following
              formats: .pdf, .doc, .docx, .odt, or .rtf
            </p>
          </div>
        </div>

        <div className="relative w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsImportMenuOpen((previous) => !previous)}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-[14px] font-medium text-white shadow-[0_4px_12px_rgba(30,111,255,0.3)]"
            aria-expanded={isImportMenuOpen}
            aria-haspopup="menu"
          >
            Import resume from
            <ChevronDown
              size={16}
              className={`transition-transform ${isImportMenuOpen ? "rotate-180" : "rotate-0"}`}
            />
          </button>

          {isImportMenuOpen ? (
            <div
              className="absolute right-0 z-20 mt-2 w-full min-w-56 rounded-lg border border-border bg-white p-1 shadow-lg sm:w-56"
              role="menu"
            >
              <button
                type="button"
                onClick={() => handleImportSourceSelect("device")}
                className="block w-full rounded-md px-3 py-2 text-left text-sm text-midnight transition hover:bg-surface"
                role="menuitem"
              >
                This device
              </button>
              <button
                type="button"
                onClick={() => handleImportSourceSelect("google-drive")}
                className="block w-full rounded-md px-3 py-2 text-left text-sm text-slate transition hover:bg-surface"
                role="menuitem"
              >
                Google Drive (Coming soon)
              </button>
              <button
                type="button"
                onClick={() => handleImportSourceSelect("dropbox")}
                className="block w-full rounded-md px-3 py-2 text-left text-sm text-slate transition hover:bg-surface"
                role="menuitem"
              >
                Dropbox (Coming soon)
              </button>
              <button
                type="button"
                onClick={() => handleImportSourceSelect("linkedin")}
                className="block w-full rounded-md px-3 py-2 text-left text-sm text-slate transition hover:bg-surface"
                role="menuitem"
              >
                LinkedIn (Coming soon)
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <input
        ref={autofillInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.odt,.rtf"
        className="hidden"
        onChange={(event) =>
          handleAutofillImport(event.target.files?.[0] ?? null)
        }
      />
    </div>
  );
}
