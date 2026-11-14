import { API } from "@/constants/api";
import { interviewRequest } from "@/lib/interview-client";
import type {
  InterviewPreview,
  InvitationExpiredPreview,
  NextQuestionResult,
  RequestOtpResult,
  SessionInfo,
  StartSessionResult,
  SubmitAnswerPayload,
  SubmitAnswerResult,
  UploadUrlResult,
  VerifyOtpResult,
} from "@/types/interview.types";

export const interviewSessionService = {
  /* ───────── Public (unauthenticated) ───────── */

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
      { method: "POST", data: { token } },
    );
  },

  async verifyOtp(
    interviewId: string,
    token: string,
    otp: string,
  ): Promise<VerifyOtpResult> {
    return await interviewRequest<VerifyOtpResult>(
      API.interviews.publicVerifyOtp(interviewId),
      { method: "POST", data: { token, otp } },
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

  /* ───────── Session (cookie: interview_session) ───────── */

  /** Session API 1 – start or resume. Returns the first/current question. */
  async startInterview(interviewId: string): Promise<StartSessionResult> {
    return await interviewRequest<StartSessionResult>(
      API.interviews.startInterview(interviewId),
      { method: "POST" },
    );
  },

  /** Session API 1b – recovery of job title / company / candidate name. */
  async getSessionInfo(interviewId: string): Promise<SessionInfo> {
    return await interviewRequest<SessionInfo>(
      API.interviews.sessionInfo(interviewId),
      { method: "GET" },
    );
  },

  /** Session API 2 – next question (question === null when none left). */
  async getNextQuestion(interviewId: string): Promise<NextQuestionResult> {
    return await interviewRequest<NextQuestionResult>(
      API.interviews.nextQuestion(interviewId),
      { method: "GET" },
    );
  },

  /** Session API 3 – signed upload URL for one answer recording. */
  async getUploadUrl(
    interviewId: string,
    questionId: string,
  ): Promise<UploadUrlResult> {
    return await interviewRequest<UploadUrlResult>(
      API.interviews.recordingUploadUrl(interviewId, questionId),
      { method: "POST" },
    );
  },

  /** Uploads the audio blob straight to the Supabase signed URL. */
  async uploadRecording(
    upload: UploadUrlResult,
    blob: Blob,
    mimeType: string,
  ): Promise<void> {
    const url = new URL(upload.uploadUrl);
    if (!url.searchParams.get("token") && upload.token) {
      url.searchParams.set("token", upload.token);
    }

    // Same body shape supabase-js uses for uploadToSignedUrl.
    const form = new FormData();
    form.append("cacheControl", "3600");
    form.append("", new Blob([blob], { type: mimeType }));

    const response = await fetch(url.toString(), {
      method: "PUT",
      headers: { "x-upsert": "false" },
      body: form,
    });

    if (!response.ok) {
      throw new Error(`Recording upload failed (${response.status}).`);
    }
  },

  /** Session API 4 – confirm the uploaded recording and record the answer. */
  async submitAnswer(
    interviewId: string,
    questionId: string,
    payload: SubmitAnswerPayload,
  ): Promise<SubmitAnswerResult> {
    return await interviewRequest<SubmitAnswerResult>(
      API.interviews.submitAnswer(interviewId, questionId),
      { method: "POST", data: payload },
    );
  },
};

export type InterviewSessionService = typeof interviewSessionService;

export default interviewSessionService;