import type {
  EligibleCandidate,
  ExtensionRequest,
  ExtensionRequestStatus,
  InterviewPreview,
  InvitationExpiredPreview,
  MockFailureMode,
  Pagination,
  RequestOtpResult,
  SecurityEvent,
  SendInvitationResult,
  SessionState,
  StartInterviewResult,
  VerifyOtpResult,
} from "@/types/interview.types";

const MOCK_OTP = "123456";

/* ─────────────────────────  Recruiter mock data  ───────────────────────── */

const mockQuestions = [
  {
    id: "q1",
    order: 1,
    total: 5,
    category: "Product Thinking",
    text: "Tell us about a product decision you made that improved customer retention.",
    maxDurationSeconds: 90,
  },
  {
    id: "q2",
    order: 2,
    total: 5,
    category: "Communication",
    text: "Describe a time you had to align a team with conflicting priorities.",
    maxDurationSeconds: 60,
  },
  {
    id: "q3",
    order: 3,
    total: 5,
    category: "Leadership",
    text: "How do you delegate work when priorities shift unexpectedly?",
    maxDurationSeconds: 45,
  },
  {
    id: "q4",
    order: 4,
    total: 5,
    category: "Problem Solving",
    text: "Walk us through a technical issue you diagnosed and resolved under pressure.",
    maxDurationSeconds: 75,
  },
  {
    id: "q5",
    order: 5,
    total: 5,
    category: "Values",
    text: "Why do you want to join this company and what would success look like in your first 90 days?",
    maxDurationSeconds: 20,
  },
] as const;

const eligibleCandidates: EligibleCandidate[] = [
  {
    applicationId: "app_101",
    interviewId: "int_101",
    name: "Aisha Rahman",
    email: "aisha.rahman@example.com",
    jobTitle: "Frontend Engineer",
    inviteStatus: "SENT",
    invitedAt: "2026-10-28T09:00:00.000Z",
  },
  {
    applicationId: "app_102",
    interviewId: "int_102",
    name: "Daniel Brooks",
    email: "daniel.brooks@example.com",
    jobTitle: "Product Designer",
    inviteStatus: "NOT_SENT",
  },
  {
    applicationId: "app_103",
    interviewId: "int_103",
    name: "Priya Nair",
    email: "priya.nair@example.com",
    jobTitle: "Growth Manager",
    inviteStatus: "STARTED",
    invitedAt: "2026-10-27T15:45:00.000Z",
  },
  {
    applicationId: "app_104",
    interviewId: "int_104",
    name: "Mateo Silva",
    email: "mateo.silva@example.com",
    jobTitle: "Data Analyst",
    inviteStatus: "COMPLETED",
    invitedAt: "2026-10-26T11:30:00.000Z",
  },
];

const extensionRequests: ExtensionRequest[] = [
  {
    id: "ext_1",
    interviewId: "int_104",
    candidateName: "Mateo Silva",
    candidateEmail: "mateo.silva@example.com",
    jobTitle: "Data Analyst",
    reason:
      "Candidate missed the original slot due to timezone conflict.",
    status: "PENDING",
    requestedAt: "2026-10-28T08:15:00.000Z",
    reviewedAt: null,
    reviewer: null,
    decisionNote: null,
  },
];

/* ─────────────────────────  Candidate mock data  ───────────────────────── */

type MockSession = {
  sessionId: string;
  interviewId: string;
  status: SessionState["status"];
  currentIndex: number;
  answeredQuestionIds: string[];
  startedAt: string;
  interviewDeadlineAt: string;
  serverTime: string;
  securityEvents: SecurityEvent[];
};

const mockSessions = new Map<string, MockSession>();

/* ─────────────────────────  Helpers  ───────────────────────── */

function readFailureMode(): MockFailureMode | null {
  if (typeof window === "undefined") {
    return null;
  }

  const param = new URLSearchParams(window.location.search).get("mock");
  if (
    param === "expired" ||
    param === "badpin" ||
    param === "uploadfail" ||
    param === "terminate"
  ) {
    return param;
  }

  return null;
}

