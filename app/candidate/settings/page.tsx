"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Settings,
  Shield,
  BellRing,
  Eye,
  AlertTriangle,
} from "lucide-react";
import AccountTab from "@/components/candidate/settings/AccountTab";
import SecurityTab from "@/components/candidate/settings/SecurityTab";
import NotificationsTab from "@/components/candidate/settings/NotificationsTab";
import PrivacyTab from "@/components/candidate/settings/PrivacyTab";
import DangerZoneTab from "@/components/candidate/settings/DangerZoneTab";

type TabID = "account" | "security" | "notifications" | "privacy" | "danger";

const tabs: { id: TabID; label: string; icon: React.ComponentType<any> }[] = [
  { id: "account", label: "Account", icon: Settings },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: BellRing },
  { id: "privacy", label: "Privacy", icon: Eye },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabID>("account");

  const ActiveComponent = useMemo(() => {
    switch (activeTab) {
      case "security":
        return <SecurityTab />;
      case "notifications":
        return <NotificationsTab />;
      case "privacy":
        return <PrivacyTab />;
      case "danger":
        return <DangerZoneTab />;
      case "account":
      default:
        return <AccountTab />;
    }
  }, [activeTab]);

  return (
    <section className="space-y-6">
      <header className="rounded-2xl bg-white p-6 shadow-sm shadow-midnight/5">
        <p className="font-heading text-2xl text-midnight">Candidate Settings</p>
        <p className="mt-1 text-sm text-slate">
          Manage your account, security, notification preferences, and privacy controls.
        </p>
      </header>

      <div className="flex gap-4 overflow-x-auto rounded-2xl bg-white/70 p-3 shadow-sm shadow-midnight/5 lg:hidden">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive ? "bg-primary text-white" : "bg-surface text-slate"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px,1fr]">
        <aside className="hidden rounded-2xl bg-midnight p-4 text-white lg:flex lg:flex-col">
          <p className="text-xs uppercase tracking-[0.2em] text-slate/60">Settings</p>
          <div className="mt-4 flex flex-col gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-between rounded-xl px-3 py-3 text-left transition ${
                    isActive
                      ? "bg-white text-midnight shadow-sm"
                      : "text-white/70 hover:bg-white/10"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon
                      className={`h-5 w-5 ${isActive ? "text-primary" : "text-white/60"}`}
                    />
                    <span className="font-semibold">{tab.label}</span>
                  </span>
                  {isActive && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {ActiveComponent}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

