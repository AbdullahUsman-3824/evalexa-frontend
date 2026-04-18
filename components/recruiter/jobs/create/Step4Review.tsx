"use client";

import Link from "next/link";
import { Edit3 } from "lucide-react";
import type { JobPostFormData } from "./types";

interface Step4ReviewProps {
  data: JobPostFormData;
  onEditStep: (step: 1 | 2 | 3) => void;
}

export default function Step4Review({ data, onEditStep }: Step4ReviewProps) {
  const formattedSalary =
    data.salaryMin && data.salaryMax
      ? `${data.currency} ${data.salaryMin} - ${data.salaryMax} / ${data.salaryPer}`
      : "Not specified";

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-syne text-lg font-semibold text-midnight">Job Overview</h3>
          <button
            type="button"
            onClick={() => onEditStep(1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
          >
            <Edit3 className="h-4 w-4" /> Edit
          </button>
        </div>
        <div className="grid gap-2 text-sm text-midnight sm:grid-cols-2">
          <p><span className="text-slate">Title:</span> {data.jobTitle || "—"}</p>
          <p><span className="text-slate">Department:</span> {data.department}</p>
          <p><span className="text-slate">Type:</span> {data.jobType}</p>
          <p><span className="text-slate">Mode:</span> {data.workMode}</p>
          <p><span className="text-slate">Location:</span> {data.workMode === "Remote" ? "Remote" : data.location || "—"}</p>
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
          <h3 className="font-syne text-lg font-semibold text-midnight">Requirements</h3>
          <button
            type="button"
            onClick={() => onEditStep(2)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
          >
            <Edit3 className="h-4 w-4" /> Edit
          </button>
        </div>
        <div className="grid gap-2 text-sm text-midnight sm:grid-cols-2">
          <p><span className="text-slate">Salary:</span> {formattedSalary}</p>
          <p><span className="text-slate">Experience:</span> {data.experienceLevel}</p>
          <p><span className="text-slate">Education:</span> {data.educationRequirement}</p>
          <p><span className="text-slate">Openings:</span> {data.openings}</p>
        </div>
        <div className="mt-4">
          <p className="mb-1 text-sm font-medium text-midnight">Required skills</p>
          <div className="flex flex-wrap gap-2">
            {data.requiredSkills.map((skill) => (
              <span key={skill} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-3">
          <p className="mb-1 text-sm font-medium text-midnight">Nice-to-have skills</p>
          <div className="flex flex-wrap gap-2">
            {data.niceToHaveSkills.map((skill) => (
              <span key={skill} className="rounded-full bg-slate/15 px-3 py-1 text-xs font-semibold text-slate">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h3 className="mb-3 font-syne text-lg font-semibold text-midnight">Description</h3>
        <div className="max-h-[200px] overflow-auto rounded-lg border border-slate/15 bg-surface p-3 text-sm text-midnight whitespace-pre-wrap">
          {data.jobDescription || "No description provided."}
        </div>
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-midnight">Responsibilities</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-midnight">
            {data.responsibilities.map((responsibility, idx) => (
              <li key={`${responsibility}-${idx}`}>{responsibility}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-syne text-lg font-semibold text-midnight">AI Settings</h3>
          <button
            type="button"
            onClick={() => onEditStep(3)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
          >
            <Edit3 className="h-4 w-4" /> Edit
          </button>
        </div>
        <div className="grid gap-2 text-sm text-midnight sm:grid-cols-2">
          <p>
            <span className="text-slate">AI Screening:</span>{" "}
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${data.aiScreeningEnabled ? "bg-success/10 text-success" : "bg-slate/15 text-slate"}`}>
              {data.aiScreeningEnabled ? "On" : "Off"}
            </span>
          </p>
          <p><span className="text-slate">Min match:</span> {data.minMatchScore}%</p>
          <p><span className="text-slate">Auto-shortlist:</span> {data.autoShortlistEnabled ? "On" : "Off"}</p>
          <p><span className="text-slate">Screening questions:</span> {data.screeningQuestions.length}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-primary p-6 text-white shadow-sm">
          <h4 className="font-syne text-lg font-semibold">Publish Now</h4>
          <p className="mt-1 text-sm text-white/90">Post goes live immediately</p>
          <button
            type="button"
            className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-slate-100"
          >
            Publish Job Post
          </button>
        </div>

        <div className="rounded-xl border border-primary bg-white p-6 shadow-sm">
          <h4 className="font-syne text-lg font-semibold text-midnight">Save as Draft</h4>
          <p className="mt-1 text-sm text-slate">Save and publish later</p>
          <button
            type="button"
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Save as Draft
          </button>
        </div>
      </div>

      <div>
        <Link href="/recruiter/jobs/preview" className="text-sm font-semibold text-primary hover:underline">
          Preview Post
        </Link>
      </div>
    </div>
  );
}

