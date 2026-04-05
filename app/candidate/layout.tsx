"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Sidebar from "@/components/candidate/layout/Sidebar";
import TopNavbar from "@/components/candidate/layout/TopNavbar";

// Map routes to page titles
const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/profile": "My Profile",
  "/resume": "Resume",
  "/resume/analysis": "AI Resume Analysis",
  "/ai-analysis": "AI Analysis",
  "/jobs/explore": "Explore Jobs",
  "/jobs/recommended": "Recommended Jobs",
  "/recommendations": "Job Recommendations",
  "/explore": "Explore Jobs",
  "/applied": "Applied Jobs",
  "/saved": "Saved Jobs",
  "/saved-jobs": "Saved Jobs",
  "/interviews": "Interviews",
  "/notifications": "Notifications",
  "/settings": "Settings",
};

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const pageTitle = pageTitles[pathname] || "Evalexa";

  return (
    <div className="min-h-screen bg-surface">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main content area */}
      <div className="lg:ml-60">
        {/* Top navbar */}
        <TopNavbar
          onMenuClick={() => setIsSidebarOpen(true)}
          pageTitle={pageTitle}
        />

        {/* Page content with animation */}
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="p-4 lg:p-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
