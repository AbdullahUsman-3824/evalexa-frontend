/**
 * Pure helper functions for the recruiter applicants feature.
 * Extracted from ApplicantTable.tsx — no JSX, no React imports.
 */

import type { ScreeningStage } from "@/types/job.types";

/** Format an ISO date string as "Jan 1, 2025" style. */
export function formatAppliedDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Map a screeningStage enum value to a human-readable label. */
export function formatAiStatus(stage: ScreeningStage): string {
  switch (stage) {
    case "NOT_STARTED":
      return "Pending";
    case "IN_PROGRESS":
      return "Processing";
    case "COMPLETED":
      return "Done";
    default:
      return "Pending";
  }
}

/** Return the Tailwind badge classes for a given screeningStage. */
export function statusTone(stage: ScreeningStage): string {
  switch (stage) {
    case "COMPLETED":
      return "bg-success/10 text-success border border-success/20";
    case "IN_PROGRESS":
      return "bg-warning/15 text-warning border border-warning/20";
    default:
      return "bg-slate/10 text-slate border border-slate/20";
  }
}

/** Convert a numeric match score to a High / Medium / Low label. */
export function matchLabel(score: number | null): string {
  if (score === null) return "--";
  if (score >= 85) return "High";
  if (score >= 65) return "Medium";
  return "Low";
}

/** Return the Tailwind text-color class for a given match score. */
export function scoreTone(score: number | null): string {
  if (score === null) return "text-slate";
  if (score >= 85) return "text-success";
  if (score >= 65) return "text-warning";
  return "text-danger";
}
