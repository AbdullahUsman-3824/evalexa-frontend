export default function HireAnalyticsPage() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="font-syne text-2xl font-bold text-[#0D1B2A] mb-2">
            Hire Analytics
          </h1>
          <p className="text-[#6B7A99]">
            Track your hiring funnel and time-to-hire metrics
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
              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
            />
          </svg>
          <h3 className="font-syne text-lg font-semibold text-[#0D1B2A] mb-2">
            Hiring Analytics
          </h3>
          <p className="text-[#6B7A99] max-w-md mx-auto">
            Detailed hiring analytics coming soon
          </p>
        </div>
      </div>
    </div>
  );
}
