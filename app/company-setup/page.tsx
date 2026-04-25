"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser, getProfile } from "@/lib/services/authService";
import { createCompany } from "@/lib/services/companyService";
import FormInput from "@/components/ui/FormInput";
import Toast from "@/components/ui/Toast";

type ToastState = {
  message: string;
  type: "success" | "error" | "info";
} | null;

export default function CompanySetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    companySize: "",
    location: "",
    website: "",
    description: "",
  });

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      router.push("/login");
    } else if (user.companyId) {
      router.push("/recruiter/dashboard");
    }
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleChangeValue = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const closeToast = () => setToast(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = getStoredUser();
    if (!user?.id) {
      setToast({
        message: "User session expired or invalid. Please log in again.",
        type: "error",
      });
      return;
    }

    if (
      !formData.name ||
      !formData.industry ||
      !formData.companySize ||
      !formData.location
    ) {
      setToast({
        message: "Please fill in all required fields.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      await createCompany({
        name: formData.name,
        industry: formData.industry,
        companySize: formData.companySize,
        location: formData.location,
        website: formData.website || undefined,
        description: formData.description || undefined,
      });

      // Refresh local user profile so companyId is updated
      await getProfile();

      setToast({
        message: "Company profile created successfully!",
        type: "success",
      });
      setTimeout(() => router.push("/recruiter/dashboard"), 1000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create company.";
      setToast({ message, type: "error" });
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push("/recruiter/dashboard");
  };

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
            Tell us about your organization to personalize your Evalexa
            workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Company Name *"
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Acme Corp"
              value={formData.name}
              onChange={(value) => handleChangeValue("name", value)}
            />

            <div className="flex flex-col gap-2">
              <label
                htmlFor="industry"
                className="text-sm font-semibold text-midnight"
              >
                Industry *
              </label>
              <select
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate/30 bg-surface/50 px-4 py-3 text-sm text-midnight outline-none transition-all placeholder:text-slate/50 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
              >
                <option value="" disabled>
                  Select industry
                </option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Education">Education</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="companySize"
                className="text-sm font-semibold text-midnight"
              >
                Company Size *
              </label>
              <select
                id="companySize"
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate/30 bg-surface/50 px-4 py-3 text-sm text-midnight outline-none transition-all placeholder:text-slate/50 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
              >
                <option value="" disabled>
                  Select size
                </option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="500+">500+ employees</option>
              </select>
            </div>

            <FormInput
              label="Location *"
              id="location"
              name="location"
              type="text"
              placeholder="e.g. New York, USA"
              value={formData.location}
              onChange={(value) => handleChangeValue("location", value)}
            />
          </div>

          <FormInput
            label="Website (optional)"
            id="website"
            name="website"
            type="url"
            placeholder="https://example.com"
            value={formData.website}
            onChange={(value) => handleChangeValue("website", value)}
          />

          <div className="flex flex-col gap-2">
            <label
              htmlFor="description"
              className="text-sm font-semibold text-midnight"
            >
              Description (optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Briefly describe what your company does..."
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate/30 bg-surface/50 px-4 py-3 text-sm text-midnight outline-none transition-all placeholder:text-slate/50 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
            <button
              type="button"
              onClick={handleSkip}
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
