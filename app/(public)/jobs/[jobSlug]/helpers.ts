/**
 * Helpers specific to the public job detail page.
 * Pure/formatting functions extracted from page.tsx.
 */

export function normalizeResponsibilities(
  responsibilities?: string | string[],
): string[] {
  if (Array.isArray(responsibilities)) {
    return responsibilities.map((item) => item.trim()).filter(Boolean);
  }
  if (typeof responsibilities === "string") {
    return responsibilities
      .split(/\r?\n/)
      .map((item) => item.replace(/^[-*\u2022]\s*/, "").trim())
      .filter(Boolean);
  }
  return [];
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const past = new Date(dateStr);
  const diffMs = now.getTime() - past.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Posted today";
  if (diffDays === 1) return "Posted 1 day ago";
  if (diffDays < 7) return `Posted ${diffDays} days ago`;
  if (diffDays < 14) return "Posted 1 week ago";
  if (diffDays < 30) return `Posted ${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 60) return "Posted 1 month ago";
  return `Posted ${Math.floor(diffDays / 30)} months ago`;
}

export function formatWorkMode(workModel: string): string {
  switch (workModel) {
    case "ONSITE": return "On-site";
    case "REMOTE": return "Remote";
    case "HYBRID": return "Hybrid";
    default: return workModel;
  }
}

export function formatJobType(jobType: string): string {
  switch (jobType) {
    case "FULL_TIME": return "Full-time";
    case "PART_TIME": return "Part-time";
    case "CONTRACT": return "Contract";
    default: return jobType;
  }
}

export function formatExperienceLevel(level: string): string {
  switch (level) {
    case "JUNIOR": return "Junior";
    case "MID": return "Mid-level";
    case "SENIOR": return "Senior";
    case "LEAD": return "Lead";
    default: return level;
  }
}

export function formatEducationLevel(level: string): string {
  switch (level) {
    case "BACHELOR": return "Bachelor's degree";
    case "MASTER": return "Master's degree";
    case "PHD": return "PhD";
    case "HIGH_SCHOOL": return "High school";
    default: return level;
  }
}

export function formatSalary(
  min: number,
  max: number,
  currency: string,
  period: string,
): string {
  const fmt = (n: number) => n.toLocaleString();
  const per = period === "MONTHLY" ? "/mo" : "/yr";
  return `${currency} ${fmt(min)} – ${fmt(max)}${per}`;
}