function readPreviewMode(): "verified" | "resume" | null {
  if (typeof window === "undefined") {
    return null;
  }

  const param = new URLSearchParams(window.location.search).get("preview");
  if (param === "verified" || param === "resume") {
    return param;
  }

  return null;
}

function getRandomDelay(): number {
  return 400 + Math.floor(Math.random() * 500);
}

function wait<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), getRandomDelay());
  });
}

function buildSessionState(session: MockSession): SessionState {
  const question =
    mockQuestions[session.currentIndex] ??
    mockQuestions[mockQuestions.length - 1];

  return {
    sessionId: session.sessionId,
    status: session.status,
    currentQuestion: {
      id: question.id,
      order: question.order,
      total: question.total,
      category: question.category,
      text: question.text,
      maxDurationSeconds: question.maxDurationSeconds,
      deadlineAt: new Date(
        Date.now() + question.maxDurationSeconds * 1000,
      ).toISOString(),
    },
    answeredQuestionIds: [...session.answeredQuestionIds],
    serverTime: session.serverTime,
    interviewDeadlineAt: session.interviewDeadlineAt,
    startedAt: session.startedAt,
  };
}

/* ─────────────────────────  Recruiter service  ───────────────────────── */

async function listEligibleCandidates(): Promise<EligibleCandidate[]> {
  return wait([...eligibleCandidates]);
}

async function listExtensionRequests(options?: {
  status?: ExtensionRequestStatus;
  page?: number;
  limit?: number;
}): Promise<{ items: ExtensionRequest[]; pagination: Pagination }> {
  let items = [...extensionRequests];

  if (options?.status) {
    items = items.filter((item) => item.status === options.status);
  }

  const page = options?.page ?? 1;
  const limit = options?.limit ?? 20;
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit);

  return wait({
    items: paged,
    pagination: { page, limit, total, totalPages },
  });
}

async function sendInvitation(interviewId: string): Promise<SendInvitationResult> {
  const candidate = eligibleCandidates.find(
    (item) => item.interviewId === interviewId,
  );

  if (!candidate) {
    throw new Error("Candidate not found for this interview.");
  }

  if (candidate.inviteStatus === "SENT") {
    throw new Error("An invitation has already been sent and is still valid.");
  }

  const now = new Date().toISOString();
  candidate.inviteStatus = "SENT";
  candidate.invitedAt = now;

  return wait({
    id: `invitation_${interviewId}_${Date.now()}`,
    deliveryStatus: "SENT",
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    sentAt: now,
  });
}

async function approveExtensionRequest(
  interviewId: string,
  requestId: string,
  decisionNote?: string,
): Promise<ExtensionRequest> {
  const request = extensionRequests.find(
    (item) => item.id === requestId && item.interviewId === interviewId,
  );

  if (!request) {
    throw new Error("Extension request not found.");
  }

  if (request.status !== "PENDING") {
    throw new Error("This request has already been reviewed.");
  }

  const candidate = eligibleCandidates.find(
    (item) => item.interviewId === interviewId,
  );

  request.status = "APPROVED";
  request.reviewedAt = new Date().toISOString();
  request.reviewer = {
    id: "recruiter_mock",
    fullName: "Mock Recruiter",
    email: "recruiter@evalexa.example",
  };
  request.decisionNote = decisionNote?.trim() || null;
  request.invitation = {
    id: `invitation_${interviewId}_${Date.now()}`,
    deliveryStatus: "SENT",
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    sentAt: new Date().toISOString(),
    isResend: true,
  };

  if (candidate) {
    candidate.inviteStatus = "SENT";
    candidate.invitedAt = new Date().toISOString();
  }

  return wait({ ...request });
}

async function rejectExtensionRequest(
  interviewId: string,
  requestId: string,
  decisionNote?: string,
): Promise<ExtensionRequest> {
  const request = extensionRequests.find(
    (item) => item.id === requestId && item.interviewId === interviewId,
  );

  if (!request) {
    throw new Error("Extension request not found.");
  }

  if (request.status !== "PENDING") {
    throw new Error("This request has already been reviewed.");
  }

  request.status = "REJECTED";
  request.reviewedAt = new Date().toISOString();
  request.reviewer = {
    id: "recruiter_mock",
    fullName: "Mock Recruiter",
    email: "recruiter@evalexa.example",
  };
  request.decisionNote = decisionNote?.trim() || null;

  return wait({ ...request });
}

