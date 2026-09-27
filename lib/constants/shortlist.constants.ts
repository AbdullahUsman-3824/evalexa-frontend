import type {
  SortOption,
  CandidateSource,
  RejectedSource,
  ShortlistedCandidate,
  RejectedCandidate,
  JobContext,
} from '@/lib/types/shortlist.types'

export const TOP_N_OPTIONS = [3, 5, 10, 15, 20]

export const DEFAULT_TOP_N = 5

export const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Match Score', value: 'match_score' },
  { label: 'Name', value: 'name' },
  { label: 'Source', value: 'source' },
]

export const SOURCE_LABELS: Record<CandidateSource, string> = {
  ai_shortlisted: 'AI Shortlisted',
  manually_added: 'Manually Added',
}

export const REJECTED_SOURCE_LABELS: Record<RejectedSource, string> = {
  ai_rejected: 'Below AI Threshold',
  manually_rejected: 'Manually Rejected',
}

export const MOCK_JOB: JobContext = {
  id: 'job-1',
  title: 'Frontend Developer',
  company: 'TechCorp Inc.',
  department: 'Engineering',
  applicantsCount: 42,
}

export const MOCK_SHORTLISTED: ShortlistedCandidate[] = [
  {
    id: 'c1',
    name: 'Ayesha Khan',
    initials: 'AK',
    role: 'Senior Frontend Developer',
    avatarColor: 'from-[#1E6FFF] to-[#00C2D1]',
    matchScore: 94,
    skills: ['React', 'TypeScript', 'Node.js'],
    experience: '4 years',
    source: 'ai_shortlisted',
  },
  {
    id: 'c2',
    name: 'Usman Hassan',
    initials: 'UH',
    role: 'Frontend Engineer',
    avatarColor: 'from-[#00C2D1] to-[#00B37E]',
    matchScore: 91,
    skills: ['Vue.js', 'JavaScript', 'CSS'],
    experience: '3 years',
    source: 'ai_shortlisted',
  },
  {
    id: 'c3',
    name: 'Sara Malik',
    initials: 'SM',
    role: 'React Developer',
    avatarColor: 'from-[#FF9500] to-[#E63946]',
    matchScore: 88,
    skills: ['React', 'Redux', 'Tailwind'],
    experience: '2 years',
    source: 'ai_shortlisted',
  },
  {
    id: 'c4',
    name: 'Ali Raza',
    initials: 'AR',
    role: 'UI Developer',
    avatarColor: 'from-[#1E6FFF] to-[#534AB7]',
    matchScore: 76,
    skills: ['HTML', 'CSS', 'JavaScript'],
    experience: '2 years',
    source: 'manually_added',
  },
]

export const MOCK_REJECTED: RejectedCandidate[] = [
  {
    id: 'r1',
    name: 'Bilal Ahmed',
    initials: 'BA',
    role: 'Junior Developer',
    avatarColor: 'from-[#6B7A99] to-[#4A5568]',
    matchScore: 68,
    skills: ['JavaScript', 'HTML'],
    experience: '1 year',
    rejectedSource: 'ai_rejected',
  },
  {
    id: 'r2',
    name: 'Hina Nawaz',
    initials: 'HN',
    role: 'Frontend Dev',
    avatarColor: 'from-[#00B37E] to-[#00C2D1]',
    matchScore: 65,
    skills: ['React', 'CSS'],
    experience: '1.5 years',
    rejectedSource: 'ai_rejected',
  },
  {
    id: 'r3',
    name: 'Kamran Iqbal',
    initials: 'KI',
    role: 'Web Developer',
    avatarColor: 'from-[#FF9500] to-[#1E6FFF]',
    matchScore: 58,
    skills: ['jQuery', 'Bootstrap'],
    experience: '2 years',
    rejectedSource: 'manually_rejected',
  },
  {
    id: 'r4',
    name: 'Zara Siddiqui',
    initials: 'ZS',
    role: 'React Developer',
    avatarColor: 'from-[#E63946] to-[#FF9500]',
    matchScore: 55,
    skills: ['React', 'Firebase'],
    experience: '1 year',
    rejectedSource: 'ai_rejected',
  },
  {
    id: 'r5',
    name: 'Omar Farooq',
    initials: 'OF',
    role: 'Frontend Intern',
    avatarColor: 'from-[#534AB7] to-[#1E6FFF]',
    matchScore: 48,
    skills: ['HTML', 'CSS', 'Vue'],
    experience: '6 months',
    rejectedSource: 'ai_rejected',
  },
]

export const TOAST_DURATION = 3000

export const PANEL_ANIMATION_DURATION = 300
