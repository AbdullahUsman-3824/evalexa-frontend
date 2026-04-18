"use client";

import { CalendarPlus, ExternalLink, MapPin, Phone, Sparkles, Video } from "lucide-react";
import { type ComponentType, useEffect, useMemo, useState } from "react";
import CandidateSelector, { CandidateOption } from "./CandidateSelector";

export type InterviewType = "AI Interview" | "Video Call" | "Phone Call" | "In-Person";

export interface Interviewer {
  name: string;
  email: string;
}

export interface ScheduleFormState {
  candidate: CandidateOption | null;
  title: string;
  interviewType: InterviewType;
  date: string;
  hour: string;
  minute: string;
  timezone: string;
  duration: string;
  interviewers: Interviewer[];
  meetingLink: string;
  location: string;
  instructions: string;
  sendNotification: boolean;
}

interface ScheduleFormProps {
  candidates: CandidateOption[];
  value: ScheduleFormState;
  onChange: (next: ScheduleFormState) => void;
  onSubmit: () => void;
  onSaveDraft: () => void;
  onCancel: () => void;
  loading: boolean;
}

const interviewTypeCards: {
  label: InterviewType;
  icon: ComponentType<{ className?: string }>;
  tone: string;
}[] = [
  { label: "AI Interview", icon: Sparkles, tone: "border-[#00C2D1] bg-[#00C2D1]/10 text-[#00C2D1]" },
  { label: "Video Call", icon: Video, tone: "border-[#1E6FFF] bg-[#1E6FFF]/10 text-[#1E6FFF]" },
  { label: "Phone Call", icon: Phone, tone: "border-[#00B37E] bg-[#00B37E]/10 text-[#00B37E]" },
  { label: "In-Person", icon: MapPin, tone: "border-[#FF9500] bg-[#FF9500]/10 text-[#FF9500]" },
];

const durationOptions = ["30 min", "45 min", "1 hour", "1.5 hours", "2 hours"];

