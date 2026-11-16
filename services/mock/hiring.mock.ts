import type { InterviewResult } from "@/types/interview.types";
import type {
  HireCandidateResponse,
  HiredCandidate,
  HiredCandidatesQuery,
  HiredCandidatesResponse,
} from "@/types/hiring.types";
import type { JobListRecord } from "@/types/job.types";

/**
 * Mock data for the recruiter "Active & Completed" results table, the Hire
 * action and the Hired Candidates page. Only used when
 * NEXT_PUBLIC_USE_MOCK_INTERVIEWS=true.
 */

const STORAGE_KEY = "mock-hired-applications";
const MOCK_DELAY_MS = 350;

const wait = (ms = MOCK_DELAY_MS) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const minutesAgo = (minutes: number) =>
  new Date(Date.now() - minutes * 60_000).toISOString();

const JOB_ENGINEER = { id: "mock-job-1", title: "Senior Software Engineer" };
const JOB_DESIGNER = { id: "mock-job-2", title: "Product Designer" };

type MockRowInput = {
  n: number;
  name: string;
  job: { id: string; title: string };
  status: InterviewResult["status"];
  processingStatus: InterviewResult["processingStatus"];
  processingLabel: string;
  startedMinutesAgo: number;
  minutes: number | null;
  score: { got: number; max: number } | null;
  recommendation: string | null;
};

