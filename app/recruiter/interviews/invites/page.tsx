"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Loader2,
  RefreshCcw,
  Send,
  Sparkles,
  Users,
} from "lucide-react";
import { interviewService } from "@/services/interview.service";
import { getJob, getJobs } from "@/services/job.service";
import type { EligibleCandidate } from "@/types/interview.types";
import type { JobListRecord, JobRecord } from "@/types/job.types";

const inviteStatusLabels: Record<string, string> = {
  NOT_SENT: "Not sent",
  SENT: "Sent",
  STARTED: "Started",
  COMPLETED: "Completed",
  EXPIRED: "Expired",
  TERMINATED: "Terminated",
};

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "NA"
  );
}

export default function InterviewInvitesPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobListRecord[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [selectedJob, setSelectedJob] = useState<JobRecord | null>(null);
  const [candidates, setCandidates] = useState<EligibleCandidate[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(false);
  const [sendingIds, setSendingIds] = useState<Record<string, boolean>>({});
  const [failedIds, setFailedIds] = useState<Record<string, string>>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadJobs() {
      try {
        const nextJobs = await getJobs();
        if (!mounted) return;
        setJobs(nextJobs);
        if (nextJobs[0]) {
          setSelectedJobId(nextJobs[0].id);
        }
      } catch (error) {
        if (!mounted) return;
        setNotice(
          error instanceof Error
            ? error.message
            : "Unable to load available jobs.",
        );
      } finally {
        if (mounted) {
          setIsLoadingJobs(false);
        }
      }
    }

    loadJobs();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedJobId) return;

    let mounted = true;

    async function loadSelectedJob() {
      try {
        const nextJob = await getJob(selectedJobId);
        if (mounted) {
          setSelectedJob(nextJob);
        }
      } catch (error) {
        if (mounted) {
          setNotice(
            error instanceof Error
              ? error.message
              : "Unable to load the selected job details.",
          );
        }
      }
    }

    loadSelectedJob();

    return () => {
      mounted = false;
    };
  }, [selectedJobId]);

  useEffect(() => {
    if (!selectedJobId) return;

    let mounted = true;

    async function loadCandidates() {
      setIsLoadingCandidates(true);
      try {
        const nextCandidates = await interviewService.listEligibleCandidates();
        if (!mounted) return;

        const selectedJobTitle = selectedJob?.title ?? "";
        const filtered = selectedJobTitle
          ? nextCandidates.filter(
              (candidate) =>
                candidate.jobTitle.toLowerCase() ===
                  selectedJobTitle.toLowerCase() ||
                candidate.jobTitle
                  .toLowerCase()
                  .includes(selectedJobTitle.toLowerCase()),
            )
          : nextCandidates;

        setCandidates(filtered);
      } catch (error) {
        if (!mounted) return;
        setNotice(
          error instanceof Error
            ? error.message
            : "Unable to load eligible candidates.",
        );
      } finally {
        if (mounted) {
          setIsLoadingCandidates(false);
        }
      }
    }

    loadCandidates();

    return () => {
      mounted = false;
    };
  }, [selectedJob, selectedJobId]);

  const summary = useMemo(() => {
    const ready = candidates.filter(
      (candidate) =>
        !["SENT", "STARTED", "COMPLETED", "EXPIRED", "TERMINATED"].includes(
          candidate.inviteStatus,
        ),
    ).length;
    const sent = candidates.filter(
      (candidate) => candidate.inviteStatus === "SENT",
    ).length;
    const inProgress = candidates.filter(
      (candidate) => candidate.inviteStatus === "STARTED",
    ).length;
    const completed = candidates.filter(
      (candidate) => candidate.inviteStatus === "COMPLETED",
    ).length;

    return { ready, sent, inProgress, completed };
  }, [candidates]);

  const enableAiInterview = selectedJob?.aiConfig?.enableAiInterview ?? true;
  const interviewLimit = selectedJob?.aiConfig?.interviewLimit ?? null;
  const totalSent = candidates.filter(
    (candidate) => candidate.inviteStatus === "SENT",
  ).length;
  const sendLimitReached =
    interviewLimit !== null && totalSent >= interviewLimit;
  const readyCandidates = candidates.filter(
    (candidate) =>
      !["SENT", "STARTED", "COMPLETED", "EXPIRED", "TERMINATED"].includes(
        candidate.inviteStatus,
      ),
  );

  async function sendInvite(candidate: EligibleCandidate) {
    if (sendingIds[candidate.applicationId]) {
      return;
    }

    if (
      candidate.inviteStatus === "SENT" ||
      candidate.inviteStatus === "STARTED"
    ) {
      return;
    }

    if (!enableAiInterview) {
      setNotice("AI interview is disabled for this job.");
      return;
    }

    if (interviewLimit !== null && totalSent >= interviewLimit) {
      setNotice(
        `The interview limit for this job has been reached (${interviewLimit}).`,
      );
      return;
    }

    const confirmed = window.confirm(
      `Send interview invite to ${candidate.name} (${candidate.email}) for ${candidate.jobTitle}?`,
    );
    if (!confirmed) {
      return;
    }

    setSendingIds((prev) => ({ ...prev, [candidate.applicationId]: true }));
    setFailedIds((prev) => {
      const next = { ...prev };
      delete next[candidate.applicationId];
      return next;
    });

    try {
      await interviewService.sendInvitation(candidate.interviewId);
      setCandidates((prev) =>
        prev.map((item) =>
          item.applicationId === candidate.applicationId
            ? {
                ...item,
                inviteStatus: "SENT",
                invitedAt: new Date().toISOString(),
              }
            : item,
        ),
      );
      setNotice(`Invite sent to ${candidate.name}.`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Invite failed to send.";
      setFailedIds((prev) => ({ ...prev, [candidate.applicationId]: message }));
      setNotice(`Retry ${candidate.name}: ${message}`);
    } finally {
      setSendingIds((prev) => ({ ...prev, [candidate.applicationId]: false }));
    }
  }

  async function sendAllReadyInvites() {
    if (!readyCandidates.length) {
      setNotice("No eligible candidates are ready to invite.");
      return;
    }

    if (!enableAiInterview) {
      setNotice("AI interviews are disabled for this job.");
      return;
    }

    if (
      interviewLimit !== null &&
      totalSent + readyCandidates.length > interviewLimit
    ) {
      setNotice(
        `This job allows ${interviewLimit} interviews, but ${readyCandidates.length} more candidates are ready.`,
      );
      return;
    }

    setShowConfirm(false);

    for (const candidate of readyCandidates) {
      await sendInvite(candidate);
    }
  }

  const selectedJobLabel =
    selectedJob?.title ??
    jobs.find((job) => job.id === selectedJobId)?.title ??
    "Select a job";

  return (
    <div className="min-h-screen bg-[#F4F7FF] p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-4 rounded-2xl border border-slate/15 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => router.push("/recruiter/interviews")}
              className="mt-1 inline-flex items-center gap-2 rounded-lg border border-slate/20 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Interview flow
              </p>
              <h1 className="mt-2 font-syne text-2xl font-bold text-midnight">
                Send invites
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/recruiter/interviews/schedule")}
              className="rounded-lg border border-slate/20 bg-white px-4 py-2 text-sm font-semibold text-midnight hover:bg-surface"
            >
              Schedule manually
            </button>
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              disabled={
                !readyCandidates.length ||
                !enableAiInterview ||
                sendLimitReached
              }
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Send className="h-4 w-4" />
              Send invites
            </button>
          </div>
        </header>

        {notice && (
          <div className="rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-midnight">
            {notice}
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-slate/15 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Ready
            </p>
            <p className="mt-3 font-syne text-3xl font-bold text-midnight">
              {summary.ready}
            </p>
          </div>
          <div className="rounded-2xl border border-slate/15 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Sent
            </p>
            <p className="mt-3 font-syne text-3xl font-bold text-midnight">
              {summary.sent}
            </p>
          </div>
          <div className="rounded-2xl border border-slate/15 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Started
            </p>
            <p className="mt-3 font-syne text-3xl font-bold text-midnight">
              {summary.inProgress}
            </p>
          </div>
          <div className="rounded-2xl border border-slate/15 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Completed
            </p>
            <p className="mt-3 font-syne text-3xl font-bold text-midnight">
              {summary.completed}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate/15 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="w-full md:max-w-sm">
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Job
              </label>
              <div className="relative mt-2">
                <select
                  value={selectedJobId}
                  onChange={(event) => setSelectedJobId(event.target.value)}
                  className="h-12 w-full appearance-none rounded-xl border border-slate/20 bg-white px-4 pr-10 text-sm font-medium text-midnight outline-none focus:border-primary"
                  disabled={isLoadingJobs || !jobs.length}
                >
                  {jobs.length === 0 ? (
                    <option value="">Loading jobs...</option>
                  ) : (
                    jobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title}
                      </option>
                    ))
                  )}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm">
              {enableAiInterview ? (
                <span className="rounded-full bg-success/10 px-3 py-1.5 font-medium text-success">
                  AI interviews enabled
                </span>
              ) : (
                <span className="rounded-full bg-warning/10 px-3 py-1.5 font-medium text-warning">
                  AI interviews disabled
                </span>
              )}
              {interviewLimit !== null && (
                <span className="rounded-full bg-primary/10 px-3 py-1.5 font-medium text-primary">
                  Limit: {interviewLimit}
                </span>
              )}
            </div>
          </div>

          {sendLimitReached && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/5 p-3 text-sm text-warning">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                This job has reached its interview limit. No additional invite
                can be sent until a recruiter increases the cap.
              </span>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate/15 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-midnight">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="font-syne text-lg font-semibold">
                Eligible candidates
              </h2>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
              {selectedJobLabel}
            </span>
          </div>

          {isLoadingCandidates ? (
            <div className="flex items-center justify-center gap-3 rounded-xl border border-dashed border-slate/25 bg-slate-50 py-12 text-sm text-slate-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading eligible candidates...
            </div>
          ) : candidates.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate/25 bg-slate-50 py-10 text-center text-sm text-slate-600">
              No eligible candidates for this job yet.
            </div>
          ) : (
            <div className="space-y-3">
              {candidates.map((candidate) => {
                const isSending = Boolean(sendingIds[candidate.applicationId]);
                const failedMessage = failedIds[candidate.applicationId];
                const canSend =
                  candidate.inviteStatus !== "SENT" &&
                  candidate.inviteStatus !== "STARTED" &&
                  candidate.inviteStatus !== "COMPLETED" &&
                  candidate.inviteStatus !== "EXPIRED" &&
                  candidate.inviteStatus !== "TERMINATED" &&
                  enableAiInterview &&
                  !(interviewLimit !== null && totalSent >= interviewLimit);

                return (
                  <div
                    key={candidate.applicationId}
                    className="flex flex-col gap-3 rounded-xl border border-slate/15 bg-slate-50 p-3 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {getInitials(candidate.name)}
                      </div>

                      <div>
                        <p className="font-semibold text-midnight">
                          {candidate.name}
                        </p>
                        <p className="text-sm text-slate-600">
                          {candidate.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 md:justify-end">
                      <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700">
                        {candidate.jobTitle}
                      </span>
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        {inviteStatusLabels[candidate.inviteStatus] ??
                          candidate.inviteStatus}
                      </span>

                      {failedMessage ? (
                        <span className="rounded-full bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger">
                          Retry needed
                        </span>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => sendInvite(candidate)}
                        disabled={!canSend || isSending}
                        className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-white px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/5 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                      >
                        {isSending ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : failedMessage ? (
                          <>
                            <RefreshCcw className="h-4 w-4" />
                            Retry invite
                          </>
                        ) : canSend ? (
                          <>
                            <Send className="h-4 w-4" />
                            Send invite
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            {inviteStatusLabels[candidate.inviteStatus] ??
                              "Sent"}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate/15 bg-white p-5 shadow-xl">
            <div className="flex items-center gap-3 text-midnight">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-syne text-lg font-semibold">
                  Confirm sends
                </h3>
                <p className="text-sm text-slate-600">
                  {readyCandidates.length} candidates are ready to receive
                  interviews.
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-600">
              You are about to send interview invites for {selectedJobLabel}.
              This action will notify each candidate by the active mock service.
            </p>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="rounded-lg border border-slate/20 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={sendAllReadyInvites}
                className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90"
              >
                Confirm send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
