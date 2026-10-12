import * as applicationService from "@/services/application.service";

export const {
  getShortlistedForJob,
  getRejectedPoolForJob,
  shortlistCandidate,
  unshortlistCandidate,
  shortlistTopN,
  bulkShortlistCandidates,
  shortlistSortParams,
} = applicationService;
