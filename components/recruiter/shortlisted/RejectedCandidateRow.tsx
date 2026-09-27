'use client'

import { Plus } from 'lucide-react'
import { getScoreTextColor } from '@/lib/helpers/shortlist.helpers'
import { REJECTED_SOURCE_LABELS } from '@/lib/constants/shortlist.constants'
import type { RejectedCandidateRowProps } from '@/lib/types/shortlist.types'

export default function RejectedCandidateRow({
  candidate,
  isSelected,
  onSelect,
  onShortlist,
}: RejectedCandidateRowProps) {
  const scoreColor = getScoreTextColor(candidate.matchScore)

  return (
    <div
      className={`rounded-xl border bg-white px-3 py-2.5 flex items-center gap-3 transition-all duration-150 ${
        isSelected
          ? 'border-[#1E6FFF] bg-[#FAFCFF]'
          : 'border-[#ECEEF2] hover:border-[#C5D5F0]'
      }`}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onSelect(candidate.id)}
        className="w-3.5 h-3.5 rounded accent-[#1E6FFF] shrink-0 cursor-pointer"
        aria-label={`Select ${candidate.name}`}
      />

      {/* Avatar */}
      <div
        className={`bg-gradient-to-br ${candidate.avatarColor} w-8 h-8 rounded-full flex items-center justify-center shrink-0`}
      >
        <span className="text-white text-[10px] font-bold">{candidate.initials}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[#0D1B2A] truncate leading-tight">
          {candidate.name}
        </p>
        <p className="text-[11px] text-[#6B7A99] truncate mt-0.5">{candidate.role}</p>
        <span
          className={`inline-block mt-1 px-1.5 py-px rounded text-[10px] font-medium ${
            candidate.rejectedSource === 'ai_rejected'
              ? 'bg-[#F4F7FF] text-[#6B7A99]'
              : 'bg-[#FFF0F0] text-[#A32D2D]'
          }`}
        >
          {REJECTED_SOURCE_LABELS[candidate.rejectedSource]}
        </span>
      </div>

      {/* Score + action */}
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <span className={`font-syne text-[13px] font-semibold ${scoreColor}`}>
          {candidate.matchScore}%
        </span>
        <button
          onClick={() => onShortlist(candidate.id)}
          className="inline-flex items-center gap-1 bg-white text-[#1E6FFF] text-[11px] px-2.5 py-1 rounded-lg font-medium border border-[#D0E1FF] hover:bg-[#1E6FFF] hover:text-white hover:border-[#1E6FFF] transition-all duration-150"
          aria-label={`Shortlist ${candidate.name}`}
        >
          <Plus size={11} />
          Add
        </button>
      </div>
    </div>
  )
}
