import { API } from "@/constants/api";
import { interviewRequest } from "@/lib/interview-client";
import {
  mockInterviewService,
  shouldUseMockInterviews,
} from "@/services/mock/interview.mock";
import type {
  ApiEnvelope,
  EligibleCandidate,
  ExtensionRequest,
  ExtensionRequestStatus,
  InterviewApplication,
  InviteStatus,
  Pagination,
  SendInvitationResult,
} from "@/types/interview.types";

const useMock = shouldUseMockInterviews();

const toLegacyInviteStatus = (
  value: string | null | undefined,
): InviteStatus => {
  switch (value) {
    case "SENT":
      return "SENT";
    case "EXPIRED":
      return "EXPIRED";
    case "STARTED":
      return "STARTED";
    case "COMPLETED":
      return "COMPLETED";
    case "TERMINATED":
      return "TERMINATED";
    default:
      return "NOT_SENT";
  }
};

const mapApplicationToEligibleCandidate = (
  application: InterviewApplication,
): EligibleCandidate => ({
  applicationId: application.id,
  interviewId: application.interviewId,
  name: application.candidateName,
  email: application.candidateEmail,
  jobTitle: application.jobTitle,
  inviteStatus: toLegacyInviteStatus(application.invitationDeliveryStatus),
  invitedAt: undefined,
});

const readDataList = <T>(payload: ApiEnvelope<T[]>) => {
  const items = Array.isArray(payload.data) ? payload.data : [];
  return {
    items,
    pagination: payload.pagination ?? {
      page: 1,
      limit: items.length,
      total: items.length,
      totalPages: 1,
    },
  };
};

export const interviewService = useMock
  ? mockInterviewService
  : {
      async listEligibleCandidates(): Promise<EligibleCandidate[]> {
        const payload = await interviewRequest<
          ApiEnvelope<InterviewApplication[]>
        >(API.interviews.applications, { method: "GET" });

        return readDataList(payload).items.map(
          mapApplicationToEligibleCandidate,
        );
      },

      async listExtensionRequests(options?: {
        status?: ExtensionRequestStatus;
        page?: number;
        limit?: number;
      }): Promise<{ items: ExtensionRequest[]; pagination: Pagination }> {
        const params = new URLSearchParams();
        if (options?.status) params.set("status", options.status);
        if (options?.page) params.set("page", String(options.page));
        if (options?.limit) params.set("limit", String(options.limit));

        const url = `${API.interviews.listExtensionRequests}${params.size ? `?${params.toString()}` : ""}`;
        const payload = await interviewRequest<ApiEnvelope<ExtensionRequest[]>>(
          url,
          {
            method: "GET",
          },
        );

        return readDataList(payload) as {
          items: ExtensionRequest[];
          pagination: Pagination;
        };
      },

      async sendInvitation(interviewId: string): Promise<SendInvitationResult> {
        const payload = await interviewRequest<
          ApiEnvelope<SendInvitationResult>
        >(API.interviews.sendInvitation(interviewId), { method: "POST" });

        return payload.data as SendInvitationResult;
      },

      async approveExtensionRequest(
        interviewId: string,
        requestId: string,
        decisionNote?: string,
      ): Promise<ExtensionRequest> {
        const payload = await interviewRequest<ApiEnvelope<ExtensionRequest>>(
          API.interviews.approveExtensionRequest(interviewId, requestId),
          {
            method: "POST",
            data: decisionNote?.trim()
              ? { decisionNote: decisionNote.trim() }
              : {},
          },
        );

        return payload.data as ExtensionRequest;
      },

      async rejectExtensionRequest(
        interviewId: string,
        requestId: string,
        decisionNote?: string,
      ): Promise<ExtensionRequest> {
        const payload = await interviewRequest<ApiEnvelope<ExtensionRequest>>(
          API.interviews.rejectExtensionRequest(interviewId, requestId),
          {
            method: "POST",
            data: decisionNote?.trim()
              ? { decisionNote: decisionNote.trim() }
              : {},
          },
        );

        return payload.data as ExtensionRequest;
      },
    };

export type InterviewService = typeof interviewService;

export default interviewService;
