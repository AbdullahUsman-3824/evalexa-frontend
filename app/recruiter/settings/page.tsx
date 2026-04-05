export default function RecruiterSettingsPage() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="font-syne text-2xl font-bold text-[#0D1B2A] mb-2">
            Settings
          </h1>
          <p className="text-[#6B7A99]">
            Manage your account preferences and notifications
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-syne text-lg font-semibold text-[#0D1B2A] mb-4">
              Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-[#0D1B2A]">New Applications</p>
                  <p className="text-xs text-[#6B7A99] mt-1">
                    Get notified when someone applies to your job posts
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1E6FFF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E6FFF]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-[#0D1B2A]">AI Ranking Complete</p>
                  <p className="text-xs text-[#6B7A99] mt-1">
                    Get notified when AI finishes ranking candidates
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1E6FFF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E6FFF]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-[#0D1B2A]">Interview Reminders</p>
                  <p className="text-xs text-[#6B7A99] mt-1">
                    Get reminders for upcoming interviews
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1E6FFF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E6FFF]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Account */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-syne text-lg font-semibold text-[#0D1B2A] mb-4">
              Account
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0D1B2A] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="recruiter@techcorp.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6FFF] focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0D1B2A] mb-2">
                  Change Password
                </label>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  Update Password
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button className="px-6 py-2.5 bg-[#1E6FFF] text-white rounded-lg hover:bg-[#1557D8] transition-colors font-medium">
              Save Changes
            </button>
            <button className="px-6 py-2.5 border border-gray-300 text-[#0D1B2A] rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
