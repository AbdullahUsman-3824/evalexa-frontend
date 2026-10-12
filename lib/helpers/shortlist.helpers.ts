import type {
  ShortlistedCandidate,
  RejectedCandidate,
  ShortlistedCandidateApi,
  RejectedCandidateApi,
  ShortlistStats,
  SortOption,
  CandidateSource,
  ShortlistStatsApi,
  ShortlistJobInfo,
  JobContext,
} from '@/lib/types/shortlist.types'

// ───────────────────────────────────────────────────────────────
// Avatar color — the API returns no gradient, so derive one
// deterministically from the candidate name so it stays stable.
// ───────────────────────────────────────────────────────────────

const AVATAR_GRADIENTS = [
  'from-[#1E6FFF] to-[#00C2D1]',
  'from-[#00C2D1] to-[#00B37E]',
  'from-[#FF9500] to-[#E63946]',
  'from-[#534AB7] to-[#1E6FFF]',
  'from-[#6B7A99] to-[#4A5568]',
  'from-[#00B37E] to-[#00C2D1]',
  'from-[#FF9500] to-[#1E6FFF]',
  'from-[#E63946] to-[#FF9500]',
]

export function avatarColorFromName(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  }
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length] ?? AVATAR_GRADIENTS[0]
}

// ───────────────────────────────────────────────────────────────
// API → display mapping
// `role` / `experience` are always null from the backend, so fall
// back to the job title / skill count so cards stay informative.
// ───────────────────────────────────────────────────────────────

export function mapShortlistedCandidate(
  api: ShortlistedCandidateApi,
  jobTitle: string,
): ShortlistedCandidate {
  return {
    id: api.applicationId,
    candidateId: api.candidateId,
    name: api.name,
    initials: api.initials,
    role: api.role ?? jobTitle,
    avatarColor: avatarColorFromName(api.name),
    matchScore: api.matchScore ?? 0,
    skills: api.skills,
    experience:
      api.experience ??
      (api.skills.length > 0 ? `${api.skills.length} skill${api.skills.length === 1 ? '' : 's'}` : '—'),
    source: api.source,
    shortlistedAt: api.shortlistedAt,
    overriddenAt: api.overriddenAt,
  }
}

export function mapRejectedCandidate(
  api: RejectedCandidateApi,
  jobTitle: string,
): RejectedCandidate {
  return {
    id: api.applicationId,
    candidateId: api.candidateId,
    name: api.name,
    initials: api.initials,
    role: api.role ?? jobTitle,
    avatarColor: avatarColorFromName(api.name),
    matchScore: api.matchScore ?? 0,
    skills: api.skills,
    experience:
      api.experience ??
      (api.skills.length > 0 ? `${api.skills.length} skill${api.skills.length === 1 ? '' : 's'}` : '—'),
    rejectedSource: api.rejectedSource,
    rejectedAt: api.rejectedAt,
  }
}

export function jobInfoToContext(
  job: ShortlistJobInfo,
): JobContext {
  return {
    id: job.id,
    title: job.title,
    company: job.company ?? '',
    department: job.department ?? '',
    applicantsCount: job.applicantsCount,
  }
}

export function statsApiToStats(stats: ShortlistStatsApi): ShortlistStats {
  return {
    totalShortlisted: stats.totalShortlisted,
    aiSelected: stats.aiSelected,
    manuallyAdded: stats.manuallyAdded,
    totalRejected: stats.totalRejected,
    isFinalized: stats.isFinalized,
    finalizedAt: stats.finalizedAt,
  }
}

/**
 * Stats used as a fallback when the endpoint payload is unavailable.
 */
export function calculateStats(
  shortlisted: ShortlistedCandidate[],
  rejected: RejectedCandidate[],
): ShortlistStats {
  return {
    totalShortlisted: shortlisted.length,
    aiSelected: shortlisted.filter((c) => c.source === 'ai_shortlisted').length,
    manuallyAdded: shortlisted.filter((c) => c.source === 'manually_shortlisted')
      .length,
    totalRejected: rejected.length,
    isFinalized: false,
    finalizedAt: null,
  }
}

/**
 * Sort shortlisted candidates by given option (client-side fallback).
 */
