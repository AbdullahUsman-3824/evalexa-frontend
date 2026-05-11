import { apiRequest } from "@/lib/services/apiClient";
import { API_BASE_URL } from "@/lib/services/apiClient";

export type BackendJobType = "FULL_TIME" | "PART_TIME" | "CONTRACT";
export type BackendExperienceLevel = "JUNIOR" | "MID" | "SENIOR" | "LEAD";
export type BackendWorkModel = "ONSITE" | "REMOTE" | "HYBRID";
export type BackendJobStatus = "OPEN" | "CLOSED" | "DRAFT";
export type BackendSkillImportance = "REQUIRED" | "PREFERRED";

export type JobSortBy = "newest" | "deadline";

export interface JobSkillRecord {
  jobId: string;
  skillId: number;
  importance: BackendSkillImportance;
  weight: number;
  skill: {
    id: number;
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

export interface JobQuery {
  search?: string;
  status?: BackendJobStatus;
  jobType?: BackendJobType;
  workModel?: BackendWorkModel;
  sortBy?: JobSortBy;
}

export interface CreateJobSkillPayload {
  name: string;
  category: string;
  importance: BackendSkillImportance;
  weight: number;
}

export interface CreateJobPayload {
  title: string;
  description: string;
  jobType: BackendJobType;
  experienceLevel: BackendExperienceLevel;
  salaryMin: number;
  salaryMax: number;
  location: string;
  workModel: BackendWorkModel;
  status?: BackendJobStatus;
  applicationDeadline: string;
  skills: CreateJobSkillPayload[];
  aiConfig: {
    minMatchScore: number;
    autoShortlistThreshold: number;
    enableAutoShortlist: boolean;
    enableAiInterview: boolean;
    aiInterviewThreshold: number;
  };
}

export interface UpdateJobPayload extends Partial<CreateJobPayload> {
  skills?: CreateJobSkillPayload[];
  aiConfig?: CreateJobPayload["aiConfig"];
}

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

/** Submit a public job application using multipart/form-data (no auth). */
export async function submitPublicJobApplication(
  slug: string,
  formData: FormData,
): Promise<{ [key: string]: unknown }> {
  const endpoint = `/public/jobs/${encodeURIComponent(slug)}/apply`;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    body: formData,
    // Note: FormData will set Content-Type header automatically with boundary
  });

  const contentType = response.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(
      typeof body === "string"
        ? body || `Request failed (${response.status})`
        : typeof body === "object" && body?.message
          ? body.message
          : `Request failed (${response.status})`,
    );
  }

  return (typeof body === "object" && body) || {};
}
