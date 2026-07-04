"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser, getProfile } from "@/store/auth-session";
import {
  createCompany,
  type CompanySize,
  type CompanyType,
} from "@/lib/services/company-service";
import FormInput from "@/components/ui/FormInput";
import Toast from "@/components/ui/Toast";

type ToastState = {
  message: string;
  type: "success" | "error" | "info";
} | null;

const COMPANY_SIZES: { value: CompanySize; label: string }[] = [
  { value: "STARTUP_1_10", label: "1–10 employees" },
  { value: "SMALL_11_50", label: "11–50 employees" },
  { value: "MEDIUM_51_200", label: "51–200 employees" },
  { value: "LARGE_201_500", label: "201–500 employees" },
  { value: "ENTERPRISE_500_PLUS", label: "500+ employees" },
];

const COMPANY_TYPES: { value: CompanyType; label: string }[] = [
  { value: "STARTUP", label: "Startup" },
  { value: "AGENCY", label: "Agency" },
  { value: "ENTERPRISE", label: "Enterprise" },
  { value: "NON_PROFIT", label: "Non-Profit" },
  { value: "GOVERNMENT", label: "Government" },
];

const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Media & Entertainment",
  "Real Estate",
  "Transportation",
  "Other",
];

const CURRENT_YEAR = new Date().getFullYear();

