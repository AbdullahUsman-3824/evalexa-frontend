export type InviteStatus =
  | "NOT_SENT"
  | "SENT"
  | "STARTED"
  | "COMPLETED"
  | "EXPIRED"
  | "TERMINATED";

export type ReinviteStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ExtensionRequestStatus = ReinviteStatus;
export type InvitePublicStatus = "VALID" | "EXPIRED" | "USED" | "INVALID";
export type InvitationDeliveryStatus =
  | "PENDING"
  | "SENT"
  | "EXPIRED"
  | "FAILED"
  | "NOT_SENT";

export type InterviewSessionStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "PAUSED"
  | "COMPLETED"
  | "EXPIRED"
  | "TERMINATED";

export type InterviewQuestionSummary = {
  id: string;
  order: number;
  total: number;
  category: string;
  text: string;
  maxDurationSeconds: number;
  deadlineAt: string;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiEnvelope<T> =
  | {
      success: true;
      data: T;
      message?: string;
      code?: string;
      pagination?: Pagination;
    }
  | {
      success: false;
      data?: T;
      message?: string;
      code?: string;
      pagination?: Pagination;
    };

export type InterviewApplication = {
  id: string;
  interviewId: string;
  jobId: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  invitationDeliveryStatus: InvitationDeliveryStatus | null;
};

export type SendInvitationResult = {
  id: string;
  deliveryStatus: InvitationDeliveryStatus;
  expiresAt: string;
  sentAt: string;
};

export type ExtensionRequest = {
  id: string;
  interviewId: string;
  applicationId?: string;
  jobId?: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  reason: string;
  status: ExtensionRequestStatus;
  requestedAt: string;
  reviewedAt: string | null;
  reviewer: { id: string; fullName: string; email: string } | null;
  decisionNote: string | null;
  invitation?: {
    id: string;
    deliveryStatus: InvitationDeliveryStatus;
    expiresAt: string;
    sentAt: string;
    isResend: boolean;
  };
};

export type InterviewPreview = {
  interviewId: string;
  invitationId: string;
  jobTitle: string;
  companyName: string;
  language: string;
  status: string;
  expiresAt: string;
  candidateName: string;
  requiresOtp: boolean;
  alreadyVerified: boolean;
  canResume: boolean;
};

export type InvitationExpiredPreview = {
  interviewId: string;
  expired: true;
  canRequestNew: boolean;
  jobTitle: string;
  companyName: string;
};

export type RequestOtpResult = {
  emailHint: string;
  expiresInSeconds: number;
};

export type VerifyOtpResult = {
  expiresIn: number;
  interview: {
    id: string;
    status: string;
    startedAt: string | null;
    language: string;
    jobTitle: string;
    companyName: string;
  };
};

export type StartInterviewResult = {
  interview: {
    id: string;
    status: string;
    startedAt: string | null;
    language: string;
    jobTitle: string;
    companyName: string;
  };
};

export type EligibleCandidate = {
  applicationId: string;
  interviewId: string;
  jobId?: string;
  name: string;
  email: string;
  jobTitle: string;
  inviteStatus: InviteStatus;
  deliveryStatus?: InvitationDeliveryStatus | null;
  invitedAt?: string;
};

export type ReinviteRequest = {
  id: string;
  interviewId: string;
  candidate: string;
  jobApplicationId: string;
  jobTitle?: string;
  reason: string;
  requestedAt: string;
  status: ReinviteStatus;
  reviewerNote?: string | null;
  token?: string | null;
};

export type CandidateReinviteStatus = {
  status: ReinviteStatus;
  reason: string;
  requestedAt: string;
  resolvedAt: string | null;
  newToken?: string | null;
  reviewerNote?: string | null;
};

export type InvitePublicInfo = {
  candidateFirstName: string;
  jobTitle: string;
  companyName: string;
  expiresAt: string;
  instructions: string[];
  status: InvitePublicStatus;
};

export type SessionState = {
  sessionId: string;
  status: InterviewSessionStatus;
  currentQuestion: InterviewQuestionSummary;
  answeredQuestionIds: string[];
  serverTime: string;
  interviewDeadlineAt: string;
  startedAt?: string;
};

export type SecurityEvent = {
  type: string;
  occurredAt: string;
  meta?: Record<string, unknown>;
};

export type PublicInterviewTokenPayload = {
  token: string;
  pin: string;
};

export type InterviewAnswerPayload = {
  answer: string;
  submittedAt?: string;
};

export type StartInterviewSessionResponse = {
  session: SessionState;
  message: string;
};

export type MockFailureMode = "expired" | "badpin" | "uploadfail" | "terminate";

/* ───────────── Candidate session API (cookie based) ───────────── */

export type ApiQuestion = {
  id: string;
  order: number;
  category?: string;
  questionText: string;
};

export type StartSessionResult = {
  interviewId: string;
  question: ApiQuestion | null;
  isCompleted: boolean;
};

export type NextQuestionResult = {
  interviewId: string;
  question: ApiQuestion | null;
  isCompleted: boolean;
};

export type SessionInfo = {
  interviewId: string;
  jobTitle: string;
  companyName: string;
  candidateName: string;
  language: string;
  status: string;
  startedAt: string | null;
  canResume: boolean;
  isCompleted: boolean;
};

export type UploadUrlResult = {
  uploadUrl: string;
  storagePath: string;
  token: string;
};

export type SubmitAnswerPayload = {
  durationSeconds: number;
  storageKey: string;
  mimeType: string;
  sizeBytes: number;
};

export type SubmitAnswerResult = {
  interviewId: string;
  questionId: string;
  answerId: string;
  submitted: boolean;
  isCompleted: boolean;
};