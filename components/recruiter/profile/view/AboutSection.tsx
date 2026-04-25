"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { getCompanies, Company } from "@/lib/services/companyService";

export default function AboutSection() {
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const companies = await getCompanies();
        setCompany(companies[0] ?? null);
      } catch (error) {
        console.error("Failed to fetch company", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompany();
  }, []);
  const cultureTags = [
    "Remote Friendly",
    "Fast Growth",
    "Work-Life Balance",
    "Innovative Culture",
    "Diverse Team",
    "Competitive Benefits",
  ];

  if (isLoading) {
    return (
      <div className="h-48 rounded-xl bg-white border border-gray-200 animate-pulse"></div>
    );
  }

  const isEmpty = !company?.description;

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

      {isEmpty ? (
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
          <p
            className="text-midnight leading-relaxed"
            style={{ lineHeight: 1.8 }}
          >
            {company?.description}
          </p>

          {/* Culture Tags */}
          {cultureTags.length > 0 && (
            <div>
              <h3 className="font-semibold text-midnight text-sm mb-3">
                Company Culture
              </h3>
              <div className="flex flex-wrap gap-2">
                {cultureTags.map((tag, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="px-3 py-1.5 bg-gray-100 text-slate text-sm font-medium rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
