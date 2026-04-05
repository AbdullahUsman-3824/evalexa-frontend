"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  BarChart2,
  PlusCircle,
  Briefcase,
  Users,
  Sparkles,
  Star,
  XCircle,
  CalendarCheck,
  MessageSquare,
  PieChart,
  Building2,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  special?: boolean;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    label: "OVERVIEW",
    items: [
      {
        label: "Dashboard",
        href: "/recruiter/dashboard",
        icon: LayoutDashboard,
      },
      { label: "Analytics", href: "/recruiter/analytics", icon: BarChart2 },
    ],
  },
  {
    label: "JOBS",
    items: [
      {
        label: "Post a Job",
        href: "/recruiter/jobs/create",
        icon: PlusCircle,
        special: true,
      },
      { label: "My Job Posts", href: "/recruiter/jobs", icon: Briefcase },
      { label: "Applicants", href: "/recruiter/applicants", icon: Users },
    ],
  },
  {
    label: "CANDIDATES",
    items: [
      {
        label: "AI Ranking",
        href: "/recruiter/ranking",
        icon: Sparkles,
        badge: "AI",
      },
      { label: "Shortlisted", href: "/recruiter/shortlisted", icon: Star },
      { label: "Rejected", href: "/recruiter/rejected", icon: XCircle },
    ],
  },
  {
    label: "HIRING",
    items: [
      {
        label: "Interviews",
        href: "/recruiter/interviews",
        icon: CalendarCheck,
      },
      {
        label: "Messages",
        href: "/recruiter/messages",
        icon: MessageSquare,
        badge: "3",
      },
      {
        label: "Hire Analytics",
        href: "/recruiter/hire-analytics",
        icon: PieChart,
      },
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      { label: "Company Profile", href: "/recruiter/profile", icon: Building2 },
      { label: "Settings", href: "/recruiter/settings", icon: Settings },
    ],
  },
];

interface RecruiterSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function RecruiterSidebar({
  isOpen = true,
  onClose,
}: RecruiterSidebarProps) {
  const pathname = usePathname();
  const [showLogout, setShowLogout] = useState(false);

  // Mock company data - replace with actual data from auth context
  const company = {
    name: "TechCorp Inc.",
    initials: "TC",
    role: "Recruiter",
  };

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen w-[240px] bg-[#0D1B2A] z-50
          flex flex-col transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo Section */}
        <div className="flex-shrink-0 px-6 py-6 border-b border-white/10">
          <Link href="/recruiter/dashboard" className="block">
            <h1 className="font-syne font-bold text-xl mb-2">
              <span className="text-white">Eval</span>
              <span className="text-[#1E6FFF]">exa</span>
            </h1>
            <div className="inline-flex items-center px-2 py-1 rounded-full border border-[#00C2D1] bg-[#00C2D1]/10">
              <span className="text-[#00C2D1] text-[10px] font-medium tracking-wide">
                RECRUITER PORTAL
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {navSections.map((section, sectionIdx) => (
            <div key={sectionIdx} className="mb-6">
              {/* Section Label */}
              <div className="px-3 mb-2">
                <span className="text-[#6B7A99] text-[11px] font-semibold tracking-wider">
                  {section.label}
                </span>
              </div>

              {/* Section Items */}
              <div className="space-y-1">
                {section.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  const isCyanItem = item.special || item.badge === "AI";

                  return (
                    <Link
                      key={itemIdx}
                      href={item.href}
                      className={`
                        group relative flex items-center gap-3 px-3 py-2.5 rounded-r-lg
                        transition-all duration-200
                        ${
                          active
                            ? "bg-[#1E6FFF]/15 text-white font-medium"
                            : "text-[#B0B8C8] hover:bg-white/5 hover:text-white"
                        }
                        ${item.special && !active ? "text-[#4A9EFF]" : ""}
                      `}
                      onClick={() => {
                        if (onClose) onClose();
                      }}
                    >
                      {/* Active indicator */}
                      {active && (
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#00C2D1] rounded-r-full" />
                      )}

                      {/* Special item indicator (Post a Job) */}
                      {item.special && !active && (
                        <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#00C2D1]" />
                      )}

                      <Icon
                        className={`flex-shrink-0 w-5 h-5 ${
                          isCyanItem && !active ? "text-[#00C2D1]" : ""
                        }`}
                      />
                      <span className="text-[14px]">{item.label}</span>

                      {/* Badges */}
                      {item.badge && (
                        <span
                          className={`
                            ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded
                            ${
                              item.badge === "AI"
                                ? "bg-[#00C2D1] text-[#0D1B2A]"
                                : "bg-[#E63946] text-white"
                            }
                          `}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom User Section - Fixed */}
        <div className="flex-shrink-0 border-t border-white/10">
          {/* Company Info */}
          <button
            onClick={() => setShowLogout(!showLogout)}
            className="w-full px-4 py-4 flex items-center gap-3 hover:bg-white/5 transition-colors"
          >
            {/* Company Logo Circle */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E6FFF] to-[#00C2D1] flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">
                {company.initials}
              </span>
            </div>

            {/* Company Details */}
            <div className="flex-1 text-left min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {company.name}
              </p>
              <p className="text-[#6B7A99] text-xs">{company.role}</p>
            </div>

            {/* Dropdown Icon */}
            <ChevronDown
              className={`w-4 h-4 text-[#6B7A99] transition-transform ${
                showLogout ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Logout Option */}
          {showLogout && (
            <button
              onClick={() => {
                // Handle logout
                console.log("Logout clicked");
              }}
              className="w-full px-4 py-3 flex items-center gap-3 text-[#E63946] hover:bg-[#E63946]/10 transition-colors border-t border-white/5"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
