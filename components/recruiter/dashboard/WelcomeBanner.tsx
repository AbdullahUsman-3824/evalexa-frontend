"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getProfile,
  getStoredUser,
  type AuthUser,
} from "@/lib/services/authService";

export default function WelcomeBanner() {
  const router = useRouter();
  const [accountUser, setAccountUser] = useState<AuthUser | null>(() =>
    getStoredUser(),
  );

  useEffect(() => {
    const storedUser = getStoredUser();
    setAccountUser(storedUser);

    void getProfile()
      .then((profile) => {
        setAccountUser(profile);
      })
      .catch(() => {
        // Keep stored session user as fallback if profile request fails.
      });
  }, []);

  const displayName = useMemo(() => {
    const derivedNameFromEmail = accountUser?.email?.split("@")[0];
    const sourceName =
      accountUser?.fullName ??
      accountUser?.name ??
      derivedNameFromEmail ??
      "User";
    return sourceName.split(" ")[0] ?? sourceName;
  }, [accountUser]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-midnight to-[#1A2E45] p-8"
    >
      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Content */}
        <div className="flex-1">
          <h1 className="font-syne text-white text-2xl font-semibold mb-2">
            Good morning, {displayName} 👋
          </h1>
          <p className="text-slate text-sm mb-6">
            Here's what's happening with your hiring today.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.push("/recruiter/jobs/post")}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-lg font-medium text-sm transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Post a Job
            </button>
            <button
              onClick={() => router.push("/recruiter/applicants")}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg font-medium text-sm transition-colors"
            >
              <Users className="w-4 h-4" />
              View Applicants
            </button>
          </div>
        </div>

        {/* Right - Mini Hiring Funnel Illustration */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Applied */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
              <span className="text-primary font-semibold text-sm">248</span>
            </div>
            <span className="text-white/60 text-xs font-medium">Applied</span>
          </div>

          {/* Arrow */}
          <svg
            className="w-6 h-6 text-white/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>

          {/* Screened */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-cyan/20 border-2 border-cyan flex items-center justify-center">
              <span className="text-cyan font-semibold text-sm">180</span>
            </div>
            <span className="text-white/60 text-xs font-medium">Screened</span>
          </div>

          {/* Arrow */}
          <svg
            className="w-6 h-6 text-white/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>

          {/* Shortlisted */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-warning/20 border-2 border-warning flex items-center justify-center">
              <span className="text-warning font-semibold text-xs">38</span>
            </div>
            <span className="text-white/60 text-xs font-medium">
              Shortlisted
            </span>
          </div>

          {/* Arrow */}
          <svg
            className="w-6 h-6 text-white/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>

          {/* Hired */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 border-2 border-yellow-500 flex items-center justify-center">
              <span className="text-yellow-500 font-semibold text-xs">4</span>
            </div>
            <span className="text-white/60 text-xs font-medium">Hired</span>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan rounded-full blur-3xl" />
      </div>
    </motion.div>
  );
}
