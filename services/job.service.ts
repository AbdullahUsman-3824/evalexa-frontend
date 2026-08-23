import { apiRequest } from "@/lib/api-client";
import { API } from "@/constants/api";
import type {
  JobRecord,
  JobTitleRecord,
  JobQuery,
  SkillRecord,
  CreateJobPayload,
  UpdateJobPayload,
  CandidateDetails,
  ResumeParsePreview,
  PublicJobApplicationPayload,
  PublicJobApplicationResponse,
  PublicJob,
  PublicJobsQuery,
  PublicJobsResponse,
  JobListRecord,
  ApplicationListResponse,
  ApplicationListQuery,
  JobSummaryRecord,
  JobProcessingStatusResponse,
  BulkUploadResponse,
  RetryFailedApplicationsResponse,
  ApplicationDetail,
} from "@/types/job.types";

// ...buildSkillsQueryString / buildJobsQueryString / buildPublicJobsQueryString unchanged...

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

export async function getJobs(query?: JobQuery): Promise<JobListRecord[]> {
  return apiRequest<JobListRecord[]>(
    `${API.jobs.list}${buildJobsQueryString(query)}`,
    {},
  );
}

export async function getJob(id: string): Promise<JobRecord> {
  return apiRequest<JobRecord>(API.jobs.jobById(id), {});
}

export async function getJobSummary(id: string): Promise<JobSummaryRecord> {
  return apiRequest<JobSummaryRecord>(`${API.jobs.jobById(id)}/summary`, {
    method: "GET",
  });
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
  return apiRequest<JobRecord>(API.jobs.create, {
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
  query?: ApplicationListQuery,
): Promise<ApplicationListResponse> {
  const params = new URLSearchParams();

  if (query?.page !== undefined) params.set("page", String(query.page));
  if (query?.limit !== undefined) params.set("limit", String(query.limit));
  if (query?.search?.trim()) params.set("search", query.search.trim());
  if (query?.status) params.set("status", query.status);
  if (query?.sortBy) params.set("sortBy", query.sortBy);
  if (query?.sortOrder) params.set("sortOrder", query.sortOrder);

  const queryString = params.toString();
  const response = await apiRequest<ApplicationListResponse>(
    `${API.jobs.applicationsForJob(jobId)}${queryString ? `?${queryString}` : ""}`,
    { method: "GET" },
  );

  return response;
}

export async function bulkUploadApplicantsForJob(
  jobId: string,
  files: File[],
  onUploadProgress?: (progressPercent: number) => void,
): Promise<BulkUploadResponse> {
  if (!files.length) {
    throw new Error("At least one resume file is required.");
  }

  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file, file.name);
  });

  return apiRequest<BulkUploadResponse>(API.jobs.bulkUploadApplicants(jobId), {
    method: "POST",
    data: formData,
    onUploadProgress: onUploadProgress
      ? (progressEvent) => {
          if (progressEvent.total && progressEvent.total > 0) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            onUploadProgress(percent);
          }
        }
      : undefined,
  });
}

export async function getCandidateDetails(
  candidateId: string,
): Promise<CandidateDetails> {
  return apiRequest<CandidateDetails>(API.jobs.candidateById(candidateId), {
    method: "GET",
  });
}

export async function getJobProcessingStatus(
  jobId: string,
): Promise<JobProcessingStatusResponse> {
  return apiRequest<JobProcessingStatusResponse>(
    API.processing.jobStatus(jobId),
    {
      method: "GET",
    },
  );
}

export async function retryFailedApplicationsForJob(
  jobId: string,
): Promise<RetryFailedApplicationsResponse> {
  return apiRequest<RetryFailedApplicationsResponse>(
    API.processing.retryFailedForJob(jobId),
    {
      method: "POST",
    },
  );
}

export async function getApplicationDetail(
  applicationId: string,
): Promise<ApplicationDetail> {
  return apiRequest<ApplicationDetail>(
    API.jobs.applicationById(applicationId),
    { method: "GET" },
  );
}

export async function getPublicJobs(
  query?: PublicJobsQuery,
): Promise<PublicJobsResponse> {
  return apiRequest<PublicJobsResponse>(
    `${API.jobs.publicJobs}${buildPublicJobsQueryString(query)}`,
    { method: "GET" },
  );
}

export async function getPublicFeaturedJobs(): Promise<PublicJob[]> {
  return apiRequest<PublicJob[]>(API.jobs.publicFeaturedJobs, {
    method: "GET",
  });
}

export async function getPublicJobBySlug(slug: string): Promise<PublicJob> {
  return apiRequest<PublicJob>(API.jobs.publicJobBySlug(slug), {
    method: "GET",
  });
}

export async function getPublicSimilarJobs(
  slug: string,
  limit = 6,
): Promise<PublicJob[]> {
  const qs = limit ? `?limit=${limit}` : "";
  return apiRequest<PublicJob[]>(`${API.jobs.publicSimilarJobs(slug)}${qs}`, {
    method: "GET",
  });
}

export async function parsePublicResume(
  file: File,
): Promise<ResumeParsePreview> {
  const formData = new FormData();
  formData.append("file", file, file.name);

  return apiRequest<ResumeParsePreview>(API.jobs.resumeParse, {
    method: "POST",
    data: formData,
  });
}
export async function submitPublicJobApplication(
  slug: string,
  payload: PublicJobApplicationPayload,
  resumeFile: File,
): Promise<PublicJobApplicationResponse> {
  const formData = new FormData();
  formData.append("file", resumeFile, resumeFile.name);
  formData.append("data", JSON.stringify(payload));

  return apiRequest<PublicJobApplicationResponse>(
    API.jobs.publicJobApply(slug),
    {
      method: "POST",
      data: formData,
    },
  );
}
