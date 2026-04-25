"use client";

import { motion } from "framer-motion";
import { Camera, ExternalLink } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getProfile, getStoredUser, type AuthUser } from "@/lib/services/authService";

export default function RecruiterTab() {
  const [accountUser, setAccountUser] = useState<AuthUser | null>(() => getStoredUser());
  const [bio, setBio] = useState("");
  const [isHoveringPhoto, setIsHoveringPhoto] = useState(false);

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
    return accountUser?.name ?? accountUser?.fullName ?? nameFromEmail ?? "";
  }, [accountUser]);

  const [firstName, ...otherNames] = recruiterName.split(" ").filter(Boolean);
  const lastName = otherNames.join(" ");

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

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Profile Photo */}
      <div>
        <label className="block text-sm font-medium text-midnight mb-3">
          Profile Photo
        </label>
        <div className="flex items-center gap-6">
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setIsHoveringPhoto(true)}
            onMouseLeave={() => setIsHoveringPhoto(false)}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-cyan flex items-center justify-center">
              <span className="text-white font-syne font-bold text-2xl">
                {recruiterInitials}
              </span>
            </div>

            {/* Upload Overlay */}
            {isHoveringPhoto && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center"
              >
                <Camera className="w-6 h-6 text-white" />
              </motion.div>
            )}
          </div>

          <div>
            <button className="px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors mb-2">
              Upload New Photo
            </button>
            <p className="text-xs text-slate">JPG, PNG or GIF (Max 2MB)</p>
          </div>
        </div>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-midnight mb-2">
            First Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            defaultValue={firstName ?? ""}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            placeholder="Enter first name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-midnight mb-2">
            Last Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            defaultValue={lastName}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            placeholder="Enter last name"
          />
        </div>
      </div>

      {/* Job Title / Designation */}
      <div>
        <label className="block text-sm font-medium text-midnight mb-2">
          Job Title / Designation <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          defaultValue="Senior Talent Acquisition Manager"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          placeholder="e.g., HR Manager, Talent Acquisition Specialist"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-midnight mb-2">
          Email <span className="text-danger">*</span>
        </label>
        <div className="flex gap-3">
          <input
            type="email"
            defaultValue={accountUser?.email ?? ""}
            disabled
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-slate cursor-not-allowed"
          />
          <button className="px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Change
          </button>
        </div>
        <p className="text-xs text-slate mt-2">
          This email is used for account login and notifications
        </p>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-midnight mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          defaultValue="+1 (555) 123-4567"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          placeholder="+1 (555) 000-0000"
        />
      </div>

      {/* LinkedIn Profile URL */}
      <div>
        <label className="block text-sm font-medium text-midnight mb-2">
          LinkedIn Profile URL
        </label>
        <input
          type="url"
          defaultValue="https://linkedin.com/in/ahmedhassan"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          placeholder="https://linkedin.com/in/yourprofile"
        />
      </div>

      {/* Years of Experience */}
      <div>
        <label className="block text-sm font-medium text-midnight mb-2">
          Years of Experience in Recruiting
        </label>
        <input
          type="number"
          defaultValue="7"
          min="0"
          max="50"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          placeholder="Enter years"
        />
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-midnight mb-2">
          Professional Bio
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          maxLength={200}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
          placeholder="Brief description about your role and experience..."
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-slate">
            This will be visible to candidates
          </p>
          <p className="text-xs text-slate">{bio.length}/200</p>
        </div>
      </div>
    </motion.div>
  );
}
