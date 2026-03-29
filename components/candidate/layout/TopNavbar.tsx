"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, Bell, User, Settings, LogOut } from "lucide-react";
import Link from "next/link";

interface TopNavbarProps {
  onMenuClick: () => void;
  pageTitle: string;
}

export default function TopNavbar({ onMenuClick, pageTitle }: TopNavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const unreadCount = 3;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate/20">
      <div className="h-16 px-4 lg:px-6 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {/* Hamburger menu - mobile only */}
          <button
            onClick={onMenuClick}
            className="lg:hidden text-midnight hover:text-primary transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          {/* Page title */}
          <h1 className="font-display text-lg font-semibold text-midnight">
            {pageTitle}
          </h1>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Search button */}
          <button
            className="p-2 rounded-lg text-slate hover:bg-surface hover:text-primary transition-all duration-200"
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate hover:bg-surface hover:text-primary transition-all duration-200"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
              )}
            </button>

            {/* Notifications dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-10"
                    onClick={() => setShowNotifications(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate/10 overflow-hidden z-20"
                  >
                    <div className="p-4 border-b border-slate/10">
                      <h3 className="font-semibold text-midnight">
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <p className="text-xs text-slate mt-0.5">
                          {unreadCount} unread
                        </p>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="p-4 hover:bg-surface transition-colors cursor-pointer border-b border-slate/5">
                        <p className="text-sm font-medium text-midnight">
                          New job match found!
                        </p>
                        <p className="text-xs text-slate mt-1">
                          Senior Frontend Developer at TechCorp
                        </p>
                        <p className="text-xs text-primary mt-1">2 hours ago</p>
                      </div>
                      <div className="p-4 hover:bg-surface transition-colors cursor-pointer border-b border-slate/5">
                        <p className="text-sm font-medium text-midnight">
                          Interview scheduled
                        </p>
                        <p className="text-xs text-slate mt-1">
                          Tomorrow at 2:00 PM with Innovation Labs
                        </p>
                        <p className="text-xs text-primary mt-1">5 hours ago</p>
                      </div>
                      <div className="p-4 hover:bg-surface transition-colors cursor-pointer">
                        <p className="text-sm font-medium text-midnight">
                          Application viewed
                        </p>
                        <p className="text-xs text-slate mt-1">
                          Your application for Product Designer was viewed
                        </p>
                        <p className="text-xs text-primary mt-1">1 day ago</p>
                      </div>
                    </div>
                    <Link
                      href="/notifications"
                      className="block p-3 text-center text-sm text-primary font-medium hover:bg-surface transition-colors"
                      onClick={() => setShowNotifications(false)}
                    >
                      View all notifications
                    </Link>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User avatar & menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-cyan flex items-center justify-center text-white text-sm font-semibold hover:ring-2 hover:ring-primary/30 transition-all duration-200"
              aria-label="User menu"
            >
              JD
            </button>

            {/* User dropdown */}
            <AnimatePresence>
              {showUserMenu && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-10"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate/10 overflow-hidden z-20"
                  >
                    <div className="p-4 border-b border-slate/10">
                      <p className="font-semibold text-midnight">John Doe</p>
                      <p className="text-xs text-slate mt-0.5">
                        john.doe@example.com
                      </p>
                      <span className="inline-block mt-2 px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                        Candidate
                      </span>
                    </div>
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-midnight hover:bg-surface transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User size={18} />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-midnight hover:bg-surface transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings size={18} />
                        <span>Settings</span>
                      </Link>
                    </div>
                    <div className="border-t border-slate/10 py-2">
                      <button className="flex items-center gap-3 px-4 py-2.5 w-full text-sm text-danger hover:bg-danger/5 transition-colors">
                        <LogOut size={18} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
