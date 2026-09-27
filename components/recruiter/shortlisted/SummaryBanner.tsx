'use client'

import { CheckCircle, PartyPopper } from 'lucide-react'
import type { SummaryBannerProps } from '@/lib/types/shortlist.types'

// This banner only renders when isFinalized = true.
// In non-finalized state, stats live in JobContextBar and FinalizeBar.
export default function SummaryBanner({ stats, isFinalized }: SummaryBannerProps) {
  if (!isFinalized) return null

  return (
    <div className="bg-[#00B37E] rounded-xl px-5 py-4 flex items-center gap-4">
      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
        <CheckCircle size={20} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-syne text-[15px] font-semibold text-white leading-tight">
          Shortlist finalized
        </p>
        <p className="text-white/70 text-[12px] mt-0.5">
          {stats.totalShortlisted} candidates notified · {stats.aiSelected} AI picks · {stats.manuallyAdded} manual adds
        </p>
      </div>
      <PartyPopper size={20} className="text-white/60 shrink-0" />
    </div>
  )
}
