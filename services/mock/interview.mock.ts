import type {
  CandidateReinviteStatus,
  EligibleCandidate,
  InvitePublicInfo,
  InvitePublicStatus,
  InviteStatus,
  MockFailureMode,
  ReinviteRequest,
  ReinviteStatus,
  SecurityEvent,
  SessionState,
} from "@/types/interview.types";

const MOCK_PIN = "123456";

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
    name: "Aisha Rahman",
    email: "aisha.rahman@example.com",
    jobTitle: "Frontend Engineer",
    inviteStatus: "SENT",
    invitedAt: "2026-10-28T09:00:00.000Z",
  },
  {
    applicationId: "app_102",
    name: "Daniel Brooks",
    email: "daniel.brooks@example.com",
    jobTitle: "Product Designer",
    inviteStatus: "NOT_SENT",
  },
  {
    applicationId: "app_103",
    name: "Priya Nair",
    email: "priya.nair@example.com",
    jobTitle: "Growth Manager",
    inviteStatus: "STARTED",
    invitedAt: "2026-10-27T15:45:00.000Z",
  },
  {
    applicationId: "app_104",
    name: "Mateo Silva",
    email: "mateo.silva@example.com",
    jobTitle: "Data Analyst",
    inviteStatus: "COMPLETED",
    invitedAt: "2026-10-26T11:30:00.000Z",
  },
];

const reinviteRequests: ReinviteRequest[] = [
  {
    id: "reinvite_1",
    candidate: "Mateo Silva",
    jobApplicationId: "app_104",
    jobTitle: "Data Analyst",
    reason: "Candidate missed the original slot due to timezone conflict.",
    requestedAt: "2026-10-28T08:15:00.000Z",
    status: "PENDING",
    reviewerNote: null,
    token: null,
  },
];

const publicInviteInfos: Record<string, InvitePublicInfo> = {
  demo_token: {
    candidateFirstName: "Aisha",
    jobTitle: "Frontend Engineer",
    companyName: "Evalexa Labs",
    expiresAt: "2099-12-31T23:59:59.000Z",
    instructions: [
      "Use your recruiter-provided PIN at the start of the interview.",
      "Keep your camera and microphone enabled for the full session.",
      "Answer each question in detail and submit once completed.",
    ],
    status: "VALID",
  },
};

type MockSession = {
  sessionId: string;
  token: string;
  status: SessionState["status"];
  currentIndex: number;
  answeredQuestionIds: string[];
  startedAt: string;
  interviewDeadlineAt: string;
  serverTime: string;
  securityEvents: SecurityEvent[];
};

const mockSessions = new Map<string, MockSession>();

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

export async function listEligibleCandidates(): Promise<EligibleCandidate[]> {
  return wait(eligibleCandidates);
}

export async function getReinviteRequests(): Promise<ReinviteRequest[]> {
  return wait(reinviteRequests);
}

export async function requestReinvite(
  applicationId: string,
  reason: string,
): Promise<ReinviteRequest> {
  const existingCandidate = eligibleCandidates.find(
    (candidate) => candidate.applicationId === applicationId,
  );

  if (!existingCandidate) {
    throw new Error("Candidate not found.");
  }

  const nextRequest: ReinviteRequest = {
    id: `reinvite_${Date.now()}`,
    candidate: existingCandidate.name,
    jobApplicationId: applicationId,
    jobTitle: existingCandidate.jobTitle,
    reason,
    requestedAt: new Date().toISOString(),
    status: "PENDING",
    reviewerNote: null,
    token: null,
  };

  reinviteRequests.unshift(nextRequest);
  return wait(nextRequest);
}

export async function approveReinvite(
  requestId: string,
): Promise<ReinviteRequest> {
  const request = reinviteRequests.find((item) => item.id === requestId);
  if (!request) {
    throw new Error("Invite request not found.");
  }

  request.status = "APPROVED" as ReinviteStatus;
  request.reviewerNote = null;

  if (request.token) {
    const existing = tokenReinviteRequests.get(request.token);
    if (existing) {
      const newToken = `renewed_${Date.now()}`;
      tokenReinviteRequests.set(request.token, {
        ...existing,
        status: "APPROVED",
        resolvedAt: new Date().toISOString(),
        newToken,
        reviewerNote: null,
      });
    }
  }

  return wait(request);
}

