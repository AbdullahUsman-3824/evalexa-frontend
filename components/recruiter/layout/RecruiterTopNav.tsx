"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  Bell,
  ChevronDown,
  Building2,
  Settings,
  LogOut,
  Plus,
} from "lucide-react";
import {
  getProfile,
  getStoredUser,
  type AuthUser,
  logoutUser,
} from "@/lib/services/auth-service";
import { getCompanies, type Company } from "@/lib/services/company-service";

interface RecruiterTopNavProps {
  onMenuClick: () => void;
}

const pageTitles: Record<string, string> = {
  "/recruiter/dashboard": "Dashboard",
  "/recruiter/analytics": "Analytics",
  "/recruiter/jobs/post": "Post a Job",
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
  const [accountUser, setAccountUser] = useState<AuthUser | null>(() =>
    getStoredUser(),
  );
  const [company, setCompany] = useState<Company | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [logoErrorSrc, setLogoErrorSrc] = useState<string | null>(null);

  const pageTitle = pageTitles[pathname] ?? "Recruiter Portal";
  const hasUnreadNotifications = true;

  useEffect(() => {
    void getProfile()
      .then((profile) => setAccountUser(profile))
      .catch(() => {});

    void getCompanies()
      .then((companies) => {
        if (companies.length > 0) {
          setCompany(companies[0] ?? null);
        }
      })
      .catch(() => {});
  }, []);

  const accountName = useMemo(() => {
    const nameFromEmail = accountUser?.email?.split("@")[0];
    return (
      accountUser?.fullName ?? accountUser?.name ?? nameFromEmail ?? "User"
    );
  }, [accountUser]);

  const accountInitials = useMemo(() => {
    const words = accountName
      .split(" ")
      .map((v) => v.trim())
      .filter(Boolean);
    if (words.length === 0) return "U";
    if (words.length === 1) return (words[0]?.slice(0, 2) ?? "U").toUpperCase();
    return `${words[0]?.charAt(0) ?? ""}${words[1]?.charAt(0) ?? ""}`.toUpperCase();
  }, [accountName]);

  const handleSignOut = async () => {
    await logoutUser();
    setShowProfileDropdown(false);
    router.push("/login");
  };

  const logoSrc = company?.logo ?? null;
  const showLogo = !!logoSrc && logoErrorSrc !== logoSrc;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200">
      <div className="h-full flex items-center justify-between px-6">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          <h2 className="font-syne text-lg font-semibold text-midnight">
            {pageTitle}
          </h2>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-700" />
              {hasUnreadNotifications && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-syne font-semibold text-midnight text-sm">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
                    {[
                      {
                        color: "primary",
                        title: "New application received",
                        body: "John Doe applied for Senior Developer",
                        time: "2 hours ago",
                      },
                      {
                        color: "cyan",
                        title: "AI ranking completed",
                        body: "15 candidates ranked for Product Manager",
                        time: "5 hours ago",
                      },
                      {
                        color: "green",
                        title: "Interview scheduled",
                        body: "Sarah Johnson — tomorrow at 2 PM",
                        time: "1 day ago",
                      },
                    ].map(({ color, title, body, time }) => (
                      <div
                        key={title}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            color === "primary"
                              ? "bg-primary/10"
                              : color === "cyan"
                                ? "bg-cyan/10"
                                : "bg-green-500/10"
                          }`}
                        >
                          <Bell
                            className={`w-4 h-4 ${
                              color === "primary"
                                ? "text-primary"
                                : color === "cyan"
                                  ? "text-cyan"
                                  : "text-green-500"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-midnight truncate">
                            {title}
                          </p>
                          <p className="text-xs text-slate mt-0.5 truncate">
                            {body}
                          </p>
                          <p className="text-xs text-slate/60 mt-0.5">{time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-100 text-center">
                    <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
                      View all notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Avatar + company dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-xl transition-colors"
            >
              {/* Avatar: company logo or initials */}
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                {showLogo ? (
                  <Image
                    src={logoSrc!}
                    alt={company!.name}
                    width={32}
                    height={32}
                    unoptimized
                    className="w-full h-full object-cover"
                    onError={() => setLogoErrorSrc(logoSrc)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-cyan flex items-center justify-center">
                    <span className="text-white font-semibold text-xs">
                      {company
                        ? company.name.slice(0, 2).toUpperCase()
                        : accountInitials}
                    </span>
                  </div>
                )}
              </div>

              {/* Name area */}
              <div className="hidden md:flex flex-col items-start leading-tight">
                {company ? (
                  <>
                    <span className="text-sm font-semibold text-midnight">
                      {company.name}
                    </span>
                    {company.industry && (
                      <span className="text-xs text-slate">
                        {company.industry}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span className="text-sm font-semibold text-midnight">
                      {accountName.split(" ")[0]}
                    </span>
                    <span className="text-xs text-slate/60">
                      No company yet
                    </span>
                  </>
                )}
              </div>

              <ChevronDown
                className={`hidden md:block w-4 h-4 text-slate/60 transition-transform ${
                  showProfileDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown */}
            {showProfileDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfileDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-gray-200 z-50 py-1 overflow-hidden">
                  {/* Company header */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-cyan flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-xs">
                          {accountInitials}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-midnight">
                          {accountName}
                        </p>
                        <p
                          className="truncate text-xs text-slate/60"
                          title={accountUser?.email}
                        >
                          {accountUser?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  {company ? (
                    <Link
                      href="/recruiter/profile"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <Building2 className="w-4 h-4 text-slate" />
                      <span className="text-sm text-midnight">
                        Company Profile
                      </span>
                    </Link>
                  ) : (
                    <Link
                      href="/company-setup"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary/5 transition-colors group"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Plus className="w-2.5 h-2.5 text-primary" />
                      </div>
                      <span className="text-sm text-primary font-medium">
                        Set up company
                      </span>
                    </Link>
                  )}

                  <Link
                    href="/recruiter/settings"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    <Settings className="w-4 h-4 text-slate" />
                    <span className="text-sm text-midnight">Settings</span>
                  </Link>

                  <div className="border-t border-gray-100 my-1" />

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-500">Sign out</span>
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
