/* =========================
   Backend enums / unions
========================= */

export type BackendJobType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERN"
  | "FREELANCE";

export type BackendExperienceLevel =
  | "INTERN"
  | "JUNIOR"
  | "MID"
  | "SENIOR"
  | "LEAD";

export type BackendWorkModel = "ONSITE" | "REMOTE" | "HYBRID";

export type BackendJobStatus = "DRAFT" | "OPEN" | "CLOSED" | "ARCHIVED";

export type BackendSkillImportance = "REQUIRED" | "PREFERRED";

export type BackendEducationLevel =
  | "HIGH_SCHOOL"
  | "DIPLOMA"
  | "ASSOCIATE"
  | "BACHELOR"
  | "MASTER"
  | "PHD"
  | "ANY";

export type BackendCurrency = "PKR" | "USD" | "EUR";

export type BackendSalaryPeriod = "HOURLY" | "MONTHLY" | "YEARLY";

export type JobSortBy = "newest" | "deadline";

export type ApplicationListSortBy = "rankPosition" | "matchScore" | "appliedAt";
export type ApplicationListSortOrder = "asc" | "desc";

/* =========================
   Form UI label types
   (human-readable labels used inside the multi-step job form;
    mapped to backend enums before submitting)
========================= */

export type FormJobType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Internship"
  | "Freelance";

export type FormWorkMode = "On-site" | "Remote" | "Hybrid";

export type FormExperienceLevel =
  | "Intern"
  | "Entry"
  | "Mid"
  | "Senior"
  | "Lead";

export type FormEducationLevel =
  | "Any"
  | "High School"
  | "Diploma"
  | "Associate"
  | "Bachelor's"
  | "Master's"
  | "PhD";

/** Skill as held in form state — includes display fields for the UI table. */
export interface FormSkill {
  skillId: string;
  name: string;
  category: string;
  importance: BackendSkillImportance;
  /** 1–100 weighting used by the AI ranking engine. */
  weight: number;
}

/**
 * Internal state shape for the multi-step job creation / edit form.
 * Uses FormJobType / FormWorkMode / etc. so step components can render
 * values directly. JobForm.tsx maps these to backend enums on submit.
 */
export interface JobPostFormData {
  // Step 1 — Basic info
  title: string;
  department: string;
  jobType: FormJobType;
  workModel: FormWorkMode;
  location: string;
  applicationDeadline: string;

  // Step 2 — Requirements
  salaryMin: string;
  salaryMax: string;
  currency: BackendCurrency;
  salaryPer: BackendSalaryPeriod;
  experienceLevel: FormExperienceLevel;
  educationLevel: FormEducationLevel;
  skills: FormSkill[];
  description: string;
  totalOpenings: number;

  // Step 3 — AI config
  enableRanking: boolean;
  enableAutoShortlisting: boolean;
  shortlistLimit: number;
  minimumMatchScore: number;
  enableAiInterview: boolean;
  interviewLimit: number | null;
}

/* =========================
   Nested records
========================= */

export interface JobSkillRecord {
  jobId: string;
  skillId: string;
  importance: BackendSkillImportance;
  weight: number;
  skill: {
    id: string;
    name: string;
    category: string;
  };
}

/** Current AI config shape (matches create payload) */
export interface JobAiConfigRecord {
  id?: number | string;
  jobId?: string;
  enableRanking: boolean;
  enableAutoShortlisting: boolean;
  shortlistLimit: number;
  minimumMatchScore: number;
  enableAiInterview: boolean;
  interviewLimit: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobCompanyRecord {
  id: string;
  name: string;
  logo: string | null;
  location: string | null;
}

export interface JobCreatorRecord {
  id: string;
  fullName: string;
  email: string;
}

export interface JobSalaryRecord {
  min: number;
  max: number;
  currency: BackendCurrency;
  period: BackendSalaryPeriod;
}

/* =========================
   Job records
========================= */

export interface JobRecord {
  id: string;
  companyId: string;
  createdBy: string;
  title: string;
  slug: string;
  department: string;
  description: string;

  jobType: BackendJobType;
  experienceLevel: BackendExperienceLevel;
  educationLevel: BackendEducationLevel;

  salaryMin: number;
  salaryMax: number;
  salaryCurrency: BackendCurrency;
  salaryPeriod: BackendSalaryPeriod;

