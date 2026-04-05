export default function JobPostsPage() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-syne text-2xl font-bold text-[#0D1B2A] mb-2">
              My Job Posts
            </h1>
            <p className="text-[#6B7A99]">
              Manage your active and archived job postings
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1E6FFF] text-white rounded-lg hover:bg-[#1557D8] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Post a Job
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button className="px-4 py-2 font-medium text-[#1E6FFF] border-b-2 border-[#1E6FFF]">
            Active (24)
          </button>
          <button className="px-4 py-2 font-medium text-[#6B7A99] hover:text-[#0D1B2A]">
            Draft (3)
          </button>
          <button className="px-4 py-2 font-medium text-[#6B7A99] hover:text-[#0D1B2A]">
            Closed (12)
          </button>
        </div>

        {/* Job cards placeholder */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-syne text-lg font-semibold text-[#0D1B2A] mb-2">
                    Senior Full Stack Developer
                  </h3>
                  <div className="flex flex-wrap gap-2 text-sm text-[#6B7A99]">
                    <span>Remote</span>
                    <span>•</span>
                    <span>Full-time</span>
                    <span>•</span>
                    <span>$120k - $180k</span>
                  </div>
                </div>
                <span className="px-3 py-1 bg-[#00B37E]/10 text-[#00B37E] text-xs font-semibold rounded-full">
                  Active
                </span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#6B7A99]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="text-[#0D1B2A] font-medium">45 applicants</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#6B7A99]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="text-[#6B7A99]">1.2k views</span>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-[#6B7A99]">Posted 5 days ago</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
