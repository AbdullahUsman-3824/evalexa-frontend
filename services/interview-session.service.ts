import { API } from "@/constants/api";
import { interviewRequest } from "@/lib/interview-client";
import {
  mockInterviewSessionService,
  shouldUseMockInterviews,
} from "@/services/mock/interview.mock";
import type {
  InterviewPreview,
  InvitationExpiredPreview,
  RequestOtpResult,
  SecurityEvent,
  SessionState,
  StartInterviewResult,
  VerifyOtpResult,
} from "@/types/interview.types";

const useMock = shouldUseMockInterviews();

export const interviewSessionService = useMock
  ? mockInterviewSessionService
  : {
      async getPreview(
        interviewId: string,
        token: string,
      ): Promise<InterviewPreview | InvitationExpiredPreview> {
        try {
          return await interviewRequest<InterviewPreview>(
            API.interviews.publicPreview(interviewId, token),
            { method: "GET" },
          );
        } catch (error) {
          const typedError = error as Error & {
            code?: string;
            payload?: { data?: unknown };
          };

          if (typedError.code === "INVITATION_EXPIRED" && typedError.payload?.data) {
            return typedError.payload.data as InvitationExpiredPreview;
          }

          throw error;
        }
      },

      async requestOtp(
        interviewId: string,
        token: string,
      ): Promise<RequestOtpResult> {
        return await interviewRequest<RequestOtpResult>(
          API.interviews.publicRequestOtp(interviewId),
          {
            method: "POST",
            data: { token },
          },
        );
      },

      async verifyOtp(
        interviewId: string,
        token: string,
        otp: string,
      ): Promise<VerifyOtpResult> {
        return await interviewRequest<VerifyOtpResult>(
          API.interviews.publicVerifyOtp(interviewId),
          {
            method: "POST",
            data: { token, otp },
          },
        );
      },

      async startInterview(interviewId: string): Promise<StartInterviewResult> {
        return await interviewRequest<StartInterviewResult>(
          API.interviews.startInterview(interviewId),
          { method: "POST" },
        );
      },

      async requestExtension(
        interviewId: string,
        token: string,
        reason: string,
      ): Promise<{ id: string; status: string; reason: string }> {
        return await interviewRequest<{
          id: string;
          status: string;
          reason: string;
        }>(API.interviews.publicInvitationExtensionRequest(interviewId), {
          method: "POST",
          data: { token, reason },
        });
      },

      /**
       * Calls POST /interviews/:id/start (cookie session only) and builds a
       * SessionState from the response. The OTP must have been verified in
       * the PIN step before calling this.
       */
      async startSession(interviewId: string): Promise<SessionState> {
        const result = await this.startInterview(interviewId);

        return {
          sessionId: result.interview.id,
          status:
            result.interview.status === "IN_PROGRESS"
              ? "IN_PROGRESS"
              : "NOT_STARTED",
          currentQuestion: {
            id: "question-1",
            order: 1,
            total: 1,
            category: "General",
            text: "Please start your interview.",
            maxDurationSeconds: 120,
            deadlineAt: new Date(
              Date.now() + 120 * 1000,
            ).toISOString(),
          },
          answeredQuestionIds: [],
          serverTime: new Date().toISOString(),
          interviewDeadlineAt: new Date(
            Date.now() + 60 * 60 * 1000,
          ).toISOString(),
          startedAt: result.interview.startedAt ?? new Date().toISOString(),
        };
      },

      async getSessionState(sessionId: string): Promise<SessionState> {
        return await interviewRequest<SessionState>(
          API.interviews.sessionById(sessionId),
          { method: "GET" },
        );
      },

      async answerQuestion(
        sessionId: string,
        questionId: string,
        answer: string,
      ): Promise<SessionState> {
        return await interviewRequest<SessionState>(
          API.interviews.answerQuestion(sessionId, questionId),
          {
            method: "POST",
            data: { answer },
          },
        );
      },

      async submitSession(sessionId: string): Promise<SessionState> {
        return await interviewRequest<SessionState>(
          API.interviews.submitSession(sessionId),
          { method: "POST" },
        );
      },

      async terminateSession(sessionId: string): Promise<SessionState> {
        return await interviewRequest<SessionState>(
          API.interviews.terminateSession(sessionId),
          { method: "POST" },
        );
      },

      async listSecurityEvents(sessionId: string): Promise<SecurityEvent[]> {
        return await interviewRequest<SecurityEvent[]>(
          API.interviews.securityEvents(sessionId),
          { method: "GET" },
        );
      },

      async recordSecurityEvent(
        sessionId: string,
        event: {
          type: string;
          questionId?: string;
          occurredAt?: string;
          meta?: Record<string, unknown>;
        },
      ): Promise<SecurityEvent> {
        return await interviewRequest<SecurityEvent>(
          API.interviews.securityEvents(sessionId),
          {
            method: "POST",
            data: event,
          },
        );
      },
    };

export type InterviewSessionService = typeof interviewSessionService;

export default interviewSessionService;
