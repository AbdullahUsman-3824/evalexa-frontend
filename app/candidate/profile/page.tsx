import ProfileHeader from "@/components/candidate/profile/view/ProfileHeader";
import AboutSection from "@/components/candidate/profile/view/AboutSection";
import SkillsSection from "@/components/candidate/profile/view/SkillsSection";
import ExperienceSection from "@/components/candidate/profile/view/ExperienceSection";
import EducationSection from "@/components/candidate/profile/view/EducationSection";
import CertificationsSection from "@/components/candidate/profile/view/CertificationsSection";
import PortfolioSection from "@/components/candidate/profile/view/PortfolioSection";
import ResumeSection from "@/components/candidate/profile/view/ResumeSection";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <ProfileHeader />

      {/* Two column layout for sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          <AboutSection />
          <ExperienceSection />
          <EducationSection />
          <CertificationsSection />
        </div>

        {/* Right column - 1/3 width */}
        <div className="space-y-6">
          <SkillsSection />
          <PortfolioSection />
          <ResumeSection />
        </div>
      </div>
    </div>
  );
}
