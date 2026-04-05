"use client";

import { useState } from "react";
import { Camera, Mail, Phone, Globe2, Clock3 } from "lucide-react";
import SettingRow from "@/components/candidate/settings/SettingRow";

export default function AccountTab() {
  const [phone, setPhone] = useState("+1 (202) 555-0147");
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("EST");

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow-sm shadow-midnight/5">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80"
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover"
            />
            <button
              className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-white shadow-lg"
              aria-label="Change profile photo"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <p className="text-lg font-semibold text-midnight">Aria Chen</p>
              <div className="flex items-center gap-2 text-sm text-slate">
                <Mail className="h-4 w-4" />
                <span>aria.chen@evalexa.com</span>
                <button className="font-semibold text-primary hover:text-primary/80 transition">
                  Change email
                </button>
              </div>
            </div>
            <p className="text-sm text-slate">
              Update your basic profile details to keep recruiters informed.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm shadow-midnight/5">
        <div className="space-y-4">
          <SettingRow
            label="Phone number"
            description="Used for interview reminders and two-factor prompts."
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate" />
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="rounded-lg border border-slate/30 px-3 py-2 text-sm text-midnight placeholder:text-slate/50 focus:border-primary focus:outline-none"
                />
                <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                  Verified
                </span>
              </div>
            </div>
          </SettingRow>

          <SettingRow
            label="Language"
            description="Choose your preferred interface language."
          >
            <div className="flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-slate" />
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="rounded-lg border border-slate/30 px-3 py-2 text-sm text-midnight focus:border-primary focus:outline-none"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          </SettingRow>

          <SettingRow
            label="Timezone"
            description="Interview invites will use this timezone."
          >
            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-slate" />
              <select
                value={timezone}
                onChange={(event) => setTimezone(event.target.value)}
                className="rounded-lg border border-slate/30 px-3 py-2 text-sm text-midnight focus:border-primary focus:outline-none"
              >
                <option value="EST">(GMT-05:00) Eastern Time</option>
                <option value="PST">(GMT-08:00) Pacific Time</option>
                <option value="GMT">(GMT+00:00) Greenwich Mean Time</option>
              </select>
            </div>
          </SettingRow>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white shadow-sm shadow-primary/40 transition hover:bg-primary/90">
            Save changes
          </button>
        </div>
      </section>
    </div>
  );
}
