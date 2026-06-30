"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit3, Rocket, Save, Loader2, X } from "lucide-react";
import type { JobPostFormData } from "./types";

interface Step4ReviewProps {
  data: JobPostFormData;
  onEditStep: (step: 1 | 2 | 3) => void;
  onPublish: () => void;
  onSaveDraft: () => void;
  isSubmitting?: boolean;
  error?: string | null;
}

function capitalize(value: string) {
  return value
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function Step4Review({
  data,
  onEditStep,
  onPublish,
  onSaveDraft,
  isSubmitting = false,
  error = null,
}: Step4ReviewProps) {
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  const selectedSkills = data.skills ?? [];
  const legacySkills = data.requiredSkills ?? [];
  const responsibilitiesText =
    typeof data.responsibilities === "string"
      ? data.responsibilities
      : Array.isArray(data.responsibilities)
        ? data.responsibilities.join("\n")
        : "";
  const enableAutoShortlist =
    data.enableAutoShortlist ?? data.autoShortlistEnabled ?? false;
  const enableAiInterview =
    data.enableAiInterview ?? data.aiInterviewEnabled ?? false;
  const resumeSelectionCount = data.resumeSelectionCount ?? 20;
  const interviewSelectionCount = data.interviewSelectionCount ?? 5;

  const formattedSalary =
    data.salaryMin && data.salaryMax
      ? `${data.currency} ${data.salaryMin} - ${data.salaryMax} / ${data.salaryPer}`
      : "Not specified";

  const handleConfirmPublish = () => {
    setShowPublishConfirm(false);
    onPublish();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-syne text-lg font-semibold text-midnight">
            Job Overview
          </h3>
          <button
            type="button"
            onClick={() => onEditStep(1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
          >
            <Edit3 className="h-4 w-4" /> Edit
          </button>
        </div>
        <div className="grid gap-2 text-sm text-midnight sm:grid-cols-2">
          <p>
            <span className="text-slate">Title:</span> {data.jobTitle || "—"}
          </p>
          <p>
            <span className="text-slate">Department:</span> {data.department}
          </p>
          <p>
            <span className="text-slate">Type:</span> {data.jobType}
          </p>
          <p>
            <span className="text-slate">Mode:</span> {data.workMode}
          </p>
          <p>
            <span className="text-slate">Location:</span>{" "}
            {data.workMode === "Remote" ? "Remote" : data.location || "—"}
          </p>
          <p>
            <span className="text-slate">Deadline:</span>{" "}
            {data.applicationDeadline
              ? new Date(data.applicationDeadline).toLocaleDateString()
              : "—"}
          </p>
        </div>
        {data.urgentHiring && (
          <span className="mt-3 inline-flex rounded-full bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">
            Urgent Hiring
          </span>
        )}
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-syne text-lg font-semibold text-midnight">
            Requirements &amp; Description
          </h3>
          <button
            type="button"
            onClick={() => onEditStep(2)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
          >
            <Edit3 className="h-4 w-4" /> Edit
          </button>
        </div>
        <div className="grid gap-2 text-sm text-midnight sm:grid-cols-2 lg:grid-cols-3">
          <p>
            <span className="text-slate">Salary:</span> {formattedSalary}
          </p>
          <p>
            <span className="text-slate">Experience:</span>{" "}
            {data.experienceLevel}
          </p>
          <p>
            <span className="text-slate">Education:</span>{" "}
            {data.educationRequirement}
          </p>
          <p>
            <span className="text-slate">Skills selected:</span>{" "}
            {selectedSkills.length}
          </p>
        </div>

        <div className="mt-5 space-y-5">
          <div>
            <p className="mb-2 text-sm font-medium text-midnight">
              Selected skills
            </p>
            {selectedSkills.length > 0 ? (
              <div className="overflow-hidden rounded-lg border border-slate/15">
                <table className="min-w-full divide-y divide-slate/10 text-sm">
                  <thead className="bg-surface text-left text-xs uppercase tracking-[0.14em] text-slate">
                    <tr>
                      <th className="px-4 py-3">Skill</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Importance</th>
                      <th className="px-4 py-3">Weight</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate/10 bg-white">
                    {selectedSkills.map((skill) => (
                      <tr key={skill.skillId}>
                        <td className="px-4 py-3 font-medium text-midnight">
                          {skill.name}
                        </td>
                        <td className="px-4 py-3 text-slate">
                          {capitalize(skill.category)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                            {skill.importance.toLowerCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate">{skill.weight}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : legacySkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {legacySkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate">No skills selected yet.</p>
            )}
          </div>

          <div>
            <p className="mb-1 text-sm font-medium text-midnight">
              Responsibilities
            </p>
            {responsibilitiesText.trim() ? (
              <ul className="list-disc space-y-1 pl-5 text-sm text-midnight">
                {responsibilitiesText
                  .split("\n")
                  .filter((line) => line.trim())
                  .map((line, index) => (
                    <li key={`${line}-${index}`}>
                      {line.replace(/^[-*]\s*/, "")}
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-sm text-slate">
                No responsibilities provided.
              </p>
            )}
          </div>

          <div>
            <p className="mb-1 text-sm font-medium text-midnight">
              Description
            </p>
            <div className="max-h-56 overflow-auto rounded-lg border border-slate/15 bg-surface p-3 text-sm text-midnight whitespace-pre-wrap">
              {data.jobDescription || "No description provided."}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-syne text-lg font-semibold text-midnight">
            AI Settings
          </h3>
          <button
            type="button"
            onClick={() => onEditStep(3)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
          >
            <Edit3 className="h-4 w-4" /> Edit
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm text-midnight">
          <p>
            <span className="text-slate">Auto-shortlist:</span>{" "}
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${enableAutoShortlist ? "bg-success/10 text-success" : "bg-slate/15 text-slate"}`}
            >
              {enableAutoShortlist ? "On" : "Off"}
            </span>
          </p>
          <p>
            <span className="text-slate">Resume selection:</span>{" "}
            {resumeSelectionCount}
          </p>
          <p>
            <span className="text-slate">AI interview:</span>{" "}
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${enableAiInterview ? "bg-success/10 text-success" : "bg-slate/15 text-slate"}`}
            >
              {enableAiInterview ? "On" : "Off"}
            </span>
          </p>
          <p>
            <span className="text-slate">Interview selection:</span>{" "}
            {interviewSelectionCount}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Publish Now - primary action */}
        <div className="rounded-xl bg-primary p-6 text-white shadow-sm">
          <div className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            <h4 className="font-syne text-lg font-semibold">Publish Now</h4>
          </div>
          <p className="mt-1 text-sm text-white/90">
            Post goes live immediately
          </p>
          <p className="mt-1 text-xs text-white/70">
            You can pause or edit it anytime after publishing.
          </p>
          <button
            type="button"
            onClick={() => setShowPublishConfirm(true)}
            disabled={isSubmitting}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Publishing..." : "Publish Job Post"}
          </button>
        </div>

        {/* Save as Draft - secondary action */}
        <div className="rounded-xl border border-slate/20 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Save className="h-5 w-5 text-primary" />
            <h4 className="font-syne text-lg font-semibold text-midnight">
              Save as Draft
            </h4>
          </div>
          <p className="mt-1 text-sm text-slate">Save and publish later</p>
          <p className="mt-1 text-xs text-slate/70">
            Saved to your Drafts tab — visible only to your team.
          </p>
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSubmitting}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Saving..." : "Save as Draft"}
          </button>
        </div>
      </div>

      {error && <p className="text-sm font-medium text-danger">{error}</p>}

      <div>
        <Link
          href="/recruiter/jobs/preview"
          className="text-sm font-semibold text-primary hover:underline"
        >
          Preview Post
        </Link>
      </div>

      {/* Publish confirmation modal */}
      {showPublishConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/40 p-4"
          onClick={() => setShowPublishConfirm(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <Rocket className="h-5 w-5" />
                </div>
                <h4 className="font-syne text-lg font-semibold text-midnight">
                  Publish this job post?
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowPublishConfirm(false)}
                className="text-slate hover:text-midnight"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-slate">
              It will go live immediately and be visible to candidates. You can
              edit or pause it anytime afterward.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowPublishConfirm(false)}
                className="rounded-lg border border-slate/20 px-4 py-2 text-sm font-semibold text-midnight hover:bg-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPublish}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
              >
                <Rocket className="h-4 w-4" /> Yes, publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
