"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Settings,
  Shield,
  BellRing,
  Building2,
  AlertTriangle,
} from "lucide-react";
import AccountTab from "@/components/recruiter/settings/AccountTab";
import SecurityTab from "@/components/recruiter/settings/SecurityTab";
import NotificationsTab from "@/components/recruiter/settings/NotificationsTab";
import CompanyPrefsTab from "@/components/recruiter/settings/CompanyPrefsTab";
import DangerZoneTab from "@/components/recruiter/settings/DangerZoneTab";

type TabID = "account" | "security" | "notifications" | "company" | "danger";

const tabs: { id: TabID; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "account", label: "Account", icon: Settings },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: BellRing },
  { id: "company", label: "Company Preferences", icon: Building2 },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

export default function RecruiterSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabID>("account");

  const ActiveComponent = useMemo(() => {
    switch (activeTab) {
      case "security":
        return <SecurityTab />;
      case "notifications":
        return <NotificationsTab />;
      case "company":
        return <CompanyPrefsTab />;
      case "danger":
        return <DangerZoneTab />;
      case "account":
      default:
        return <AccountTab />;
    }
  }, [activeTab]);

  return (
    <section className="space-y-6 bg-surface p-4 md:p-6">
      <header className="rounded-2xl bg-white p-6 shadow-sm shadow-midnight/5">
        <p className="font-syne text-2xl font-semibold text-midnight">Recruiter Settings</p>
       <p className="mt-1 text-sm text-slate">
          Manage account, security, notifications, company defaults, and sensitive actions.
        </p>
      </header>

      <div className="rounded-2xl bg-white p-4 shadow-sm shadow-midnight/5 lg:hidden">
        <label
          htmlFor="settings-section-select"
          className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate"
        >
          Settings section
        </label>
        <select
          id="settings-section-select"
          value={activeTab}
          onChange={(event) => setActiveTab(event.target.value as TabID)}
          className="w-full rounded-xl border border-light bg-surface px-4 py-3 text-sm font-semibold text-midnight outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <aside className="hidden rounded-2xl bg-white p-4 shadow-sm shadow-midnight/5 lg:block">
          <p className="text-xs uppercase tracking-[0.2em] text-slate">Settings</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "border-primary bg-primary text-white shadow-sm"
                      : "border-light bg-surface text-slate hover:border-primary/30 hover:text-midnight"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="rounded-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {ActiveComponent}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
