import { apiRequest } from "@/lib/api-client";
import { API } from "@/constants/api";
import type {
  ShortlistedListResponse,
  RejectedListResponse,
  ShortlistListQuery,
  ShortlistOneResponse,
  ShortlistTopResponse,
  BulkShortlistResponse,
  FinalizeShortlistResponse,
  SortOrder,
  SortOption,
} from "@/lib/types/shortlist.types";

import { shouldUseMockInterviews } from "@/services/mock/interview.mock";
import {
  mockGetHiredCandidates,
  mockHireCandidate,
} from "@/services/mock/hiring.mock";

import type {
  HireCandidateResponse,
  HiredCandidatesQuery,
  HiredCandidatesResponse,
} from "@/types/hiring.types";

function buildShortlistQuery(query?: ShortlistListQuery) {
  if (!query) return "";

  const params = new URLSearchParams();

  if (query.page !== undefined) params.set("page", String(query.page));
  if (query.limit !== undefined) params.set("limit", String(query.limit));
  if (query.sortBy) params.set("sortBy", query.sortBy);
  if (query.order) params.set("order", query.order);
  if (query.search?.trim()) params.set("search", query.search.trim());

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/**
 * GET /application/jobs/:jobId/shortlisted
 * Shortlisted candidates + job block + stats + pagination.
 */
export async function getShortlistedForJob(
  jobId: string,
  query?: ShortlistListQuery,
): Promise<ShortlistedListResponse> {
  return apiRequest<ShortlistedListResponse>(
    `${API.application.shortlistedForJob(jobId)}${buildShortlistQuery(query)}`,
    { method: "GET" },
  );
}

/**
 * GET /application/jobs/:jobId/rejected
 * Pool of not-shortlisted (status APPLIED) candidates + pagination.
 */
export async function getRejectedPoolForJob(
  jobId: string,
  query?: ShortlistListQuery,
): Promise<RejectedListResponse> {
  return apiRequest<RejectedListResponse>(
    `${API.application.rejectedForJob(jobId)}${buildShortlistQuery(query)}`,
    { method: "GET" },
  );
}

/**
 * POST /application/:id/shortlist — shortlist a single candidate.
 * Idempotent if already shortlisted.
 */
export async function shortlistCandidate(
  applicationId: string,
): Promise<ShortlistOneResponse> {
  return apiRequest<ShortlistOneResponse>(
    API.application.shortlistOne(applicationId),
    { method: "POST" },
  );
}

/**
 * POST /application/:id/unshortlist — move a shortlisted candidate back to the pool.
 */
export async function unshortlistCandidate(
  applicationId: string,
): Promise<ShortlistOneResponse> {
  return apiRequest<ShortlistOneResponse>(
    API.application.unshortlistOne(applicationId),
    { method: "POST" },
  );
}

/**
 * POST /application/jobs/:jobId/shortlist-top — shortlist top N by rank.
 */
export async function shortlistTopN(
  jobId: string,
  count: number,
): Promise<ShortlistTopResponse> {
  return apiRequest<ShortlistTopResponse>(API.application.shortlistTop(jobId), {
    method: "POST",
    data: JSON.stringify({ count }),
  });
}

/**
 * POST /application/jobs/:jobId/bulk-shortlist — shortlist many by IDs.
 */
export async function bulkShortlistCandidates(
  jobId: string,
  applicationIds: string[],
): Promise<BulkShortlistResponse> {
  return apiRequest<BulkShortlistResponse>(
    API.application.bulkShortlist(jobId),
    {
      method: "POST",
      data: JSON.stringify({ applicationIds }),
    },
  );
}

/**
 * POST /application/jobs/:jobId/finalize-shortlist
 * Finalizes the shortlist for a job (candidates get notified by the backend).
 */
export async function finalizeShortlist(
  jobId: string,
): Promise<FinalizeShortlistResponse> {
  return apiRequest<FinalizeShortlistResponse>(
    API.application.finalizeShortlist(jobId),
    { method: "POST" },
  );
}

/** Convenience: default sort/order for the shortlisted list. */
export function shortlistSortParams(
  sortBy: SortOption,
): { sortBy: SortOption; order: SortOrder } {
  const order: SortOrder = sortBy === "match_score" ? "desc" : "asc";
  return { sortBy, order };
}

/**
 * POST /application/:id/hire
 * Marks an application (INTERVIEW or OFFER status) as HIRED.
 * `sendEmail` is optional on the backend and defaults to false.
 */
export async function hireCandidate(
  applicationId: string,
  sendEmail: boolean,
): Promise<HireCandidateResponse> {
  if (shouldUseMockInterviews()) return mockHireCandidate(applicationId, sendEmail);
  return apiRequest<HireCandidateResponse>(API.application.hireOne(applicationId), {
    method: "POST",
    data: { sendEmail },
  });
}

/**
 * GET /application/hired?jobId=<optional>&page=1&limit=20
 * Hired candidates (contact details, job, match score, dates) + pagination.
 */
export async function getHiredCandidates(
  query?: HiredCandidatesQuery,
): Promise<HiredCandidatesResponse> {
   if (shouldUseMockInterviews()) return mockGetHiredCandidates(query);
  const params = new URLSearchParams();
  if (query?.jobId) params.set("jobId", query.jobId);
  if (query?.page !== undefined) params.set("page", String(query.page));
  if (query?.limit !== undefined) params.set("limit", String(query.limit));

  const qs = params.toString();
  return apiRequest<HiredCandidatesResponse>(
    `${API.application.hiredList}${qs ? `?${qs}` : ""}`,
    { method: "GET" },
  );
}

/**
 * Collects the applicationId of every hired candidate (all pages) so other
 * screens can hide candidates who are already hired.
 */
export async function getAllHiredApplicationIds(): Promise<Set<string>> {
  const ids = new Set<string>();
  const limit = 50;
  const maxPages = 20;
  let page = 1;
  let totalPages = 1;

  do {
    const response = await getHiredCandidates({ page, limit });
    const items = Array.isArray(response?.data) ? response.data : [];
    items.forEach((item) => ids.add(item.applicationId));
    totalPages = response?.pagination?.totalPages ?? 1;
    page += 1;
  } while (page <= totalPages && page <= maxPages);

  return ids;
}