/* ─────────────────────────  Candidate session service  ───────────────────────── */

async function getPreview(
  interviewId: string,
  token: string,
): Promise<InterviewPreview | InvitationExpiredPreview> {
  const mode = readFailureMode();
  const previewMode = readPreviewMode();

  if (mode === "expired" || token === "expired") {
    return wait({
      interviewId,
      expired: true,
      canRequestNew: true,
      jobTitle: "Data Analyst",
      companyName: "Evalexa Labs",
    });
  }

  const alreadyVerified = previewMode === "verified";
  const canResume = previewMode === "resume";

  return wait({
    interviewId,
    invitationId: `inv_${interviewId}`,
    jobTitle: "Frontend Engineer",
    companyName: "Evalexa Labs",
    language: "en",
    status: canResume ? "IN_PROGRESS" : "PENDING",
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    candidateName: "Aisha Rahman",
    requiresOtp: !alreadyVerified,
    alreadyVerified,
    canResume,
  });
}

async function requestOtp(
  interviewId: string,
  token: string,
): Promise<RequestOtpResult> {
  if (token === "expired") {
    throw new Error("This interview invite has expired.");
  }

  const candidate = eligibleCandidates.find(
    (item) => item.interviewId === interviewId,
  );
  const email = candidate?.email ?? "aisha.rahman@example.com";
  const [localPart, domain] = email.split("@");
  const hint = `${localPart[0]}***@${domain}`;

  return wait({
    emailHint: hint,
    expiresInSeconds: 600,
  });
}

async function verifyOtp(
  interviewId: string,
  token: string,
  otp: string,
): Promise<VerifyOtpResult> {
  if (token === "expired") {
    throw new Error("This interview invite has expired.");
  }

  if (otp !== MOCK_OTP) {
    throw new Error("Incorrect OTP code.");
  }

  return wait({
    expiresIn: 3600,
    interview: {
      id: interviewId,
      status: "PENDING",
      startedAt: null,
      language: "en",
      jobTitle: "Frontend Engineer",
      companyName: "Evalexa Labs",
    },
  });
}

async function startInterview(
  interviewId: string,
): Promise<StartInterviewResult> {
  return wait({
    interview: {
      id: interviewId,
      status: "IN_PROGRESS",
      startedAt: new Date().toISOString(),
      language: "en",
      jobTitle: "Frontend Engineer",
      companyName: "Evalexa Labs",
    },
  });
}

async function requestExtension(
  interviewId: string,
  token: string,
  reason: string,
): Promise<{ id: string; status: string; reason: string }> {
  if (token === "expired" || !token) {
    throw new Error("Invalid or expired invitation token.");
  }

  const trimmed = reason.trim();
  if (!trimmed) {
    throw new Error("Please provide a reason for your request.");
  }

  if (trimmed.length > 2000) {
    throw new Error("Reason must be 2,000 characters or fewer.");
  }

  return wait({
    id: `extension_${Date.now()}`,
    status: "PENDING",
    reason: trimmed,
  });
}

async function startSession(interviewId: string): Promise<SessionState> {
  const mode = readFailureMode();
  if (mode === "expired") {
    throw new Error("This interview invite has expired.");
  }

  const interviewDeadline = new Date(
    Date.now() + 45 * 60 * 1000,
  ).toISOString();
  const sessionId = `mock_session_${Date.now()}`;
  const session: MockSession = {
    sessionId,
    interviewId,
    status: "IN_PROGRESS",
    currentIndex: 0,
    answeredQuestionIds: [],
    startedAt: new Date().toISOString(),
    interviewDeadlineAt: interviewDeadline,
    serverTime: new Date().toISOString(),
    securityEvents: [
      {
        type: "session_started",
        occurredAt: new Date().toISOString(),
        meta: { interviewId },
      },
    ],
  };

  mockSessions.set(sessionId, session);
  return wait(buildSessionState(session));
}

