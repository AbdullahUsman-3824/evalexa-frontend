'use client'

import { Zap, CheckCheck } from 'lucide-react'
import { TOP_N_OPTIONS } from '@/lib/constants/shortlist.constants'
import type { BulkSelectorProps } from '@/lib/types/shortlist.types'

export default function BulkSelector({
  topNValue,
  selectedCount,
  onTopNChange,
  onApplyTopN,
  onBulkShortlist,
  onClearSelection,
}: BulkSelectorProps) {
  return (
    <div className="px-3 py-2.5 bg-[#FAFBFF] border-b border-[#F0F4FA]">

      {/* Top-N row */}
      <div className="flex items-center gap-2">
        <span className="text-[#6B7A99] text-[12px] shrink-0">Top</span>

        <select
          value={topNValue}
          onChange={e => onTopNChange(Number(e.target.value))}
          className="bg-white border border-[#E2E8F0] rounded-lg px-2 py-1.5 text-[13px] w-14 text-center outline-none focus:border-[#1E6FFF] cursor-pointer"
          aria-label="Select top N candidates"
        >
          {TOP_N_OPTIONS.map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>

        <span className="text-[#6B7A99] text-[12px] flex-1 shrink-0">by AI score</span>

        <button
          onClick={onApplyTopN}
          className="inline-flex items-center gap-1 bg-[#1E6FFF] text-white text-[12px] font-medium px-3 py-1.5 rounded-lg hover:bg-[#1660E0] transition-colors shrink-0"
        >
          <Zap size={12} />
          Apply
        </button>
      </div>

      {/* Bulk action strip — only when candidates are selected */}
      {selectedCount > 0 && (
        <div className="mt-2 flex items-center justify-between bg-[#EEF4FF] rounded-lg px-3 py-2">
          <span className="text-[#1E6FFF] text-[12px] font-medium">
            {selectedCount} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onBulkShortlist}
              className="inline-flex items-center gap-1 bg-[#1E6FFF] text-white text-[11px] font-medium px-3 py-1.5 rounded-lg hover:bg-[#1660E0] transition-colors"
            >
              <CheckCheck size={12} />
              Shortlist all
            </button>
            <button
              onClick={onClearSelection}
              className="text-[#6B7A99] text-[11px] hover:text-[#0D1B2A] transition-colors px-1"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
