export default function PostJobPage() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="font-syne text-2xl font-bold text-[#0D1B2A] mb-2">
            Post a New Job
          </h1>
          <p className="text-[#6B7A99]">
            Create a job posting to attract the best candidates
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <form className="space-y-6">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-[#0D1B2A] mb-2">
                Job Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Full Stack Developer"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6FFF] focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Location & Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#0D1B2A] mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco, CA"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6FFF] focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0D1B2A] mb-2">
                  Job Type *
                </label>
                <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6FFF] focus:border-transparent outline-none transition-all">
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </div>
            </div>

            {/* Salary Range */}
            <div>
              <label className="block text-sm font-medium text-[#0D1B2A] mb-2">
                Salary Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Min"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6FFF] focus:border-transparent outline-none transition-all"
                />
                <input
                  type="text"
                  placeholder="Max"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6FFF] focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#0D1B2A] mb-2">
                Job Description *
              </label>
              <textarea
                rows={8}
                placeholder="Describe the role, responsibilities, and requirements..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6FFF] focus:border-transparent outline-none transition-all resize-none"
              />
            </div>

            {/* AI Features Callout */}
            <div className="bg-[#00C2D1]/5 border border-[#00C2D1]/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#00C2D1]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#00C2D1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-[#0D1B2A] mb-1">
                    AI-Powered Candidate Ranking
                  </h4>
                  <p className="text-sm text-[#6B7A99]">
                    Once published, our AI will automatically rank incoming applications based on relevance, skills match, and experience.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#1E6FFF] text-white rounded-lg hover:bg-[#1557D8] transition-colors font-medium"
              >
                Publish Job
              </button>
              <button
                type="button"
                className="px-6 py-2.5 border border-gray-300 text-[#0D1B2A] rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Save as Draft
              </button>
              <button
                type="button"
                className="px-6 py-2.5 text-[#6B7A99] hover:text-[#0D1B2A] transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
