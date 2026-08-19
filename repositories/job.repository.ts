import * as jobService from "@/services/job.service";
import type {
  BackendJobType,
  BackendExperienceLevel,
  BackendWorkModel,
  BackendJobStatus,
} from "@/types/job.types";

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

export const {
  getJobs,
  getJob,
  getJobSummary,
  getJobTitles,
  getSkills,
  getSkillCategories,
  createSkill,
  updateSkill,
  deleteSkill,
  createJob,
  updateJob,
  getApplicationsForJob,
  bulkUploadApplicantsForJob,
  getJobProcessingStatus,
  retryFailedApplicationsForJob,
  getCandidateDetails,
  getPublicJobs,
  getPublicFeaturedJobs,
  getPublicJobBySlug,
  getPublicSimilarJobs,
  submitPublicJobApplication,
  parsePublicResume,
} = jobService;
