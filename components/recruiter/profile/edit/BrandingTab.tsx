"use client";

import { motion } from "framer-motion";
import { Upload, X } from "lucide-react";
import { useState } from "react";

export default function BrandingTab() {
  const [primaryColor, setPrimaryColor] = useState("#1E6FFF");
  const [accentColor, setAccentColor] = useState("#00C2D1");

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Company Logo Upload */}
      <div>
        <label className="block text-sm font-medium text-midnight mb-3">
          Company Logo
        </label>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Zone */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-primary transition-colors bg-surface">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-slate" />
              </div>
              <h3 className="font-semibold text-midnight mb-2">
                Upload Company Logo
              </h3>
              <p className="text-sm text-slate mb-4">
                PNG, SVG, or JPG (Max 2MB)
              </p>
              <button className="px-5 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors">
                Choose File
              </button>
              <p className="text-xs text-slate mt-3">
                Recommended: Square image, 512x512px
              </p>
            </div>
          </div>

          {/* Preview */}
          <div className="flex flex-col items-center justify-center p-8 bg-surface rounded-lg border border-gray-200">
            <p className="text-xs font-medium text-slate mb-4">PREVIEW</p>
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-cyan flex items-center justify-center shadow-lg">
              <span className="text-white font-syne font-bold text-4xl">
                TC
              </span>
            </div>
            <p className="text-xs text-slate mt-4">Current Logo</p>
          </div>
        </div>
      </div>

      {/* Cover/Banner Image Upload */}
      <div>
        <label className="block text-sm font-medium text-midnight mb-3">
          Cover Banner Image (Optional)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-primary transition-colors bg-surface">
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-slate" />
            </div>
            <h3 className="font-semibold text-midnight mb-2">
              Upload Cover Image
            </h3>
            <p className="text-sm text-slate mb-4">PNG or JPG (Max 5MB)</p>
            <button className="px-5 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors">
              Choose File
            </button>
            <p className="text-xs text-slate mt-3">Recommended: 1920x480px</p>
          </div>
        </div>
      </div>

      {/* Brand Colors */}
      <div>
        <label className="block text-sm font-medium text-midnight mb-3">
          Brand Colors
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primary Color */}
          <div>
            <label className="block text-sm text-slate mb-2">
              Primary Color
            </label>
            <div className="flex gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-16 h-16 rounded-lg border-2 border-gray-200 cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-mono text-sm"
                  placeholder="#1E6FFF"
                />
                <p className="text-xs text-slate mt-2">
                  Used for buttons and primary actions
                </p>
              </div>
            </div>
          </div>

          {/* Accent Color */}
          <div>
            <label className="block text-sm text-slate mb-2">
              Accent Color
            </label>
            <div className="flex gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-16 h-16 rounded-lg border-2 border-gray-200 cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-mono text-sm"
                  placeholder="#00C2D1"
                />
                <p className="text-xs text-slate mt-2">
                  Used for highlights and accents
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Card */}
      <div>
        <label className="block text-sm font-medium text-midnight mb-3">
          Job Post Preview
        </label>
        <div className="border border-gray-200 rounded-xl p-6 bg-white">
          <div className="flex items-start gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: primaryColor }}
            >
              TC
            </div>
            <div className="flex-1">
              <h3 className="font-syne text-lg font-semibold text-midnight mb-1">
                Senior Software Engineer
              </h3>
              <p className="text-sm text-slate">TechCorp Solutions</p>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <span
              className="px-3 py-1.5 text-white text-xs font-medium rounded-full"
              style={{ backgroundColor: primaryColor }}
            >
              Full-time
            </span>
            <span
              className="px-3 py-1.5 text-white text-xs font-medium rounded-full"
              style={{ backgroundColor: accentColor }}
            >
              Remote
            </span>
          </div>

          <p className="text-sm text-slate mb-4">
            We're looking for a talented software engineer to join our growing
            team...
          </p>

          <button
            className="w-full py-2.5 text-white rounded-lg font-medium text-sm transition-colors hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            Apply Now
          </button>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-slate text-center">
              This is how your job posts will appear to candidates
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