export function sortShortlisted(
  candidates: ShortlistedCandidate[],
  sortBy: SortOption,
): ShortlistedCandidate[] {
  return [...candidates].sort((a, b) => {
    switch (sortBy) {
      case 'match_score':
        return b.matchScore - a.matchScore
      case 'name':
        return a.name.localeCompare(b.name)
      case 'source':
        return a.source.localeCompare(b.source)
      default:
        return 0
    }
  })
}

/**
 * Get top N rejected candidates by match score (client-side fallback).
 */
export function getTopNRejected(
  rejected: RejectedCandidate[],
  n: number,
): RejectedCandidate[] {
  return [...rejected]
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, n)
}

/**
 * Pick a sensible default sort order per sort key.
 */
export function defaultOrderForSort(sortBy: SortOption): 'asc' | 'desc' {
  switch (sortBy) {
    case 'match_score':
      return 'desc'
    case 'name':
      return 'asc'
    case 'source':
      return 'asc'
    default:
      return 'asc'
  }
}

/**
 * Convert rejected candidate to shortlisted (client-side optimistic helper).
 */
export function toShortlisted(
  candidate: RejectedCandidate,
): ShortlistedCandidate {
  return {
    id: candidate.id,
    candidateId: candidate.candidateId,
    name: candidate.name,
    initials: candidate.initials,
    role: candidate.role,
    avatarColor: candidate.avatarColor,
    matchScore: candidate.matchScore,
    skills: candidate.skills,
    experience: candidate.experience,
    source: 'manually_shortlisted' as CandidateSource,
    shortlistedAt: new Date().toISOString(),
    overriddenAt: null,
  }
}

/**
 * Convert shortlisted candidate back to the pool (client-side optimistic helper).
 */
export function toRejected(
  candidate: ShortlistedCandidate,
): RejectedCandidate {
  return {
    id: candidate.id,
    candidateId: candidate.candidateId,
    name: candidate.name,
    initials: candidate.initials,
    role: candidate.role,
    avatarColor: candidate.avatarColor,
    matchScore: candidate.matchScore,
    skills: candidate.skills,
    experience: candidate.experience,
    rejectedSource: 'not_shortlisted',
    rejectedAt: new Date().toISOString(),
  }
}

/**
 * Get match score badge color classes based on score value
 */
export function getScoreBadgeClasses(score: number): string {
  if (score >= 90) return 'bg-[#E1F5EE] text-[#0F6E56]'
  if (score >= 70) return 'bg-[#EEF4FF] text-[#185FA5]'
  return 'bg-[#FFF3E0] text-[#854F0B]'
}

/**
 * Get score text color for rejected panel
 */
export function getScoreTextColor(score: number): string {
  if (score >= 70) return 'text-[#1E6FFF]'
  return 'text-[#6B7A99]'
}

/**
 * Get source badge classes for shortlisted card
 */
export function getSourceBadgeClasses(source: CandidateSource): string {
  switch (source) {
    case 'ai_shortlisted':
      return 'bg-[#E1F5FB] text-[#0A6E85]'
    case 'manually_shortlisted':
      return 'bg-[#FFF3E0] text-[#854F0B]'
    default:
      return 'bg-[#F4F7FF] text-[#6B7A99]'
  }
}

/**
 * Get left border class based on source
 */
export function getCardBorderClass(source: CandidateSource): string {
  switch (source) {
    case 'ai_shortlisted':
      return 'border-l-4 border-l-[#00C2D1]'
    case 'manually_shortlisted':
      return 'border-l-4 border-l-[#FF9500]'
    default:
      return ''
  }
}

/**
 * Check if finalize button should be enabled
 */
export function canFinalize(
  shortlisted: ShortlistedCandidate[],
  isFinalized: boolean,
): boolean {
  return shortlisted.length > 0 && !isFinalized
}

/**
 * Find candidate name by id from shortlisted array
 */
export function getCandidateName(
  id: string | null,
  shortlisted: ShortlistedCandidate[],
): string {
  if (!id) return ''
  return shortlisted.find((c) => c.id === id)?.name ?? ''
}

/**
 * Filter rejected candidates by search query (client-side fallback)
 */
export function filterRejected(
  rejected: RejectedCandidate[],
  query: string,
): RejectedCandidate[] {
  if (!query.trim()) return rejected
  const q = query.toLowerCase()
  return rejected.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      c.skills.some((s) => s.toLowerCase().includes(q)),
  )
}
