export default function InterviewsPage() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="font-syne text-2xl font-bold text-[#0D1B2A] mb-2">
            Interviews
          </h1>
          <p className="text-[#6B7A99]">
            Schedule and manage candidate interviews
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <svg
            className="w-16 h-16 text-[#6B7A99] mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="font-syne text-lg font-semibold text-[#0D1B2A] mb-2">
            Interview Scheduler
          </h3>
          <p className="text-[#6B7A99] max-w-md mx-auto">
            Interview scheduling features coming soon
          </p>
        </div>
      </div>
    </div>
  );
}
