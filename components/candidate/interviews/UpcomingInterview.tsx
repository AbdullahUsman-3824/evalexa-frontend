"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Video,
  MapPin,
  Monitor,
  CalendarPlus,
  Clock,
  Copy,
  CheckCircle,
  User,
} from "lucide-react";
import Link from "next/link";

export interface UpcomingInterviewData {
  id: string;
  company: string;
  companyInitials: string;
  companyColor: string;
  jobTitle: string;
  interviewType: "AI Interview" | "Video Call" | "In-Person";
  scheduledDate: string;
  scheduledTime: string;
  meetingLink?: string;
  interviewer?: {
    name: string;
    designation: string;
  };
}

interface UpcomingInterviewProps {
  interview: UpcomingInterviewData;
}

export default function UpcomingInterview({
  interview,
}: UpcomingInterviewProps) {
  const [timeUntil, setTimeUntil] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const interviewDate = new Date(
        `${interview.scheduledDate} ${interview.scheduledTime}`,
      );
      const now = new Date();
      const diff = interviewDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeUntil("Interview is now!");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeUntil(
          `In ${days} day${days > 1 ? "s" : ""}, ${hours} hour${hours > 1 ? "s" : ""}`,
        );
      } else if (hours > 0) {
        setTimeUntil(
          `In ${hours} hour${hours > 1 ? "s" : ""}, ${minutes} minute${minutes > 1 ? "s" : ""}`,
        );
      } else {
        setTimeUntil(`In ${minutes} minute${minutes > 1 ? "s" : ""}`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [interview.scheduledDate, interview.scheduledTime]);

  const getInterviewIcon = () => {
    switch (interview.interviewType) {
      case "AI Interview":
        return Monitor;
      case "Video Call":
        return Video;
      case "In-Person":
        return MapPin;
    }
  };

  const getInterviewColor = () => {
    switch (interview.interviewType) {
      case "AI Interview":
        return "bg-cyan/10 text-cyan border-cyan/30";
      case "Video Call":
        return "bg-primary/10 text-primary border-primary/30";
      case "In-Person":
        return "bg-success/10 text-success border-success/30";
    }
  };

  const Icon = getInterviewIcon();

  const handleCopyLink = () => {
    if (interview.meetingLink) {
      navigator.clipboard.writeText(interview.meetingLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  return (
    <motion.div
      className="rounded-xl border-t-4 border-primary bg-white p-5 shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ backgroundColor: interview.companyColor }}
        >
          {interview.companyInitials}
        </div>
        <div className="flex-1">
          <h3 className="font-display text-lg font-semibold text-midnight">
            {interview.jobTitle}
          </h3>
          <p className="text-sm text-slate">{interview.company}</p>
        </div>
        <span
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getInterviewColor()}`}
        >
          <Icon className="h-3.5 w-3.5" />
          {interview.interviewType}
        </span>
      </div>

      {/* Countdown */}
      <div className="mt-4 flex items-center gap-2 rounded-lg bg-primary/5 p-3">
        <Clock className="h-5 w-5 text-primary" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate">
            Starts In
          </p>
          <p className="font-display text-base font-bold text-primary">
            {timeUntil}
          </p>
        </div>
      </div>

      {/* Date & Time */}
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate">
          Scheduled For
        </p>
        <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-midnight">
          <Calendar className="h-4 w-4 text-primary" />
          {interview.scheduledDate} — {interview.scheduledTime}
        </p>
      </div>

      {/* Meeting Link (if Video Call) */}
      {interview.meetingLink && interview.interviewType === "Video Call" && (
        <div className="mt-4 rounded-lg border border-slate/15 bg-surface p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate">
            Meeting Link
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={interview.meetingLink}
              readOnly
              className="flex-1 rounded border border-slate/20 bg-white px-3 py-2 text-xs text-midnight"
            />
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary/90"
            >
              {linkCopied ? (
                <>
                  <CheckCircle className="h-3.5 w-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Interviewer (if provided) */}
      {interview.interviewer && (
        <div className="mt-4 flex items-center gap-3 rounded-lg border border-slate/15 bg-surface p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-midnight text-sm font-bold text-white">
            {interview.interviewer.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-midnight">
              {interview.interviewer.name}
            </p>
            <p className="text-xs text-slate">
              {interview.interviewer.designation}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={`/interviews/${interview.id}`}
          className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-primary/90"
        >
          View Details
        </Link>
        <button className="flex items-center gap-1.5 rounded-lg border border-slate/20 bg-white px-4 py-2.5 text-sm font-semibold text-midnight transition hover:bg-surface">
          <CalendarPlus className="h-4 w-4" />
          Add to Calendar
        </button>
      </div>
    </motion.div>
  );
}
