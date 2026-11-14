import { interviewSessionService } from "@/services/interview-session.service";

export type StoredInterviewInfo = {
  interviewId: string;
  jobTitle: string;
  companyName: string;
  candidateName: string;
};

const keyFor = (interviewId: string) => `evalexa:interview-info:${interviewId}`;

export function saveInterviewInfo(info: StoredInterviewInfo): void {
  try {
    window.sessionStorage.setItem(keyFor(info.interviewId), JSON.stringify(info));
  } catch {
    // storage unavailable – the session API (1b) is the fallback
  }
}

export function readInterviewInfo(
  interviewId: string,
): StoredInterviewInfo | null {
  try {
    const raw = window.sessionStorage.getItem(keyFor(interviewId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredInterviewInfo>;
    if (!parsed.jobTitle || !parsed.companyName || !parsed.candidateName) {
      return null;
    }
    return parsed as StoredInterviewInfo;
  } catch {
    return null;
  }
}

export function clearInterviewInfo(interviewId: string): void {
  try {
    window.sessionStorage.removeItem(keyFor(interviewId));
  } catch {
    // ignore
  }
}

/** Stored values first; if they were lost, recover via Session API 1b. */
export async function resolveInterviewInfo(
  interviewId: string,
): Promise<StoredInterviewInfo> {
  const stored = readInterviewInfo(interviewId);
  if (stored) return stored;

  const session = await interviewSessionService.getSessionInfo(interviewId);
  const info: StoredInterviewInfo = {
    interviewId,
    jobTitle: session.jobTitle,
    companyName: session.companyName,
    candidateName: session.candidateName,
  };
  saveInterviewInfo(info);
  return info;
}