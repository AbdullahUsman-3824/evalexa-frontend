"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Star, Plus, Trash2, CheckCircle, XCircle } from "lucide-react";

interface SocialLink {
  id: string;
  platform: string;
  icon: React.ReactNode;
  url: string;
  verified: boolean;
}

interface CustomLink {
  id: string;
  label: string;
  url: string;
}

// Social Media Icon Components
const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export default function SocialLinksTab() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    {
      id: "1",
      platform: "LinkedIn",
      icon: <LinkedInIcon />,
      url: "https://linkedin.com/company/techcorp",
      verified: true,
    },
    {
      id: "2",
      platform: "Twitter / X",
      icon: <TwitterIcon />,
      url: "https://twitter.com/techcorp",
      verified: false,
    },
    {
      id: "3",
      platform: "Instagram",
      icon: <InstagramIcon />,
      url: "",
      verified: false,
    },
    {
      id: "4",
      platform: "Facebook",
      icon: <FacebookIcon />,
      url: "",
      verified: false,
    },
    {
      id: "5",
      platform: "Glassdoor",
      icon: <Star className="w-5 h-5" />,
      url: "",
      verified: false,
    },
  ]);

  const [customLinks, setCustomLinks] = useState<CustomLink[]>([]);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [newCustomLabel, setNewCustomLabel] = useState("");
  const [newCustomUrl, setNewCustomUrl] = useState("");

  const handleVerify = (id: string) => {
    // Simulate verification
    setSocialLinks(
      socialLinks.map((link) =>
        link.id === id ? { ...link, verified: true } : link,
      ),
    );
  };

  const handleAddCustomLink = () => {
    if (newCustomLabel.trim() && newCustomUrl.trim()) {
      setCustomLinks([
        ...customLinks,
        {
          id: Date.now().toString(),
          label: newCustomLabel.trim(),
          url: newCustomUrl.trim(),
        },
      ]);
      setNewCustomLabel("");
      setNewCustomUrl("");
      setShowAddCustom(false);
    }
  };

  const handleDeleteCustomLink = (id: string) => {
    setCustomLinks(customLinks.filter((link) => link.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Social Media Links */}
      <div className="space-y-4">
        {socialLinks.map((link, index) => (
          <motion.div
            key={link.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex items-center gap-4"
          >
            {/* Platform Icon */}
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-surface flex items-center justify-center text-primary">
              {link.icon}
            </div>

            {/* Platform Name & URL Input */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-midnight mb-2">
                {link.platform}
              </label>
              <input
                type="url"
                value={link.url}
                onChange={(e) =>
                  setSocialLinks(
                    socialLinks.map((l) =>
                      l.id === link.id ? { ...l, url: e.target.value } : l,
                    ),
                  )
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder={`https://${link.platform.toLowerCase().replace(" / ", "")}.com/yourcompany`}
              />
            </div>

            {/* Verify Button & Status */}
            <div className="flex-shrink-0 w-32">
              {link.url ? (
                link.verified ? (
                  <div className="flex items-center gap-2 text-success text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Verified
                  </div>
                ) : (
                  <button
                    onClick={() => handleVerify(link.id)}
                    className="w-full px-3 py-1.5 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Verify
                  </button>
                )
              ) : (
                <div className="flex items-center gap-2 text-slate text-sm">
                  <XCircle className="w-4 h-4" />
                  Not added
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Custom Links Section */}
      <div className="pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-midnight">Custom Links</h3>
          {!showAddCustom && (
            <button
              onClick={() => setShowAddCustom(true)}
              className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-gray-200 text-midnight text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Custom Link
            </button>
          )}
        </div>

        {/* Custom Links List */}
        {customLinks.length > 0 && (
          <div className="space-y-3 mb-4">
            {customLinks.map((link) => (
              <div
                key={link.id}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-midnight text-sm mb-1">
                    {link.label}
                  </p>
                  <p className="text-xs text-slate truncate">{link.url}</p>
                </div>
                <button
                  onClick={() => handleDeleteCustomLink(link.id)}
                  className="flex-shrink-0 p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Custom Link Form */}
        {showAddCustom && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 border border-gray-300 rounded-lg bg-surface"
          >
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-midnight mb-2">
                  Link Label
                </label>
                <input
                  type="text"
                  value={newCustomLabel}
                  onChange={(e) => setNewCustomLabel(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="e.g., Company Blog, Careers Page"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-midnight mb-2">
                  URL
                </label>
                <input
                  type="url"
                  value={newCustomUrl}
                  onChange={(e) => setNewCustomUrl(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="https://www.example.com"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAddCustomLink}
                  disabled={!newCustomLabel.trim() || !newCustomUrl.trim()}
                  className="flex-1 px-4 py-2 bg-primary hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Add Link
                </button>
                <button
                  onClick={() => {
                    setShowAddCustom(false);
                    setNewCustomLabel("");
                    setNewCustomUrl("");
                  }}
                  className="px-4 py-2 border border-gray-300 text-midnight hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Info Box */}
      <div className="p-4 bg-cyan/5 border border-cyan/20 rounded-lg">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-cyan/20 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-cyan"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-midnight text-sm mb-1">
              Why verify your social links?
            </h4>
            <p className="text-sm text-slate">
              Verified social links help candidates learn more about your
              company culture and build trust. They also improve your company
              profile visibility on Evalexa.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
