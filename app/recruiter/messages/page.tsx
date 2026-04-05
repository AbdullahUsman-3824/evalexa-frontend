export default function MessagesPage() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="font-syne text-2xl font-bold text-[#0D1B2A] mb-2">
            Messages
          </h1>
          <p className="text-[#6B7A99]">
            Communicate with candidates and team members
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
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <h3 className="font-syne text-lg font-semibold text-[#0D1B2A] mb-2">
            Messaging Center
          </h3>
          <p className="text-[#6B7A99] max-w-md mx-auto">
            Messaging features coming soon
          </p>
        </div>
      </div>
    </div>
  );
}
