import { API } from "@/constants/api";
import { interviewRequest } from "@/lib/interview-client";
import {
  mockInterviewSessionService,
  shouldUseMockInterviews,
} from "@/services/mock/interview.mock";
import type {
  CandidateReinviteStatus,
  InvitePublicInfo,
  InterviewAnswerPayload,
  SecurityEvent,
  SessionState,
} from "@/types/interview.types";

const useMock = shouldUseMockInterviews();

export const interviewSessionService = useMock
  ? mockInterviewSessionService
  : {
      async getPublicInviteInfo(token: string): Promise<InvitePublicInfo> {
        return interviewRequest<InvitePublicInfo>(
          API.interviews.publicInvite(token),
          {
            method: "GET",
          },
        );
      },

      async requestReinviteByToken(
        token: string,
        reason: string,
      ): Promise<CandidateReinviteStatus> {
        return interviewRequest<CandidateReinviteStatus>(
          API.interviews.reinviteRequestByToken(token),
          {
            method: "POST",
            data: { reason },
          },
        );
      },

      async getReinviteStatusByToken(
        token: string,
      ): Promise<CandidateReinviteStatus | null> {
        return interviewRequest<CandidateReinviteStatus | null>(
          API.interviews.reinviteStatusByToken(token),
          {
            method: "GET",
          },
        );
      },

      async validateInviteToken(
        token: string,
        pin: string,
      ): Promise<InvitePublicInfo> {
        return interviewRequest<InvitePublicInfo>(
          API.interviews.validateInvite(token),
          {
            method: "POST",
            data: { pin },
          },
        );
      },

      async startSession(token: string, pin: string): Promise<SessionState> {
        return interviewRequest<SessionState>(
          API.interviews.sessionByToken(token),
          {
            method: "POST",
            data: { pin },
          },
        );
      },

      async getSessionState(sessionId: string): Promise<SessionState> {
        return interviewRequest<SessionState>(
          API.interviews.sessionById(sessionId),
          {
            method: "GET",
          },
        );
      },

      async answerQuestion(
        sessionId: string,
        questionId: string,
        answer: string,
      ): Promise<SessionState> {
        return interviewRequest<SessionState>(
          API.interviews.answerQuestion(sessionId, questionId),
          {
            method: "POST",
            data: { answer } satisfies InterviewAnswerPayload,
          },
        );
      },

      async submitSession(sessionId: string): Promise<SessionState> {
        return interviewRequest<SessionState>(
          API.interviews.submitSession(sessionId),
          {
            method: "POST",
          },
        );
      },

      async terminateSession(sessionId: string): Promise<SessionState> {
        return interviewRequest<SessionState>(
          API.interviews.terminateSession(sessionId),
          {
            method: "POST",
          },
        );
      },

      async listSecurityEvents(sessionId: string): Promise<SecurityEvent[]> {
        return interviewRequest<SecurityEvent[]>(
          API.interviews.securityEvents(sessionId),
          {
            method: "GET",
          },
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
        return interviewRequest<SecurityEvent>(
          API.interviews.securityEvents(sessionId),
          {
            method: "POST",
            data: {
              ...event,
              occurredAt: event.occurredAt ?? new Date().toISOString(),
            },
          },
        );
      },
    };

export type InterviewSessionService = typeof interviewSessionService;

export default interviewSessionService;
