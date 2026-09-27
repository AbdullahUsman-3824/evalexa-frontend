'use client'

import { Briefcase, Sparkles, Users, XCircle } from 'lucide-react'
import type { JobContextBarProps } from '@/lib/types/shortlist.types'

export default function JobContextBar({
  job,
  stats,
  rejectedCount,
  showRejectedPanel,
  onViewRejected,
}: JobContextBarProps) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl px-5 py-3.5 flex items-center justify-between gap-4 flex-wrap">

      {/* Left: job identity */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-[#EEF4FF] rounded-lg flex items-center justify-center shrink-0">
          <Briefcase size={15} className="text-[#1E6FFF]" />
        </div>
        <div>
          <p className="font-syne text-[14px] font-semibold text-[#0D1B2A] leading-tight">
            {job.title}
          </p>
          <p className="text-[12px] text-[#6B7A99] leading-tight mt-0.5">
            {job.department} · {job.applicantsCount} applicants
          </p>
        </div>
      </div>

      {/* Right: compact stats + action */}
      <div className="flex items-center gap-3">

        {/* Inline stat pills — only 2, not 3 */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-[#E1F5EE] text-[#0F6E56] rounded-full px-3 py-1 text-[12px] font-medium whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00B37E]" />
            {stats.totalShortlisted} shortlisted
          </span>

          <span className="inline-flex items-center gap-1.5 bg-[#F4F7FF] text-[#6B7A99] rounded-full px-3 py-1 text-[12px] font-medium whitespace-nowrap">
            <Sparkles size={11} className="text-[#00C2D1]" />
            {stats.aiSelected} by AI · {stats.manuallyAdded} manual
          </span>
        </div>

        <div className="w-px h-5 bg-[#E2E8F0] shrink-0" />

        {/* View Rejected toggle */}
        <button
          onClick={onViewRejected}
          className={`inline-flex items-center gap-2 rounded-xl text-[13px] font-medium px-4 py-2 border transition-all duration-200 whitespace-nowrap ${
            showRejectedPanel
              ? 'bg-[#EEF4FF] text-[#1E6FFF] border-[#1E6FFF]'
              : 'bg-white text-[#6B7A99] border-[#E2E8F0] hover:border-[#1E6FFF] hover:text-[#1E6FFF]'
          }`}
        >
          {showRejectedPanel ? (
            <XCircle size={14} />
          ) : (
            <Users size={14} />
          )}
          {showRejectedPanel ? 'Close Panel' : `Rejected (${rejectedCount})`}
        </button>
      </div>
    </div>
  )
}
