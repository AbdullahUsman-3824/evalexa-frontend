"use client";

import { useCallback, useState } from "react";
import ActiveCompletedTab from "@/components/recruiter/interviews/ActiveCompletedTab";
import ExtensionRequestsTab from "@/components/recruiter/interviews/ExtensionRequestTab";
import PendingInterviewsTab from "@/components/recruiter/interviews/PendingInterviewsTab";
import Toast from "@/components/ui/Toast";

type TabKey = "pending" | "requests" | "active";

const TABS: { key: TabKey; label: string }[] = [
  { key: "pending", label: "Pending Interviews" },
  { key: "requests", label: "Extension Requests" },
  { key: "active", label: "Active & Completed" },
];

type ToastType = "success" | "error" | "info";

export default function InterviewsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("pending");
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    visible: boolean;
  }>({ message: "", type: "success", visible: false });

  // Stable references so the tabs' effects don't re-run on every render
  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type, visible: true });
  }, []);

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F7FF] p-6">
      <div className="mx-auto max-w-6xl space-y-5">
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                activeTab === tab.key
                  ? "bg-[#1E6FFF] text-white"
                  : "bg-white text-[#6B7A99] hover:bg-[#EAF0FF]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "pending" && <PendingInterviewsTab onToast={showToast} />}
        {activeTab === "requests" && (
          <ExtensionRequestsTab onToast={showToast} />
        )}
        {activeTab === "active" && <ActiveCompletedTab />}
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={closeToast}
      />
    </div>
  );
}