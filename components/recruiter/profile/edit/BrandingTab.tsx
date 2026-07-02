"use client";

import { motion } from "framer-motion";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useRef } from "react";
import Image from "next/image";

interface BrandingTabProps {
  currentLogoUrl: string | null;
  currentBannerUrl: string | null;
  logoFile: File | null;
  bannerFile: File | null;
  onLogoChange: (file: File | null) => void;
  onBannerChange: (file: File | null) => void;
}

export default function BrandingTab({
  currentLogoUrl,
  currentBannerUrl,
  logoFile,
  bannerFile,
  onLogoChange,
  onBannerChange,
}: BrandingTabProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Derive preview URLs — new file takes priority over existing URL
  const logoPreview = logoFile
    ? URL.createObjectURL(logoFile)
    : currentLogoUrl;

  const bannerPreview = bannerFile
    ? URL.createObjectURL(bannerFile)
    : currentBannerUrl;

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onLogoChange(file);
    e.target.value = "";
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onBannerChange(file);
    e.target.value = "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >

      {/* ── Logo ── */}
      <div>
        <label className="block text-sm font-medium text-midnight mb-1">
          Company Logo
        </label>
        <p className="text-xs text-slate mb-4">
          Recommended: square image, 512×512px. PNG, SVG, or JPG — max 5 MB.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload zone */}
          <div
            onClick={() => logoInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 hover:border-primary rounded-xl p-8 bg-surface transition-colors cursor-pointer group"
          >
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
            />
            <div className="text-center">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/5 transition-colors">
                <Upload className="w-6 h-6 text-slate group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm font-medium text-midnight mb-1">
                {logoFile ? logoFile.name : "Click to upload logo"}
              </p>
              <p className="text-xs text-slate">
                {logoFile
                  ? `${(logoFile.size / 1024).toFixed(0)} KB`
                  : "PNG, SVG, JPG up to 5 MB"}
              </p>
              {logoFile && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLogoChange(null);
                  }}
                  className="mt-3 flex items-center gap-1 text-xs text-red-500 hover:text-red-600 mx-auto transition-colors"
                >
                  <X className="w-3 h-3" />
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="flex flex-col items-center justify-center p-8 bg-surface rounded-xl border border-gray-200">
            <p className="text-xs font-medium text-slate mb-4 tracking-wide uppercase">
              Preview
            </p>
            {logoPreview ? (
              <Image
                src={logoPreview}
                alt="Logo preview"
                width={112}
                height={112}
                className="w-28 h-28 rounded-full object-cover shadow-md border-4 border-white"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-cyan flex items-center justify-center shadow-md border-4 border-white">
                <span className="text-white font-syne font-bold text-3xl">
                  CO
                </span>
              </div>
            )}
            <p className="text-xs text-slate mt-3">
              {logoFile ? "New logo" : currentLogoUrl ? "Current logo" : "No logo uploaded"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Banner ── */}
      <div>
        <label className="block text-sm font-medium text-midnight mb-1">
          Cover Banner
          <span className="ml-2 font-normal text-slate">(optional)</span>
        </label>
        <p className="text-xs text-slate mb-4">
          Recommended: 1920×480px. PNG or JPG — max 5 MB.
        </p>

        {/* Banner preview strip */}
        {bannerPreview ? (
          <div className="relative rounded-xl overflow-hidden mb-4 border border-gray-200">
            <Image
              src={bannerPreview}
              alt="Banner preview"
              className="w-full h-36 object-cover"
            />
            <button
              type="button"
              onClick={() => onBannerChange(null)}
              className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            <div className="absolute bottom-2 left-3">
              <span className="text-xs text-white/80 bg-black/40 rounded px-2 py-0.5">
                {bannerFile ? "New banner" : "Current banner"}
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full h-36 rounded-xl bg-surface border border-dashed border-gray-300 flex items-center justify-center mb-4">
            <div className="text-center">
              <ImageIcon className="w-8 h-8 text-slate/40 mx-auto mb-1" />
              <p className="text-xs text-slate">No banner uploaded</p>
            </div>
          </div>
        )}

        <div
          onClick={() => bannerInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 hover:border-primary rounded-xl p-6 bg-surface transition-colors cursor-pointer group"
        >
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleBannerChange}
          />
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary/5 transition-colors">
              <Upload className="w-5 h-5 text-slate group-hover:text-primary transition-colors" />
            </div>
            <div>
              <p className="text-sm font-medium text-midnight">
                {bannerFile ? bannerFile.name : "Click to upload banner"}
              </p>
              <p className="text-xs text-slate">
                {bannerFile
                  ? `${(bannerFile.size / 1024).toFixed(0)} KB`
                  : "PNG or JPG up to 5 MB"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Save reminder ── */}
      <p className="text-xs text-slate/60 text-center">
        Changes are uploaded when you hit &quot;Save Changes&quot; below.
      </p>
    </motion.div>
  );
}