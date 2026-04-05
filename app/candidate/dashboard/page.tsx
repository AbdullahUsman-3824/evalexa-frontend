import WelcomeBanner from '@/components/candidate/dashboard/WelcomeBanner';
import StatsRow from '@/components/candidate/dashboard/StatsRow';
import ProfileCompletion from '@/components/candidate/dashboard/ProfileCompletion';
import AIInsightsTeaser from '@/components/candidate/dashboard/AIInsightsTeaser';
import RecommendedJobs from '@/components/candidate/dashboard/RecommendedJobs';
import ActivityFeed from '@/components/candidate/dashboard/ActivityFeed';
import InterviewWidget from '@/components/candidate/dashboard/InterviewWidget';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* Stats Row */}
      <StatsRow />

      {/* Two column layout for Profile Completion and AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfileCompletion />
        <AIInsightsTeaser />
      </div>

      {/* Recommended Jobs */}
      <RecommendedJobs />

      {/* Two column layout for Activity Feed and Interview Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed />
        <InterviewWidget />
      </div>
    </div>
  );
}