async function getSessionState(sessionId: string): Promise<SessionState> {
  const session = mockSessions.get(sessionId);
  if (!session) {
    throw new Error("Interview session not found.");
  }

  return wait(buildSessionState(session));
}

async function answerQuestion(
  sessionId: string,
  questionId: string,
  answer: string,
): Promise<SessionState> {
  const mode = readFailureMode();
  if (mode === "uploadfail") {
    throw new Error("File upload failed. Please try again.");
  }

  const session = mockSessions.get(sessionId);
  if (!session) {
    throw new Error("Interview session not found.");
  }

  if (!session.answeredQuestionIds.includes(questionId)) {
    session.answeredQuestionIds.push(questionId);
  }

  const nextIndex = Math.max(
    0,
    mockQuestions.findIndex((question) => question.id === questionId),
  );

  session.currentIndex =
    nextIndex < mockQuestions.length - 1
      ? nextIndex + 1
      : mockQuestions.length - 1;
  session.serverTime = new Date().toISOString();
  session.securityEvents.push({
    type: "answer_submitted",
    occurredAt: new Date().toISOString(),
    meta: { questionId, answerLength: answer.length },
  });

  return wait(buildSessionState(session));
}

async function submitSession(sessionId: string): Promise<SessionState> {
  const session = mockSessions.get(sessionId);
  if (!session) {
    throw new Error("Interview session not found.");
  }

  session.status = "COMPLETED";
  session.serverTime = new Date().toISOString();
  session.securityEvents.push({
    type: "session_submitted",
    occurredAt: new Date().toISOString(),
    meta: { answeredCount: session.answeredQuestionIds.length },
  });

  return wait(buildSessionState(session));
}

async function terminateSession(sessionId: string): Promise<SessionState> {
  const mode = readFailureMode();
  if (mode === "terminate") {
    throw new Error("Interview was terminated by the system.");
  }

  const session = mockSessions.get(sessionId);
  if (!session) {
    throw new Error("Interview session not found.");
  }

  session.status = "TERMINATED";
  session.serverTime = new Date().toISOString();
  session.securityEvents.push({
    type: "session_terminated",
    occurredAt: new Date().toISOString(),
  });

  return wait(buildSessionState(session));
}

async function listSecurityEvents(
  sessionId: string,
): Promise<SecurityEvent[]> {
  const session = mockSessions.get(sessionId);
  if (!session) {
    throw new Error("Interview session not found.");
  }

  return wait(session.securityEvents);
}

async function recordSecurityEvent(
  sessionId: string,
  event: {
    type: string;
    questionId?: string;
    occurredAt?: string;
    meta?: Record<string, unknown>;
  },
): Promise<SecurityEvent> {
  const session = mockSessions.get(sessionId);
  if (!session) {
    throw new Error("Interview session not found.");
  }

  const nextEvent: SecurityEvent = {
    type: event.type,
    occurredAt: event.occurredAt ?? new Date().toISOString(),
    meta: {
      ...(event.meta ?? {}),
      ...(event.questionId ? { questionId: event.questionId } : {}),
    },
  };

  session.securityEvents.push(nextEvent);
  return wait(nextEvent);
}

/* ─────────────────────────  Service exports  ───────────────────────── */

export const mockInterviewService = {
  listEligibleCandidates,
  listExtensionRequests,
  sendInvitation,
  approveExtensionRequest,
  rejectExtensionRequest,
};

export const mockInterviewSessionService = {
  getPreview,
  requestOtp,
  verifyOtp,
  startInterview,
  requestExtension,
  startSession,
  getSessionState,
  answerQuestion,
  submitSession,
  terminateSession,
  listSecurityEvents,
  recordSecurityEvent,
};

export function shouldUseMockInterviews(): boolean {
  return process.env.NEXT_PUBLIC_USE_MOCK_INTERVIEWS === "true";
}
