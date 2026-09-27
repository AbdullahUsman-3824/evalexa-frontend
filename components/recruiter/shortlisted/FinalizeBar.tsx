'use client'

import { CheckCircle, Save, CalendarPlus } from 'lucide-react'
import type { FinalizeBarProps } from '@/lib/types/shortlist.types'

export default function FinalizeBar({
  stats,
  isFinalized,
  onSaveDraft,
  onFinalize,
}: FinalizeBarProps) {
  if (isFinalized) {
    return (
      <div className="sticky bottom-0 z-30 bg-[#00B37E] px-6 py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <CheckCircle size={18} className="text-white shrink-0" />
          <div>
            <p className="font-syne text-[14px] font-semibold text-white leading-tight">
              Shortlist Finalized
            </p>
            <p className="text-white/70 text-[12px]">
              All candidates have been notified
            </p>
          </div>
        </div>
        <button className="inline-flex items-center gap-2 bg-white text-[#00B37E] px-5 py-2 rounded-xl font-syne text-[13px] font-semibold hover:bg-white/90 transition-colors">
          <CalendarPlus size={15} />
          Schedule Interviews
        </button>
      </div>
    )
  }

  const isDisabled = stats.totalShortlisted === 0

  return (
    <div
      className="sticky bottom-0 z-30 bg-white border-t border-[#E2E8F0] px-6 py-3.5 flex items-center justify-between gap-4"
      style={{ boxShadow: '0 -4px 16px rgba(0,0,0,0.06)' }}
    >
      {/* Left: minimal stat summary */}
      <div className="flex items-center gap-5">
        <div>
          <span className="font-syne text-[18px] font-bold text-[#0D1B2A]">
            {stats.totalShortlisted}
          </span>
          <span className="text-[#6B7A99] text-[12px] ml-1.5">shortlisted</span>
        </div>

        <div className="w-px h-6 bg-[#E2E8F0]" />

        <div className="flex items-center gap-3 text-[12px] text-[#6B7A99]">
          <span>
            <span className="font-medium text-[#0D1B2A]">{stats.aiSelected}</span> AI
          </span>
          <span>·</span>
          <span>
            <span className="font-medium text-[#0D1B2A]">{stats.manuallyAdded}</span> manual
          </span>
          <span>·</span>
          <span>
            <span className="font-medium text-[#0D1B2A]">{stats.totalRejected}</span> rejected
          </span>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onSaveDraft}
          className="inline-flex items-center gap-1.5 border border-[#E2E8F0] text-[#6B7A99] text-[13px] font-medium px-4 py-2.5 rounded-xl hover:border-[#1E6FFF] hover:text-[#1E6FFF] transition-colors"
        >
          <Save size={14} />
          Save Draft
        </button>

        <button
          onClick={onFinalize}
          disabled={isDisabled}
          className={`inline-flex items-center gap-2 bg-[#00B37E] text-white px-5 py-2.5 rounded-xl font-syne text-[13px] font-semibold transition-all duration-200 ${
            isDisabled
              ? 'opacity-40 cursor-not-allowed'
              : 'hover:bg-[#009E6E] hover:-translate-y-px'
          }`}
          style={isDisabled ? {} : { boxShadow: '0 4px 14px rgba(0,179,126,0.3)' }}
        >
          <CheckCircle size={15} />
          Finalize · {stats.totalShortlisted}
        </button>
      </div>
    </div>
  )
}
