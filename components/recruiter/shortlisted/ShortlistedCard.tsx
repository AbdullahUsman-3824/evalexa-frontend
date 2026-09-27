'use client'

import { Sparkles, User, X } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  getCardBorderClass,
  getScoreBadgeClasses,
  getSourceBadgeClasses,
} from '@/lib/helpers/shortlist.helpers'
import { SOURCE_LABELS } from '@/lib/constants/shortlist.constants'
import type { ShortlistedCardProps } from '@/lib/types/shortlist.types'

export default function ShortlistedCard({
  candidate,
  onRemove,
  isFinalized,
  index = 0,
}: ShortlistedCardProps & { index?: number }) {
  const borderClass = getCardBorderClass(candidate.source)
  const scoreBadge = getScoreBadgeClasses(candidate.matchScore)
  const sourceBadge = getSourceBadgeClasses(candidate.source)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.2 }}
      className={`bg-white rounded-xl border border-[#E2E8F0] px-4 py-3.5 flex items-center gap-4 hover:shadow-sm transition-all duration-200 ${borderClass}`}
    >
      {/* Avatar */}
      <div
        className={`bg-gradient-to-br ${candidate.avatarColor} w-10 h-10 rounded-full flex items-center justify-center shrink-0`}
      >
        <span className="font-syne text-[12px] font-bold text-white">
          {candidate.initials}
        </span>
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-syne text-[14px] font-semibold text-[#0D1B2A]">
            {candidate.name}
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${sourceBadge}`}
          >
            {candidate.source === 'ai_shortlisted' ? (
              <Sparkles size={9} />
            ) : (
              <User size={9} />
            )}
            {SOURCE_LABELS[candidate.source]}
          </span>
        </div>

        <p className="text-[12px] text-[#6B7A99] mt-0.5 truncate">
          {candidate.role} · {candidate.experience}
        </p>

        <div className="flex flex-wrap gap-1 mt-2">
          {candidate.skills.slice(0, 4).map(skill => (
            <span
              key={skill}
              className="bg-[#F4F7FF] text-[#6B7A99] text-[11px] px-2 py-0.5 rounded-md"
            >
              {skill}
            </span>
          ))}
          {candidate.skills.length > 4 && (
            <span className="text-[#6B7A99] text-[11px] px-1 py-0.5">
              +{candidate.skills.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Score + remove */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg font-syne text-[13px] font-bold ${scoreBadge}`}>
          {candidate.matchScore}%
        </span>

        {!isFinalized && (
          <button
            onClick={() => onRemove(candidate.id)}
            className="flex items-center gap-1 text-[#6B7A99] text-[11px] px-2 py-1 rounded-lg hover:bg-[#FFF0F0] hover:text-[#E63946] transition-all duration-150"
            aria-label={`Remove ${candidate.name}`}
          >
            <X size={11} />
            Remove
          </button>
        )}
      </div>
    </motion.div>
  )
}
