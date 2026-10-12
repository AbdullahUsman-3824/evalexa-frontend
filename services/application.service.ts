import { apiRequest } from "@/lib/api-client";
import { API } from "@/constants/api";
import type {
  ShortlistedListResponse,
  RejectedListResponse,
  ShortlistListQuery,
  ShortlistOneResponse,
  ShortlistTopResponse,
  BulkShortlistResponse,
  SortOrder,
  SortOption,
} from "@/lib/types/shortlist.types";

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

/** Convenience: default sort/order for the shortlisted list. */
export function shortlistSortParams(
  sortBy: SortOption,
): { sortBy: SortOption; order: SortOrder } {
  const order: SortOrder = sortBy === "match_score" ? "desc" : "asc";
  return { sortBy, order };
}
