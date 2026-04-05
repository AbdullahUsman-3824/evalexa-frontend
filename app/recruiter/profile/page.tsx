import CompanyHeader from "@/components/recruiter/profile/view/CompanyHeader";
import AboutSection from "@/components/recruiter/profile/view/AboutSection";
import RecruiterDetails from "@/components/recruiter/profile/view/RecruiterDetails";
import BrandingSection from "@/components/recruiter/profile/view/BrandingSection";
import ActiveJobsPreview from "@/components/recruiter/profile/view/ActiveJobsPreview";

export default function RecruiterProfile() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-[1400px] mx-auto p-6 space-y-6">
        {/* Company Header */}
        <CompanyHeader />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2 cols */}
          <div className="lg:col-span-2 space-y-6">
            <AboutSection />
            <ActiveJobsPreview />
          </div>

          {/* Right Column - 1 col */}
          <div className="space-y-6">
            <RecruiterDetails />
            <BrandingSection />
          </div>
        </div>
      </div>
    </div>
  );
}