export async function rejectReinvite(
  requestId: string,
  reviewerNote?: string,
): Promise<ReinviteRequest> {
  const request = reinviteRequests.find((item) => item.id === requestId);
  if (!request) {
    throw new Error("Invite request not found.");
  }

  request.status = "REJECTED" as ReinviteStatus;
  request.reviewerNote = reviewerNote ?? null;

  if (request.token) {
    const existing = tokenReinviteRequests.get(request.token);
    if (existing) {
      tokenReinviteRequests.set(request.token, {
        ...existing,
        status: "REJECTED",
        resolvedAt: new Date().toISOString(),
        newToken: null,
        reviewerNote: reviewerNote ?? null,
      });
    }
  }

  return wait(request);
}

// ── Candidate-facing (token-based) re-invite requests ────────────────────
const tokenReinviteRequests = new Map<
  string,
  {
    token: string;
    reason: string;
    status: ReinviteStatus;
    requestedAt: string;
    resolvedAt: string | null;
    newToken: string | null;
    reviewerNote: string | null;
  }
>();

export async function requestReinviteByToken(
  token: string,
  reason: string,
): Promise<CandidateReinviteStatus> {
  const trimmed = reason.trim();
  if (!trimmed) {
    throw new Error("Please provide a reason for your request.");
  }

  const existing = tokenReinviteRequests.get(token);
  // Already approved → surface the fresh link again.
  if (existing?.status === "APPROVED") {
    return wait({
      status: "APPROVED",
      reason: existing.reason,
      requestedAt: existing.requestedAt,
      resolvedAt: existing.resolvedAt,
      newToken: existing.newToken,
      reviewerNote: null,
    });
  }
  // Pending → return the existing request rather than creating a duplicate.
  if (existing?.status === "PENDING") {
    return wait({
      status: "PENDING",
      reason: existing.reason,
      requestedAt: existing.requestedAt,
      resolvedAt: null,
      newToken: null,
      reviewerNote: null,
    });
  }

  const record = {
    token,
    reason: trimmed,
    status: "PENDING" as ReinviteStatus,
    requestedAt: new Date().toISOString(),
    resolvedAt: null,
    newToken: null,
    reviewerNote: null,
  };
  tokenReinviteRequests.set(token, record);

  const existingRequestIndex = reinviteRequests.findIndex(
    (item) => item.token === token,
  );
  const inviteInfo = publicInviteInfos[token];
  const normalizedRequest: ReinviteRequest = {
    id:
      existingRequestIndex >= 0
        ? reinviteRequests[existingRequestIndex].id
        : `reinvite_token_${Date.now()}`,
    candidate: inviteInfo?.candidateFirstName ?? "Candidate",
    jobApplicationId: token,
    jobTitle: inviteInfo?.jobTitle ?? "Interview role",
    reason: trimmed,
    requestedAt: record.requestedAt,
    status: "PENDING",
    reviewerNote: null,
    token,
  };

  if (existingRequestIndex >= 0) {
    reinviteRequests[existingRequestIndex] = normalizedRequest;
  } else {
    reinviteRequests.unshift(normalizedRequest);
  }

  return wait({
    status: record.status,
    reason: record.reason,
    requestedAt: record.requestedAt,
    resolvedAt: null,
    newToken: null,
    reviewerNote: null,
  });
}

export async function getReinviteStatusByToken(
  token: string,
): Promise<CandidateReinviteStatus | null> {
  const existing = tokenReinviteRequests.get(token);
  if (!existing) {
    return wait(null);
  }
  return wait({
    status: existing.status,
    reason: existing.reason,
    requestedAt: existing.requestedAt,
    resolvedAt: existing.resolvedAt,
    newToken: existing.newToken,
    reviewerNote: existing.reviewerNote,
  });
}

export async function sendInvite(applicationId: string): Promise<{
  message: string;
  applicationId: string;
  inviteStatus: InviteStatus;
  invitedAt: string;
}> {
  const candidate = eligibleCandidates.find(
    (item) => item.applicationId === applicationId,
  );

  if (!candidate) {
    throw new Error("Candidate not found.");
  }

  const invitedAt = new Date().toISOString();
  candidate.inviteStatus = "SENT";
  candidate.invitedAt = invitedAt;

  return wait({
    message: `Interview invite sent to ${candidate.name}.`,
    applicationId,
    inviteStatus: "SENT",
    invitedAt,
  });
}