function getTomorrowISODate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function ScheduleForm({
  candidates,
  value,
  onChange,
  onSubmit,
  onSaveDraft,
  onCancel,
  loading,
}: ScheduleFormProps) {
  const [interviewerName, setInterviewerName] = useState("");
  const [interviewerEmail, setInterviewerEmail] = useState("");

  const timezoneOptions = useMemo(() => {
    const autoZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    return [autoZone, "UTC", "Asia/Kuala_Lumpur", "Asia/Singapore", "Europe/London", "America/New_York"];
  }, []);

  useEffect(() => {
    if (!value.candidate) return;
    const generatedTitle = `Interview — ${value.candidate.name} — ${value.candidate.jobTitle}`;
    if (!value.title || value.title.startsWith("Interview —")) {
      onChange({ ...value, title: generatedTitle });
    }
  }, [value, onChange]);

  function addInterviewer() {
    if (!interviewerName.trim() || !interviewerEmail.trim()) return;
    onChange({
      ...value,
      interviewers: [...value.interviewers, { name: interviewerName.trim(), email: interviewerEmail.trim() }],
    });
    setInterviewerName("");
    setInterviewerEmail("");
  }

  function isFormValid() {
    if (!value.candidate) return false;
    if (!value.title.trim() || !value.date || !value.hour || !value.minute) return false;
    if (value.interviewType === "Video Call" && !value.meetingLink.trim()) return false;
    if (value.interviewType === "In-Person" && !value.location.trim()) return false;
    return true;
  }

  return (
    <div className="rounded-2xl border border-[#6B7A99]/20 bg-white p-5 shadow-sm">
      <div className="space-y-6">
        <CandidateSelector
          candidates={candidates}
          selectedCandidate={value.candidate}
          onSelect={(candidate) => onChange({ ...value, candidate })}
          onClear={() => onChange({ ...value, candidate: null, title: "" })}
        />

        <section className="space-y-4">
          <h2 className="font-syne text-lg font-semibold text-[#0D1B2A]">Interview Details</h2>

          <div>
            <label className="mb-1 block text-sm font-semibold text-[#0D1B2A]">Interview Title</label>
            <input
              type="text"
              value={value.title}
              onChange={(event) => onChange({ ...value, title: event.target.value })}
              className="h-11 w-full rounded-lg border border-[#6B7A99]/30 px-3 text-sm text-[#0D1B2A] placeholder:text-[#6B7A99]/70 focus:border-[#1E6FFF] focus:outline-none focus:ring-2 focus:ring-[#1E6FFF]/20"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-[#0D1B2A]">Interview Type *</p>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {interviewTypeCards.map((item) => {
                const Icon = item.icon;
                const active = value.interviewType === item.label;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => onChange({ ...value, interviewType: item.label })}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                      active ? item.tone : "border-[#6B7A99]/30 text-[#6B7A99] hover:bg-[#F4F7FF]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#0D1B2A]">Date *</label>
              <input
                type="date"
                min={getTomorrowISODate()}
                value={value.date}
                onChange={(event) => onChange({ ...value, date: event.target.value })}
                className="h-11 w-full rounded-lg border border-[#6B7A99]/30 px-3 text-sm text-[#0D1B2A] focus:border-[#1E6FFF] focus:outline-none focus:ring-2 focus:ring-[#1E6FFF]/20"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="mb-1 block text-sm font-semibold text-[#0D1B2A]">Time *</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={value.hour}
                    onChange={(event) => onChange({ ...value, hour: event.target.value })}
                    className="h-11 rounded-lg border border-[#6B7A99]/30 px-2 text-sm text-[#0D1B2A] focus:border-[#1E6FFF] focus:outline-none"
                  >
                    <option value="">Hour</option>
                    {Array.from({ length: 24 }, (_, idx) => String(idx).padStart(2, "0")).map((hour) => (
                      <option key={hour} value={hour}>
                        {hour}
                      </option>
                    ))}
                  </select>
                  <select
                    value={value.minute}
                    onChange={(event) => onChange({ ...value, minute: event.target.value })}
                    className="h-11 rounded-lg border border-[#6B7A99]/30 px-2 text-sm text-[#0D1B2A] focus:border-[#1E6FFF] focus:outline-none"
                  >
                    <option value="">Minute</option>
                    {["00", "15", "30", "45"].map((minute) => (
                      <option key={minute} value={minute}>
                        {minute}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-[#0D1B2A]">TZ</label>
                <select
                  value={value.timezone}
                  onChange={(event) => onChange({ ...value, timezone: event.target.value })}
                  className="h-11 w-full rounded-lg border border-[#6B7A99]/30 px-2 text-xs text-[#0D1B2A] focus:border-[#1E6FFF] focus:outline-none"
                >
                  {timezoneOptions.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-[#0D1B2A]">Duration</label>
            <select
              value={value.duration}
              onChange={(event) => onChange({ ...value, duration: event.target.value })}
              className="h-11 w-full rounded-lg border border-[#6B7A99]/30 px-3 text-sm text-[#0D1B2A] focus:border-[#1E6FFF] focus:outline-none"
            >
              {durationOptions.map((duration) => (
                <option key={duration} value={duration}>
                  {duration}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#0D1B2A]">Interviewer(s)</p>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <input
                type="text"
                placeholder="Interviewer name"
                value={interviewerName}
                onChange={(event) => setInterviewerName(event.target.value)}
                className="h-11 rounded-lg border border-[#6B7A99]/30 px-3 text-sm text-[#0D1B2A] placeholder:text-[#6B7A99]/70 focus:border-[#1E6FFF] focus:outline-none"
              />
              <input
                type="email"
                placeholder="Interviewer email"
                value={interviewerEmail}
                onChange={(event) => setInterviewerEmail(event.target.value)}
                className="h-11 rounded-lg border border-[#6B7A99]/30 px-3 text-sm text-[#0D1B2A] placeholder:text-[#6B7A99]/70 focus:border-[#1E6FFF] focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={addInterviewer}
              className="text-sm font-semibold text-[#1E6FFF] hover:underline"
            >
              + Add Another Interviewer
            </button>
            {value.interviewers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {value.interviewers.map((interviewer) => (
                  <button
                    key={`${interviewer.email}-${interviewer.name}`}
                    type="button"
                    onClick={() =>
                      onChange({
                        ...value,
                        interviewers: value.interviewers.filter(
                          (item) => item.email !== interviewer.email || item.name !== interviewer.name,
                        ),
                      })
                    }
                    className="rounded-full bg-[#1E6FFF]/10 px-3 py-1 text-xs font-semibold text-[#1E6FFF] hover:bg-[#1E6FFF]/20"
                  >
                    {interviewer.name} ({interviewer.email}) ✕
                  </button>
                ))}
              </div>
            )}
          </div>

          {value.interviewType === "Video Call" && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#0D1B2A]">Meeting Link</label>
              <input
                type="url"
                placeholder="https://meet.google.com/..."
                value={value.meetingLink}
                onChange={(event) => onChange({ ...value, meetingLink: event.target.value })}
                className="h-11 w-full rounded-lg border border-[#6B7A99]/30 px-3 text-sm text-[#0D1B2A] placeholder:text-[#6B7A99]/70 focus:border-[#1E6FFF] focus:outline-none"
              />
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-lg border border-[#6B7A99]/30 px-3 py-2 text-sm font-medium text-[#6B7A99] hover:bg-[#F4F7FF]"
              >
                Generate Zoom Link
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          )}

          {value.interviewType === "In-Person" && (
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#0D1B2A]">Location</label>
              <textarea
                rows={3}
                placeholder="Enter full office address"
                value={value.location}
                onChange={(event) => onChange({ ...value, location: event.target.value })}
                className="w-full rounded-lg border border-[#6B7A99]/30 px-3 py-2 text-sm text-[#0D1B2A] placeholder:text-[#6B7A99]/70 focus:border-[#1E6FFF] focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-semibold text-[#0D1B2A]">Instructions for Candidate</label>
            <textarea
              rows={4}
              placeholder="Please bring your portfolio..."
              value={value.instructions}
              onChange={(event) => onChange({ ...value, instructions: event.target.value })}
              className="w-full rounded-lg border border-[#6B7A99]/30 px-3 py-2 text-sm text-[#0D1B2A] placeholder:text-[#6B7A99]/70 focus:border-[#1E6FFF] focus:outline-none"
            />
          </div>

          <div className="rounded-lg border border-[#6B7A99]/25 bg-[#F4F7FF] p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-[#0D1B2A]">Send email notification to candidate</p>
              <button
                type="button"
                onClick={() => onChange({ ...value, sendNotification: !value.sendNotification })}
                className={`relative h-6 w-11 rounded-full transition ${
                  value.sendNotification ? "bg-[#1E6FFF]" : "bg-[#6B7A99]/40"
                }`}
                aria-label="Toggle send notification"
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                    value.sendNotification ? "left-5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
            <div className="mt-2 rounded-md bg-white p-2 text-xs text-[#6B7A99]">
              Subject: Interview Invitation — {value.candidate?.jobTitle || "Selected Role"}
              <br />
              Body preview includes date, time, format, and preparation notes.
            </div>
          </div>
        </section>

        <div className="space-y-3 border-t border-[#6B7A99]/20 pt-4">
          <button
            type="button"
            onClick={onSubmit}
            disabled={!isFormValid() || loading}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#1E6FFF] px-4 text-sm font-semibold text-white hover:bg-[#1557D8] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CalendarPlus className="h-4 w-4" />
            {loading ? "Scheduling..." : "Schedule Interview"}
          </button>
          <button
            type="button"
            onClick={onSaveDraft}
            className="h-11 w-full rounded-lg border border-[#6B7A99]/30 text-sm font-semibold text-[#6B7A99] hover:bg-[#F4F7FF]"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full text-sm font-semibold text-[#E63946] hover:underline"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

