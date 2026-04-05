"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MonitorSmartphone } from "lucide-react";
import ToggleSwitch from "@/components/candidate/settings/ToggleSwitch";

interface Session {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
}

const initialSessions: Session[] = [
  {
    id: "session-1",
    device: "MacBook Pro",
    browser: "Chrome · SF, USA",
    location: "San Francisco, USA",
    lastActive: "Active now",
  },
  {
    id: "session-2",
    device: "iPhone 15",
    browser: "Safari · NYC, USA",
    location: "New York, USA",
    lastActive: "2h ago",
  },
  {
    id: "session-3",
    device: "Surface Pro",
    browser: "Edge · Berlin, DE",
    location: "Berlin, Germany",
    lastActive: "1d ago",
  },
];

const loginHistory = [
  {
    id: "1",
    date: "Mar 28, 10:42 AM",
    device: "MacBook Pro",
    ip: "192.168.1.20",
    location: "San Francisco, USA",
  },
  {
    id: "2",
    date: "Mar 27, 7:15 PM",
    device: "iPhone 15",
    ip: "10.0.0.14",
    location: "New York, USA",
  },
  {
    id: "3",
    date: "Mar 25, 5:54 PM",
    device: "iPad Air",
    ip: "172.16.4.9",
    location: "Seattle, USA",
  },
  {
    id: "4",
    date: "Mar 23, 2:12 PM",
    device: "Surface Pro",
    ip: "192.168.1.11",
    location: "Berlin, Germany",
  },
  {
    id: "5",
    date: "Mar 20, 9:45 AM",
    device: "Pixel 8",
    ip: "10.0.0.19",
    location: "Toronto, Canada",
  },
];

export default function SecurityTab() {
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [sessions, setSessions] = useState(initialSessions);
  const [showHistory, setShowHistory] = useState(false);

  const strength = useMemo(() => {
    const { next } = passwords;
    let score = 0;
    if (next.length >= 8) score += 1;
    if (/[A-Z]/.test(next)) score += 1;
    if (/[0-9]/.test(next)) score += 1;
    if (/[^A-Za-z0-9]/.test(next)) score += 1;
    return score;
  }, [passwords]);

  const revokeSession = (id: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== id));
  };

  const getStrengthLabel = () => {
    switch (strength) {
      case 0:
      case 1:
        return { label: "Weak", color: "text-danger" };
      case 2:
        return { label: "Fair", color: "text-warning" };
      case 3:
        return { label: "Strong", color: "text-primary" };
      case 4:
        return { label: "Excellent", color: "text-success" };
      default:
        return { label: "Weak", color: "text-danger" };
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow-sm shadow-midnight/5">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-midnight">
            Change Password
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                label: "Current password",
                name: "current",
                placeholder: "••••••••",
              },
              {
                label: "New password",
                name: "next",
                placeholder: "At least 8 characters",
              },
              {
                label: "Confirm new password",
                name: "confirm",
                placeholder: "Re-enter password",
              },
            ].map((field) => (
              <div key={field.name} className="flex flex-col gap-2">
                <label className="text-sm font-medium text-midnight">
                  {field.label}
                </label>
                <input
                  type="password"
                  value={passwords[field.name as keyof typeof passwords]}
                  onChange={(event) =>
                    setPasswords((prev) => ({
                      ...prev,
                      [field.name]: event.target.value,
                    }))
                  }
                  placeholder={field.placeholder}
                  className="rounded-lg border border-slate/30 px-3 py-2 text-midnight placeholder:text-slate/50 focus:border-primary focus:outline-none"
                />
              </div>
            ))}
          </div>
          <div>
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-slate">
              <span>Password Strength</span>
              <span className={getStrengthLabel().color}>
                {getStrengthLabel().label}
              </span>
            </div>
            <div className="mt-2 flex gap-1">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded-full ${
                    strength > index
                      ? ["bg-danger", "bg-warning", "bg-primary", "bg-success"][
                          index
                        ]
                      : "bg-slate/20"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <button className="rounded-lg bg-midnight px-6 py-2 text-sm font-semibold text-white hover:bg-midnight/90">
              Update password
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-5 rounded-2xl bg-white p-6 shadow-sm shadow-midnight/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-midnight">
              Two-Factor Authentication
            </p>
            <p className="text-sm text-slate">
              Add an extra layer of security with OTP codes.
            </p>
          </div>
          <ToggleSwitch checked={is2FAEnabled} onChange={setIs2FAEnabled} />
        </div>

        <AnimatePresence>
          {is2FAEnabled && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="grid gap-4 rounded-xl border border-slate/20 p-4 md:grid-cols-2"
            >
              <div className="space-y-2">
                <p className="font-semibold text-midnight">Authenticator App</p>
                <p className="text-sm text-slate">
                  Scan the QR code using Google Authenticator, Authy, or
                  1Password.
                </p>
                <div className="rounded-lg bg-surface p-4 text-center">
                  <div className="mx-auto h-28 w-28 rounded-lg bg-white p-2 shadow-inner">
                    <div className="h-full w-full rounded bg-slate/10" />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <p className="font-semibold text-midnight">Backup codes</p>
                <p className="text-sm text-slate">
                  Store these securely. Each code can be used once.
                </p>
                <div className="rounded-lg border border-slate/20 bg-slate/5 p-4 text-center text-slate/70 backdrop-blur">
                  <p>•••• •••• ••••</p>
                </div>
                <button className="text-sm font-semibold text-primary">
                  Reveal codes
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section className="space-y-5 rounded-2xl bg-white p-6 shadow-sm shadow-midnight/5">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-midnight">Active Sessions</p>
          {sessions.length > 1 && (
            <button className="text-sm font-semibold text-danger hover:text-danger/80">
              Sign out all devices
            </button>
          )}
        </div>
        <ul className="space-y-3">
          <AnimatePresence>
            {sessions.map((session) => (
              <motion.li
                key={session.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-4 rounded-xl border border-slate/20 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex flex-1 items-center gap-3">
                  <MonitorSmartphone className="h-10 w-10 rounded-full bg-surface p-2 text-primary" />
                  <div>
                    <p className="font-semibold text-midnight">
                      {session.device}
                    </p>
                    <p className="text-sm text-slate">{session.browser}</p>
                    <p className="text-xs text-slate/70">{session.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate">
                    {session.lastActive}
                  </span>
                  <button
                    onClick={() => revokeSession(session.id)}
                    className="rounded-full border border-danger/40 px-4 py-1 text-sm font-semibold text-danger hover:bg-danger/10"
                  >
                    Revoke
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </section>

      <section className="space-y-4 rounded-2xl bg-white p-6 shadow-sm shadow-midnight/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-midnight">Login History</p>
            <p className="text-sm text-slate">
              Keep track of the last 5 sign-ins to this account.
            </p>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-full border border-slate/30 px-3 py-1 text-xs font-semibold"
            onClick={() => setShowHistory((prev) => !prev)}
          >
            {showHistory ? "Hide" : "Show"}
          </button>
        </div>
        <AnimatePresence initial={false}>
          {showHistory && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <table className="mt-4 w-full text-left text-sm text-midnight">
                <thead className="text-xs uppercase tracking-[0.2em] text-slate">
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
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
