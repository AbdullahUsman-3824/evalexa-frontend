'use client'

import { useState } from 'react'
import { X, Search, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { filterRejected } from '@/lib/helpers/shortlist.helpers'
import type { RejectedPanelProps } from '@/lib/types/shortlist.types'
import RejectedCandidateRow from './RejectedCandidateRow'
import BulkSelector from './BulkSelector'

export default function RejectedPanel({
  rejected,
  selectedIds,
  topNValue,
  onClose,
  onTopNChange,
  onApplyTopN,
  onToggleSelect,
  onBulkShortlist,
  onClearSelection,
  onManualShortlist,
}: RejectedPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const filtered = filterRejected(rejected, searchQuery)

  return (
    <motion.div
      initial={{ x: 380, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 380, opacity: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="w-[380px] flex-shrink-0 bg-white rounded-xl border border-[#E2E8F0] flex flex-col max-h-[calc(100vh-190px)] overflow-hidden"
    >
      {/* Header — lighter, less imposing */}
      <div className="px-4 py-3.5 border-b border-[#F0F4FA] flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-syne text-[14px] font-semibold text-[#0D1B2A]">
              Rejected Candidates
            </span>
            <span className="bg-[#FFF0F0] text-[#E63946] text-[11px] rounded-full px-2 py-0.5 font-medium">
              {rejected.length}
            </span>
          </div>
          <p className="text-[#6B7A99] text-[12px] mt-0.5">
            Manually add candidates the AI missed
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-[#6B7A99] hover:bg-[#F4F7FF] hover:text-[#0D1B2A] transition-colors"
          aria-label="Close panel"
        >
          <X size={15} />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2.5 border-b border-[#F0F4FA] shrink-0">
        <div className="bg-[#F8FAFF] rounded-lg px-3 py-2 flex items-center gap-2">
          <Search size={14} className="text-[#6B7A99] shrink-0" />
          <input
            type="text"
            placeholder="Search by name, role or skill..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="text-[13px] bg-transparent outline-none w-full text-[#0D1B2A] placeholder:text-[#9AA5B8]"
          />
        </div>
      </div>

      {/* Bulk shortlist tools */}
      <div className="shrink-0">
        <BulkSelector
          topNValue={topNValue}
          selectedCount={selectedIds.length}
          onTopNChange={onTopNChange}
          onApplyTopN={onApplyTopN}
          onBulkShortlist={onBulkShortlist}
          onClearSelection={onClearSelection}
        />
      </div>

      {/* Candidate rows */}
      <div className="flex-1 overflow-y-auto px-3 py-2.5 space-y-2">
        {filtered.length === 0 ? (
          <div className="py-10 text-center">
            <div className="w-10 h-10 bg-[#E1F5EE] rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={18} className="text-[#00B37E]" />
            </div>
            <p className="text-[#0D1B2A] text-[13px] font-medium">All caught up</p>
            <p className="text-[#6B7A99] text-[12px] mt-1">No candidates match your search</p>
          </div>
        ) : (
          filtered.map(candidate => (
            <RejectedCandidateRow
              key={candidate.id}
              candidate={candidate}
              isSelected={selectedIds.includes(candidate.id)}
              onSelect={onToggleSelect}
              onShortlist={onManualShortlist}
            />
          ))
        )}
      </div>
    </motion.div>
  )
}
