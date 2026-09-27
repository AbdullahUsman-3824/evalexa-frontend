export type CandidateSource = 'ai_shortlisted' | 'manually_added'

export type RejectedSource = 'ai_rejected' | 'manually_rejected'

export type ToastType = 'success' | 'error' | 'info'

export type SortOption = 'match_score' | 'name' | 'source'

export interface ShortlistedCandidate {
  id: string
  name: string
  initials: string
  role: string
  avatarColor: string
  matchScore: number
  skills: string[]
  experience: string
  source: CandidateSource
}

export interface RejectedCandidate {
  id: string
  name: string
  initials: string
  role: string
  avatarColor: string
  matchScore: number
  skills: string[]
  experience: string
  rejectedSource: RejectedSource
}

export interface JobContext {
  id: string
  title: string
  company: string
  department: string
  applicantsCount: number
}

export interface ToastState {
  message: string
  type: ToastType
}

export interface ShortlistStats {
  totalShortlisted: number
  aiSelected: number
  manuallyAdded: number
  totalRejected: number
}

export interface FinalizeModalProps {
  isOpen: boolean
  stats: ShortlistStats
  onConfirm: () => void
  onCancel: () => void
}

export interface RemoveConfirmModalProps {
  candidateId: string | null
  candidateName: string
  onConfirm: (id: string) => void
  onCancel: () => void
}

export interface ShortlistedCardProps {
  candidate: ShortlistedCandidate
  onRemove: (id: string) => void
  isFinalized: boolean
}

export interface RejectedCandidateRowProps {
  candidate: RejectedCandidate
  isSelected: boolean
  onSelect: (id: string) => void
  onShortlist: (id: string) => void
}

export interface RejectedPanelProps {
  rejected: RejectedCandidate[]
  selectedIds: string[]
  topNValue: number
  onClose: () => void
  onTopNChange: (value: number) => void
  onApplyTopN: () => void
  onToggleSelect: (id: string) => void
  onBulkShortlist: () => void
  onClearSelection: () => void
  onManualShortlist: (id: string) => void
}

export interface FinalizeBarProps {
  stats: ShortlistStats
  isFinalized: boolean
  onSaveDraft: () => void
  onFinalize: () => void
}

export interface SummaryBannerProps {
  stats: ShortlistStats
  isFinalized: boolean
}

export interface BulkSelectorProps {
  topNValue: number
  selectedCount: number
  onTopNChange: (value: number) => void
  onApplyTopN: () => void
  onBulkShortlist: () => void
  onClearSelection: () => void
}

export interface JobContextBarProps {
  job: JobContext
  stats: ShortlistStats
  rejectedCount: number
  showRejectedPanel: boolean
  onViewRejected: () => void
}
