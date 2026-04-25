"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Link, Award } from "lucide-react";
import { getProfile, getStoredUser, type AuthUser } from "@/lib/services/authService";

export default function RecruiterDetails() {
  const [accountUser, setAccountUser] = useState<AuthUser | null>(() => getStoredUser());

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
    return accountUser?.name ?? accountUser?.fullName ?? nameFromEmail ?? "User";
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

  const recruiterData = {
    name: recruiterName,
    designation: "Senior Talent Acquisition Manager",
    email: accountUser?.email ?? "No email available",
    phone: "+1 (555) 123-4567",
    linkedin: "",
    yearsExperience: 0,
    avatar: recruiterInitials,
    avatarColor: "bg-gradient-to-br from-primary to-cyan",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-xl border border-gray-200 p-6"
    >
      <h2 className="font-syne text-lg font-semibold text-midnight mb-6">
        Recruiter Information
      </h2>

      <div className="space-y-6">
        {/* Recruiter Profile */}
        <div className="flex items-start gap-4">
          <div
            className={`flex-shrink-0 w-11 h-11 ${recruiterData.avatarColor} rounded-full flex items-center justify-center text-white font-semibold text-base`}
          >
            {recruiterData.avatar}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-midnight text-base mb-1">
              {recruiterData.name}
            </h3>
            <p className="text-slate text-sm">{recruiterData.designation}</p>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
            <Award className="w-3.5 h-3.5" />
            {recruiterData.yearsExperience} years
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-3 pt-4 border-t border-gray-200">
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
              <a
                href={`tel:${recruiterData.phone}`}
                className="text-sm text-midnight hover:text-success font-medium transition-colors"
              >
                {recruiterData.phone}
              </a>
            </div>
          </div>

          {recruiterData.linkedin && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center">
                <Link className="w-4 h-4 text-cyan" />
              </div>
              <div>
                <p className="text-xs text-slate mb-0.5">LinkedIn</p>
                <a
                  href={recruiterData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-midnight hover:text-cyan font-medium transition-colors"
                >
                  View Profile
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
