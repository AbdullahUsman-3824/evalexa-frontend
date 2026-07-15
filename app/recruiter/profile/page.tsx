"use client";

import CompanyHeader from "@/components/recruiter/profile/view/CompanyHeader";
import AboutSection from "@/components/recruiter/profile/view/AboutSection";
import RecruiterDetails from "@/components/recruiter/profile/view/RecruiterDetails";
// import ActiveJobsPreview from "@/components/recruiter/profile/view/ActiveJobsPreview";
import {
  useGetCompaniesQuery,
  useGetCompanyStatsQuery,
} from "@/store/api/companyApi";

export default function RecruiterProfile() {
  const { data: companies, isLoading: isCompanyLoading } =
    useGetCompaniesQuery();

  const company = companies?.[0] ?? null;
  const { data: stats, isLoading: isStatsLoading } = useGetCompanyStatsQuery(
    company?.id ?? "",
    { skip: !company?.id },
  );

  const isLoading = isCompanyLoading || isStatsLoading;

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
