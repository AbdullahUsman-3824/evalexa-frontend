'use client'

import { Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { RemoveConfirmModalProps } from '@/lib/types/shortlist.types'

export default function RemoveConfirmModal({
  candidateId,
  candidateName,
  onConfirm,
  onCancel,
}: RemoveConfirmModalProps) {
  if (!candidateId) return null

  return (
    <AnimatePresence>
      <motion.div
        key="remove-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
        onClick={onCancel}
      >
        <motion.div
          key="remove-card"
          initial={{ scale: 0.96, opacity: 0, y: 8 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 8 }}
          transition={{ duration: 0.18 }}
          className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="w-11 h-11 bg-[#FFF0F0] rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={20} className="text-[#E63946]" />
          </div>

          <h2 className="font-syne text-[18px] font-bold text-[#0D1B2A] text-center">
            Remove candidate?
          </h2>
          <p className="text-[#6B7A99] text-[13px] text-center mt-2 leading-relaxed">
            <span className="font-semibold text-[#0D1B2A]">{candidateName}</span> will
            be moved back to the rejected list.
          </p>

          <div className="mt-5 flex gap-2.5">
            <button
              onClick={onCancel}
              className="flex-1 h-10 bg-white border border-[#E2E8F0] rounded-xl text-[#6B7A99] text-[13px] hover:border-[#CBD5E1] hover:text-[#0D1B2A] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(candidateId)}
              className="flex-1 h-10 bg-[#E63946] text-white rounded-xl text-[13px] font-medium hover:bg-[#CC2F3B] transition-colors"
            >
              Remove
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
