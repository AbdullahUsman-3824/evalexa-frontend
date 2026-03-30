"use client";

import { useState } from "react";
import ToggleSwitch from "@/components/candidate/settings/ToggleSwitch";
import SettingRow from "@/components/candidate/settings/SettingRow";

type DeliveryOption = "In-app" | "Email" | "Both" | "None";

interface PreferenceGroup {
  id: string;
  title: string;
  description: string;
  toggles: { id: string; label: string }[];
}

const preferenceGroups: PreferenceGroup[] = [
  {
    id: "job",
    title: "Job Alerts",
    description: "Stay informed about new roles and saved job updates.",
    toggles: [
      { id: "matches", label: "New job matches" },
      { id: "deadlines", label: "Job application deadlines" },
      { id: "saved", label: "Saved job updates" },
    ],
  },
  {
    id: "application",
    title: "Application Updates",
    description: "Track every step of your applications.",
    toggles: [
      { id: "status", label: "Application status changes" },
      { id: "messages", label: "Recruiter messages" },
      { id: "interviews", label: "Interview invitations" },
      { id: "shortlist", label: "Shortlisting notifications" },
    ],
  },
  {
    id: "platform",
    title: "Platform",
    description: "Product updates, tips, and digests.",
    toggles: [
      { id: "product", label: "Product updates" },
      { id: "tips", label: "Tips and recommendations" },
      { id: "digest", label: "Weekly digest email" },
    ],
  },
];

export default function NotificationsTab() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    matches: true,
    deadlines: false,
    saved: true,
    status: true,
    messages: true,
    interviews: true,
    shortlist: true,
    product: false,
    tips: true,
    digest: true,
  });
  const [delivery, setDelivery] = useState<Record<string, DeliveryOption>>({
    job: "Both",
    application: "In-app",
    platform: "Email",
  });

  const handleToggle = (id: string, value: boolean) => {
    setToggles((prev) => ({ ...prev, [id]: value }));
  };

  const deliveryOptions: DeliveryOption[] = ["In-app", "Email", "Both", "None"];

  return (
    <div className="space-y-6">
      {preferenceGroups.map((group) => (
        <section
          key={group.id}
          className="rounded-2xl bg-white p-6 shadow-sm shadow-midnight/5"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-midnight">{group.title}</h3>
              <p className="text-sm text-slate">{group.description}</p>
            </div>

            <div className="space-y-3">
              {group.toggles.map((toggle) => (
                <SettingRow
                  key={toggle.id}
                  label={toggle.label}
                  description=" "
                >
                  <ToggleSwitch
                    checked={toggles[toggle.id]}
                    onChange={(value) => handleToggle(toggle.id, value)}
                  />
                </SettingRow>
              ))}
            </div>

            <div className="rounded-xl border border-slate/20 p-4">
              <p className="text-sm font-semibold text-midnight">Delivery Method</p>
              <div className="mt-3 grid gap-2 md:grid-cols-4">
                {deliveryOptions.map((option) => (
                  <label
                    key={`${group.id}-${option}`}
                    className={`flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                      delivery[group.id] === option
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-slate/20 text-slate"
                    }`}
                  >
                    {option}
                    <input
                      type="radio"
                      name={`${group.id}-delivery`}
                      className="sr-only"
                      checked={delivery[group.id] === option}
                      onChange={() => setDelivery((prev) => ({ ...prev, [group.id]: option }))}
                    />
                    <span
                      className={`h-3 w-3 rounded-full border ${
                        delivery[group.id] === option
                          ? "border-primary bg-primary"
                          : "border-slate/40"
                      }`}
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

