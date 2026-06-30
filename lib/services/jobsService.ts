import {
  apiRequest,
  API_BASE_URL,
  parseApiResponse,
} from "@/lib/services/apiClient";

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
  id: number;
  name: string;
  logo: string | null;
  location: string | null;
}

export interface JobCreatorRecord {
  id: number;
  fullName: string;
  email: string;
}

export interface JobRecord {
  id: string;
  slug?: string;
  companyId: number;
  createdBy: number;
  title: string;
  description: string;
  jobType: BackendJobType;
  experienceLevel: BackendExperienceLevel;
  salaryMin: number;
  salaryMax: number;
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

export interface UpdateJobPayload extends Omit<Partial<CreateJobPayload>, "aiConfig"> {
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

export type ResumeUploadResponse = {
  candidateId: string;
  resumeId: string;
  resumeUrl: string;
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
  candidateId?: string;
  resumeId?: string;
  resumeUrl?: string;
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
  status: "APPLIED";
};

function buildQueryString(query?: JobQuery) {
  if (!query) return "";

  const searchParams = new URLSearchParams();

  if (query.search?.trim()) searchParams.set("search", query.search.trim());
  if (query.status) searchParams.set("status", query.status);
  if (query.jobType) searchParams.set("jobType", query.jobType);
  if (query.workModel) searchParams.set("workModel", query.workModel);
  if (query.sortBy) searchParams.set("sortBy", query.sortBy);

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export async function getJobs(query?: JobQuery): Promise<JobRecord[]> {
  return apiRequest<JobRecord[]>(`/jobs${buildQueryString(query)}`, {}, true);
}

export async function getJob(id: string): Promise<JobRecord> {
  return apiRequest<JobRecord>(`/jobs/${id}`, {}, true);
}

export async function getJobTitles(): Promise<JobTitleRecord[]> {
  return apiRequest<JobTitleRecord[]>("/jobs/titles", {}, true);
}

export async function getSkills(query?: {
  category?: string;
  search?: string;
}): Promise<SkillRecord[]> {
  const params = new URLSearchParams();
  if (query?.category?.trim()) params.set("category", query.category.trim());
  if (query?.search?.trim()) params.set("search", query.search.trim());

  const queryString = params.toString();
  return apiRequest<SkillRecord[]>(
    `/skills${queryString ? `?${queryString}` : ""}`,
    {},
    true,
  );
}

export async function getSkillCategories(): Promise<string[]> {
  return apiRequest<string[]>("/skills/categories", {}, true);
}

export async function createSkill(payload: {
  name: string;
  category: string;
}): Promise<SkillRecord> {
  return apiRequest<SkillRecord>(
    "/skills",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    true,
  );
}

export async function updateSkill(
  id: string,
  payload: Partial<Pick<SkillRecord, "name" | "category">>,
): Promise<SkillRecord> {
  return apiRequest<SkillRecord>(
    `/skills/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
    true,
  );
}

export async function deleteSkill(id: string): Promise<void> {
  return apiRequest<void>(`/skills/${id}`, { method: "DELETE" }, true);
}

export async function createJob(payload: CreateJobPayload): Promise<JobRecord> {
  return apiRequest<JobRecord>(
    "/jobs",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    true,
  );
}

export async function updateJob(
  id: string,
  payload: UpdateJobPayload,
): Promise<JobRecord> {
  return apiRequest<JobRecord>(
    `/jobs/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
    true,
  );
}

export async function getApplicationsForJob(
  jobId: string,
): Promise<Application[]> {
  return apiRequest<Application[]>(
    `/application/job/${jobId}`,
    { method: "GET" },
    true,
  );
}

export async function getCandidateDetails(
  candidateId: string,
): Promise<CandidateDetails> {
  return apiRequest<CandidateDetails>(
    `/candidate/${candidateId}`,
    { method: "GET" },
    true,
  );
}

function labelFromSegment(segment: string) {
  return segment
    .split(/[-_]/) // Split by both hyphens and underscores
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("-");
}

export function formatJobStatus(
  status: BackendJobStatus,
): "Published" | "Draft" | "Closed" {
  if (status === "OPEN") return "Published";
  if (status === "CLOSED") return "Closed";
  return "Draft";
}

export function formatJobType(jobType: BackendJobType) {
  return labelFromSegment(jobType);
}

export function formatWorkModel(workModel: BackendWorkModel) {
  return workModel === "ONSITE" ? "On-site" : labelFromSegment(workModel);
}

export function formatExperienceLevel(experienceLevel: BackendExperienceLevel) {
  switch (experienceLevel) {
    case "JUNIOR":
      return "Entry Level";
    case "MID":
      return "Mid Level";
    case "SENIOR":
      return "Senior Level";
    case "LEAD":
      return "Lead Level";
  }
}

export function formatJobDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelativeDays(dateString: string) {
  const targetDate = new Date(dateString);
  const now = new Date();
  targetDate.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const diffDays = Math.round(
    (now.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

export function formatCurrencyRange(min: number, max: number) {
  return `PKR ${min.toLocaleString()} - ${max.toLocaleString()}`;
}

/* Public-facing job types + endpoints */
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

function buildPublicJobsQueryString(query?: PublicJobsQuery) {
  if (!query) return "";

  const params = new URLSearchParams();

  if (query.page !== undefined) params.set("page", String(query.page));
  if (query.limit !== undefined) params.set("limit", String(query.limit));
  if (query.search?.trim()) params.set("search", query.search.trim());
  if (query.location?.trim()) params.set("location", query.location.trim());
  if (query.employmentType) params.set("employmentType", query.employmentType);
  if (query.experienceLevel)
    params.set("experienceLevel", query.experienceLevel);
  if (query.company?.trim()) params.set("company", query.company.trim());
  if (query.skills?.trim()) params.set("skills", query.skills.trim());
  if (query.sort) params.set("sort", query.sort);

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/** Public: list open, non-expired jobs */
export async function getPublicJobs(
  query?: PublicJobsQuery,
): Promise<PublicJobsResponse> {
  const qs = buildPublicJobsQueryString(query);
  return apiRequest<PublicJobsResponse>(`/public/jobs${qs}`, { method: "GET" });
}

/** Public: small curated featured jobs */
export async function getPublicFeaturedJobs(): Promise<PublicJob[]> {
  return apiRequest<PublicJob[]>(`/public/jobs/featured`, { method: "GET" });
}

/** Public: job detail by slug (only open + not expired) */
export async function getPublicJobBySlug(slug: string): Promise<PublicJob> {
  return apiRequest<PublicJob>(`/public/jobs/${encodeURIComponent(slug)}`, {
    method: "GET",
  });
}

/** Public: similar jobs to a slug */
export async function getPublicSimilarJobs(
  slug: string,
  limit = 6,
): Promise<PublicJob[]> {
  const qs = limit ? `?limit=${limit}` : "";
  return apiRequest<PublicJob[]>(
    `/public/jobs/${encodeURIComponent(slug)}/similar${qs}`,
    { method: "GET" },
  );
}

/** Submit a public job application as JSON (no auth). */
export async function submitPublicJobApplication(
  slug: string,
  payload: PublicJobApplicationPayload,
): Promise<PublicJobApplicationResponse> {
  const endpoint = `/public/jobs/${encodeURIComponent(slug)}/apply`;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseApiResponse<PublicJobApplicationResponse>(response);
}

/** Upload a resume so the backend can extract and return parsed profile data. */
export async function uploadPublicResume(
  file: File,
  candidateId?: string,
): Promise<ResumeUploadResponse> {
  const formData = new FormData();
  formData.append("file", file, file.name);

  const queryString = candidateId
    ? `?candidateId=${encodeURIComponent(candidateId)}`
    : "";

  const response = await fetch(`${API_BASE_URL}/resume/upload${queryString}`, {
    method: "POST",
    body: formData,
  });

  return parseApiResponse<ResumeUploadResponse>(response);
}
