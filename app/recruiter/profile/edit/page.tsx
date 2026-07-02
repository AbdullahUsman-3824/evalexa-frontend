"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import CompanyInfoTab, {
  type CompanyFormData,
} from "@/components/recruiter/profile/edit/CompanyInfoTab";
import RecruiterTab from "@/components/recruiter/profile/edit/RecruiterTab";
import BrandingTab from "@/components/recruiter/profile/edit/BrandingTab";
import {
  updateCompany,
  getCompanies,
  type Company,
} from "@/lib/services/company-service";
import { getProfile, getStoredUserId } from "@/lib/services/auth-service";
import { updateUser } from "@/lib/services/user-service";
import Toast from "@/components/ui/Toast";

type TabId = "company" | "recruiter" | "branding";

interface Tab {
  id: TabId;
  label: string;
}

const TABS: Tab[] = [
  { id: "company", label: "Company Info" },
  { id: "recruiter", label: "Recruiter Details" },
  { id: "branding", label: "Branding" },
];

interface RecruiterFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("company");
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const [companyId, setCompanyId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [companyData, setCompanyData] = useState<CompanyFormData>({
    name: "",
    industry: "",
    size: null,
    foundedYear: null,
    type: null,
    location: "",
    website: null,
    email: null,
    description: null,
  });

  const [recruiterData, setRecruiterData] = useState<RecruiterFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  // File state — lifted here so handleSave can include them all in one call
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [verificationDocuments, setVerificationDocuments] = useState<File[]>(
    [],
  );

  // Existing URLs from DB — passed to BrandingTab for preview
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string | null>(null);
  const [currentBannerUrl, setCurrentBannerUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companies, profile] = await Promise.all([
          getCompanies(),
          getProfile(),
        ]);

        const nameParts = (profile.fullName ?? "")
          .trim()
          .split(/\s+/)
          .filter(Boolean);
        const [firstName = "", ...otherParts] = nameParts;

        setUserId(String(profile.id));
        setRecruiterData({
          firstName,
          lastName: otherParts.join(" "),
          phone: profile.phone ?? "",
          email: profile.email ?? "",
        });

        if (companies.length === 0) {
          router.push("/recruiter/company/setup");
          return;
        }

        const primary = companies[0] as Company;
        setCompanyId(primary.id);
        setCurrentLogoUrl(primary.logo);
        setCurrentBannerUrl(primary.banner);
        setCompanyData({
          name: primary.name ?? "",
          industry: primary.industry ?? "",
          size: primary.size ?? null,
          foundedYear: primary.foundedYear ?? null,
          type: primary.type ?? null,
          location: primary.location ?? "",
          website: primary.website ?? null,
          email: primary.email ?? null,
          description: primary.description ?? null,
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setToast({ message: "Failed to load profile data.", type: "error" });
      }
    };

    void fetchData();
  }, [router]);

  const handleSave = async () => {
    if (!companyId) {
      setToast({
        message: "Company not found. Please set up your company first.",
        type: "error",
      });
      return;
    }

    const rawUserId = userId ?? getStoredUserId();
    const effectiveUserId = rawUserId !== null ? Number(rawUserId) : null;
    if (!effectiveUserId) {
      setToast({
        message: "Session expired. Please log in again.",
        type: "error",
      });
      return;
    }

    const firstName = recruiterData.firstName.trim();
    const lastName = recruiterData.lastName.trim();
    const phone = recruiterData.phone.trim().replace(/[\s()-]/g, "");
    const fullName = `${firstName} ${lastName}`.trim();

    if (!firstName || !lastName) {
      setToast({
        message: "First name and last name are required.",
        type: "error",
      });
      return;
    }

    if (phone && !/^(\+92|0)[0-9]{10}$/.test(phone)) {
      setToast({
        message: "Phone must be +92XXXXXXXXXX or 0XXXXXXXXXX format.",
        type: "error",
      });
      return;
    }

    setIsSaving(true);
    try {
      const [updatedCompany] = await Promise.all([
        updateCompany(companyId, {
          name: companyData.name || undefined,
          industry: companyData.industry || undefined,
          location: companyData.location || undefined,
          description: companyData.description || undefined,
          size: companyData.size ?? undefined,
          foundedYear: companyData.foundedYear ?? undefined,
          type: companyData.type ?? undefined,
          website: companyData.website || undefined,
          email: companyData.email || undefined,
          logo: logoFile ?? undefined,
          banner: bannerFile ?? undefined,
          verificationDocuments: verificationDocuments.length
            ? verificationDocuments
            : undefined,
        }),
        updateUser(Number(effectiveUserId), {
          fullName,
          phone: phone || undefined,
        }),
      ]);

      // Sync state with server response
      setCurrentLogoUrl(updatedCompany.logo);
      setCurrentBannerUrl(updatedCompany.banner);
      setLogoFile(null);
      setBannerFile(null);
      setVerificationDocuments([]);

      setCompanyData({
        name: updatedCompany.name ?? "",
        industry: updatedCompany.industry ?? "",
        size: updatedCompany.size ?? null,
        foundedYear: updatedCompany.foundedYear ?? null,
        type: updatedCompany.type ?? null,
        location: updatedCompany.location ?? "",
        website: updatedCompany.website ?? null,
        email: updatedCompany.email ?? null,
        description: updatedCompany.description ?? null,
      });

      // Refresh session so top nav picks up updated name
      await getProfile();

      setToast({ message: "Profile updated successfully!", type: "success" });
      setTimeout(() => {
        router.push("/recruiter/profile");
        router.refresh();
      }, 1200);
    } catch (error) {
      console.error("Failed to update profile:", error);
      setToast({
        message:
          error instanceof Error ? error.message : "Failed to update profile.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    if (confirm("Discard all unsaved changes?")) {
      router.push("/recruiter/profile");
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case "company":
        return (
          <CompanyInfoTab
            data={companyData}
            onChange={(patch) =>
              setCompanyData((prev) => ({ ...prev, ...patch }))
            }
            verificationDocuments={verificationDocuments}
            onVerificationDocumentsChange={setVerificationDocuments}
          />
        );
      case "recruiter":
        return (
          <RecruiterTab
            data={recruiterData}
            onChange={(patch) =>
              setRecruiterData((prev) => ({ ...prev, ...patch }))
            }
          />
        );
      case "branding":
        return (
          <BrandingTab
            currentLogoUrl={currentLogoUrl}
            currentBannerUrl={currentBannerUrl}
            logoFile={logoFile}
            bannerFile={bannerFile}
            onLogoChange={setLogoFile}
            onBannerChange={setBannerFile}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/recruiter/profile")}
            className="flex items-center gap-2 text-slate hover:text-midnight text-sm font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </button>
          <h1 className="font-syne text-2xl font-semibold text-midnight mb-1">
            Edit Company Profile
          </h1>
          <p className="text-slate text-sm">
            Update your company information and branding to attract top talent.
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Tab Nav */}
          <div className="border-b border-gray-200 bg-surface/50">
            <div className="flex overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "text-primary"
                      : "text-slate hover:text-midnight"
                  }`}
                >
                  {tab.label}
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
                {renderTab()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="max-w-4xl mx-auto mt-6 mb-6 px-6">
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            <button
              onClick={handleDiscard}
              className="px-5 py-2.5 text-red-500 hover:bg-red-50 rounded-lg font-medium text-sm transition-colors"
            >
              Discard Changes
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors min-w-[130px] justify-center"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
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
