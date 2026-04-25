"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import CompanyInfoTab from "@/components/recruiter/profile/edit/CompanyInfoTab";
import RecruiterTab from "@/components/recruiter/profile/edit/RecruiterTab";
import BrandingTab from "@/components/recruiter/profile/edit/BrandingTab";
import SocialLinksTab from "@/components/recruiter/profile/edit/SocialLinksTab";
import {
  updateCompany,
  Company,
  getCompanies,
} from "@/lib/services/companyService";
import { getProfile, getStoredUser } from "@/lib/services/authService";
import { updateUser } from "@/lib/services/userService";
import Toast from "@/components/ui/Toast";

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
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const [companyData, setCompanyData] = useState<Partial<Company>>({
    name: "",
    industry: "",
    companySize: "",
    location: "",
    website: "",
    description: "",
  });

  const [recruiterData, setRecruiterData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser?.id) {
      setUserId(storedUser.id);
    }
  }, []);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const [companies, profile] = await Promise.all([
          getCompanies(),
          getProfile(),
        ]);

        const nameParts = (profile.fullName ?? "")
          .trim()
          .split(/\s+/)
          .filter(Boolean);
        const [firstName = "", ...otherNames] = nameParts;

        setUserId(profile.id);
        setRecruiterData({
          firstName,
          lastName: otherNames.join(" "),
          phone: profile.phone ?? "",
          email: profile.email ?? "",
        });

        if (companies.length === 0) {
          router.push("/company-setup");
          return;
        }

        const [primaryCompany] = companies;
        setCompanyId(primaryCompany.id);
        setCompanyData(primaryCompany);
      } catch (error) {
        console.error("Failed to fetch company", error);
        setToast({ message: "Failed to load company data.", type: "error" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompany();
  }, [router]);
  const tabs: Tab[] = [
    { id: "company", label: "Company Info", hasChanges: false },
    { id: "recruiter", label: "Recruiter Details", hasChanges: false },
    { id: "branding", label: "Branding", hasChanges: false },
    { id: "social", label: "Social Links", hasChanges: false },
  ];

  const handleSave = async () => {
    if (!companyId) {
      setToast({
        message: "Company not found. Please set up your company profile first.",
        type: "error",
      });
      return;
    }

    const effectiveUserId = userId ?? getStoredUser()?.id ?? null;
    if (!effectiveUserId) {
      setToast({
        message: "User session not found. Please log in again.",
        type: "error",
      });
      return;
    }

    setIsSaving(true);
    try {
      const firstName = recruiterData.firstName.trim();
      const lastName = recruiterData.lastName.trim();
      const phoneRaw = recruiterData.phone.trim();
      const phone = phoneRaw.replace(/[\s()-]/g, "");
      const fullName = `${firstName} ${lastName}`.trim();

      if (!firstName || !lastName) {
        setToast({
          message: "First name and last name are required.",
          type: "error",
        });
        setIsSaving(false);
        return;
      }

      if (phone && !/^(\+92|0)[0-9]{10}$/.test(phone)) {
        setToast({
          message: "Phone must be in +92XXXXXXXXXX or 0XXXXXXXXXX format.",
          type: "error",
        });
        setIsSaving(false);
        return;
      }

      const [updatedCompany] = await Promise.all([
        updateCompany(companyId, {
          name: companyData.name,
          industry: companyData.industry,
          companySize: companyData.companySize,
          location: companyData.location,
          website: companyData.website || undefined,
          description: companyData.description || undefined,
        }),
        updateUser(effectiveUserId, {
          fullName,
          phone: phone || undefined,
        }),
      ]);

      setRecruiterData((prev) => ({ ...prev, phone }));

      setCompanyData(updatedCompany);
      // Refresh persisted auth session so top nav/dashboard pick up updated fullName.
      await getProfile();
      setToast({ message: "Profile updated successfully!", type: "success" });
      setTimeout(() => {
        router.push("/recruiter/profile");
        router.refresh();
      }, 1200);
    } catch (error) {
      console.error("Failed to update company", error);
      const message =
        error instanceof Error ? error.message : "Failed to update profile.";
      setToast({ message, type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    if (confirm("Are you sure you want to discard all changes?")) {
      router.push("/recruiter/profile");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "company":
        return (
          <CompanyInfoTab
            data={companyData}
            onChange={(newData) =>
              setCompanyData({ ...companyData, ...newData })
            }
          />
        );
      case "recruiter":
        return (
          <RecruiterTab
            data={recruiterData}
            onChange={(newData) =>
              setRecruiterData((prev) => ({ ...prev, ...newData }))
            }
          />
        );
      case "branding":
        return <BrandingTab />;
      case "social":
        return <SocialLinksTab />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-300 mx-auto p-6">
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

      {/* End-of-page Action Bar */}
      <div className="mx-auto mt-6 mb-6 max-w-300 px-6">
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-lg">
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
              className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors min-w-35 justify-center"
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

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={!!toast}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
