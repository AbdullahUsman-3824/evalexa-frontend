"use client";

import {
  AlertTriangle,
  BrainCircuit,
  Gauge,
  ShieldAlert,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

export type InterviewFeedbackRecord = {
  id: string;
  candidateName: string;
  jobTitle: string;
  overallScore: number | null;
  recommendation: string | null;
  summary: string;
  questionFeedback: Array<{
    id: string;
    prompt: string;
    score: number | null;
    feedback: string;
    skipped: boolean;
  }>;
  securityEvents: Array<{
    type: string;
    time: string;
    detail: string;
    severity: "info" | "warning" | "danger";
  }>;
};

interface InterviewFeedbackPanelProps {
  isOpen: boolean;
  interviewId: string | null;
  candidateName?: string;
  jobTitle?: string;
  onClose: () => void;
}

const feedbackCatalog: Record<string, InterviewFeedbackRecord> = {
  app_101: {
    id: "app_101",
    candidateName: "Aisha Rahman",
    jobTitle: "Frontend Engineer",
    overallScore: null,
    recommendation: null,
    summary:
      "Aisha showed strong product instincts and clear communication, though the final answer lacked a few concrete metrics.",
    questionFeedback: [
      {
        id: "q1",
        prompt: "Product decision and retention",
        score: null,
        feedback:
          "Strong reasoning and structure. Needs one more quantified outcome to be fully persuasive.",
        skipped: false,
      },
      {
        id: "q2",
        prompt: "Team alignment under constraints",
        score: null,
        feedback:
          "Clear ownership and communication. Could have described trade-offs more explicitly.",
        skipped: false,
      },
      {
        id: "q3",
        prompt: "Delegation under shifting priorities",
        score: null,
        feedback: "Skipped due to timer expiration.",
        skipped: true,
      },
    ],
    securityEvents: [
      {
        type: "session_started",
        time: "09:12 AM",
        detail: "Interview started with valid token and PIN verification.",
        severity: "info",
      },
      {
        type: "answer_submitted",
        time: "09:24 AM",
        detail: "Submission received for question 2 without anomalies.",
        severity: "info",
      },
      {
        type: "late_answer",
        time: "09:31 AM",
        detail: "One question timed out and was marked as skipped.",
        severity: "warning",
      },
    ],
  },
};

export default function InterviewFeedbackPanel({
  isOpen,
  interviewId,
  candidateName,
  jobTitle,
  onClose,
}: InterviewFeedbackPanelProps) {
  const [feedback, setFeedback] = useState<InterviewFeedbackRecord | null>(
    null,
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!isOpen || !interviewId) {
      // This panel intentionally resets its local demo state when closed.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFeedback(null);
      setIsAnalyzing(false);
      return;
    }

    const record = feedbackCatalog[interviewId] ?? {
      id: interviewId,
      candidateName: candidateName ?? "Candidate",
      jobTitle: jobTitle ?? "Interview",
      overallScore: 92,
      recommendation: "Strong fit",
      summary:
        "The candidate demonstrated solid judgment and strong cross-functional communication in the AI interview.",
      questionFeedback: [
        {
          id: "q1",
          prompt: "Product reasoning",
          score: 94,
          feedback: "Excellent structure and decision framing.",
          skipped: false,
        },
      ],
      securityEvents: [
        {
          type: "session_started",
          time: "Now",
          detail: "Interview started successfully.",
          severity: "info",
        },
      ],
    };

    const applyFeedback = (
      nextRecord: InterviewFeedbackRecord,
      analyzing: boolean,
    ) => {
      setFeedback(nextRecord);
      setIsAnalyzing(analyzing);
    };

    if (record.overallScore === null) {
      const timer = window.setTimeout(() => {
        applyFeedback(
          { ...record, overallScore: null, recommendation: null },
          true,
        );

        const analysisTimer = window.setTimeout(() => {
          applyFeedback(
            {
              ...record,
              overallScore: 91,
              recommendation: "Strong fit",
              questionFeedback: record.questionFeedback.map((item, index) => ({
                ...item,
                score: item.skipped ? null : 90 + index * 2,
              })),
            },
            false,
          );
        }, 10000);

        return () => window.clearTimeout(analysisTimer);
      }, 0);

      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      applyFeedback(record, false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [candidateName, isOpen, interviewId, jobTitle]);

  if (!isOpen) return null;

  const panel = feedback;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate/15 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate/15 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Interview review
            </p>
            <h3 className="mt-1 font-syne text-xl font-semibold text-midnight">
              {panel?.candidateName ?? candidateName ?? "Candidate"}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              setFeedback(null);
              setIsAnalyzing(false);
              onClose();
            }}
            className="rounded-lg border border-slate/20 p-2 text-slate-600 hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!panel ? (
          <div className="p-5 text-sm text-slate-600">Loading feedback…</div>
        ) : (
          <div className="space-y-6 p-5">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-primary/5 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Overall score
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <Gauge className="h-5 w-5 text-primary" />
                  <span className="font-syne text-3xl font-bold text-midnight">
                    {panel.overallScore ?? "—"}
                  </span>
                  {panel.overallScore !== null && (
                    <span className="text-sm text-slate-500">/ 100</span>
                  )}
                </div>
              </div>

              <div className="rounded-2xl bg-success/5 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Recommendation
                </p>
                <p className="mt-2 font-syne text-lg font-semibold text-success">
                  {panel.recommendation ??
                    (isAnalyzing ? "Analyzing…" : "Pending")}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-100 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Job
                </p>
                <p className="mt-2 font-medium text-midnight">
                  {panel.jobTitle}
                </p>
              </div>
            </div>

            {isAnalyzing && (
              <div className="rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-sm text-primary">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4" />
                  Analyzing candidate response…
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-slate/15 bg-white p-4">
              <h4 className="font-syne text-lg font-semibold text-midnight">
                Summary
              </h4>
              <p className="mt-2 text-sm text-slate-700">{panel.summary}</p>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
              <div className="rounded-2xl border border-slate/15 bg-white p-4">
                <h4 className="font-syne text-lg font-semibold text-midnight">
                  Question review
                </h4>
                <div className="mt-4 space-y-3">
                  {panel.questionFeedback.map((question) => (
                    <div
                      key={question.id}
                      className="rounded-xl border border-slate/15 bg-slate-50 p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-midnight">
                          {question.prompt}
                        </p>
                        {question.skipped && (
                          <span className="rounded-full bg-warning/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-warning">
                            Skipped
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex items-center gap-3 text-sm text-slate-600">
                        <span className="rounded-full bg-primary/10 px-2 py-1 font-semibold text-primary">
                          {question.skipped ? "—" : `${question.score}/100`}
                        </span>
                        {question.skipped && (
                          <span className="text-warning">
                            Timed out or omitted.
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-sm text-slate-700">
                        {question.feedback}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate/15 bg-white p-4">
                <h4 className="font-syne text-lg font-semibold text-midnight">
                  Security timeline
                </h4>
                <div className="mt-4 space-y-3">
                  {panel.securityEvents.map((event) => (
                    <div
                      key={`${event.type}-${event.time}`}
                      className="rounded-xl border border-slate/15 bg-slate-50 p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold capitalize text-midnight">
                          {event.type.replace("_", " ")}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {event.time}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        {event.severity === "danger" && (
                          <AlertTriangle className="h-3.5 w-3.5 text-danger" />
                        )}
                        {event.severity === "warning" && (
                          <ShieldAlert className="h-3.5 w-3.5 text-warning" />
                        )}
                        {event.severity === "info" && (
                          <BrainCircuit className="h-3.5 w-3.5 text-primary" />
                        )}
                        <p className="text-sm text-slate-700">{event.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