  location: string;
  workModel: BackendWorkModel;
  status: BackendJobStatus;

  applicationDeadline: string;
  totalOpenings: number;

  createdAt: string;
  updatedAt: string;

  company: JobCompanyRecord;
  creator: JobCreatorRecord;
  aiConfig: JobAiConfigRecord | null;
  jobSkills: JobSkillRecord[];
}

export interface JobSummaryRecord {
  id: string;
  title: string;
  openings: number;
  applications: number;
}

export interface JobListRecord {
  id: string;
  title: string;
  applicationDeadline: string;
  status: BackendJobStatus;
  applications: number;
}

export interface JobTitleRecord {
  id: string;
  title: string;
  slug?: string;
}

export interface JobQuery {
  search?: string;
  status?: BackendJobStatus;
  jobType?: BackendJobType;
  workModel?: BackendWorkModel;
  sortBy?: JobSortBy;
}

export interface SkillRecord {
  id: string;
  name: string;
  category: string;
}

/* =========================
   Create / Update payloads
========================= */

export interface CreateJobSkillPayload {
  skillId: string;
  importance: BackendSkillImportance;
  weight: number;
}

export interface CreateJobAiConfigPayload {
  enableRanking: boolean;
  enableAutoShortlisting: boolean;
  shortlistLimit: number;
  minimumMatchScore: number;
  enableAiInterview: boolean;
  interviewLimit: number | null;
}

export interface CreateJobPayload {
  title: string;
  department: string;
  location: string;
  jobType: BackendJobType;
  workModel: BackendWorkModel;
  description: string;
  applicationDeadline: string; // ISO 8601, e.g. "2026-09-30T23:59:59.000Z"
  experienceLevel: BackendExperienceLevel;
  educationLevel: BackendEducationLevel;
  salary: {
    min: number;
    max: number;
    currency: BackendCurrency;
    period: BackendSalaryPeriod;
  };
  status: BackendJobStatus;
  totalOpenings: number;
  skills: CreateJobSkillPayload[];
  aiConfig: CreateJobAiConfigPayload;
}

export type UpdateJobPayload = Partial<
  Omit<CreateJobPayload, "aiConfig" | "skills">
> & {
  skills?: CreateJobSkillPayload[];
  aiConfig?: Partial<CreateJobAiConfigPayload>;
};

/* =========================
   Application types
========================= */

export type ApplicationStatus =
  | "APPLIED"
  | "SCREENING"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "OFFER"
  | "REJECTED"
  | "HIRED";

export type ScreeningStage = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export type ApplicationSource = "FORM_FILL" | "RESUME" | "BULK_UPLOAD";

export interface ApplicationCandidate {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
}

export interface ApplicationResume {
  id: string;
  resumeUrl: string;
  extractedEducation: string;
  extractedExperience: number; // months
  uploadedAt: string;
}

export interface Application {
  id: string;
  status: ApplicationStatus;
  screeningStage: ScreeningStage;
  source: ApplicationSource;
  matchScore: number;
  rankPosition: number;
  isAutoShortlisted: boolean;
  appliedAt: string;
  updatedAt: string;
  candidate: ApplicationCandidate;
  resume: ApplicationResume;
}

export interface ApplicationListResponse {
  data: Application[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApplicationListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: ApplicationStatus;
  sortBy?: ApplicationListSortBy;
  sortOrder?: ApplicationListSortOrder;
}

export type ProcessingStatusValue =
  | "PENDING"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED"
  | "SKIPPED";

export type ProcessingTaskTypeValue =
  | "RESUME_PARSE"
  | "RESUME_ANALYSIS"
  | "RANKING"
  | "SHORTLISTING"
  | "AI_INTERVIEW"
  | "EMAIL_NOTIFICATION";

export interface JobProcessingProgress {
  total: number;
  completed: number;
  processing: number;
  failed: number;
}

export interface JobProcessingLastError {
  message?: string;
  [key: string]: unknown;
}

export interface JobProcessingStatusResponse {
  jobId: string;
  jobProcessingId: string;
  status: ProcessingStatusValue;
  currentTask: ProcessingTaskTypeValue | null;
  progress: JobProcessingProgress;
  startedAt: string | null;
  completedAt: string | null;
  retryCount: number;
  lastError: JobProcessingLastError | null;
}

export interface RetryFailedApplicationResult {
  applicationId: string;
  taskId: string;
  taskType: ProcessingTaskTypeValue;
  jobName: string;
}

export interface RetryFailedApplicationsResponse {
  jobId: string;
  retried: number;
  results: RetryFailedApplicationResult[];
}

export interface BulkUploadApplicationResult {
  applicationId: string;
  candidateId: string;
  resumeId: string;
  fileName: string;
}

export interface BulkUploadErrorResult {
  fileName: string;
  reason: string;
}

export interface BulkUploadResponse {
  jobId: string;
  companyId: string;
  accepted: number;
  rejected: number;
  applications: BulkUploadApplicationResult[];
  errors: BulkUploadErrorResult[];
}

/* =========================
   Candidate details
========================= */

export interface CandidateResume {
  id: string;
  resumeUrl: string;
  fileName: string;
  description: string;
  parsedData: Record<string, unknown>;
  extractedSkills: Array<{ name: string; category?: string }>;
  extractedExperience: number; // months
  extractedEducation: string;
  isPrimary: boolean;
  uploadedAt: string;
}

export interface CandidateApplication {
  id: string;
  jobId: string;
  companyId: string;
  resumeId: string;
  source: ApplicationSource;
  status: ApplicationStatus;
  screeningStage: ScreeningStage;
  matchScore: number;
  rankPosition: number;
  isAutoShortlisted: boolean;
  appliedAt: string;
  updatedAt: string;
  job: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface CandidateDetails {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  portfolioUrl: string;
  location: string;
  _count: {
    resumes: number;
    applications: number;
  };
  resumes: CandidateResume[];
  applications: CandidateApplication[];
}

export type ResumeParsePreview = {
  personal: {
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string | null;
    headline: string | null;
    address: string | null;
    linkedinUrl: string | null;
  };
  education: Array<{
    degree: string | null;
    field: string | null;
    institution: string | null;
    startDate: string | null;
    endDate: string | null;
    grade: string | null;
  }>;
  experience: Array<{
    title: string | null;
    company: string | null;
    startDate: string | null;
    endDate: string | null;
    isCurrent: boolean;
    description: string | null;
  }>;
  skills: Array<{ name: string; category?: string }>;
};

export type PublicJobApplicationPayload = {
  personal: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    headline?: string;
    address?: string;
  };
  education: Array<{
    school: string;
    fieldOfStudy?: string;
    degree?: string;
    startDate?: string;
    endDate?: string;
  }>;
  experience: Array<{
    title: string;
    company?: string;
    industry?: string;
    summary?: string;
    startDate?: string;
    endDate?: string;
    isCurrent?: boolean;
  }>;
  skills: Array<{ name: string; category?: string }>;
};

export type PublicJobApplicationResponse = {
  applicationId: string;
  candidateId: string;
  resumeId: string;
  resumeUrl: string;
  status: "APPLIED";
};

/* =========================
   Public-facing job types
========================= */

export type PublicJobSkill = {
  importance: BackendSkillImportance;
  weight: number;
  skill: {
    id: string;
    name: string;
    category: string;
  };
};

export type PublicJobCompany = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  industry: string;
  companySize: string;
  website: string | null;
  location: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PublicJob = {
  id: string;
  title: string;
  slug: string;
  description: string;
  responsibilities?: string | string[];
  jobType: BackendJobType;
  experienceLevel: BackendExperienceLevel;
  salaryMin: number | null;
  salaryMax: number | null;
  location: string;
  workModel: BackendWorkModel;
  status: BackendJobStatus;
  applicationDeadline: string;
  createdAt: string;
  updatedAt: string;
  company: PublicJobCompany;
  jobSkills: PublicJobSkill[];
};

export type PublicJobsPagination = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PublicJobsResponse = {
  items: PublicJob[];
  pagination: PublicJobsPagination;
};

export type PublicJobsQuery = {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  employmentType?: BackendJobType;
  experienceLevel?: BackendExperienceLevel;
  company?: string;
  skills?: string; // comma-separated
  sort?: "newest" | "oldest" | "deadline" | "salary-high" | "salary-low";
};
