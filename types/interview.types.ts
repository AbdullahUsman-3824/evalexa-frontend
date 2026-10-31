export type InviteStatus =
  | "NOT_SENT"
  | "SENT"
  | "STARTED"
  | "COMPLETED"
  | "EXPIRED"
  | "TERMINATED";

export type ReinviteStatus = "PENDING" | "APPROVED" | "REJECTED";

export type InvitePublicStatus = "VALID" | "EXPIRED" | "USED" | "INVALID";

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

export type EligibleCandidate = {
  applicationId: string;
  name: string;
  email: string;
  jobTitle: string;
  inviteStatus: InviteStatus;
  invitedAt?: string;
};

export type ReinviteRequest = {
  id: string;
  candidate: string;
  jobApplicationId: string;
  jobTitle?: string;
  reason: string;
  requestedAt: string;
  status: ReinviteStatus;
  reviewerNote?: string | null;
  token?: string | null;
};

/** Candidate-facing re-invite request status (no internal ids exposed). */
export type CandidateReinviteStatus = {
  status: ReinviteStatus;
  reason: string;
  requestedAt: string;
  resolvedAt: string | null;
  /** Present when approved — the new invite token to start the interview. */
  newToken?: string | null;
  /** Recruiter-supplied note on rejection, if any. */
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
