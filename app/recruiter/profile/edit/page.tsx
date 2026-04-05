"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import CompanyInfoTab from "@/components/recruiter/profile/edit/CompanyInfoTab";
import RecruiterTab from "@/components/recruiter/profile/edit/RecruiterTab";
import BrandingTab from "@/components/recruiter/profile/edit/BrandingTab";
import SocialLinksTab from "@/components/recruiter/profile/edit/SocialLinksTab";

type TabId = "company" | "recruiter" | "branding" | "social";

interface Tab {
  id: TabId;
  label: string;
  hasChanges: boolean;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("company");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const tabs: Tab[] = [
    { id: "company", label: "Company Info", hasChanges: false },
    { id: "recruiter", label: "Recruiter Details", hasChanges: false },
    { id: "branding", label: "Branding", hasChanges: false },
    { id: "social", label: "Social Links", hasChanges: false },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleDiscard = () => {
    if (confirm("Are you sure you want to discard all changes?")) {
      router.push("/recruiter/profile");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "company":
        return <CompanyInfoTab />;
      case "recruiter":
        return <RecruiterTab />;
      case "branding":
        return <BrandingTab />;
      case "social":
        return <SocialLinksTab />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-surface pb-24">
      <div className="max-w-[1200px] mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/recruiter/profile")}
            className="flex items-center gap-2 text-slate hover:text-midnight text-sm font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </button>

          <h1 className="font-syne text-2xl font-semibold text-midnight mb-2">
            Edit Company Profile
          </h1>
          <p className="text-slate text-sm">
            Update your company information and branding to attract top talent
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 bg-surface/50">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "text-primary"
                      : "text-slate hover:text-midnight"
                  }`}
                >
                  {tab.label}
                  {tab.hasChanges && (
                    <span className="w-2 h-2 rounded-full bg-warning" />
                  )}

                  {/* Active Indicator */}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left - Discard */}
            <button
              onClick={handleDiscard}
              className="flex items-center gap-2 px-5 py-2.5 text-danger hover:bg-danger/10 rounded-lg font-medium text-sm transition-colors"
            >
              Discard Changes
            </button>

            {/* Right - Save */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors min-w-[140px] justify-center"
            >
              {isSaving ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 right-6 z-50"
          >
            <div className="bg-success text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="font-medium">Profile updated successfully!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
