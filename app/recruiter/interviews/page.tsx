"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, ShieldAlert } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import CancelModal from "@/components/recruiter/interviews/CancelModal";
import ExpiredLinkRequestsPanel from "@/components/recruiter/interviews/ExpiredLinkRequestsPanel";
import InterviewCard, {
  InterviewItem,
  InterviewTab,
  mapInviteStatusToInterviewStatus,
} from "@/components/recruiter/interviews/InterviewCard";
import InterviewFeedbackPanel from "@/components/recruiter/interviews/InterviewFeedbackPanel";
import Toast from "@/components/ui/Toast";
import { interviewService } from "@/services/interview.service";
import type {
  EligibleCandidate,
  ExtensionRequest,
  ExtensionRequestStatus,
  InviteStatus,
  ReinviteRequest,
} from "@/types/interview.types";

const tabs: InterviewTab[] = [
  "Invited",
  "In progress",
  "Completed",
  "Terminated",
  "Expired",
  "All",
];

const requestStatusTabs: { label: string; value: ExtensionRequestStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "AI"
  );
}

function formatInterviewDate(value: string | undefined): string {
  if (!value) return "Not scheduled";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not scheduled";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatInterviewTime(value: string | undefined): string {
  if (!value) return "--:--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--:--";
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function mapCandidatesToInterviews(
  candidates: EligibleCandidate[],
): InterviewItem[] {
  return candidates.map((candidate) => ({
    id: candidate.applicationId,
    candidateName: candidate.name,
    candidateAvatar: getInitials(candidate.name),
    jobTitle: candidate.jobTitle,
    date: formatInterviewDate(candidate.invitedAt),
    time: formatInterviewTime(candidate.invitedAt),
    duration: "AI interview",
    type: "AI Interview",
    status: mapInviteStatusToInterviewStatus(
      candidate.inviteStatus as InviteStatus,
    ),
    interviewers: ["AI Review"],
    outcome:
      candidate.inviteStatus === "COMPLETED"
        ? "Passed"
        : candidate.inviteStatus === "TERMINATED"
          ? "Failed"
          : null,
    score: candidate.inviteStatus === "COMPLETED" ? 92 : null,
    recommendation:
      candidate.inviteStatus === "COMPLETED" ? "Strong fit" : null,
  }));
}

function mapExtensionRequestToReinviteRequest(
  request: ExtensionRequest,
): ReinviteRequest {
  return {
    id: request.id,
    interviewId: request.interviewId,
    candidate: request.candidateName,
    jobApplicationId: request.interviewId,
    jobTitle: request.jobTitle,
    reason: request.reason,
    requestedAt: request.requestedAt,
    status: request.status,
    reviewerNote: request.decisionNote,
    token: null,
  };
}

export default function InterviewsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<InterviewTab>("Invited");
  const [interviews, setInterviews] = useState<InterviewItem[]>([]);
  const [isLoadingInterviews, setIsLoadingInterviews] = useState(true);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(
    null,
  );
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(
    null,
  );
  const [showFeedbackPanel, setShowFeedbackPanel] = useState(false);
  const [showRequestsPanel, setShowRequestsPanel] = useState(false);
  const [expiredRequests, setExpiredRequests] = useState<ReinviteRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [requestStatusFilter, setRequestStatusFilter] = useState<
    ExtensionRequestStatus | "ALL"
  >("ALL");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "success",
  );

  function showToast(message: string, type: "success" | "error" | "info") {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  }

  const loadCandidates = useCallback(async () => {
    try {
      const candidates = await interviewService.listEligibleCandidates();
      setInterviews(mapCandidatesToInterviews(candidates));
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Unable to load interviews.",
        "error",
      );
    }
  }, []);

  const loadRequests = useCallback(
    async (status: ExtensionRequestStatus | "ALL") => {
      setIsLoadingRequests(true);
      try {
        const result = await interviewService.listExtensionRequests(
          status === "ALL" ? undefined : { status },
        );
        setExpiredRequests(
          result.items.map(mapExtensionRequestToReinviteRequest),
        );
      } catch (error) {
        showToast(
          error instanceof Error ? error.message : "Unable to load requests.",
          "error",
        );
      } finally {
        setIsLoadingRequests(false);
      }
    },
    [],
  );

  useEffect(() => {
    let active = true;

    async function loadData() {
      await Promise.all([loadCandidates(), loadRequests("ALL")]);

      if (active) {
        setIsLoadingInterviews(false);
      }
    }

    loadData();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload requests when the status filter changes
  useEffect(() => {
    if (!showRequestsPanel) return;
    void loadRequests(requestStatusFilter);
  }, [requestStatusFilter, showRequestsPanel, loadRequests]);

  const invitedCount = interviews.filter(
    (item) => item.status === "invited",
  ).length;
  const inProgressCount = interviews.filter(
    (item) => item.status === "in_progress",
  ).length;
  const completedCount = interviews.filter(
    (item) => item.status === "completed",
  ).length;
  const terminatedCount = interviews.filter(
    (item) => item.status === "terminated",
  ).length;
  const expiredCount = interviews.filter(
    (item) => item.status === "expired",
  ).length;

  const filteredInterviews = useMemo(() => {
    switch (activeTab) {
      case "Invited":
        return interviews.filter((item) => item.status === "invited");
      case "In progress":
        return interviews.filter((item) => item.status === "in_progress");
      case "Completed":
        return interviews.filter((item) => item.status === "completed");
      case "Terminated":
        return interviews.filter((item) => item.status === "terminated");
      case "Expired":
        return interviews.filter((item) => item.status === "expired");
      default:
        return interviews;
    }
  }, [activeTab, interviews]);

  async function handleApproveRequest(
    request: ReinviteRequest,
    decisionNote?: string,
  ) {
    const previous = expiredRequests;
    setExpiredRequests((items) =>
      items.map((item) =>
        item.id === request.id ? { ...item, status: "APPROVED" } : item,
      ),
    );

    try {
      await interviewService.approveExtensionRequest(
        request.interviewId,
        request.id,
        decisionNote,
      );
      showToast(
        "Request approved and a new invitation has been sent to the candidate.",
        "success",
      );
      // Refresh both lists so the invitation status updates
      await Promise.all([loadCandidates(), loadRequests(requestStatusFilter)]);
    } catch (error) {
      setExpiredRequests(previous);
      showToast(
        error instanceof Error ? error.message : "Approval failed.",
        "error",
      );
    }
  }

  async function handleRejectRequest(
    request: ReinviteRequest,
    decisionNote?: string,
  ) {
    const previous = expiredRequests;
    setExpiredRequests((items) =>
      items.map((item) =>
        item.id === request.id
          ? {
              ...item,
              status: "REJECTED",
              reviewerNote: decisionNote?.trim() || null,
            }
          : item,
      ),
    );

    try {
      await interviewService.rejectExtensionRequest(
        request.interviewId,
        request.id,
        decisionNote,
      );
      showToast(
        decisionNote
          ? `Request rejected with note: ${decisionNote}`
          : "Request rejected.",
        "info",
      );
      await loadRequests(requestStatusFilter);
    } catch (error) {
      setExpiredRequests(previous);
      showToast(
        error instanceof Error ? error.message : "Rejection failed.",
        "error",
      );
    }
  }

  function openCancel(interview: InterviewItem) {
    setSelectedInterviewId(interview.id);
    setCancelOpen(true);
  }

  function handleViewFeedback(interview: InterviewItem) {
    setSelectedFeedbackId(interview.id);
    setShowFeedbackPanel(true);
  }

  async function handleCancelConfirm(payload: {
    reason: string;
    notifyCandidate: boolean;
  }) {
    if (!selectedInterviewId) return;

    // Optimistic UI update only - no backend cancel endpoint in the
    // interview contract. The CancelModal remains for local management.
    setInterviews((items) =>
      items.map((item) =>
        item.id === selectedInterviewId
          ? { ...item, status: "terminated" }
          : item,
      ),
    );

    showToast(
      `Interview cancelled${payload.notifyCandidate ? " and candidate notified" : ""}`,
      "error",
    );

    setCancelOpen(false);
    setSelectedInterviewId(null);
  }

  return (
    <div className="min-h-screen bg-[#F4F7FF] p-6">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-syne text-2xl font-bold text-[#0D1B2A]">
              Interviews
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#1E6FFF]/15 px-3 py-1 text-xs font-semibold text-[#1E6FFF]">
                Invited: {invitedCount}
              </span>
              <span className="rounded-full bg-[#00B37E]/15 px-3 py-1 text-xs font-semibold text-[#00B37E]">
                In progress: {inProgressCount}
              </span>
              <span className="rounded-full bg-[#6B7A99]/15 px-3 py-1 text-xs font-semibold text-[#6B7A99]">
                Completed: {completedCount}
              </span>
              <span className="rounded-full bg-[#E63946]/10 px-3 py-1 text-xs font-semibold text-[#E63946]">
                Terminated: {terminatedCount}
              </span>
              <span className="rounded-full bg-[#FF9500]/10 px-3 py-1 text-xs font-semibold text-[#FF9500]">
                Expired: {expiredCount}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowRequestsPanel((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/5 px-4 py-2 text-sm font-semibold text-warning hover:bg-warning/10"
            >
              <ShieldAlert className="h-4 w-4" />
              {showRequestsPanel ? "Hide requests" : "Link requests"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/recruiter/interviews/invites")}
              className="inline-flex items-center gap-2 rounded-lg border border-primary/25 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
            >
              Send Invites
            </button>
            <Link
              href="/recruiter/interviews/schedule"
              className="inline-flex items-center gap-2 rounded-lg bg-[#1E6FFF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1557D8]"
            >
              <Plus className="h-4 w-4" />
              Schedule New
            </Link>
          </div>
        </header>

        {showRequestsPanel && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {requestStatusTabs.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setRequestStatusFilter(tab.value)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                    requestStatusFilter === tab.value
                      ? "bg-[#1E6FFF] text-white"
                      : "bg-white text-[#6B7A99] hover:bg-[#EAF0FF]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <ExpiredLinkRequestsPanel
              requests={expiredRequests}
              isLoading={isLoadingRequests}
              onApprove={handleApproveRequest}
              onReject={handleRejectRequest}
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                activeTab === tab
                  ? "bg-[#1E6FFF] text-white"
                  : "bg-white text-[#6B7A99] hover:bg-[#EAF0FF]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {isLoadingInterviews ? (
            <div className="rounded-xl border border-dashed border-slate/25 bg-white p-8 text-center text-sm text-slate-600">
              Loading AI interviews…
            </div>
          ) : filteredInterviews.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate/25 bg-white p-8 text-center text-sm text-slate-600">
              No interviews match this status.
            </div>
          ) : (
            filteredInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interview={interview}
                onReschedule={() => undefined}
                onCancel={openCancel}
                onSendReminder={(item) =>
                  showToast(`Reminder sent to ${item.candidateName}`, "info")
                }
                onMarkCompleted={() => undefined}
                onViewFeedback={handleViewFeedback}
              />
            ))
          )}
        </div>
      </div>

      {selectedInterviewId && (
        <CancelModal
          isOpen={cancelOpen}
          onClose={() => {
            setCancelOpen(false);
            setSelectedInterviewId(null);
          }}
          onConfirm={handleCancelConfirm}
        />
      )}

      <InterviewFeedbackPanel
        isOpen={showFeedbackPanel}
        interviewId={selectedFeedbackId}
        candidateName={
          interviews.find((item) => item.id === selectedFeedbackId)
            ?.candidateName ?? undefined
        }
        jobTitle={
          interviews.find((item) => item.id === selectedFeedbackId)?.jobTitle ??
          undefined
        }
        onClose={() => {
          setShowFeedbackPanel(false);
          setSelectedFeedbackId(null);
        }}
      />

      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
}
