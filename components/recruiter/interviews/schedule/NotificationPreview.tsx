"use client";

import { CalendarDays, Clock3, Link2, MapPin, UserRound } from "lucide-react";
import type { ScheduleFormState } from "./ScheduleForm";

interface NotificationPreviewProps {
  form: ScheduleFormState;
}

function formatDate(input: string) {
  if (!input) return "Date not set";
  const date = new Date(`${input}T00:00:00`);
  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(hour: string, minute: string) {
  if (!hour || !minute) return "Time not set";
  const date = new Date();
  date.setHours(Number(hour), Number(minute), 0, 0);
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function NotificationPreview({ form }: NotificationPreviewProps) {
  return (
    <aside className="sticky top-20 rounded-2xl border border-[#6B7A99]/20 bg-white p-5 shadow-sm">
      <h3 className="font-syne text-lg font-semibold text-[#0D1B2A]">Interview Invitation</h3>
      <p className="mt-1 text-xs text-[#6B7A99]">Live preview for candidate notification</p>

      <div className="mt-4 space-y-3 rounded-xl bg-[#F4F7FF] p-4">
        <div className="flex items-center gap-2 text-sm text-[#0D1B2A]">
          <UserRound className="h-4 w-4 text-[#1E6FFF]" />
          <span className="font-semibold">{form.candidate?.name || "Candidate name"}</span>
        </div>

        <p className="rounded-full bg-[#1E6FFF]/10 px-2 py-1 text-xs font-semibold text-[#1E6FFF]">
          {form.candidate?.jobTitle || "Job title"}
        </p>

        <div className="space-y-2 text-xs text-[#6B7A99]">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[#1E6FFF]" />
            {formatDate(form.date)}
          </div>
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-[#1E6FFF]" />
            {formatTime(form.hour, form.minute)} ({form.duration}) • {form.timezone}
          </div>
        </div>

        <span className="inline-flex rounded-full bg-[#00C2D1]/15 px-2 py-1 text-xs font-semibold text-[#00C2D1]">
          {form.interviewType}
        </span>

        {form.interviewType === "Video Call" && form.meetingLink && (
          <div className="flex items-start gap-2 text-xs text-[#6B7A99]">
            <Link2 className="mt-0.5 h-4 w-4 text-[#1E6FFF]" />
            <a
              href={form.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="break-all text-[#1E6FFF] hover:underline"
            >
              {form.meetingLink}
            </a>
          </div>
        )}

        {form.interviewType === "In-Person" && form.location && (
          <div className="flex items-start gap-2 text-xs text-[#6B7A99]">
            <MapPin className="mt-0.5 h-4 w-4 text-[#FF9500]" />
            <span>{form.location}</span>
          </div>
        )}

        <div className="rounded-lg bg-white p-3">
          <p className="text-[11px] uppercase tracking-wide text-[#6B7A99]">Instructions</p>
          <p className="mt-1 text-xs text-[#0D1B2A]">
            {form.instructions || "No additional instructions provided yet."}
          </p>
        </div>
      </div>
    </aside>
  );
}

