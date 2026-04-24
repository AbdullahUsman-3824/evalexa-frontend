"use client";

import { motion } from "framer-motion";
import {
  Globe,
  Link as LinkIcon,
  ExternalLink,
  Plus,
  Code,
  Share2,
} from "lucide-react";
import Link from "next/link";

interface PortfolioLink {
  id: string;
  type: "github" | "linkedin" | "website" | "other";
  label: string;
  url: string;
}

const portfolioLinks: PortfolioLink[] = [
  {
    id: "1",
    type: "github",
    label: "GitHub",
    url: "https://github.com/ayeshakhan",
  },
  {
    id: "2",
    type: "linkedin",
    label: "LinkedIn",
    url: "https://linkedin.com/in/ayeshakhan",
  },
  {
    id: "3",
    type: "website",
    label: "Portfolio Website",
    url: "https://ayeshakhan.dev",
  },
];

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

function getIconColor(type: PortfolioLink["type"]) {
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

function PortfolioLinkItem({
  link,
  index,
}: {
  link: PortfolioLink;
  index: number;
}) {
  const Icon = getIcon(link.type);
  const iconColor = getIconColor(link.type);

  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="flex items-center gap-3 p-3 border border-slate/10 rounded-lg hover:border-primary/50 hover:shadow-sm transition-all group"
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${iconColor}15` }}
      >
        <Icon size={18} style={{ color: iconColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-midnight truncate">
          {link.label}
        </p>
        <p className="text-xs text-slate truncate">{link.url}</p>
      </div>
      <ExternalLink
        size={16}
        className="text-slate group-hover:text-primary transition-colors flex-shrink-0"
      />
    </motion.a>
  );
}

export default function PortfolioSection() {
  const hasLinks = portfolioLinks.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-white rounded-xl p-6 border border-slate/10"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-semibold text-midnight">
          Portfolio & Links
        </h2>
        <Link
          href="/candidate/profile/edit"
          className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
        >
          <Plus size={16} />
          <span>Add Link</span>
        </Link>
      </div>

      {hasLinks ? (
        <div className="space-y-2">
          {portfolioLinks.map((link, index) => (
            <PortfolioLinkItem key={link.id} link={link} index={index} />
          ))}
        </div>
      ) : (
        <Link
          href="/candidate/profile/edit"
          className="flex items-center justify-center gap-3 p-8 border-2 border-dashed border-slate/30 rounded-lg text-slate hover:border-primary hover:text-primary transition-colors"
        >
          <LinkIcon size={20} />
          <span className="text-sm font-medium">Add portfolio links →</span>
        </Link>
      )}
    </motion.div>
  );
}
