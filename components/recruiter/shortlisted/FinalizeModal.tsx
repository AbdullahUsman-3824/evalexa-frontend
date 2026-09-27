'use client'

import { CheckCircle, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { FinalizeModalProps } from '@/lib/types/shortlist.types'

export default function FinalizeModal({
  isOpen,
  stats,
  onConfirm,
  onCancel,
}: FinalizeModalProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        key="finalize-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
        onClick={onCancel}
      >
        <motion.div
          key="finalize-card"
          initial={{ scale: 0.96, opacity: 0, y: 8 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl p-7 max-w-sm w-full shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="w-12 h-12 bg-[#E1F5EE] rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={24} className="text-[#00B37E]" />
          </div>

          {/* Title + subtitle */}
          <h2 className="font-syne text-[20px] font-bold text-[#0D1B2A] text-center leading-tight">
            Finalize Shortlist?
          </h2>
          <p className="text-[#6B7A99] text-[13px] text-center mt-1.5">
            This will send email notifications to all shortlisted candidates.
          </p>

          {/* Stats — horizontal, compact */}
          <div className="mt-5 grid grid-cols-4 gap-0 bg-[#F8FAFF] rounded-xl overflow-hidden border border-[#EEF2FF]">
            {[
              { value: stats.totalShortlisted, label: 'Total', color: 'text-[#1E6FFF]' },
              { value: stats.aiSelected, label: 'AI', color: 'text-[#00C2D1]' },
              { value: stats.manuallyAdded, label: 'Manual', color: 'text-[#FF9500]' },
              { value: stats.totalRejected, label: 'Rejected', color: 'text-[#6B7A99]' },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`py-3 text-center ${i < 3 ? 'border-r border-[#EEF2FF]' : ''}`}
              >
                <p className={`font-syne text-[20px] font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[#6B7A99] text-[11px] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Warning */}
          <div className="mt-4 bg-[#FFFBEB] rounded-xl px-3.5 py-3 flex items-start gap-2.5">
            <AlertTriangle size={14} className="text-[#FF9500] shrink-0 mt-0.5" />
            <p className="text-[#854F0B] text-[12px] leading-relaxed">
              This action cannot be undone. Candidates will be notified immediately.
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-5 flex gap-2.5">
            <button
              onClick={onCancel}
              className="flex-1 h-11 bg-white border border-[#E2E8F0] text-[#6B7A99] rounded-xl text-[13px] hover:border-[#CBD5E1] hover:text-[#0D1B2A] transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 h-11 bg-[#00B37E] text-white rounded-xl font-syne text-[14px] font-semibold flex items-center justify-center gap-2 hover:bg-[#009E6E] transition-colors"
            >
              <CheckCircle size={15} />
              Confirm
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
