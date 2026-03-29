'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  User,
  FileText,
  Sparkles,
  Search,
  Lightbulb,
  ClipboardList,
  Bookmark,
  CalendarCheck,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  badge?: number;
  badgeColor?: 'red' | 'cyan';
  isCyan?: boolean;
  onClose: () => void;
}

function NavItem({
  icon: Icon,
  label,
  href,
  active,
  badge,
  badgeColor = 'red',
  isCyan,
  onClose,
}: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className={`
        relative flex items-center gap-[10px] px-[10px] py-[9px] cursor-pointer transition-all duration-200
        ${
          active
            ? 'bg-[rgba(30,111,255,0.15)] border-l-[3px] border-l-[#00C2D1] rounded-r-lg'
            : 'border-l-[3px] border-l-transparent rounded-lg hover:bg-white/5'
        }
      `}
    >
      {/* Icon */}
      <div className="relative flex-shrink-0">
        <Icon
          size={20}
          className={
            active
              ? 'text-white'
              : isCyan
              ? 'text-[#00C2D1]'
              : 'text-[#7a93ab] opacity-45 transition-opacity group-hover:opacity-70'
          }
          style={
            !active && isCyan
              ? { color: '#00C2D1' }
              : !active && !isCyan
              ? { opacity: 0.45 }
              : undefined
          }
        />
        {/* Cyan dot for AI Analysis */}
        {isCyan && (
          <span className="absolute -top-0.5 -right-0.5 w-[6px] h-[6px] bg-[#00C2D1] rounded-full" />
        )}
      </div>

      {/* Label */}
      <span
        className={`flex-1 text-sm transition-colors ${
          active
            ? 'text-white font-medium'
            : isCyan
            ? 'text-[#00C2D1]'
            : 'text-[#7a93ab] hover:text-[#c8d8e8]'
        }`}
      >
        {label}
      </span>

      {/* Badge */}
      {badge !== undefined && badge > 0 && (
        <span
          className={`text-[10px] rounded-full px-1.5 py-px font-semibold ${
            badgeColor === 'red'
              ? 'bg-[#E63946] text-white'
              : 'bg-[#00C2D1]/15 text-[#00C2D1] border border-[#00C2D1]/30'
          }`}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="pt-3 pb-1 px-2">
      <p className="text-[10px] font-medium tracking-[0.1em] text-[#3a5068] uppercase font-sans">
        {children}
      </p>
    </div>
  );
}

function Divider() {
  return <div className="my-2 mx-3 h-px bg-white/[0.07]" />;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-[#0D1B2A] flex flex-col overflow-hidden z-40">
      {/* 1. Logo Section - flex-shrink-0 */}
      <div className="flex-shrink-0 px-4 pt-6 pb-5 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center">
          <span className="text-[20px] font-bold font-display text-white">Eval</span>
          <span className="text-[20px] font-bold font-display text-[#1E6FFF]">exa</span>
        </Link>

        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="lg:hidden text-[#6B7A99] hover:text-white transition-colors"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      {/* 2. Nav Section - flex-1 with overflow-y-auto */}
      <nav
        className="flex-1 overflow-y-auto px-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.1) transparent',
        }}
      >
        {/* MAIN Section */}
        <SectionLabel>MAIN</SectionLabel>
        <div className="space-y-0.5">
          <NavItem
            icon={LayoutDashboard}
            label="Dashboard"
            href="/dashboard"
            active={pathname === '/dashboard'}
            onClose={onClose}
          />
          <NavItem
            icon={User}
            label="My Profile"
            href="/profile"
            active={pathname === '/profile'}
            onClose={onClose}
          />
          <NavItem
            icon={FileText}
            label="Resume"
            href="/resume"
            active={pathname === '/resume'}
            onClose={onClose}
          />
          <NavItem
            icon={Sparkles}
            label="AI Analysis"
            href="/ai-analysis"
            active={pathname === '/ai-analysis' || pathname === '/resume/analysis'}
            badge={1}
            badgeColor="cyan"
            isCyan
            onClose={onClose}
          />
        </div>

        <Divider />

        {/* JOBS Section */}
        <SectionLabel>JOBS</SectionLabel>
        <div className="space-y-0.5">
          <NavItem
            icon={Search}
            label="Explore Jobs"
            href="/explore"
            active={pathname === '/explore' || pathname === '/jobs/explore'}
            onClose={onClose}
          />
          <NavItem
            icon={Lightbulb}
            label="Recommended"
            href="/recommendations"
            active={pathname === '/recommendations' || pathname === '/jobs/recommended'}
            onClose={onClose}
          />
          <NavItem
            icon={ClipboardList}
            label="Applications"
            href="/applied"
            active={pathname === '/applied' || pathname === '/applications'}
            onClose={onClose}
          />
          <NavItem
            icon={Bookmark}
            label="Saved Jobs"
            href="/saved"
            active={pathname === '/saved' || pathname === '/saved-jobs'}
            onClose={onClose}
          />
        </div>

        <Divider />

        {/* ACTIVITY Section */}
        <SectionLabel>ACTIVITY</SectionLabel>
        <div className="space-y-0.5">
          <NavItem
            icon={CalendarCheck}
            label="Interviews"
            href="/interviews"
            active={pathname === '/interviews'}
            onClose={onClose}
          />
          <NavItem
            icon={Bell}
            label="Notifications"
            href="/notifications"
            active={pathname === '/notifications'}
            badge={3}
            badgeColor="red"
            onClose={onClose}
          />
          <NavItem
            icon={Settings}
            label="Settings"
            href="/settings"
            active={pathname === '/settings'}
            onClose={onClose}
          />
        </div>
      </nav>

      {/* 3. User + Logout Section - flex-shrink-0, always at bottom */}
      <div className="flex-shrink-0 border-t border-white/[0.07] px-3 pb-4 pt-3">
        {/* User Row */}
        <button className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
          {/* Avatar with gradient */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1E6FFF] to-[#00C2D1] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[12px] font-bold font-display">JD</span>
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0 text-left">
            <p className="text-[#e8f0f8] text-sm font-medium truncate">John Doe</p>
            <p className="text-[#3a6080] text-[11px]">Candidate</p>
          </div>

          {/* Chevron */}
          <ChevronDown size={14} className="text-white/30 flex-shrink-0" />
        </button>

        {/* Logout Row */}
        <button className="w-full flex items-center gap-3 px-2 py-2 mt-1 rounded-lg cursor-pointer group hover:bg-red-500/10 transition-colors">
          <LogOut size={16} className="text-[#E63946] opacity-50 group-hover:opacity-100 transition-opacity" />
          <span className="text-[#5a7a90] text-sm group-hover:text-[#E63946] transition-colors">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block">{sidebarContent}</div>

      {/* Mobile sidebar - drawer with backdrop */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="lg:hidden fixed inset-0 bg-[#0D1B2A]/50 backdrop-blur-sm z-30"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden z-40"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
