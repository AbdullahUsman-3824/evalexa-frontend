"use client";

import { useState } from "react";
import ToggleSwitch from "@/components/candidate/settings/ToggleSwitch";

const visibilityOptions = [
  {
    id: "all",
    label: "All Recruiters",
    description: "Your full profile and resume are discoverable.",
  },
  {
    id: "applied",
    label: "Only Recruiters I've Applied To",
    description: "Hidden from search, visible when you apply.",
  },
  {
    id: "hidden",
    label: "Hidden",
    description: "Only you can view the profile.",
  },
];

export default function PrivacyTab() {
  const [visibility, setVisibility] = useState("all");
  const [resumeVisible, setResumeVisible] = useState(true);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow-sm shadow-midnight/5 space-y-4">
        <div>
          <p className="text-lg font-semibold text-midnight">
            Profile Visibility
          </p>
          <p className="text-sm text-slate">
            Control who can discover and reach out to you.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {visibilityOptions.map((option) => (
            <label
              key={option.id}
              className={`flex cursor-pointer flex-col gap-2 rounded-2xl border px-4 py-4 transition ${
                visibility === option.id
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-slate/20 text-midnight"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold">{option.label}</p>
                <span
                  className={`h-4 w-4 rounded-full border ${
                    visibility === option.id
                      ? "border-primary bg-primary"
                      : "border-slate/40"
                  }`}
                />
              </div>
              <p className="text-sm text-slate">{option.description}</p>
              <input
                type="radio"
                name="profile-visibility"
                className="sr-only"
                checked={visibility === option.id}
                onChange={() => setVisibility(option.id)}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm shadow-midnight/5 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-midnight">
              Resume Visibility
            </p>
            <p className="text-sm text-slate">
              Allow recruiters to download your resume when they discover you.
            </p>
          </div>
          <ToggleSwitch checked={resumeVisible} onChange={setResumeVisible} />
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="rounded-lg border border-slate/30 px-4 py-2 text-sm font-semibold text-midnight transition hover:border-primary hover:text-primary">
            Download My Data
          </button>
          <button className="text-sm font-semibold text-danger transition hover:text-danger/80">
            Request Data Deletion
          </button>
        </div>
      </section>
    </div>
  );
}
