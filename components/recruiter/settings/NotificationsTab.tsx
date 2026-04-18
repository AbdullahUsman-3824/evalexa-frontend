"use client";

import { useState } from "react";
import ToggleSwitch from "@/components/candidate/settings/ToggleSwitch";
import SettingRow from "@/components/candidate/settings/SettingRow";

type Delivery = "In-app" | "Email" | "Both";

type GroupConfig = {
  id: string;
  title: string;
  toggles: { id: string; label: string }[];
};

const groups: GroupConfig[] = [
  {
    id: "candidates",
    title: "Candidates",
    toggles: [
      { id: "newApplication", label: "New application received" },
      { id: "withdrawn", label: "Application withdrawn" },
      { id: "candidateMessage", label: "Candidate message received" },
    ],
  },
  {
    id: "interviews",
    title: "Interviews",
    toggles: [
      { id: "accepted", label: "Interview accepted by candidate" },
      { id: "declined", label: "Interview declined" },
      { id: "reminder", label: "Interview reminder (1 hour before)" },
    ],
  },
  {
    id: "platform",
    title: "Platform",
    toggles: [
      { id: "weeklyDigest", label: "Weekly hiring digest email" },
      { id: "aiRanking", label: "AI ranking completed" },
      { id: "jobExpiring", label: "Job post expiring soon" },
    ],
  },
];

export default function NotificationsTab() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    newApplication: true,
    withdrawn: true,
    candidateMessage: true,
    accepted: true,
    declined: true,
    reminder: true,
    weeklyDigest: false,
    aiRanking: true,
    jobExpiring: true,
  });
  const [delivery, setDelivery] = useState<Record<string, Delivery>>({
    candidates: "Both",
    interviews: "In-app",
    platform: "Email",
  });

  const options: Delivery[] = ["In-app", "Email", "Both"];

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.id} className="rounded-2xl bg-white p-6 shadow-sm shadow-midnight/5">
          <h3 className="text-lg font-semibold text-midnight">{group.title}</h3>

          <div className="mt-3 space-y-1">
            {group.toggles.map((toggle) => (
              <SettingRow key={toggle.id} label={toggle.label} description=" ">
                <ToggleSwitch
                  checked={toggles[toggle.id]}
                  onChange={(value) => setToggles((prev) => ({ ...prev, [toggle.id]: value }))}
                />
              </SettingRow>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-slate/20 p-4">
            <p className="text-sm font-semibold text-midnight">Delivery</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {options.map((option) => {
                const checked = delivery[group.id] === option;
                return (
                  <label
                    key={`${group.id}-${option}`}
                    className={`flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                      checked ? "border-primary bg-primary/5 text-primary" : "border-slate/20 text-slate"
                    }`}
                  >
                    {option}
                    <input
                      type="radio"
                      className="sr-only"
                      name={`delivery-${group.id}`}
                      checked={checked}
                      onChange={() => setDelivery((prev) => ({ ...prev, [group.id]: option }))}
                    />
                    <span className={`h-3 w-3 rounded-full border ${checked ? "border-primary bg-primary" : "border-slate/40"}`} />
                  </label>
                );
              })}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

