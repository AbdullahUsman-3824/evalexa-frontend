"use client";

import { motion } from "framer-motion";
import { MapPin, Download, Share2, Edit } from "lucide-react";
import Link from "next/link";

export default function ProfileHeader() {
  const completionPercentage = 72;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden bg-gradient-to-r from-midnight to-navy rounded-2xl p-8"
    >
      <div className="relative z-10">
        {/* Action buttons - top right */}
        <div className="absolute top-0 right-0 flex gap-2">
          <Link
            href="/profile/edit"
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Edit size={16} />
            <span>Edit Profile</span>
          </Link>
          <button className="px-4 py-2 border border-white/20 text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2">
            <Download size={16} />
            <span className="hidden md:inline">Download Resume</span>
          </button>
          <button className="p-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors">
            <Share2 size={16} />
          </button>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
          {/* Avatar */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold font-display flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #1E6FFF, #00C2D1)",
            }}
          >
            AK
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
              Ayesha Khan
            </h1>
            <p className="text-cyan text-base md:text-lg mb-2">
              Frontend Developer
            </p>
            <div className="flex flex-wrap items-center gap-4 text-slate text-sm">
              <div className="flex items-center gap-1.5">
                <MapPin size={16} />
                <span>Lahore, Pakistan</span>
              </div>
              <span className="px-3 py-1 bg-success/20 text-success text-xs font-semibold rounded-full">
                Open to Work
              </span>
            </div>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate text-sm">Profile Completion</span>
            <span className="text-white text-sm font-semibold">
              {completionPercentage}%
            </span>
          </div>
          <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className="absolute top-0 left-0 h-full bg-primary rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTM2IDEzNGg4djhIMzZ6bTAgMTZoOHY4SDM2em0xNi0xNmg4djhoLTh6bTE2IDBIOHY4aDh6bS0xNiAxNmg4djhoLTh6bTE2IDBIOHY4aDh6bTAtMTZoOHY4aC04em0xNiAwaDh2OGgtOHptMCAxNmg4djhoLTh6bTE2LTE2aDh2OGgtOHptMCAxNmg4djhoLTh6Ii8+PC9nPjwvZz48L3N2Zz4=')]" />
      </div>
    </motion.div>
  );
}
