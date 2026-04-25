"use client";

import { useCallback, useMemo, useState } from "react";
import { MonitorSmartphone } from "lucide-react";
import ToggleSwitch from "@/components/candidate/settings/ToggleSwitch";
import { getStoredUser } from "@/lib/services/authService";
import { updateUser } from "@/lib/services/userService";
import Toast from "@/components/ui/Toast";

type Session = {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
};

const initialSessions: Session[] = [
  {
    id: "s1",
    device: "MacBook Pro",
    browser: "Chrome",
    location: "Lagos, Nigeria",
    lastActive: "Active now",
  },
  {
    id: "s2",
    device: "iPhone 15",
    browser: "Safari",
    location: "Abuja, Nigeria",
    lastActive: "3h ago",
  },
];

const loginHistory = [
  { id: "l1", date: "Apr 17, 10:21 AM", device: "MacBook Pro", ip: "192.168.0.4", location: "Lagos, NG" },
  { id: "l2", date: "Apr 16, 4:03 PM", device: "iPhone 15", ip: "10.0.1.22", location: "Abuja, NG" },
  { id: "l3", date: "Apr 14, 8:42 AM", device: "Windows PC", ip: "172.16.2.11", location: "Accra, GH" },
  { id: "l4", date: "Apr 13, 9:15 PM", device: "MacBook Pro", ip: "192.168.0.5", location: "Lagos, NG" },
  { id: "l5", date: "Apr 11, 11:27 AM", device: "iPad Pro", ip: "10.0.1.44", location: "Ibadan, NG" },
];

type ToastState = { message: string; type: "success" | "error" | "info" } | null;

export default function SecurityTab() {
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [sessions, setSessions] = useState(initialSessions);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const closeToast = useCallback(() => setToast(null), []);

  const handleChangePassword = async () => {
    if (passwords.next.length < 8) {
      setToast({ message: "New password must be at least 8 characters.", type: "error" });
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setToast({ message: "Passwords do not match.", type: "error" });
      return;
    }
    const user = getStoredUser();
    if (!user?.id) {
      setToast({ message: "Session expired. Please log in again.", type: "error" });
      return;
    }
    setSaving(true);
    try {
      await updateUser(user.id, { password: passwords.next });
      setToast({ message: "Password updated successfully!", type: "success" });
      setPasswords({ current: "", next: "", confirm: "" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update password.";
      setToast({ message, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const passwordStrength = useMemo(() => {
    const value = passwords.next;
    let score = 0;
    if (value.length >= 8) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/[0-9]/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;
    return score;
  }, [passwords.next]);

  const strengthLabel = ["Weak", "Weak", "Fair", "Strong", "Excellent"][passwordStrength];

  return (
    <div className="space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={!!toast}
          onClose={closeToast}
        />
      )}

      <section className="rounded-2xl bg-white p-6 shadow-sm shadow-midnight/5">
        <h3 className="text-lg font-semibold text-midnight">Change Password</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {[
            { key: "current", label: "Current password" },
            { key: "next", label: "New password" },
            { key: "confirm", label: "Confirm new password" },
          ].map((field) => (
            <div key={field.key} className="flex flex-col gap-2">
              <label className="text-sm font-medium text-midnight">{field.label}</label>
              <input
                type="password"
                value={passwords[field.key as keyof typeof passwords]}
                onChange={(event) =>
                  setPasswords((prev) => ({
                    ...prev,
                    [field.key]: event.target.value,
                  }))
                }
                className="rounded-lg border border-slate/30 px-3 py-2 text-sm text-midnight focus:border-primary focus:outline-none"
              />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.15em] text-slate">
            <span>Password Strength</span>
            <span>{strengthLabel}</span>
          </div>
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((segment) => (
              <span
                key={segment}
                className={`h-2 flex-1 rounded-full ${
                  passwordStrength > segment
                    ? ["bg-danger", "bg-warning", "bg-primary", "bg-success"][segment]
                    : "bg-slate/20"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => void handleChangePassword()}
            disabled={saving || !passwords.current || !passwords.next || !passwords.confirm}
            className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Updating…" : "Update Password"}
          </button>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm shadow-midnight/5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-midnight">Two-Factor Authentication</h3>
            <p className="text-sm text-slate">Enable OTP verification for additional account security.</p>
          </div>
          <ToggleSwitch checked={is2FAEnabled} onChange={setIs2FAEnabled} />
        </div>
        {is2FAEnabled && (
          <div className="mt-4 rounded-xl border border-slate/20 bg-surface p-4 text-sm text-slate">
            Authenticator setup is enabled. Backup codes are available for recovery.
          </div>
        )}
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm shadow-midnight/5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-midnight">Active Sessions</h3>
          <button type="button" className="text-sm font-semibold text-danger hover:text-danger/80">
            Sign out all devices
          </button>
        </div>
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex flex-col gap-3 rounded-xl border border-slate/20 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-center gap-3">
                <MonitorSmartphone className="h-10 w-10 rounded-full bg-surface p-2 text-primary" />
                <div>
                  <p className="font-semibold text-midnight">{session.device}</p>
                  <p className="text-sm text-slate">
                    {session.browser} • {session.location}
                  </p>
                  <p className="text-xs text-slate/80">{session.lastActive}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSessions((prev) => prev.filter((item) => item.id !== session.id))}
                className="rounded-full border border-danger/40 px-4 py-1 text-sm font-semibold text-danger hover:bg-danger/10"
              >
                Revoke
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm shadow-midnight/5">
        <h3 className="text-lg font-semibold text-midnight">Login History (last 5)</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm text-midnight">
            <thead className="text-xs uppercase tracking-[0.14em] text-slate">
              <tr>
                <th className="pb-2">Date</th>
                <th className="pb-2">Device</th>
                <th className="pb-2">IP</th>
                <th className="pb-2">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate/10">
              {loginHistory.map((entry) => (
                <tr key={entry.id}>
                  <td className="py-2">{entry.date}</td>
                  <td className="py-2">{entry.device}</td>
                  <td className="py-2">{entry.ip}</td>
                  <td className="py-2">{entry.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

