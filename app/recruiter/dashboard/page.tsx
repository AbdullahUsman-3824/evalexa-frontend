import WelcomeBanner from "@/components/recruiter/dashboard/WelcomeBanner";
import StatsRow from "@/components/recruiter/dashboard/StatsRow";
import ActiveJobsOverview from "@/components/recruiter/dashboard/ActiveJobsOverview";
import RecentApplications from "@/components/recruiter/dashboard/RecentApplications";
import HiringFunnel from "@/components/recruiter/dashboard/HiringFunnel";
import BottomRow from "@/components/recruiter/dashboard/BottomRow";

export default function RecruiterDashboard() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
        {/* Welcome Banner */}
        <WelcomeBanner />

        {/* Stats Row */}
        <StatsRow />

        {/* Active Jobs & Recent Applications */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ActiveJobsOverview />
          <RecentApplications />
        </div>

        {/* Hiring Funnel */}
        <HiringFunnel />

        {/* Bottom Row - Top Jobs & Interviews */}
        <BottomRow />
      </div>
    </div>
  );
}
