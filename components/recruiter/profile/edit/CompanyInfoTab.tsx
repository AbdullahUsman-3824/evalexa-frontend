"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { X, Upload } from "lucide-react";
import type { CompanySize, CompanyType } from "@/types/company.types";

// ── Shared type — can be moved to a shared types file and imported in both ──
export interface CompanyFormData {
  name: string;
  industry: string;
  size: CompanySize | null;
  foundedYear: number | null;
  type: CompanyType | null;
  location: string;
  website: string | null;
  email: string | null;
  description: string | null;
}

interface CompanyInfoTabProps {
  data: CompanyFormData;
  onChange: (patch: Partial<CompanyFormData>) => void;
  verificationDocuments: File[];
  onVerificationDocumentsChange: (files: File[]) => void;
}

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
  "Finance",
  "Healthcare",
  "Education",
  "Retail",
  "Manufacturing",
  "Media & Entertainment",
  "Real Estate",
  "Transportation",
  "Consulting",
  "Other",
];

const CURRENT_YEAR = new Date().getFullYear();

const inputClass =
  "w-full px-4 py-2.5 bg-white text-midnight border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all";

export default function CompanyInfoTab({
  data,
  onChange,
  verificationDocuments,
  onVerificationDocumentsChange,
}: CompanyInfoTabProps) {
  const docsInputRef = useRef<HTMLInputElement>(null);

  const handleDocsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files ?? []);
    const combined = [...verificationDocuments, ...incoming];
    if (combined.length > 5) {
      // Silently cap at 5 — parent page surfaces this error if needed
      onVerificationDocumentsChange(combined.slice(0, 5));
    } else {
      onVerificationDocumentsChange(combined);
    }
    e.target.value = "";
  };

  const removeDoc = (index: number) => {
    onVerificationDocumentsChange(
      verificationDocuments.filter((_, i) => i !== index),
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Company Name */}
      <div>
        <label className="block text-sm font-medium text-midnight mb-2">
          Company Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className={inputClass}
          placeholder="Enter company name"
        />
      </div>

      {/* Industry */}
      <div>
        <label className="block text-sm font-medium text-midnight mb-2">
          Industry <span className="text-danger">*</span>
        </label>
        <select
          value={data.industry}
          onChange={(e) => onChange({ industry: e.target.value })}
          className={inputClass}
        >
          <option value="">Select industry</option>
          {INDUSTRIES.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>
      </div>

      {/* Size + Founded Year */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-midnight mb-2">
            Company Size
          </label>
          <select
            value={data.size ?? ""}
            onChange={(e) =>
              onChange({ size: (e.target.value as CompanySize) || null })
            }
            className={inputClass}
          >
            <option value="">Select size</option>
            {COMPANY_SIZES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-midnight mb-2">
            Founded Year
          </label>
          <input
            type="number"
            value={data.foundedYear ?? ""}
            min={1800}
            max={CURRENT_YEAR}
            onChange={(e) => {
              const val = e.target.value;
              onChange({
                foundedYear: val ? parseInt(val, 10) : null,
              });
            }}
            className={inputClass}
            placeholder={String(CURRENT_YEAR)}
          />
        </div>
      </div>

      {/* Company Type */}
      <div>
        <label className="block text-sm font-medium text-midnight mb-3">
          Company Type
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {COMPANY_TYPES.map(({ value, label }) => {
            const selected = data.type === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => onChange({ type: selected ? null : value })}
                className={`relative flex items-center justify-center p-3 border-2 rounded-lg transition-all text-sm font-medium ${
                  selected
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-300 text-slate hover:border-primary/50 hover:text-midnight"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-midnight mb-2">
          Headquarters Location <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          value={data.location}
          onChange={(e) => onChange({ location: e.target.value })}
          className={inputClass}
          placeholder="e.g. Lahore, Pakistan"
        />
      </div>

      {/* Website + Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-midnight mb-2">
            Website URL
          </label>
          <input
            type="url"
            value={data.website ?? ""}
            onChange={(e) => onChange({ website: e.target.value || null })}
            className={inputClass}
            placeholder="https://example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-midnight mb-2">
            Company Email
          </label>
          <input
            type="email"
            value={data.email ?? ""}
            onChange={(e) => onChange({ email: e.target.value || null })}
            className={inputClass}
            placeholder="hr@example.com"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-midnight mb-2">
          Company Description
        </label>
        <textarea
          value={data.description ?? ""}
          onChange={(e) => onChange({ description: e.target.value || null })}
          rows={5}
          maxLength={500}
          className={`${inputClass} resize-none`}
          placeholder="Tell candidates about your company culture, mission, and values..."
        />
        <div className="flex justify-between items-center mt-1.5">
          <p className="text-xs text-slate">
            Help candidates understand what makes your company unique.
          </p>
          <p className="text-xs text-slate">
            {(data.description ?? "").length}/500
          </p>
        </div>
      </div>

      {/* Verification Documents */}
      <div>
        <label className="block text-sm font-medium text-midnight mb-1">
          Verification Documents
        </label>
        <p className="text-xs text-slate mb-3">
          Business license, incorporation certificate, or tax docs. PDF, PNG, or
          JPG — max 5 MB each, up to 5 files.
        </p>

        {/* Uploaded list */}
        {verificationDocuments.length > 0 && (
          <ul className="space-y-2 mb-3">
            {verificationDocuments.map((file, i) => (
              <li
                key={i}
                className="flex items-center justify-between bg-surface border border-gray-200 rounded-lg px-4 py-2.5 text-sm"
              >
                <span className="text-midnight truncate">{file.name}</span>
                <div className="flex items-center gap-3 ml-3 flex-shrink-0">
                  <span className="text-slate text-xs">
                    {(file.size / 1024).toFixed(0)} KB
                  </span>
                  <button
                    type="button"
                    onClick={() => removeDoc(i)}
                    className="text-slate hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {verificationDocuments.length < 5 && (
          <div
            onClick={() => docsInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 hover:border-primary rounded-xl p-6 bg-surface transition-colors cursor-pointer group"
          >
            <input
              ref={docsInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="hidden"
              onChange={handleDocsChange}
            />
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary/5 transition-colors">
                <Upload className="w-5 h-5 text-slate group-hover:text-primary transition-colors" />
              </div>
              <div>
                <p className="text-sm font-medium text-midnight">
                  Click to attach documents
                </p>
                <p className="text-xs text-slate">
                  {5 - verificationDocuments.length} slot
                  {5 - verificationDocuments.length !== 1 ? "s" : ""} remaining
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
