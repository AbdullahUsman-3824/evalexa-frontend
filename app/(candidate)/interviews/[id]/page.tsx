"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  CheckCircle,
  ClipboardCheck,
  Star,
} from "lucide-react";
import CountdownTimer from "@/components/candidate/interviews/details/CountdownTimer";
import InterviewInfo from "@/components/candidate/interviews/details/InterviewInfo";
import PrepTips from "@/components/candidate/interviews/details/PrepTips";

// Mock interview data
const INTERVIEW_DATA = {
  id: "3",
  company: "Digital Solutions",
  companyInitials: "DS",
  companyColor: "#00B37E",
  jobTitle: "UI/UX Designer",
  status: "Confirmed",
  interviewType: "Video Call" as const,
  scheduledDate: "April 2, 2026",
  scheduledTime: "2:00 PM",
  endTime: "3:00 PM",
  meetingLink: "https://zoom.us/j/1234567890",
  meetingId: "123 456 7890",
  meetingPassword: "abc123",
  interviewer: {
    name: "Sarah Johnson",
    designation: "Lead Designer",
  },
  instructions: [
    "Join the meeting 5 minutes early to test your audio and video",
    "Have your portfolio ready to share on screen",
    "Prepare examples of your recent design work",
    "Be ready to discuss your design process and methodology",
  ],
  prepTips: [
    "Review the company's product and design system beforehand",
    "Prepare to discuss your experience with user research and testing",
    "Be ready to walk through 2-3 case studies in detail",
    "Practice explaining your design decisions and trade-offs",
    "Have questions ready about the team structure and design process",
  ],
  documents: [
    "Updated CNIC copy",
    "Latest degree certificates",
    "Portfolio (PDF or link)",
  ],
};

export default function InterviewDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  const getStatusColor = () => {
    switch (INTERVIEW_DATA.status) {
      case "Confirmed":
        return "bg-primary/10 text-primary border-primary/30";
      case "Pending":
        return "bg-warning/10 text-warning border-warning/30";
      case "Completed":
        return "bg-slate/10 text-slate border-slate/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition hover:bg-surface"
        >
          <ArrowLeft className="h-5 w-5 text-midnight" />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold text-midnight">
            Interview Details
          </h1>
        </div>
        <span
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${getStatusColor()}`}
        >
          <CheckCircle className="h-4 w-4" />
          {INTERVIEW_DATA.status}
        </span>
      </div>

      {/* Main Detail Card - Dark Gradient */}
      <motion.div
        className="rounded-2xl bg-gradient-to-br from-midnight via-midnight/95 to-midnight/90 p-8 text-white shadow-xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Company & Job */}
        <div className="flex items-start gap-4 mb-6">
          <div
            className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
            style={{ backgroundColor: INTERVIEW_DATA.companyColor }}
          >
            {INTERVIEW_DATA.companyInitials}
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-white">
              {INTERVIEW_DATA.jobTitle}
            </h2>
            <p className="text-white/70">{INTERVIEW_DATA.company}</p>
          </div>
        </div>

        {/* Date & Time Display */}
        <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-cyan" />
            <span className="text-sm uppercase tracking-wider text-white/70">
              Scheduled For
            </span>
          </div>
          <p className="mb-1 font-display text-3xl font-bold text-white">
            {INTERVIEW_DATA.scheduledDate}
          </p>
          <p className="text-xl text-cyan">
            {INTERVIEW_DATA.scheduledTime} – {INTERVIEW_DATA.endTime} PKT
          </p>
        </div>

        {/* Countdown */}
        <div className="mb-4">
          <p className="mb-4 text-center text-sm uppercase tracking-wider text-white/70">
            Starts In
          </p>
          <CountdownTimer
            targetDate={INTERVIEW_DATA.scheduledDate}
            targetTime={INTERVIEW_DATA.scheduledTime}
          />
        </div>
      </motion.div>

      {/* Interview Info & Instructions */}
      <InterviewInfo
        interviewType={INTERVIEW_DATA.interviewType}
        meetingLink={INTERVIEW_DATA.meetingLink}
        meetingId={INTERVIEW_DATA.meetingId}
        meetingPassword={INTERVIEW_DATA.meetingPassword}
        instructions={INTERVIEW_DATA.instructions}
      />

      {/* Interviewer Card */}
      {INTERVIEW_DATA.interviewer && (
        <motion.div
          className="rounded-xl border border-slate/15 bg-white p-6 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h3 className="mb-4 font-display text-lg font-semibold text-midnight">
            Interviewer
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-midnight text-lg font-bold text-white">
              {INTERVIEW_DATA.interviewer.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-midnight">
                {INTERVIEW_DATA.interviewer.name}
              </p>
              <p className="text-sm text-slate">
                {INTERVIEW_DATA.interviewer.designation}
              </p>
              <p className="text-xs text-slate">{INTERVIEW_DATA.company}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* AI Prep Tips */}
      <PrepTips tips={INTERVIEW_DATA.prepTips} />

      {/* Documents Checklist */}
      <motion.div
        className="rounded-xl border border-slate/15 bg-white p-6 shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className="mb-4 flex items-center gap-3">
          <ClipboardCheck className="h-5 w-5 text-primary" />
          <h3 className="font-display text-lg font-semibold text-midnight">
            Documents to Bring
          </h3>
        </div>
        <ul className="space-y-2">
          {INTERVIEW_DATA.documents.map((doc, index) => (
            <li
              key={index}
              className="flex items-center gap-3 rounded-lg border border-slate/10 bg-surface p-3"
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate/40 text-primary focus:ring-primary"
              />
              <span className="text-sm text-midnight">{doc}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Action Buttons */}
      {INTERVIEW_DATA.status === "Confirmed" && (
        <motion.div
          className="flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button className="flex-1 rounded-xl bg-success px-6 py-4 font-semibold text-white shadow-lg shadow-success/30 transition hover:bg-success/90">
            Join Interview
          </button>
          <button className="rounded-xl border-2 border-slate/20 bg-white px-6 py-4 font-semibold text-midnight transition hover:bg-surface">
            Add to Calendar
          </button>
          <button className="rounded-xl border-2 border-slate/20 bg-white px-6 py-4 text-sm font-semibold text-slate transition hover:bg-surface">
            Request Reschedule
          </button>
        </motion.div>
      )}

      {/* Completed - Rating Section */}
      {INTERVIEW_DATA.status === "Completed" && (
        <motion.div
          className="rounded-xl border border-slate/15 bg-white p-6 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="mb-4 font-display text-lg font-semibold text-midnight">
            Rate Your Interview Experience
          </h3>
          <div className="mb-4 flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} className="transition hover:scale-110">
                <Star className="h-8 w-8 text-warning" fill="none" />
              </button>
            ))}
          </div>
          <textarea
            placeholder="Share your experience (optional)"
            className="w-full rounded-lg border border-slate/20 p-3 text-sm text-midnight focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            rows={3}
          />
          <button className="mt-3 rounded-lg bg-primary px-6 py-2 font-semibold text-white transition hover:bg-primary/90">
            Submit Feedback
          </button>
        </motion.div>
      )}
    </div>
  );
}
