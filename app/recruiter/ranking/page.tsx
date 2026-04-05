export default function RankingPage() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="font-syne text-2xl font-bold text-[#0D1B2A] mb-2">
            AI Candidate Ranking
          </h1>
          <p className="text-[#6B7A99]">
            AI-powered ranking of candidates based on job requirements
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#00C2D1]/5 to-[#1E6FFF]/5 rounded-xl border border-[#00C2D1]/20 p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-[#00C2D1]/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-[#00C2D1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="font-syne text-lg font-semibold text-[#0D1B2A] mb-2">
            AI Ranking Engine
          </h3>
          <p className="text-[#6B7A99] max-w-md mx-auto mb-4">
            Our AI analyzes resumes, skills, experience, and job requirements to automatically rank candidates
          </p>
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#00C2D1] text-white rounded-lg text-sm font-semibold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI Feature
          </span>
        </div>
      </div>
    </div>
  );
}
