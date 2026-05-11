"use client";

import { Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { sectionCardClass } from "@/app/(public)/jobs/[jobSlug]/apply/job-application-form-context";

interface SectionCardProps {
  title: string;
  onClear?: () => void;
  children: ReactNode;
}

export default function SectionCard({
  title,
  onClear,
  children,
}: SectionCardProps) {
  return (
    <div className={sectionCardClass}>
      <div className="mb-4 flex items-center justify-between border-b border-[#F0F4FA] pb-4">
        <h2 className="border-l-4 border-[#1E6FFF] pl-3 text-[17px] font-semibold text-[#0D1B2A]">
          {title}
        </h2>
        {onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 text-[13px] text-[#9BA3B2] transition hover:text-[#E63946]"
          >
            <Trash2 size={14} /> Clear
          </button>
        ) : null}
      </div>

      {children}
    </div>
  );
}
