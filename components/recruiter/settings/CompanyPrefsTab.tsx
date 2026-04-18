"use client";

import { useState } from "react";
import ToggleSwitch from "@/components/candidate/settings/ToggleSwitch";
import SettingRow from "@/components/candidate/settings/SettingRow";

const visibilityOptions = ["Public", "Private", "Invite-only"] as const;
const durations = ["15 minutes", "30 minutes", "45 minutes", "60 minutes"] as const;
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export default function CompanyPrefsTab() {
  const [visibility, setVisibility] = useState<(typeof visibilityOptions)[number]>("Public");
  const [aiScreening, setAiScreening] = useState(true);
  const [minScore, setMinScore] = useState(70);
  const [autoReject, setAutoReject] = useState(true);
  const [autoRejectScore, setAutoRejectScore] = useState(45);
  const [signature, setSignature] = useState("Best regards,\nEvalexa Talent Team");
  const [duration, setDuration] = useState<(typeof durations)[number]>("45 minutes");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [selectedDays, setSelectedDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri"]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow-sm shadow-midnight/5">
        <h3 className="text-lg font-semibold text-midnight">Company Preferences</h3>

        <div className="mt-4 space-y-5">
          <div>
            <p className="mb-2 text-sm font-semibold text-midnight">Default job visibility</p>
            <div className="grid gap-2 md:grid-cols-3">
              {visibilityOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setVisibility(option)}
                  className={`rounded-xl border px-3 py-3 text-left text-sm font-semibold transition ${
                    visibility === option
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-slate/20 text-midnight hover:border-primary/40"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <SettingRow label="Default screening: AI enabled" description="Set AI ranking as your default pipeline mode.">
            <ToggleSwitch checked={aiScreening} onChange={setAiScreening} />
          </SettingRow>

          <div>
            <div className="mb-2 flex items-center justify-between text-sm font-semibold text-midnight">
              <span>Default min match score</span>
              <span>{minScore}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={minScore}
              onChange={(event) => setMinScore(Number(event.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <SettingRow label="Auto-reject below threshold" description="Automatically reject applications below a defined score.">
            <div className="flex items-center gap-3">
              <ToggleSwitch checked={autoReject} onChange={setAutoReject} />
              <input
                type="number"
                min={0}
                max={100}
                value={autoRejectScore}
                onChange={(event) => setAutoRejectScore(Number(event.target.value))}
                className="w-20 rounded-lg border border-slate/30 px-2 py-1.5 text-sm text-midnight focus:border-primary focus:outline-none"
                disabled={!autoReject}
              />
            </div>
          </SettingRow>

          <div>
            <p className="mb-2 text-sm font-semibold text-midnight">Email signature for candidate communication</p>
            <textarea
              rows={4}
              value={signature}
              onChange={(event) => setSignature(event.target.value)}
              className="w-full rounded-lg border border-slate/30 px-3 py-2 text-sm text-midnight focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-semibold text-midnight">Default interview duration</p>
              <select
                value={duration}
                onChange={(event) => setDuration(event.target.value as (typeof durations)[number])}
                className="w-full rounded-lg border border-slate/30 px-3 py-2 text-sm text-midnight focus:border-primary focus:outline-none"
              >
                {durations.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-midnight">Working hours</p>
              <div className="flex gap-2">
                <input
                  type="time"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  className="w-full rounded-lg border border-slate/30 px-3 py-2 text-sm text-midnight focus:border-primary focus:outline-none"
                />
                <input
                  type="time"
                  value={endTime}
                  onChange={(event) => setEndTime(event.target.value)}
                  className="w-full rounded-lg border border-slate/30 px-3 py-2 text-sm text-midnight focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-midnight">Working days</p>
            <div className="flex flex-wrap gap-2">
              {days.map((day) => {
                const checked = selectedDays.includes(day);
                return (
                  <label
                    key={day}
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                      checked ? "border-primary bg-primary/5 text-primary" : "border-slate/20 text-slate"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={(event) => {
                        const next = event.target.checked
                          ? [...selectedDays, day]
                          : selectedDays.filter((item) => item !== day);
                        setSelectedDays(next);
                      }}
                    />
                    {day}
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

