"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BrandingSection() {
  const router = useRouter();

  const brandingData = {
    logo: "TC",
    primaryColor: "#1E6FFF",
    accentColor: "#00C2D1",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-xl border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-syne text-lg font-semibold text-midnight">
          Company Branding
        </h2>
        <button
          onClick={() => router.push("/recruiter/profile/edit?tab=branding")}
          className="flex items-center gap-1.5 text-primary hover:text-blue-600 text-sm font-medium transition-colors"
        >
          Edit Branding
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Logo Preview */}
        <div>
          <p className="text-xs text-slate font-medium mb-3">Company Logo</p>
          <div className="flex items-center justify-center p-8 bg-surface rounded-lg">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-cyan flex items-center justify-center shadow-lg">
              <span className="text-white font-syne font-bold text-3xl">
                {brandingData.logo}
              </span>
            </div>
          </div>
        </div>

        {/* Brand Colors */}
        <div>
          <p className="text-xs text-slate font-medium mb-3">Brand Colors</p>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-xs text-slate mb-2">Primary Color</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg border-2 border-gray-200 shadow-sm"
                  style={{ backgroundColor: brandingData.primaryColor }}
                />
                <span className="text-sm text-midnight font-mono">
                  {brandingData.primaryColor}
                </span>
              </div>
            </div>

            <div className="flex-1">
              <p className="text-xs text-slate mb-2">Accent Color</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg border-2 border-gray-200 shadow-sm"
                  style={{ backgroundColor: brandingData.accentColor }}
                />
                <span className="text-sm text-midnight font-mono">
                  {brandingData.accentColor}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Note */}
        <div className="p-4 bg-surface rounded-lg border border-primary/20">
          <p className="text-sm text-slate">
            <span className="font-semibold text-midnight">Note:</span> These
            branding colors will be applied to all your job posts and company
            pages visible to candidates.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
