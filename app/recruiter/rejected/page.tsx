export default function RejectedPage() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="font-syne text-2xl font-bold text-[#0D1B2A] mb-2">
            Rejected Candidates
          </h1>
          <p className="text-[#6B7A99]">
            Candidates who were not selected for the role
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
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="font-syne text-lg font-semibold text-[#0D1B2A] mb-2">
            Rejected Candidates
          </h3>
          <p className="text-[#6B7A99] max-w-md mx-auto">
            No rejected candidates yet
          </p>
        </div>
      </div>
    </div>
  );
}
