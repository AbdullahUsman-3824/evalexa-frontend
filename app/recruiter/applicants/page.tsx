export default function ApplicantsPage() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="font-syne text-2xl font-bold text-[#0D1B2A] mb-2">
            All Applicants
          </h1>
          <p className="text-[#6B7A99]">
            View and manage all job applications
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <h3 className="font-syne text-lg font-semibold text-[#0D1B2A] mb-2">
            Applicants Management
          </h3>
          <p className="text-[#6B7A99] max-w-md mx-auto">
            Applicant tracking features coming soon
          </p>
        </div>
      </div>
    </div>
  );
}
