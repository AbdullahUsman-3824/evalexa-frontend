"use client";

import { motion } from "framer-motion";
import { Plus, Building2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Company } from "@/types/company.types";

export default function AboutSection({
  isLoading,
  company,
}: {
  isLoading: boolean;
  company: Company | null;
}) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="h-48 rounded-xl bg-white border border-gray-200 animate-pulse"></div>
    );
  }
  const getCompanyType = (type?: string) =>
    ({
      STARTUP: "Startup",
      AGENCY: "Agency",
      ENTERPRISE: "Enterprise",
      NON_PROFIT: "Non-Profit",
      GOVERNMENT: "Government",
    })[type ?? ""] ?? "";

  const details = [
    company?.type && {
      icon: Building2,
      label: "Company Type",
      value: getCompanyType(company.type),
    },
    company?.email && {
      icon: Mail,
      label: "Email",
      value: company.email,
    },
  ].filter(Boolean) as {
    icon: typeof Building2;
    label: string;
    value: string;
  }[];

  const hasDescription = !!company?.description;
  const hasDetails = details.length > 0;
  const isFullyEmpty = !hasDescription && !hasDetails;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-xl border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-syne text-lg font-semibold text-midnight">
          About the Company
        </h2>
        <button
          onClick={() => router.push("/recruiter/profile/edit")}
          className="text-primary hover:text-blue-600 text-sm font-medium transition-colors"
        >
          Edit
        </button>
      </div>

      {isFullyEmpty ? (
        <button
          onClick={() => router.push("/recruiter/profile/edit")}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-primary hover:bg-surface/50 transition-all group"
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-surface group-hover:bg-primary/10 flex items-center justify-center transition-colors">
              <Plus className="w-6 h-6 text-slate group-hover:text-primary transition-colors" />
            </div>
            <div className="text-center">
              <p className="font-medium text-midnight mb-1">
                Add company description
              </p>
              <p className="text-sm text-slate">
                Tell candidates about your company culture and mission
              </p>
            </div>
          </div>
        </button>
      ) : (
        <div className="space-y-6">
          {/* Description */}
          {hasDescription ? (
            <p
              className="text-midnight leading-relaxed"
              style={{ lineHeight: 1.8 }}
            >
              {company?.description}
            </p>
          ) : (
            <button
              onClick={() => router.push("/recruiter/profile/edit")}
              className="w-full flex items-center gap-3 border border-dashed border-gray-300 rounded-lg p-4 hover:border-primary hover:bg-surface/50 transition-all group text-left"
            >
              <div className="w-8 h-8 rounded-full bg-surface group-hover:bg-primary/10 flex items-center justify-center shrink-0 transition-colors">
                <Plus className="w-4 h-4 text-slate group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm text-slate">
                Add a description to tell candidates about your mission
              </p>
            </button>
          )}

          {/* Remaining fields (type, email) */}
          {hasDetails && (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${
                hasDescription ? "pt-4 border-t border-gray-100" : ""
              }`}
            >
              {details.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-slate" />
                  </div>
                  <div>
                    <p className="text-xs text-slate mb-0.5">{label}</p>
                    <p className="text-sm font-medium text-midnight">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
