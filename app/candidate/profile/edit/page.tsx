"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import BasicInfoTab from "@/components/candidate/profile/edit/BasicInfoTab";
import ExperienceTab from "@/components/candidate/profile/edit/ExperienceTab";
import EducationTab from "@/components/candidate/profile/edit/EducationTab";
import SkillsTab from "@/components/candidate/profile/edit/SkillsTab";
import LinksTab from "@/components/candidate/profile/edit/LinksTab";

const tabs = [
  { id: "basic", label: "Basic Info" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills & Certifications" },
  { id: "links", label: "Links & Portfolio" },
];

export default function EditProfilePage() {
  const [activeTab, setActiveTab] = useState("basic");
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    setShowSuccess(true);
    setHasChanges(false);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDiscard = () => {
    if (
      hasChanges &&
      confirm("Are you sure you want to discard all changes?")
    ) {
      setHasChanges(false);
      window.location.href = "/candidate/profile";
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/candidate/profile"
          className="inline-flex items-center gap-2 text-slate hover:text-primary transition-colors mb-3"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to Profile</span>
        </Link>
        <h1 className="font-display text-2xl font-bold text-midnight">
          Edit Profile
        </h1>
        <p className="text-sm text-slate mt-1">
          Update your professional information
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate/10 p-2 mb-6 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "text-slate hover:bg-surface hover:text-midnight"
              }`}
            >
              {tab.label}
              {hasChanges && activeTab !== tab.id && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-warning rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-slate/10 p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "basic" && <BasicInfoTab />}
            {activeTab === "experience" && <ExperienceTab />}
            {activeTab === "education" && <EducationTab />}
            {activeTab === "skills" && <SkillsTab />}
            {activeTab === "links" && <LinksTab />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate/10 z-30">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left - Discard */}
            <button
              onClick={handleDiscard}
              className="px-4 py-2 text-danger hover:bg-danger/10 rounded-lg transition-colors font-medium text-sm"
            >
              Discard Changes
            </button>

            {/* Right - Save */}
            <div className="flex items-center gap-3">
              {/* Success Message */}
              <AnimatePresence>
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-success text-sm font-medium"
                  >
                    <Check size={16} />
                    <span>Changes saved successfully!</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
