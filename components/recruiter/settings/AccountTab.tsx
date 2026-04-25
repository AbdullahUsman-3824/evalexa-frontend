"use client";

import { useEffect, useMemo, useState } from "react";
import { Camera, Clock3, Globe2, Mail, Phone } from "lucide-react";
import SettingRow from "@/components/candidate/settings/SettingRow";
import { getProfile, getStoredUser, type AuthUser } from "@/lib/services/authService";

export default function AccountTab() {
  const [accountUser, setAccountUser] = useState<AuthUser | null>(() => getStoredUser());
  const [phone, setPhone] = useState("+1 (415) 555-9012");
  const [designation, setDesignation] = useState("Senior Talent Acquisition Manager");
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("WAT");

  useEffect(() => {
    const storedUser = getStoredUser();
    setAccountUser(storedUser);

    void getProfile()
      .then((profile) => {
        setAccountUser(profile);
      })
      .catch(() => {
        // Keep stored session user as fallback if profile request fails.
      });
  }, []);

  const displayName = useMemo(
    () =>
      accountUser?.name ??
      accountUser?.fullName ??
      accountUser?.email?.split("@")[0] ??
      "User",
    [accountUser],
  );

  const displayEmail = useMemo(
    () => accountUser?.email ?? "No email available",
    [accountUser],
  );

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow-sm shadow-midnight/5">
        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-cyan" />
            <button
              type="button"
              aria-label="Upload profile photo"
              className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-white shadow-lg"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-1">
            <p className="text-lg font-semibold text-midnight">{displayName}</p>
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate">
              <Mail className="h-4 w-4" />
              <span>{displayEmail}</span>
              <button type="button" className="font-semibold text-primary hover:text-primary/80">
                Change Email
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm shadow-midnight/5">
        <SettingRow label="Phone" description="Used for interview and candidate communication alerts.">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-slate" />
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="rounded-lg border border-slate/30 px-3 py-2 text-sm text-midnight focus:border-primary focus:outline-none"
            />
          </div>
        </SettingRow>

        <SettingRow label="Designation" description="Your role shown in candidate communication context.">
          <input
            value={designation}
            onChange={(event) => setDesignation(event.target.value)}
            className="w-full rounded-lg border border-slate/30 px-3 py-2 text-sm text-midnight focus:border-primary focus:outline-none md:w-80"
          />
        </SettingRow>

        <SettingRow label="Language" description="Preferred recruiter portal language.">
          <div className="flex items-center gap-2">
            <Globe2 className="h-4 w-4 text-slate" />
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="rounded-lg border border-slate/30 px-3 py-2 text-sm text-midnight focus:border-primary focus:outline-none"
            >
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
            </select>
          </div>
        </SettingRow>

        <SettingRow label="Timezone" description="Used for scheduling interviews and reminders.">
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-slate" />
            <select
              value={timezone}
              onChange={(event) => setTimezone(event.target.value)}
              className="rounded-lg border border-slate/30 px-3 py-2 text-sm text-midnight focus:border-primary focus:outline-none"
            >
              <option value="WAT">(GMT+01:00) West Africa Time</option>
              <option value="UTC">(GMT+00:00) Coordinated Universal Time</option>
              <option value="EST">(GMT-05:00) Eastern Time</option>
            </select>
          </div>
        </SettingRow>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            Save Changes
          </button>
        </div>
      </section>
    </div>
  );
}

