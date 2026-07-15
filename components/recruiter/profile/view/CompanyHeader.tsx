"use client";

import { motion } from "framer-motion";
import {
  Globe,
  MapPin,
  Edit,
  Eye,
  CheckCircle,
  Briefcase,
  Users,
  Clock,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Company, CompanyStats } from "@/types/company.types";
import Image from "next/image";

export default function CompanyHeader({
  isLoading,
  company,
  stats,
}: {
  isLoading: boolean;
  company: Company | null;
  stats?: CompanyStats;
}) {
  const router = useRouter();
  const [isHoveringLogo, setIsHoveringLogo] = useState(false);

  if (isLoading) {
    return <div className="h-64 rounded-2xl bg-midnight/5 animate-pulse"></div>;
  }

  if (!company) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm text-center">
        <h2 className="text-xl font-bold text-midnight mb-4">
          No Company Profile
        </h2>
        <p className="text-slate mb-6">
          You haven&apos;t set up a company profile yet.
        </p>
        <button
          onClick={() => router.push("/company-setup")}
          className="px-5 py-2.5 bg-primary text-white rounded-lg font-medium"
        >
          Set Up Company Profile
        </button>
      </div>
    );
  }

  const getCompanySize = (size?: string) =>
    ({
      STARTUP_1_10: "1-10",
      SMALL_11_50: "11-50",
      MEDIUM_51_200: "51-200",
      LARGE_201_500: "201-500",
      ENTERPRISE_500_PLUS: "500+",
    })[size ?? ""] ?? "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-midnight to-[#1A2E45] p-8"
    >
      <div className="relative z-10">
        {/* Top Section - Company Info & Actions */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-8">
          {/* Left - Company Info */}
          <div className="flex items-start gap-6">
            {/* Company Logo */}
            <div
              className="relative cursor-pointer"
              onClick={() =>
                router.push("/recruiter/profile/edit?tab=branding")
              }
              onMouseEnter={() => setIsHoveringLogo(true)}
              onMouseLeave={() => setIsHoveringLogo(false)}
            >
              {company.logo ? (
                <Image
                  src={company.logo}
                  alt={`${company.name} Logo`}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-cyan flex items-center justify-center">
                  <span className="text-white font-syne font-bold text-2xl uppercase">
                    {company.name.substring(0, 2)}
                  </span>
                </div>
              )}

              {/* Upload Overlay */}
              {isHoveringLogo && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center"
                >
                  <Edit className="w-5 h-5 text-white" />
                </motion.div>
              )}
            </div>

            {/* Company Details */}
            <div>
              <h1 className="font-syne text-white text-3xl font-semibold mb-2">
                {company.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-cyan/20 border border-cyan/40 text-cyan text-xs font-medium rounded-full">
                  {company.industry}
                </span>

                {company.verificationStatus === "VERIFIED" && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-success/20 border border-success/40 text-success text-xs font-medium rounded-full">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Verified Company</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-slate">
                  {company.foundedYear && `Established ${company.foundedYear}`}

                  {company.foundedYear && company.size && " · "}

                  {company.size && `${getCompanySize(company.size)} employees`}
                </p>

                <div className="flex items-center gap-4">
                  {company.website && (
                    <a
                      href={
                        company.website.startsWith("http")
                          ? company.website
                          : `https://${company.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-cyan hover:text-cyan/80 transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      {company.website.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                  {company.location && (
                    <span className="flex items-center gap-1.5 text-slate">
                      <MapPin className="w-4 h-4" />
                      {company.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right - Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.push("/recruiter/profile/edit")}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/80 text-midnight rounded-lg font-medium text-sm transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
            <button
              onClick={() =>
                window.open(`/companies/${company.slug}`, "_blank")
              }
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg font-medium text-sm transition-colors"
            >
              <Eye className="w-4 h-4" />
              Preview Public Profile
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <p className="text-white text-2xl font-bold mb-1">
              {stats?.activeJobs}
            </p>
            <p className="text-slate text-xs">Active Jobs</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-5 h-5 text-success" />
            </div>
            <p className="text-white text-2xl font-bold mb-1">
              {stats?.totalHires}
            </p>
            <p className="text-slate text-xs">Total Hires</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-cyan" />
            </div>
            <p className="text-white text-2xl font-bold mb-1">
              {stats?.avgResponseTimeHours}
            </p>
            <p className="text-slate text-xs">Avg Response Time</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            </div>
            <p className="text-white text-2xl font-bold mb-1">
              {stats?.candidateRating}
            </p>
            <p className="text-slate text-xs">Candidate Rating</p>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan rounded-full blur-3xl" />
      </div>
    </motion.div>
  );
}
