"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, User } from "lucide-react";
import {
  getProfile,
  getStoredUser,
} from "@/store/auth-session";
import type { AuthUser } from "@/types/auth.types";
import { useRouter } from "next/navigation";

export default function RecruiterDetails() {
  const router = useRouter();
  const [accountUser, setAccountUser] = useState<AuthUser | null>(() =>
    getStoredUser(),
  );

  useEffect(() => {
    void getProfile()
      .then((profile) => {
        setAccountUser(profile);
      })
      .catch(() => {
        // Keep stored session user as fallback if profile request fails.
      });
  }, []);

  const recruiterName = useMemo(() => {
    const nameFromEmail = accountUser?.email?.split("@")[0];
    return (
      accountUser?.fullName ?? accountUser?.name ?? nameFromEmail ?? "User"
    );
  }, [accountUser]);

  const recruiterInitials = useMemo(() => {
    const words = recruiterName
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
  }, [recruiterName]);

  // avatarUrl is a placeholder for a future recruiter profile image field
  const recruiterData = {
    name: recruiterName,
    email: accountUser?.email ?? "No email available",
    phone: accountUser?.phone?.trim() || "No phone number",
    avatarUrl: null as string | null,
    avatarInitials: recruiterInitials,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-xl border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-syne text-lg font-semibold text-midnight">
          Recruiter Information
        </h2>
        <button
          onClick={() => router.push("/recruiter/profile/edit?tab=recruiter")}
          className="text-primary hover:text-blue-600 text-sm font-medium transition-colors"
        >
          Edit
        </button>
      </div>

      <div className="space-y-6">
        {/* Recruiter Profile */}

        {/* Contact Information */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-slate mb-0.5">Name</p>
              <p className="text-sm text-midnight hover:text-primary font-medium transition-colors">
                {recruiterData.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center">
              <Mail className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-slate mb-0.5">Email</p>
              <a
                href={`mailto:${recruiterData.email}`}
                className="text-sm text-midnight hover:text-primary font-medium transition-colors"
              >
                {recruiterData.email}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center">
              <Phone className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="text-xs text-slate mb-0.5">Phone</p>
              {recruiterData.phone === "No phone number" ? (
                <p className="text-sm text-slate">{recruiterData.phone}</p>
              ) : (
                <a
                  href={`tel:${recruiterData.phone}`}
                  className="text-sm text-midnight hover:text-success font-medium transition-colors"
                >
                  {recruiterData.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
