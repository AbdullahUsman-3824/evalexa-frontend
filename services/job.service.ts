import { apiRequest } from "@/lib/api-client";
import { API } from "@/constants/api";
import type {
  JobRecord,
  JobTitleRecord,
  JobQuery,
  SkillRecord,
  CreateJobPayload,
  UpdateJobPayload,
  Application,
  CandidateDetails,
  ResumeUploadResponse,
  PublicJobApplicationPayload,
  PublicJobApplicationResponse,
  PublicJob,
  PublicJobsQuery,
  PublicJobsResponse,
} from "@/types/job.types";

export async function getJobs(query?: JobQuery): Promise<JobRecord[]> {
  return apiRequest<JobRecord[]>(
    `${API.jobs}${buildJobsQueryString(query)}`,
    {},
  );
}

export function buildSkillsQueryString(query?: {
  category?: string;
  search?: string;
}) {
  const params = new URLSearchParams();
  if (query?.category?.trim()) params.set("category", query.category.trim());
  if (query?.search?.trim()) params.set("search", query.search.trim());

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

export function buildJobsQueryString(query?: JobQuery) {
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

export function buildPublicJobsQueryString(query?: PublicJobsQuery) {
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

export async function getJob(id: string): Promise<JobRecord> {
  return apiRequest<JobRecord>(API.jobs.jobById(id), {});
}

export async function getJobTitles(): Promise<JobTitleRecord[]> {
  return apiRequest<JobTitleRecord[]>(API.jobs.jobTitles, {});
}

export async function getSkills(query?: {
  category?: string;
  search?: string;
}): Promise<SkillRecord[]> {
  return apiRequest<SkillRecord[]>(
    `${API.jobs.skills}${buildSkillsQueryString(query)}`,
    {},
  );
}

export async function getSkillCategories(): Promise<string[]> {
  return apiRequest<string[]>(API.jobs.skillCategories, {});
}

export async function createSkill(payload: {
  name: string;
  category: string;
}): Promise<SkillRecord> {
  return apiRequest<SkillRecord>(API.jobs.skills, {
    method: "POST",
    data: JSON.stringify(payload),
  });
}

export async function updateSkill(
  id: string,
  payload: Partial<Pick<SkillRecord, "name" | "category">>,
): Promise<SkillRecord> {
  return apiRequest<SkillRecord>(API.jobs.skillById(id), {
    method: "PATCH",
    data: JSON.stringify(payload),
  });
}

export async function deleteSkill(id: string): Promise<void> {
  return apiRequest<void>(API.jobs.skillById(id), { method: "DELETE" });
}

export async function createJob(payload: CreateJobPayload): Promise<JobRecord> {
  return apiRequest<JobRecord>(API.jobs.jobs, {
    method: "POST",
    data: JSON.stringify(payload),
  });
}

export async function updateJob(
  id: string,
  payload: UpdateJobPayload,
): Promise<JobRecord> {
  return apiRequest<JobRecord>(API.jobs.jobById(id), {
    method: "PATCH",
    data: JSON.stringify(payload),
  });
}

export async function getApplicationsForJob(
  jobId: string,
): Promise<Application[]> {
  return apiRequest<Application[]>(API.jobs.applicationsForJob(jobId), {
    method: "GET",
  });
}

export async function getCandidateDetails(
  candidateId: string,
): Promise<CandidateDetails> {
  return apiRequest<CandidateDetails>(API.jobs.candidateById(candidateId), {
    method: "GET",
  });
}

/** Public: list open, non-expired jobs */
export async function getPublicJobs(
  query?: PublicJobsQuery,
): Promise<PublicJobsResponse> {
  return apiRequest<PublicJobsResponse>(
    `${API.jobs.publicJobs}${buildPublicJobsQueryString(query)}`,
    { method: "GET" },
  );
}

/** Public: small curated featured jobs */
export async function getPublicFeaturedJobs(): Promise<PublicJob[]> {
  return apiRequest<PublicJob[]>(API.jobs.publicFeaturedJobs, {
    method: "GET",
  });
}

/** Public: job detail by slug (only open + not expired) */
export async function getPublicJobBySlug(slug: string): Promise<PublicJob> {
  return apiRequest<PublicJob>(API.jobs.publicJobBySlug(slug), {
    method: "GET",
  });
}

/** Public: similar jobs to a slug */
export async function getPublicSimilarJobs(
  slug: string,
  limit = 6,
): Promise<PublicJob[]> {
  const qs = limit ? `?limit=${limit}` : "";
  return apiRequest<PublicJob[]>(`${API.jobs.publicSimilarJobs(slug)}${qs}`, {
    method: "GET",
  });
}

/** Submit a public job application as JSON (no auth). */
export async function submitPublicJobApplication(
  slug: string,
  payload: PublicJobApplicationPayload,
): Promise<PublicJobApplicationResponse> {
  return apiRequest<PublicJobApplicationResponse>(
    API.jobs.publicJobApply(slug),
    {
      method: "POST",
      data: payload,
    },
  );
}

/** Upload a resume so the backend can extract and return parsed profile data. */
export async function uploadPublicResume(
  file: File,
  candidateId?: string,
): Promise<ResumeUploadResponse> {
  const formData = new FormData();
  formData.append("file", file, file.name);

  return apiRequest<ResumeUploadResponse>(API.jobs.resumeUpload, {
    method: "POST",
    data: formData,
    params: candidateId ? { candidateId } : undefined,
  });
}