export async function cancelInterview(
  applicationId: string,
  reason: string,
): Promise<{ message: string; applicationId: string; reason: string }> {
  const candidate = eligibleCandidates.find(
    (item) => item.applicationId === applicationId,
  );

  if (!candidate) {
    throw new Error("Candidate not found.");
  }

  candidate.inviteStatus = "TERMINATED";

  return wait({
    message: `Interview cancelled for ${candidate.name}.`,
    applicationId,
    reason,
  });
}

export async function getPublicInviteInfo(
  token: string,
): Promise<InvitePublicInfo> {
  const mode = readFailureMode();
  if (mode === "expired") {
    // Return an expired status so the candidate UI can branch to the
    // re-invitation request screen rather than showing a generic error.
    return wait({
      candidateFirstName: "Alex",
      jobTitle: "Senior Product Manager",
      companyName: "Evalexa Labs",
      expiresAt: new Date(Date.now() - 86_400_000).toISOString(),
      instructions: [],
      status: "EXPIRED" as InvitePublicStatus,
    });
  }

  const info = publicInviteInfos[token] ?? {
    candidateFirstName: "Alex",
    jobTitle: "Senior Product Manager",
    companyName: "Evalexa Labs",
    expiresAt: "2099-12-31T23:59:59.000Z",
    instructions: [
      "Please review the brief before starting.",
      "Use the designated PIN and answer thoughtfully.",
    ],
    status: "VALID" as InvitePublicStatus,
  };

  return wait(info);
}

export async function validateInviteToken(
  token: string,
  pin: string,
): Promise<InvitePublicInfo> {
  const mode = readFailureMode();
  if (mode === "expired") {
    throw new Error("This interview invite has expired.");
  }

  if (pin !== MOCK_PIN) {
    throw new Error("Incorrect interview PIN.");
  }

  return wait(
    publicInviteInfos[token] ?? {
      candidateFirstName: "Alex",
      jobTitle: "Senior Product Manager",
      companyName: "Evalexa Labs",
      expiresAt: "2099-12-31T23:59:59.000Z",
      instructions: [
        "Review the instructions above.",
        "Answer each prompt in full.",
      ],
      status: "VALID" as InvitePublicStatus,
    },
  );
}

export async function startSession(
  token: string,
  pin: string,
): Promise<SessionState> {
  const mode = readFailureMode();
  if (mode === "expired") {
    throw new Error("This interview invite has expired.");
  }

  if (mode === "badpin" || pin !== MOCK_PIN) {
    throw new Error("Incorrect interview PIN.");
  }

  const interviewDeadline = new Date(Date.now() + 45 * 60 * 1000).toISOString();
  const sessionId = `mock_session_${Date.now()}`;
  const session: MockSession = {
    sessionId,
    token,
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
        meta: { token },
      },
    ],
  };

  mockSessions.set(sessionId, session);
  return wait(buildSessionState(session));
}

export async function getSessionState(
  sessionId: string,
): Promise<SessionState> {
  const session = mockSessions.get(sessionId);
  if (!session) {
    throw new Error("Interview session not found.");
  }

  return wait(buildSessionState(session));
}

export async function answerQuestion(
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

export async function submitSession(sessionId: string): Promise<SessionState> {
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

export async function terminateSession(
  sessionId: string,
): Promise<SessionState> {
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

export async function listSecurityEvents(
  sessionId: string,
): Promise<SecurityEvent[]> {
  const session = mockSessions.get(sessionId);
  if (!session) {
    throw new Error("Interview session not found.");
  }

  return wait(session.securityEvents);
}

export async function recordSecurityEvent(
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

export const mockInterviewService = {
  listEligibleCandidates,
  getReinviteRequests,
  requestReinvite,
  approveReinvite,
  rejectReinvite,
  sendInvite,
  cancelInterview,
};

export const mockInterviewSessionService = {
  getPublicInviteInfo,
  validateInviteToken,
  startSession,
  getSessionState,
  answerQuestion,
  submitSession,
  terminateSession,
  listSecurityEvents,
  recordSecurityEvent,
  requestReinviteByToken,
  getReinviteStatusByToken,
};

export function shouldUseMockInterviews(): boolean {
  return process.env.NEXT_PUBLIC_USE_MOCK_INTERVIEWS === "true";
}
