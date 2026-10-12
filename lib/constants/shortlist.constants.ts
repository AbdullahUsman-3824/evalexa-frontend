import type {
  SortOption,
  CandidateSource,
  RejectedSource,
  JobContext,
} from '@/lib/types/shortlist.types'

export const TOP_N_OPTIONS = [3, 5, 10, 15, 20]

export const DEFAULT_TOP_N = 5

/** High enough to surface most shortlists / pools in one request. */
export const SHORTLIST_PAGE_LIMIT = 100

export const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Match Score', value: 'match_score' },
  { label: 'Name', value: 'name' },
  { label: 'Source', value: 'source' },
]

/** Labels mirror the backend `toShortlistCard` `source` values. */
export const SOURCE_LABELS: Record<CandidateSource, string> = {
  ai_shortlisted: 'AI Shortlisted',
  manually_shortlisted: 'Manually Added',
}

/** Pool rows always carry `not_shortlisted` from the backend. */
export const REJECTED_SOURCE_LABELS: Record<RejectedSource, string> = {
  not_shortlisted: 'Not Shortlisted',
}

/**
 * Fallback job context used before the first job loads or when the
 * shortlisted endpoint hasn't returned a job block yet.
 */
export const MOCK_JOB: JobContext = {
  id: '',
  title: '—',
  company: '',
  department: '',
  applicantsCount: 0,
}

export const TOAST_DURATION = 3000

export const PANEL_ANIMATION_DURATION = 300

/** Debounce window (ms) for the rejected-panel search input. */
export const REJECTED_SEARCH_DEBOUNCE = 350
