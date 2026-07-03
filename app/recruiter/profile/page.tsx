"use client";

import CompanyHeader from "@/components/recruiter/profile/view/CompanyHeader";
import AboutSection from "@/components/recruiter/profile/view/AboutSection";
import RecruiterDetails from "@/components/recruiter/profile/view/RecruiterDetails";
// import ActiveJobsPreview from "@/components/recruiter/profile/view/ActiveJobsPreview";
import { useEffect, useState } from "react";
import { getCompanies, Company } from "@/lib/services/company-service";
import { getJobs } from "@/lib/services/jobs-service";

export default function RecruiterProfile() {
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalHires: 0,
    avgResponseTime: "N/A",
    rating: 0,
  });

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const companies = await getCompanies();
        const fetchedCompany = companies[0] ?? null;

        setCompany(fetchedCompany);

        if (fetchedCompany) {
          const jobs = await getJobs({ status: "OPEN" });

          const activeJobsCount = jobs.filter(
            (job) => String(job.companyId) === String(fetchedCompany.id),
          ).length;

          setStats((prev) => ({
            ...prev,
            activeJobs: activeJobsCount,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch company", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompany();
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-[1400px] mx-auto p-6 space-y-6">
        {/* Company Header */}
        <CompanyHeader isLoading={isLoading} company={company} stats={stats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2 cols */}
          <div className="lg:col-span-2 space-y-6">
            <AboutSection isLoading={isLoading} company={company} />
            {/* <ActiveJobsPreview /> */}
          </div>

          {/* Right Column - 1 col */}
          <div className="space-y-6">
            <RecruiterDetails />
            {/* <BrandingSection /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
