export type BackendJobType = "FULL_TIME" | "PART_TIME" | "CONTRACT";
export type BackendExperienceLevel = "JUNIOR" | "MID" | "SENIOR" | "LEAD";
export type BackendWorkModel = "ONSITE" | "REMOTE" | "HYBRID";
export type BackendJobStatus = "OPEN" | "CLOSED" | "DRAFT";
export type BackendSkillImportance = "REQUIRED" | "PREFERRED";
export type BackendEducationLevel =
  | "HIGH_SCHOOL"
  | "BACHELOR"
  | "MASTER"
  | "PHD"
  | "ANY";
export type BackendCurrency = "PKR" | "USD" | "EUR";
export type BackendSalaryPeriod = "MONTHLY" | "YEARLY";

export type JobSortBy = "newest" | "deadline";

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

export interface JobAiConfigRecord {
  id: number;
  jobId: string;
  minMatchScore: number;
  autoShortlistThreshold: number;
  enableAutoShortlist: boolean;
  enableAiInterview: boolean;
  aiInterviewThreshold: number;
  createdAt: string;
  updatedAt: string;
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


export interface JobRecord {
  id: string;
  slug: string;
  companyId: string;
  createdBy: string;

  title: string;
  department: string;
  description: string;
  responsibilities: string;

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

  createdAt: string;
  updatedAt: string;

  company: JobCompanyRecord;
  creator: JobCreatorRecord;
  aiConfig: JobAiConfigRecord | null;
  jobSkills: JobSkillRecord[];
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

export interface CreateJobSkillPayload {
  skillId?: string;
  name?: string;
  category?: string;
  importance: BackendSkillImportance;
  weight: number;
}

export interface CreateJobAiConfigPayload {
  enableAutoShortlist: boolean;
  enableAiInterview: boolean;
  resumeSelectionCount: number;
  interviewSelectionCount: number;
  minMatchScore?: number;
  autoShortlistThreshold?: number;
  aiInterviewThreshold?: number;
}

export interface CreateJobPayload {
  title: string;
  description: string;
  department: string;
  jobType: BackendJobType;
  experienceLevel: BackendExperienceLevel;
  educationLevel?: BackendEducationLevel;
  salary: {
    min: number;
    max: number;
    currency: BackendCurrency;
    period: BackendSalaryPeriod;
  };
  location: string;
  workModel: BackendWorkModel;
  status?: BackendJobStatus;
  applicationDeadline: string;
  skills: CreateJobSkillPayload[];
  responsibilities: string;
  aiConfig: CreateJobAiConfigPayload;
}

export interface UpdateJobPayload extends Omit<
  Partial<CreateJobPayload>,
  "aiConfig"
> {
  skills?: CreateJobSkillPayload[];
  aiConfig?: Partial<CreateJobAiConfigPayload>;
}

/* Application types */
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
  extractedExperience: number; // in months
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

/* Candidate Details types */
export interface CandidateResume {
  id: string;
  resumeUrl: string;
  fileName: string;
  description: string;
  parsedData: Record<string, unknown>;
  extractedSkills: string[];
  extractedExperience: number; // in months
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
  jobId: string;
  companyId: string;
};

export type PublicJobApplicationResponse = {
  applicationId: string;
  candidateId: string;
  resumeId: string;
  resumeUrl: string;
  status: "APPLIED";
};

/* Public-facing job types */
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
