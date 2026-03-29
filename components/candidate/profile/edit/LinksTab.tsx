"use client";

import { useState } from "react";
import {
  Globe,
  Link as LinkIcon,
  Plus,
  X,
  CheckCircle,
  Code,
  Share2,
} from "lucide-react";

interface PortfolioLink {
  id: string;
  type: "github" | "linkedin" | "website" | "other";
  label: string;
  url: string;
  verified: boolean;
}

export default function LinksTab() {
  const [links, setLinks] = useState<PortfolioLink[]>([
    {
      id: "1",
      type: "github",
      label: "GitHub",
      url: "https://github.com/ayeshakhan",
      verified: true,
    },
    {
      id: "2",
      type: "linkedin",
      label: "LinkedIn",
      url: "https://linkedin.com/in/ayeshakhan",
      verified: true,
    },
  ]);

  const addLink = (type: PortfolioLink["type"]) => {
    const newLink: PortfolioLink = {
      id: Date.now().toString(),
      type,
      label: getLinkLabel(type),
      url: "",
      verified: false,
    };
    setLinks([...links, newLink]);
  };

  const removeLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id));
  };

  const updateLink = (id: string, field: keyof PortfolioLink, value: any) => {
    setLinks(
      links.map((link) =>
        link.id === id ? { ...link, [field]: value } : link,
      ),
    );
  };

  const verifyLink = (id: string) => {
    // Simple URL validation
    const link = links.find((l) => l.id === id);
    if (link && link.url) {
      try {
        new URL(link.url);
        updateLink(id, "verified", true);
        // In real app, would verify the URL actually exists
      } catch {
        alert("Please enter a valid URL");
      }
    }
  };

  function getLinkLabel(type: PortfolioLink["type"]): string {
    switch (type) {
      case "github":
        return "GitHub";
      case "linkedin":
        return "LinkedIn";
      case "website":
        return "Portfolio Website";
      default:
        return "Other Link";
    }
  }

  function getIcon(type: PortfolioLink["type"]) {
    switch (type) {
      case "github":
        return Code;
      case "linkedin":
        return Share2;
      case "website":
        return Globe;
      default:
        return LinkIcon;
    }
  }

  function getIconColor(type: PortfolioLink["type"]): string {
    switch (type) {
      case "github":
        return "#333333";
      case "linkedin":
        return "#0A66C2";
      case "website":
        return "#1E6FFF";
      default:
        return "#6B7A99";
    }
  }

  return (
    <div className="space-y-6">
      {/* Quick Add Buttons */}
      <div>
        <label className="block text-sm font-medium text-midnight mb-3">
          Add Platform
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => addLink("github")}
            className="flex items-center gap-2 px-4 py-2 border border-slate/30 rounded-lg hover:border-primary hover:bg-surface transition-colors flex-shrink-0"
          >
            <Code size={18} />
            <span className="text-sm font-medium">GitHub</span>
          </button>
          <button
            onClick={() => addLink("linkedin")}
            className="flex items-center gap-2 px-4 py-2 border border-slate/30 rounded-lg hover:border-primary hover:bg-surface transition-colors flex-shrink-0"
          >
            <Share2 size={18} />
            <span className="text-sm font-medium">LinkedIn</span>
          </button>
          <button
            onClick={() => addLink("website")}
            className="flex items-center gap-2 px-4 py-2 border border-slate/30 rounded-lg hover:border-primary hover:bg-surface transition-colors flex-shrink-0"
          >
            <Globe size={18} />
            <span className="text-sm font-medium">Website</span>
          </button>
          <button
            onClick={() => addLink("other")}
            className="flex items-center gap-2 px-4 py-2 border border-slate/30 rounded-lg hover:border-primary hover:bg-surface transition-colors flex-shrink-0"
          >
            <Plus size={18} />
            <span className="text-sm font-medium">Other</span>
          </button>
        </div>
      </div>

      {/* Links List */}
      <div className="space-y-4">
        {links.map((link) => {
          const Icon = getIcon(link.type);
          const iconColor = getIconColor(link.type);

          return (
            <div
              key={link.id}
              className="p-4 border border-slate/20 rounded-xl"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                  style={{ backgroundColor: `${iconColor}15` }}
                >
                  <Icon size={20} style={{ color: iconColor }} />
                </div>

                {/* Fields */}
                <div className="flex-1 space-y-3">
                  {/* Label */}
                  <div>
                    <label className="block text-sm font-medium text-midnight mb-2">
                      Label
                    </label>
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) =>
                        updateLink(link.id, "label", e.target.value)
                      }
                      className="w-full px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    />
                  </div>

                  {/* URL */}
                  <div>
                    <label className="block text-sm font-medium text-midnight mb-2">
                      URL *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) =>
                          updateLink(link.id, "url", e.target.value)
                        }
                        placeholder="https://..."
                        className="flex-1 px-4 py-2.5 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                      />
                      <button
                        onClick={() => verifyLink(link.id)}
                        disabled={link.verified}
                        className={`px-4 py-2.5 font-medium rounded-lg transition-colors flex items-center gap-2 ${
                          link.verified
                            ? "bg-success/10 text-success cursor-not-allowed"
                            : "bg-primary text-white hover:bg-primary/90"
                        }`}
                      >
                        {link.verified ? (
                          <>
                            <CheckCircle size={16} />
                            <span className="hidden md:inline">Verified</span>
                          </>
                        ) : (
                          <span>Verify</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeLink(link.id)}
                  className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors flex-shrink-0 mt-1"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          );
        })}

        {links.length === 0 && (
          <div className="p-8 border-2 border-dashed border-slate/30 rounded-lg text-center text-slate">
            <p className="text-sm">
              No links added yet. Click the buttons above to add your profiles.
            </p>
          </div>
        )}
      </div>

      {/* Info Note */}
      <div className="p-4 bg-cyan/10 border border-cyan/30 rounded-lg">
        <p className="text-sm text-midnight">
          <span className="font-semibold">Tip:</span> Adding verified links
          increases your profile credibility and helps employers learn more
          about your work.
        </p>
      </div>
    </div>
  );
}