function buildRow(input: MockRowInput): InterviewResult {
  const submitted = input.minutes !== null;
  const startedAt = minutesAgo(input.startedMinutesAgo);
  const submittedAt = submitted
    ? minutesAgo(input.startedMinutesAgo - (input.minutes ?? 0))
    : null;
  const isDone =
    input.processingStatus === "ready" || input.processingStatus === "partial";

  return {
    interviewId: `mock-interview-${input.n}`,
    applicationId: `mock-application-${input.n}`,
    jobId: input.job.id,
    candidateName: input.name,
    candidateEmail: `${input.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
    jobTitle: input.job.title,
    status: input.status,
    startedAt,
    submittedAt,
    completedAt: isDone ? submittedAt : null,
    timeTakenSeconds: input.minutes !== null ? input.minutes * 60 : null,
    processingStatus: input.processingStatus,
    processingLabel: input.processingLabel,
    transcriptionStatus: null,
    evaluationStatus: null,
    scores: input.score
      ? {
          overallScore: input.score.got,
          overallMaxScore: input.score.max,
          overallPercentage: Math.round((input.score.got / input.score.max) * 100),
        }
      : null,
    feedback: null,
    recommendation: input.recommendation,
    evaluatedAt: isDone ? submittedAt : null,
  };
}

const MOCK_RESULTS: InterviewResult[] = [
  buildRow({
    n: 1,
    name: "Alex In Progress",
    job: JOB_ENGINEER,
    status: "IN_PROGRESS",
    processingStatus: "candidate_in_progress",
    processingLabel: "Candidate answering",
    startedMinutesAgo: 10,
    minutes: null,
    score: null,
    recommendation: null,
  }),
  buildRow({
    n: 2,
    name: "Sam Transcribing",
    job: JOB_ENGINEER,
    status: "COMPLETED",
    processingStatus: "transcribing",
    processingLabel: "Transcribing answers",
    startedMinutesAgo: 60,
    minutes: 45,
    score: null,
    recommendation: null,
  }),
  buildRow({
    n: 3,
    name: "Casey Evaluating",
    job: JOB_ENGINEER,
    status: "COMPLETED",
    processingStatus: "evaluating",
    processingLabel: "Evaluating answers",
    startedMinutesAgo: 90,
    minutes: 53,
    score: null,
    recommendation: null,
  }),
  buildRow({
    n: 4,
    name: "Riley Failed",
    job: JOB_DESIGNER,
    status: "COMPLETED",
    processingStatus: "failed",
    processingLabel: "Processing failed",
    startedMinutesAgo: 120,
    minutes: 40,
    score: null,
    recommendation: null,
  }),
  buildRow({
    n: 5,
    name: "Taylor Ready Strong",
    job: JOB_ENGINEER,
    status: "COMPLETED",
    processingStatus: "ready",
    processingLabel: "Results ready",
    startedMinutesAgo: 300,
    minutes: 60,
    score: { got: 46, max: 50 },
    recommendation: "STRONGLY_RECOMMENDED",
  }),
  buildRow({
    n: 6,
    name: "Morgan Recommended",
    job: JOB_ENGINEER,
    status: "COMPLETED",
    processingStatus: "ready",
    processingLabel: "Results ready",
    startedMinutesAgo: 420,
    minutes: 48,
    score: { got: 38, max: 50 },
    recommendation: "RECOMMENDED",
  }),
  buildRow({
    n: 7,
    name: "Quinn Neutral",
    job: JOB_DESIGNER,
    status: "COMPLETED",
    processingStatus: "ready",
    processingLabel: "Results ready",
    startedMinutesAgo: 500,
    minutes: 51,
    score: { got: 28, max: 50 },
    recommendation: "NEUTRAL",
  }),
  buildRow({
    n: 8,
    name: "Avery Not Rec",
    job: JOB_ENGINEER,
    status: "COMPLETED",
    processingStatus: "ready",
    processingLabel: "Results ready",
    startedMinutesAgo: 600,
    minutes: 35,
    score: { got: 18, max: 50 },
    recommendation: "NOT_RECOMMENDED",
  }),
  buildRow({
    n: 9,
    name: "Jordan Partial",
    job: JOB_DESIGNER,
    status: "COMPLETED",
    processingStatus: "partial",
    processingLabel: "Partial results",
    startedMinutesAgo: 700,
    minutes: 42,
    score: { got: 34, max: 50 },
    recommendation: "RECOMMENDED",
  }),
  buildRow({
    n: 10,
    name: "Sky Other Role",
    job: JOB_DESIGNER,
    status: "COMPLETED",
    processingStatus: "ready",
    processingLabel: "Results ready",
    startedMinutesAgo: 800,
    minutes: 55,
    score: { got: 41, max: 50 },
    recommendation: "RECOMMENDED",
  }),
];

/* ─────────────── Hired state (kept in sessionStorage so a reload keeps it) ─────────────── */

type HiredMap = Record<string, string>; // applicationId -> hiredAt (ISO)

function readHired(): HiredMap {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HiredMap) : {};
  } catch {
    return {};
  }
}

function writeHired(value: HiredMap) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // storage unavailable — mock still works for the current page view
  }
}

/* ─────────────── Public mock API ─────────────── */

/** Mock for GET /interviews/results */
export async function mockListInterviewResults(): Promise<InterviewResult[]> {
  await wait();
  return MOCK_RESULTS.map((row) => ({ ...row }));
}

/** Mock for the job dropdown (GET /jobs) on the Hired Candidates page */
export async function mockJobList(): Promise<JobListRecord[]> {
  await wait(150);
  const deadline = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

  return [JOB_ENGINEER, JOB_DESIGNER].map((job) => ({
    id: job.id,
    title: job.title,
    applicationDeadline: deadline,
    status: "OPEN" as const,
    applications: MOCK_RESULTS.filter((row) => row.jobId === job.id).length,
  }));
}

/** Mock for POST /application/:id/hire */
export async function mockHireCandidate(
  applicationId: string,
  sendEmail: boolean,
): Promise<HireCandidateResponse> {
  await wait();

  const row = MOCK_RESULTS.find((item) => item.applicationId === applicationId);
  if (!row) throw new Error("Application not found");

  const hired = readHired();
  if (hired[applicationId]) throw new Error("Candidate is already hired");

  if (row.processingStatus !== "ready" && row.processingStatus !== "partial") {
    throw new Error("Applications can be hired only from INTERVIEW or OFFER status");
  }

  hired[applicationId] = new Date().toISOString();
  writeHired(hired);

  return {
    success: true,
    message: sendEmail
      ? "Candidate hired and notification email sent"
      : "Candidate hired",
  };
}

/** Mock for GET /application/hired */
export async function mockGetHiredCandidates(
  query?: HiredCandidatesQuery,
): Promise<HiredCandidatesResponse> {
  await wait();

  const hired = readHired();
  const page = Math.max(1, query?.page ?? 1);
  const limit = Math.max(1, query?.limit ?? 20);

  const all: HiredCandidate[] = MOCK_RESULTS.filter(
    (row) =>
      Boolean(hired[row.applicationId]) &&
      (!query?.jobId || row.jobId === query.jobId),
  )
    .map((row) => ({
      applicationId: row.applicationId,
      status: "HIRED" as const,
      hiredAt: hired[row.applicationId],
      appliedAt: row.startedAt,
      matchScore: row.scores ? Math.round(row.scores.overallPercentage) : 80,
      job: { id: row.jobId, title: row.jobTitle },
      candidate: {
        id: `mock-candidate-${row.applicationId}`,
        fullName: row.candidateName,
        email: row.candidateEmail,
        phone: "+92 300 0000000",
      },
    }))
    .sort(
      (a, b) =>
        new Date(b.hiredAt ?? 0).getTime() - new Date(a.hiredAt ?? 0).getTime(),
    );

  const start = (page - 1) * limit;

  return {
    success: true,
    data: all.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total: all.length,
      totalPages: Math.max(1, Math.ceil(all.length / limit)),
    },
  };
}