export default function CompanySetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  // const bannerInputRef = useRef<HTMLInputElement>(null);
  const docsInputRef = useRef<HTMLInputElement>(null);

  const [fields, setFields] = useState({
    name: "",
    industry: "",
    location: "",
    description: "",
    size: "" as CompanySize | "",
    type: "" as CompanyType | "",
    foundedYear: "",
    website: "",
    email: "",
  });

  const [logo, setLogo] = useState<File | null>(null);
  // const [banner, setBanner] = useState<File | null>(null);
  const [verificationDocuments, setVerificationDocuments] = useState<File[]>([]);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      router.push("/login");
    } else if (user.companyId) {
      router.push("/recruiter/dashboard");
    }
  }, [router]);

  const handleField = (name: keyof typeof fields, value: string) => {
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    handleField(e.target.name as keyof typeof fields, e.target.value);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setLogo(file);
  };

  // const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0] ?? null;
  //   setBanner(file);
  // };

  const handleDocsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files ?? []);
    setVerificationDocuments((prev) => {
      const combined = [...prev, ...incoming];
      // max 5 files enforced by backend; surface it early
      if (combined.length > 5) {
        setToast({ message: "Maximum 5 verification documents allowed.", type: "error" });
        return prev;
      }
      return combined;
    });
    // reset input so the same file can be re-selected if removed
    e.target.value = "";
  };

  const removeDoc = (index: number) => {
    setVerificationDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const closeToast = () => setToast(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = getStoredUser();
    if (!user?.id) {
      setToast({ message: "Session expired. Please log in again.", type: "error" });
      return;
    }

    if (!fields.name || !fields.industry || !fields.location) {
      setToast({ message: "Please fill in all required fields.", type: "error" });
      return;
    }

    const parsedYear = fields.foundedYear ? parseInt(fields.foundedYear, 10) : undefined;
    if (parsedYear !== undefined && (isNaN(parsedYear) || parsedYear > CURRENT_YEAR)) {
      setToast({ message: `Founded year must be ${CURRENT_YEAR} or earlier.`, type: "error" });
      return;
    }

    setLoading(true);
    try {
      await createCompany({
        name: fields.name,
        industry: fields.industry,
        location: fields.location,
        description: fields.description || undefined,
        size: (fields.size as CompanySize) || undefined,
        type: (fields.type as CompanyType) || undefined,
        foundedYear: parsedYear,
        website: fields.website || undefined,
        email: fields.email || undefined,
        logo: logo ?? undefined,
        // banner: banner ?? undefined,
        verificationDocuments: verificationDocuments.length
          ? verificationDocuments
          : undefined,
      });

      await getProfile();

      setToast({ message: "Company profile created successfully!", type: "success" });
      setTimeout(() => router.push("/recruiter/dashboard"), 1000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create company.";
      setToast({ message, type: "error" });
      setLoading(false);
    }
  };

  const selectClass =
    "w-full rounded-xl border border-slate/30 bg-surface/50 px-4 py-3 text-sm text-midnight outline-none transition-all placeholder:text-slate/50 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10";

  return (
    <div className="flex min-h-screen bg-surface items-center justify-center p-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={!!toast}
          onClose={closeToast}
        />
      )}

      <div className="w-full max-w-2xl bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-midnight/5 border border-slate/10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-display font-bold text-midnight mb-3">
            Set up your company
          </h1>
          <p className="text-slate">
            Tell us about your organization to personalize your Evalexa workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── Required fields ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Company Name *"
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Acme Corp"
              value={fields.name}
              onChange={(value) => handleField("name", value)}
            />

            <div className="flex flex-col gap-2">
              <label htmlFor="industry" className="text-sm font-semibold text-midnight">
                Industry *
              </label>
              <select
                id="industry"
                name="industry"
                value={fields.industry}
                onChange={handleChange}
                className={selectClass}
              >
                <option value="" disabled>Select industry</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            <FormInput
              label="Location *"
              id="location"
              name="location"
              type="text"
              placeholder="e.g. Lahore, Pakistan"
              value={fields.location}
              onChange={(value) => handleField("location", value)}
            />

            <div className="flex flex-col gap-2">
              <label htmlFor="size" className="text-sm font-semibold text-midnight">
                Company Size
              </label>
              <select
                id="size"
                name="size"
                value={fields.size}
                onChange={handleChange}
                className={selectClass}
              >
                <option value="">Select size</option>
                {COMPANY_SIZES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="type" className="text-sm font-semibold text-midnight">
                Company Type
              </label>
              <select
                id="type"
                name="type"
                value={fields.type}
                onChange={handleChange}
                className={selectClass}
              >
                <option value="">Select type</option>
                {COMPANY_TYPES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <FormInput
              label="Founded Year"
              id="foundedYear"
              name="foundedYear"
              type="number"
              placeholder={`e.g. ${CURRENT_YEAR}`}
              value={fields.foundedYear}
              onChange={(value) => handleField("foundedYear", value)}
            />
          </div>

          {/* ── Contact & web ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Website"
              id="website"
              name="website"
              type="url"
              placeholder="https://example.com"
              value={fields.website}
              onChange={(value) => handleField("website", value)}
            />

            <FormInput
              label="Company Email"
              id="email"
              name="email"
              type="email"
              placeholder="hr@example.com"
              value={fields.email}
              onChange={(value) => handleField("email", value)}
            />
          </div>

          {/* ── Description ── */}
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-sm font-semibold text-midnight">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Briefly describe what your company does..."
              value={fields.description}
              onChange={handleChange}
              className={selectClass}
            />
          </div>

          {/* ── Media uploads ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-midnight">Logo</label>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="w-full rounded-xl border border-dashed border-slate/40 bg-surface/50 px-4 py-3 text-sm text-slate hover:border-primary hover:text-primary transition-colors text-left"
              >
                {logo ? logo.name : "Choose logo image…"}
              </button>
            </div>

            {/* Banner */}
            {/* <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-midnight">Banner</label>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => bannerInputRef.current?.click()}
                className="w-full rounded-xl border border-dashed border-slate/40 bg-surface/50 px-4 py-3 text-sm text-slate hover:border-primary hover:text-primary transition-colors text-left"
              >
                {banner ? banner.name : "Choose banner image…"}
              </button>
            </div> */}
          </div>

          {/* ── Verification documents ── */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-midnight">
              Verification Documents
              <span className="ml-2 font-normal text-slate text-xs">(max 5 files, 5 MB each)</span>
            </label>
            <input
              ref={docsInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleDocsChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => docsInputRef.current?.click()}
              className="w-full rounded-xl border border-dashed border-slate/40 bg-surface/50 px-4 py-3 text-sm text-slate hover:border-primary hover:text-primary transition-colors text-left"
            >
              Attach documents…
            </button>

            {verificationDocuments.length > 0 && (
              <ul className="space-y-1 mt-1">
                {verificationDocuments.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between text-sm text-midnight bg-surface/60 rounded-lg px-3 py-2"
                  >
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeDoc(index)}
                      className="ml-3 text-slate hover:text-red-500 transition-colors shrink-0"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ── Actions ── */}
          <div className="pt-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
            <button
              type="button"
              onClick={() => router.push("/recruiter/dashboard")}
              className="w-full sm:w-auto text-slate hover:text-midnight font-medium transition-colors text-sm py-2 px-4"
            >
              Skip for now
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto rounded-xl bg-primary px-8 py-3 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/40 disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? "Creating..." : "Complete Setup"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}