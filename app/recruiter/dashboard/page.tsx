export default function RecruiterDashboardPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-midnight mb-2">
          Recruiter Dashboard
        </h1>
        <p className="text-slate">
          Welcome to your recruiter dashboard. Manage jobs, view applicants, and
          more.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-slate text-sm font-medium mb-2">Active Jobs</h3>
          <p className="text-3xl font-bold text-midnight">12</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-slate text-sm font-medium mb-2">
            Total Applicants
          </h3>
          <p className="text-3xl font-bold text-midnight">48</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-slate text-sm font-medium mb-2">
            Interviews Scheduled
          </h3>
          <p className="text-3xl font-bold text-midnight">8</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-midnight mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="bg-primary text-white px-4 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            Post New Job
          </button>
          <button className="bg-surface text-midnight px-4 py-3 rounded-lg font-semibold hover:bg-slate/10 transition-colors border border-slate/20">
            View All Applicants
          </button>
        </div>
      </div>
    </div>
  );
}
