// ───────────────────────────────────────────────────────────────
// Display-side unions (mirror the backend `toShortlistCard` output)
// ───────────────────────────────────────────────────────────────

/** Backend reports `ai_shortlisted` or `manually_shortlisted`. */
export type CandidateSource = 'ai_shortlisted' | 'manually_shortlisted'

/** Pool (not-shortlisted) rows always carry `not_shortlisted`. */
export type RejectedSource = 'not_shortlisted'

export type ToastType = 'success' | 'error' | 'info'

/** Shortlist list sort options (match the backend `ShortlistListQueryDto`). */
export type SortOption = 'match_score' | 'name' | 'source'

export type SortOrder = 'asc' | 'desc'

// ───────────────────────────────────────────────────────────────
// Display candidate shapes (API rows mapped to UI-friendly form)
// `id` is the applicationId — used for shortlist/unshortlist calls.
// `avatarColor` is derived client-side (the API returns no gradient).
// ───────────────────────────────────────────────────────────────

export interface ShortlistedCandidate {
  id: string
  candidateId: string
  name: string
  initials: string
  role: string
  avatarColor: string
  matchScore: number
  skills: string[]
  experience: string
  source: CandidateSource
  shortlistedAt: string
  overriddenAt: string | null
}

export interface RejectedCandidate {
  id: string
  candidateId: string
  name: string
  initials: string
  role: string
  avatarColor: string
  matchScore: number
  skills: string[]
  experience: string
  rejectedSource: RejectedSource
  rejectedAt: string
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
  isFinalized: boolean
  finalizedAt: string | null
}

// ───────────────────────────────────────────────────────────────
// Raw API response types
// ───────────────────────────────────────────────────────────────

export interface ShortlistJobInfo {
  id: string
  title: string
  company: string | null
  department: string | null
  applicantsCount: number
}

export interface ShortlistPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

/** Raw candidate row from GET /application/jobs/:jobId/shortlisted */
export interface ShortlistedCandidateApi {
  applicationId: string
  candidateId: string
  name: string
  initials: string
  role: string | null
  matchScore: number | null
  skills: string[]
  experience: string | null
  avatarUrl: string | null
  source: CandidateSource
  shortlistedAt: string
  overriddenAt: string | null
}

/** Raw candidate row from GET /application/jobs/:jobId/rejected (pool) */
export interface RejectedCandidateApi {
  applicationId: string
  candidateId: string
  name: string
  initials: string
  role: string | null
  matchScore: number | null
  skills: string[]
  experience: string | null
  avatarUrl: string | null
  rejectedSource: 'not_shortlisted'
  rejectedAt: string
}

export interface ShortlistStatsApi {
  totalShortlisted: number
  aiSelected: number
  manuallyAdded: number
  totalRejected: number
  isFinalized: boolean
  finalizedAt: string | null
}

export interface ShortlistedListResponse {
  success: boolean
  data: {
    job: ShortlistJobInfo
    candidates: ShortlistedCandidateApi[]
    stats: ShortlistStatsApi
    pagination: ShortlistPagination
  }
}

export interface RejectedListResponse {
  success: boolean
  data: {
    candidates: RejectedCandidateApi[]
    pagination: ShortlistPagination
  }
}

export interface ShortlistListQuery {
  page?: number
  limit?: number
  sortBy?: SortOption
  order?: SortOrder
  search?: string
}

// ───────────────────────────────────────────────────────────────
// Mutation response types
// ───────────────────────────────────────────────────────────────

export interface ShortlistOneResponse {
  success: boolean
  message: string
}

export interface ShortlistTopResponse {
  jobId: string
  requested: number
  shortlisted: number
  applicationIds: string[]
  skippedReason?: string
}

export interface BulkShortlistResponse {
  shortlistedCount: number
  failedCount: number
  failedIds: string[]
  message: string
}

// ───────────────────────────────────────────────────────────────
// Component prop interfaces
// ───────────────────────────────────────────────────────────────

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
  search: string
  isLoading: boolean
  onClose: () => void
  onTopNChange: (value: number) => void
  onApplyTopN: () => void
  onToggleSelect: (id: string) => void
  onBulkShortlist: () => void
  onClearSelection: () => void
  onManualShortlist: (id: string) => void
  onSearchChange: (value: string) => void
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
