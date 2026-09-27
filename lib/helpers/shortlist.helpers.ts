import type {
  ShortlistedCandidate,
  RejectedCandidate,
  ShortlistStats,
  SortOption,
  CandidateSource,
} from '@/lib/types/shortlist.types'

/**
 * Calculate stats from current shortlisted and rejected arrays
 */
export function calculateStats(
  shortlisted: ShortlistedCandidate[],
  rejected: RejectedCandidate[],
): ShortlistStats {
  return {
    totalShortlisted: shortlisted.length,
    aiSelected: shortlisted.filter(c => c.source === 'ai_shortlisted').length,
    manuallyAdded: shortlisted.filter(c => c.source === 'manually_added').length,
    totalRejected: rejected.length,
  }
}

/**
 * Sort shortlisted candidates by given option
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
 * Get top N rejected candidates by match score
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
 * Convert rejected candidate to shortlisted with manually_added source
 */
export function toShortlisted(
  candidate: RejectedCandidate,
): ShortlistedCandidate {
  return {
    id: candidate.id,
    name: candidate.name,
    initials: candidate.initials,
    role: candidate.role,
    avatarColor: candidate.avatarColor,
    matchScore: candidate.matchScore,
    skills: candidate.skills,
    experience: candidate.experience,
    source: 'manually_added' as CandidateSource,
  }
}

/**
 * Convert shortlisted candidate back to rejected with manually_rejected source
 */
export function toRejected(
  candidate: ShortlistedCandidate,
): RejectedCandidate {
  return {
    id: candidate.id,
    name: candidate.name,
    initials: candidate.initials,
    role: candidate.role,
    avatarColor: candidate.avatarColor,
    matchScore: candidate.matchScore,
    skills: candidate.skills,
    experience: candidate.experience,
    rejectedSource: 'manually_rejected',
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
    case 'manually_added':
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
    case 'manually_added':
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
  return shortlisted.find(c => c.id === id)?.name ?? ''
}

/**
 * Filter rejected candidates by search query
 */
export function filterRejected(
  rejected: RejectedCandidate[],
  query: string,
): RejectedCandidate[] {
  if (!query.trim()) return rejected
  const q = query.toLowerCase()
  return rejected.filter(
    c =>
      c.name.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      c.skills.some(s => s.toLowerCase().includes(q)),
  )
}
