"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import CancelModal from "@/components/recruiter/interviews/CancelModal";
import InterviewCard, { InterviewItem, InterviewTab } from "@/components/recruiter/interviews/InterviewCard";
import RescheduleModal from "@/components/recruiter/interviews/RescheduleModal";
import Toast from "@/components/ui/Toast";

const tabs: InterviewTab[] = ["Upcoming", "Today", "Completed", "All", "Cancelled"];

const interviewsSeed: InterviewItem[] = [
  {
    id: "int-1",
    candidateName: "Sarah Johnson",
    candidateAvatar: "SJ",
    jobTitle: "Senior Product Designer",
    date: "April 8, 2025",
    time: "3:00 PM",
    duration: "1 hour",
    type: "Video Call",
    status: "starting-soon",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    interviewers: ["Alex Tan", "Rina Kumar"],
    outcome: null,
  },
  {
    id: "int-2",
    candidateName: "Aiman Hakim",
    candidateAvatar: "AH",
    jobTitle: "Frontend Engineer",
    date: "April 8, 2025",
    time: "5:00 PM",
    duration: "45 min",
    type: "AI Interview",
    status: "upcoming",
    interviewers: ["Mira Ong"],
    outcome: null,
  },
  {
    id: "int-3",
    candidateName: "Rachel Tan",
    candidateAvatar: "RT",
    jobTitle: "Data Analyst",
    date: "April 7, 2025",
    time: "11:00 AM",
    duration: "1.5 hours",
    type: "Phone Call",
    status: "completed",
    interviewers: ["Alex Tan"],
    rating: 4,
    outcome: "Passed",
  },
  {
    id: "int-4",
    candidateName: "John Lim",
    candidateAvatar: "JL",
    jobTitle: "Backend Engineer",
    date: "April 6, 2025",
    time: "2:30 PM",
    duration: "30 min",
    type: "In-Person",
    status: "cancelled",
    interviewers: ["Mira Ong", "Rina Kumar"],
    outcome: null,
  },
];

function isTodayInterview(interview: InterviewItem) {
  return interview.date === "April 8, 2025";
}

export default function InterviewsPage() {
  const [activeTab, setActiveTab] = useState<InterviewTab>("Upcoming");
  const [interviews, setInterviews] = useState<InterviewItem[]>(interviewsSeed);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");

  function showToast(message: string, type: "success" | "error" | "info") {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  }

  const todayCount = interviews.filter((item) => isTodayInterview(item)).length;
  const upcomingCount = interviews.filter((item) => item.status === "upcoming" || item.status === "starting-soon").length;
  const completedCount = interviews.filter((item) => item.status === "completed").length;

  const highlightedToday = useMemo(() => {
    return interviews
      .filter((item) => isTodayInterview(item))
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [interviews]);

  const filteredInterviews = useMemo(() => {
    if (activeTab === "All") return interviews;
    if (activeTab === "Today") return interviews.filter((item) => isTodayInterview(item));
    if (activeTab === "Completed") return interviews.filter((item) => item.status === "completed");
    if (activeTab === "Cancelled") return interviews.filter((item) => item.status === "cancelled");
    return interviews.filter((item) => item.status === "upcoming" || item.status === "starting-soon" || item.status === "in-progress");
  }, [activeTab, interviews]);

  function openReschedule(interview: InterviewItem) {
    setSelectedInterviewId(interview.id);
    setRescheduleOpen(true);
  }

  function openCancel(interview: InterviewItem) {
    setSelectedInterviewId(interview.id);
    setCancelOpen(true);
  }

  function handleMarkCompleted(interview: InterviewItem) {
    setInterviews((prev) =>
      prev.map((item) =>
        item.id === interview.id ? { ...item, status: "completed", outcome: item.outcome || "On Hold", rating: item.rating || 4 } : item,
      ),
    );
    showToast("Interview marked as completed", "success");
  }

  return (
    <div className="min-h-screen bg-[#F4F7FF] p-6">
      <div className="mx-auto max-w-[1600px] space-y-5">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-syne text-2xl font-bold text-[#0D1B2A]">Interviews</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#1E6FFF]/15 px-3 py-1 text-xs font-semibold text-[#1E6FFF]">
                Upcoming: {upcomingCount}
              </span>
              <span className="rounded-full bg-[#00B37E]/15 px-3 py-1 text-xs font-semibold text-[#00B37E]">Today: {todayCount}</span>
              <span className="rounded-full bg-[#6B7A99]/15 px-3 py-1 text-xs font-semibold text-[#6B7A99]">
                Completed: {completedCount}
              </span>
            </div>
          </div>

          <Link
            href="/recruiter/interviews/schedule"
            className="inline-flex items-center gap-2 rounded-lg bg-[#1E6FFF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1557D8]"
          >
            <Plus className="h-4 w-4" />
            Schedule New
          </Link>
        </header>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-700">{todayCount} interviews scheduled for today</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {highlightedToday.map((interview) => (
              <span key={interview.id} className="rounded-full border border-amber-300 bg-white px-2 py-1 text-xs text-amber-700">
                {interview.time} — {interview.candidateName}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                activeTab === tab ? "bg-[#1E6FFF] text-white" : "bg-white text-[#6B7A99] hover:bg-[#EAF0FF]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredInterviews.map((interview) => (
            <InterviewCard
              key={interview.id}
              interview={interview}
              onReschedule={openReschedule}
              onCancel={openCancel}
              onSendReminder={(item) => showToast(`Reminder sent to ${item.candidateName}`, "info")}
              onMarkCompleted={handleMarkCompleted}
            />
          ))}
        </div>
      </div>

      <RescheduleModal
        isOpen={rescheduleOpen}
        onClose={() => setRescheduleOpen(false)}
        onConfirm={(payload) => {
          if (!selectedInterviewId) return;
          setInterviews((prev) =>
            prev.map((item) =>
              item.id === selectedInterviewId
                ? {
                    ...item,
                    date: new Date(`${payload.date}T00:00:00`).toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }),
                    time: new Date(`2025-01-01T${payload.hour}:${payload.minute}:00`).toLocaleTimeString(undefined, {
                      hour: "numeric",
                      minute: "2-digit",
                    }),
                    status: "upcoming",
                  }
                : item,
            ),
          );
          setRescheduleOpen(false);
          showToast(`Interview rescheduled${payload.notifyCandidate ? " and candidate notified" : ""}`, "success");
        }}
      />

      <CancelModal
        isOpen={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={(payload) => {
          if (!selectedInterviewId) return;
          setInterviews((prev) =>
            prev.map((item) => (item.id === selectedInterviewId ? { ...item, status: "cancelled" } : item)),
          );
          setCancelOpen(false);
          showToast(`Interview cancelled${payload.notifyCandidate ? " and candidate notified" : ""}`, "error");
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

