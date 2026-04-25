"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  Bell,
  ChevronDown,
  Building2,
  Settings,
  LogOut,
} from "lucide-react";
import {
  getProfile,
  getStoredUser,
  type AuthUser,
  logoutUser,
} from "@/lib/services/authService";

interface RecruiterTopNavProps {
  onMenuClick: () => void;
}

// Page title mapping
const pageTitles: Record<string, string> = {
  "/recruiter/dashboard": "Dashboard",
  "/recruiter/analytics": "Analytics",
  "/recruiter/jobs/create": "Post a Job",
  "/recruiter/jobs": "My Job Posts",
  "/recruiter/applicants": "Applicants",
  "/recruiter/ranking": "AI Ranking",
  "/recruiter/shortlisted": "Shortlisted",
  "/recruiter/rejected": "Rejected",
  "/recruiter/interviews": "Interviews",
  "/recruiter/messages": "Messages",
  "/recruiter/hire-analytics": "Hire Analytics",
  "/recruiter/profile": "Company Profile",
  "/recruiter/settings": "Settings",
};

export default function RecruiterTopNav({ onMenuClick }: RecruiterTopNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [accountUser, setAccountUser] = useState<AuthUser | null>(() => getStoredUser());
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const pageTitle = pageTitles[pathname] || "Recruiter Portal";
  const hasUnreadNotifications = true; // Replace with actual logic

  useEffect(() => {
    void getProfile()
      .then((profile) => {
        setAccountUser(profile);
      })
      .catch(() => {
        // Keep stored session user as fallback if profile request fails.
      });
  }, []);

  const accountName = useMemo(() => {
    const nameFromEmail = accountUser?.email?.split("@")[0];
    return accountUser?.name ?? accountUser?.fullName ?? nameFromEmail ?? "User";
  }, [accountUser]);

  const accountInitials = useMemo(() => {
    const words = accountName
      .split(" ")
      .map((value) => value.trim())
      .filter(Boolean);

    if (words.length === 0) {
      return "U";
    }

    if (words.length === 1) {
      return (words[0]?.slice(0, 2) ?? "U").toUpperCase();
    }

    return `${words[0]?.charAt(0) ?? ""}${words[1]?.charAt(0) ?? ""}`.toUpperCase();
  }, [accountName]);
  const handleSignOut = async () => {
    await logoutUser();
    setShowProfileDropdown(false);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200">
      <div className="h-full flex items-center justify-between px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>

          {/* Page Title */}
          <h2 className="font-syne text-lg font-semibold text-[#0D1B2A]">
            {pageTitle}
          </h2>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-700" />
              {hasUnreadNotifications && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E63946] rounded-full" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-[#0D1B2A]">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {/* Sample notifications */}
                    <div className="p-4 hover:bg-gray-50 border-b border-gray-100 cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1E6FFF]/10 flex items-center justify-center flex-shrink-0">
                          <Bell className="w-4 h-4 text-[#1E6FFF]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#0D1B2A] font-medium">
                            New application received
                          </p>
                          <p className="text-xs text-[#6B7A99] mt-1">
                            John Doe applied for Senior Developer position
                          </p>
                          <p className="text-xs text-[#6B7A99] mt-1">
                            2 hours ago
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 hover:bg-gray-50 border-b border-gray-100 cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#00C2D1]/10 flex items-center justify-center flex-shrink-0">
                          <Bell className="w-4 h-4 text-[#00C2D1]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#0D1B2A] font-medium">
                            AI ranking completed
                          </p>
                          <p className="text-xs text-[#6B7A99] mt-1">
                            15 candidates ranked for Product Manager role
                          </p>
                          <p className="text-xs text-[#6B7A99] mt-1">
                            5 hours ago
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#00B37E]/10 flex items-center justify-center flex-shrink-0">
                          <Bell className="w-4 h-4 text-[#00B37E]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#0D1B2A] font-medium">
                            Interview scheduled
                          </p>
                          <p className="text-xs text-[#6B7A99] mt-1">
                            Interview with Sarah Johnson tomorrow at 2 PM
                          </p>
                          <p className="text-xs text-[#6B7A99] mt-1">
                            1 day ago
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border-t border-gray-200">
                    <button className="w-full text-center text-sm text-[#1E6FFF] hover:text-[#1557D8] font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Avatar Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1E6FFF] to-[#00C2D1] flex items-center justify-center">
                <span className="text-white font-semibold text-xs">
                  {accountInitials}
                </span>
              </div>

              {/* Company Name (hidden on small screens) */}
              <span className="hidden md:block text-sm font-medium text-[#0D1B2A]">
                {accountName}
              </span>

              {/* Dropdown Icon */}
              <ChevronDown
                className={`hidden md:block w-4 h-4 text-gray-500 transition-transform ${
                  showProfileDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Profile Dropdown */}
            {showProfileDropdown && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfileDropdown(false)}
                />

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                  <Link
                    href="/recruiter/profile"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    <Building2 className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-[#0D1B2A]">
                      Company Profile
                    </span>
                  </Link>
                  <Link
                    href="/recruiter/settings"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    <Settings className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-[#0D1B2A]">Settings</span>
                  </Link>
                  <div className="border-t border-gray-200 my-1" />
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4 text-[#E63946]" />
                    <span className="text-sm text-[#E63946]">Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
