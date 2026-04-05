"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck } from "lucide-react";
import PendingInvite, {
  PendingInviteData,
} from "@/components/candidate/interviews/PendingInvite";
import UpcomingInterview, {
  UpcomingInterviewData,
} from "@/components/candidate/interviews/UpcomingInterview";
import CompletedInterview, {
  CompletedInterviewData,
} from "@/components/candidate/interviews/CompletedInterview";

const TABS = ["Pending", "Upcoming", "Completed", "All"] as const;
type Tab = (typeof TABS)[number];

// Mock data
const MOCK_PENDING: PendingInviteData[] = [
  {
    id: "1",
    company: "TechCorp Inc.",
    companyInitials: "TC",
    companyColor: "#1E6FFF",
    jobTitle: "Senior Frontend Developer",
    interviewType: "Video Call",
    invitedOn: "March 28, 2026",
    responseDeadline: "April 5, 2026",
    scheduledFor: "April 8, 2026",
    scheduledTime: "3:00 PM",
  },
  {
    id: "2",
    company: "AI Innovations",
    companyInitials: "AI",
    companyColor: "#00C2D1",
    jobTitle: "Full Stack Engineer",
    interviewType: "AI Interview",
    invitedOn: "March 29, 2026",
    responseDeadline: "April 3, 2026",
    scheduledFor: "April 6, 2026",
    scheduledTime: "10:00 AM",
  },
];

const MOCK_UPCOMING: UpcomingInterviewData[] = [
  {
    id: "3",
    company: "Digital Solutions",
    companyInitials: "DS",
    companyColor: "#00B37E",
    jobTitle: "UI/UX Designer",
    interviewType: "Video Call",
    scheduledDate: "April 2, 2026",
    scheduledTime: "2:00 PM",
    meetingLink: "https://zoom.us/j/1234567890",
    interviewer: {
      name: "Sarah Johnson",
      designation: "Lead Designer",
    },
  },
];

const MOCK_COMPLETED: CompletedInterviewData[] = [
  {
    id: "4",
    company: "CloudNine",
    companyInitials: "CN",
    companyColor: "#6B7A99",
    jobTitle: "DevOps Engineer",
    completedDate: "March 25, 2026",
    result: "Passed",
    hasFeedback: true,
  },
  {
    id: "5",
    company: "StartupXYZ",
    companyInitials: "SX",
    companyColor: "#FF9500",
    jobTitle: "Backend Developer",
    completedDate: "March 20, 2026",
    result: "Pending Result",
    hasFeedback: false,
  },
  {
    id: "6",
    company: "Enterprise Solutions",
    companyInitials: "ES",
    companyColor: "#E63946",
    jobTitle: "Product Manager",
    completedDate: "March 15, 2026",
    result: "Not Selected",
    hasFeedback: true,
  },
];

export default function InterviewsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [pendingInterviews, setPendingInterviews] = useState(MOCK_PENDING);
  const [upcomingInterviews, setUpcomingInterviews] = useState(MOCK_UPCOMING);

  const handleAcceptInvite = (id: string) => {
    const invite = pendingInterviews.find((inv) => inv.id === id);
    if (invite) {
      // Move to upcoming
      const newUpcoming: UpcomingInterviewData = {
        id: invite.id,
        company: invite.company,
        companyInitials: invite.companyInitials,
        companyColor: invite.companyColor,
        jobTitle: invite.jobTitle,
        interviewType: invite.interviewType,
        scheduledDate: invite.scheduledFor,
        scheduledTime: invite.scheduledTime,
        meetingLink:
          invite.interviewType === "Video Call"
            ? "https://zoom.us/j/0987654321"
            : undefined,
      };
      setUpcomingInterviews([...upcomingInterviews, newUpcoming]);
      setPendingInterviews(pendingInterviews.filter((inv) => inv.id !== id));
    }
  };

  const handleDeclineInvite = (id: string, reason?: string) => {
    console.log("Decline invite:", id, "Reason:", reason);
    setPendingInterviews(pendingInterviews.filter((inv) => inv.id !== id));
  };

  const pendingCount = pendingInterviews.length;
  const upcomingCount = upcomingInterviews.length;
  const completedCount = MOCK_COMPLETED.length;

  const showPending = activeTab === "All" || activeTab === "Pending";
  const showUpcoming = activeTab === "All" || activeTab === "Upcoming";
  const showCompleted = activeTab === "All" || activeTab === "Completed";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-midnight">
            Interviews
          </h1>
          <p className="text-slate">Manage your interview invitations</p>
        </div>
      </div>

      {/* Count Badges */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-lg bg-warning/10 px-4 py-2">
          <span className="font-semibold text-warning">Pending:</span>
          <span className="font-bold text-warning">{pendingCount}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2">
          <span className="font-semibold text-primary">Upcoming:</span>
          <span className="font-bold text-primary">{upcomingCount}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-slate/10 px-4 py-2">
          <span className="font-semibold text-slate">Completed:</span>
          <span className="font-bold text-slate">{completedCount}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl bg-white p-3 shadow-sm">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === tab
                ? "bg-primary text-white"
                : "text-midnight hover:bg-surface"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Pending Invites */}
      {showPending && pendingInterviews.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-midnight">
            Pending Invitations ({pendingCount})
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {pendingInterviews.map((invite) => (
              <PendingInvite
                key={invite.id}
                invite={invite}
                onAccept={handleAcceptInvite}
                onDecline={handleDeclineInvite}
              />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Interviews */}
      {showUpcoming && upcomingInterviews.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-midnight">
            Upcoming Interviews ({upcomingCount})
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingInterviews.map((interview) => (
              <UpcomingInterview key={interview.id} interview={interview} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Interviews */}
      {showCompleted && MOCK_COMPLETED.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-midnight">
            Completed Interviews ({completedCount})
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {MOCK_COMPLETED.map((interview) => (
              <CompletedInterview key={interview.id} interview={interview} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {((activeTab === "Pending" && pendingCount === 0) ||
        (activeTab === "Upcoming" && upcomingCount === 0) ||
        (activeTab === "Completed" && completedCount === 0)) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-xl bg-white p-12 text-center shadow-sm"
        >
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate/10">
            <CalendarCheck className="h-12 w-12 text-slate" />
          </div>
          <h3 className="mb-2 font-display text-2xl font-semibold text-midnight">
            No {activeTab.toLowerCase()} interviews
          </h3>
          <p className="text-slate">
            {activeTab === "Pending" &&
              "You don't have any pending interview invitations"}
            {activeTab === "Upcoming" &&
              "You don't have any upcoming interviews scheduled"}
            {activeTab === "Completed" &&
              "You haven't completed any interviews yet"}
          </p>
        </motion.div>
      )}
    </div>
  );
}
