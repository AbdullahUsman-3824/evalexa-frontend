import { API } from "@/constants/api";
import { interviewRequest } from "@/lib/interview-client";
import {
  mockInterviewService,
  shouldUseMockInterviews,
} from "@/services/mock/interview.mock";
import type {
  EligibleCandidate,
  InviteStatus,
  ReinviteRequest,
} from "@/types/interview.types";

const useMock = shouldUseMockInterviews();

export const interviewService = useMock
  ? mockInterviewService
  : {
      async listEligibleCandidates(): Promise<EligibleCandidate[]> {
        return interviewRequest<EligibleCandidate[]>(
          API.interviews.eligibleCandidates,
          {
            method: "GET",
          },
        );
      },

      async getReinviteRequests(): Promise<ReinviteRequest[]> {
        return interviewRequest<ReinviteRequest[]>(
          API.interviews.reinviteRequests,
          {
            method: "GET",
          },
        );
      },

      async requestReinvite(
        applicationId: string,
        reason: string,
      ): Promise<ReinviteRequest> {
        return interviewRequest<ReinviteRequest>(
          API.interviews.reinviteRequests,
          {
            method: "POST",
            data: { applicationId, reason },
          },
        );
      },

      async approveReinvite(requestId: string): Promise<ReinviteRequest> {
        return interviewRequest<ReinviteRequest>(
          API.interviews.reinviteById(requestId),
          {
            method: "PATCH",
            data: { status: "APPROVED" },
          },
        );
      },

      async rejectReinvite(
        requestId: string,
        reviewerNote?: string,
      ): Promise<ReinviteRequest> {
        return interviewRequest<ReinviteRequest>(
          API.interviews.reinviteById(requestId),
          {
            method: "PATCH",
            data: {
              status: "REJECTED",
              ...(reviewerNote ? { reviewerNote } : {}),
            },
          },
        );
      },

      async sendInvite(applicationId: string): Promise<{
        message: string;
        applicationId: string;
        inviteStatus: InviteStatus;
        invitedAt: string;
      }> {
        return interviewRequest<{
          message: string;
          applicationId: string;
          inviteStatus: InviteStatus;
          invitedAt: string;
        }>(API.interviews.sendInvite(applicationId), {
          method: "POST",
        });
      },

      async cancelInterview(
        applicationId: string,
        reason: string,
      ): Promise<{ message: string; applicationId: string; reason: string }> {
        return interviewRequest<{
          message: string;
          applicationId: string;
          reason: string;
        }>(API.interviews.terminateSession(applicationId), {
          method: "PATCH",
          data: { reason },
        });
      },
    };

export type InterviewService = typeof interviewService;

export default interviewService;
