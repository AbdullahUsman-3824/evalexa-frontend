import { apiRequest } from "@/lib/services/apiClient";

export type BackendJobType = "FULL_TIME" | "PART_TIME" | "CONTRACT";
export type BackendExperienceLevel = "JUNIOR" | "MID" | "SENIOR" | "LEAD";
export type BackendWorkModel = "ONSITE" | "REMOTE" | "HYBRID";
export type BackendJobStatus = "OPEN" | "CLOSED" | "DRAFT";
export type BackendSkillImportance = "REQUIRED" | "PREFERRED";

export type JobSortBy = "newest" | "deadline";

export interface JobSkillRecord {
  jobId: number;
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
  jobId: number;
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
  id: number;
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

export async function getJob(id: number): Promise<JobRecord> {
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
  id: number,
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
