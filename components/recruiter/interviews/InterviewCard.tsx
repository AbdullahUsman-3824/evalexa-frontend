"use client";

import { CheckCircle2, Clock3, ExternalLink, MoreVertical } from "lucide-react";
import { useMemo, useState } from "react";

export type InterviewTab = "Upcoming" | "Today" | "Completed" | "All" | "Cancelled";
export type InterviewType = "AI Interview" | "Video Call" | "Phone Call" | "In-Person";
export type InterviewStatus = "upcoming" | "starting-soon" | "in-progress" | "completed" | "cancelled";
export type InterviewOutcome = "Passed" | "Failed" | "On Hold" | "Hired" | null;

export interface InterviewItem {
  id: string;
  candidateName: string;
  candidateAvatar: string;
  jobTitle: string;
  date: string;
  time: string;
  duration: string;
  type: InterviewType;
  status: InterviewStatus;
  meetingLink?: string;
  interviewers: string[];
  rating?: number;
  outcome: InterviewOutcome;
}

interface InterviewCardProps {
  interview: InterviewItem;
  onReschedule: (interview: InterviewItem) => void;
  onCancel: (interview: InterviewItem) => void;
  onSendReminder: (interview: InterviewItem) => void;
  onMarkCompleted: (interview: InterviewItem) => void;
}

function typeTone(type: InterviewType) {
  if (type === "AI Interview") return "bg-[#00C2D1]/15 text-[#00C2D1]";
  if (type === "Video Call") return "bg-[#1E6FFF]/15 text-[#1E6FFF]";
  if (type === "Phone Call") return "bg-[#00B37E]/15 text-[#00B37E]";
  return "bg-[#FF9500]/15 text-[#FF9500]";
}

function statusTone(status: InterviewStatus) {
  if (status === "starting-soon") return "bg-[#FF9500] animate-pulse";
  if (status === "in-progress") return "bg-[#00B37E] animate-pulse";
  if (status === "completed") return "bg-[#6B7A99]";
  if (status === "cancelled") return "bg-[#E63946]";
  return "bg-[#1E6FFF]";
}

function outcomeTone(outcome: InterviewOutcome) {
  if (outcome === "Passed") return "bg-[#00B37E]/15 text-[#00B37E]";
  if (outcome === "Failed") return "bg-[#E63946]/15 text-[#E63946]";
  if (outcome === "On Hold") return "bg-[#FF9500]/15 text-[#FF9500]";
  if (outcome === "Hired") return "bg-amber-100 text-amber-700";
  return "bg-[#6B7A99]/15 text-[#6B7A99]";
}

export default function InterviewCard({
  interview,
  onReschedule,
  onCancel,
  onSendReminder,
  onMarkCompleted,
}: InterviewCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const stars = useMemo(() => {
    if (!interview.rating) return null;
    return "★".repeat(interview.rating) + "☆".repeat(5 - interview.rating);
  }, [interview.rating]);

  return (
    <article
      className={`rounded-xl border border-[#6B7A99]/20 bg-white p-4 shadow-sm ${
        interview.status === "cancelled" ? "opacity-80" : ""
      }`}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <p className="font-syne text-[20px] font-semibold text-[#1E6FFF]">{interview.time}</p>
          <p className="text-xs text-[#6B7A99]">{interview.duration}</p>
          <p className="mt-1 text-xs text-[#6B7A99]">{interview.date}</p>
        </div>

        <div className="lg:col-span-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#1E6FFF] to-[#00C2D1] text-xs font-semibold text-white">
              {interview.candidateAvatar}
            </div>
            <div>
              <p
                className={`text-sm font-semibold text-[#0D1B2A] ${
                  interview.status === "cancelled" ? "line-through decoration-[#E63946]" : ""
                }`}
              >
                {interview.candidateName}
              </p>
              <p className="text-xs text-[#6B7A99]">{interview.jobTitle}</p>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#1E6FFF]/10 px-2 py-1 text-xs font-semibold text-[#1E6FFF]">
              {interview.jobTitle}
            </span>
            <span className={`rounded-full px-2 py-1 text-xs font-semibold ${typeTone(interview.type)}`}>
              {interview.type}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-[#6B7A99]">
              <span className={`h-2 w-2 rounded-full ${statusTone(interview.status)}`} />
              {interview.status.replace("-", " ")}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-2">
            {interview.interviewers.map((name, index) => (
              <div
                key={`${interview.id}-${name}`}
                style={{ marginLeft: index === 0 ? 0 : -8 }}
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#0D1B2A] text-[10px] font-semibold text-white"
                title={name}
              >
                {name
                  .split(" ")
                  .map((token) => token[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            ))}
          </div>

          {interview.status === "completed" && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className={`rounded-full px-2 py-1 font-semibold ${outcomeTone(interview.outcome)}`}>
                {interview.outcome || "Outcome not set"}
              </span>
              {!interview.outcome && (
                <button className="rounded-lg border border-[#6B7A99]/30 px-2 py-1 font-semibold text-[#6B7A99] hover:bg-[#F4F7FF]">
                  Add Outcome
                </button>
              )}
              {interview.type === "AI Interview" && (
                <button className="rounded-lg border border-[#00C2D1]/30 px-2 py-1 font-semibold text-[#00C2D1] hover:bg-[#00C2D1]/10">
                  View Feedback
                </button>
              )}
              {stars && <span className="text-amber-500">{stars}</span>}
            </div>
          )}
        </div>

        <div className="lg:col-span-3">
          <div className="flex items-center justify-end gap-2">
            {interview.type === "Video Call" && interview.meetingLink && (
              <a
                href={interview.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-lg bg-[#00B37E] px-3 py-2 text-xs font-semibold text-white hover:bg-[#00B37E]/90"
              >
                Join
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            <button className="rounded-lg border border-[#6B7A99]/30 px-3 py-2 text-xs font-semibold text-[#6B7A99] hover:bg-[#F4F7FF]">
              View Details
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="rounded-lg border border-[#6B7A99]/30 p-2 text-[#6B7A99] hover:bg-[#F4F7FF]"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 z-20 mt-1 w-48 rounded-lg border border-[#6B7A99]/20 bg-white p-1 shadow-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onReschedule(interview);
                    }}
                    className="block w-full rounded-md px-2 py-1.5 text-left text-xs text-[#0D1B2A] hover:bg-[#F4F7FF]"
                  >
                    Reschedule
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onCancel(interview);
                    }}
                    className="block w-full rounded-md px-2 py-1.5 text-left text-xs text-[#E63946] hover:bg-[#E63946]/10"
                  >
                    Cancel Interview
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onSendReminder(interview);
                    }}
                    className="block w-full rounded-md px-2 py-1.5 text-left text-xs text-[#0D1B2A] hover:bg-[#F4F7FF]"
                  >
                    Send Reminder to Candidate
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onMarkCompleted(interview);
                    }}
                    className="inline-flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-left text-xs text-[#00B37E] hover:bg-[#00B37E]/10"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Mark as Completed
                  </button>
                </div>
              )}
            </div>
          </div>
          {(interview.status === "upcoming" || interview.status === "starting-soon") && (
            <div className="mt-3 flex items-center justify-end gap-1 text-xs text-[#6B7A99]">
              <Clock3 className="h-3.5 w-3.5" />
              Reminder enabled
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

