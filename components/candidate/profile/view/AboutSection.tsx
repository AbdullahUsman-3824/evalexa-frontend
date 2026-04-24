"use client";

import { motion } from "framer-motion";
import { Edit2 } from "lucide-react";
import Link from "next/link";

export default function AboutSection() {
  const hasBio = true;
  const bio =
    "Passionate frontend developer with 4+ years of experience building modern, responsive web applications. Specialized in React, Next.js, and TypeScript. Love creating intuitive user interfaces and solving complex problems with clean, maintainable code.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-xl p-6 border border-slate/10"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-semibold text-midnight">
          About Me
        </h2>
        <Link
          href="/candidate/profile/edit"
          className="p-2 text-slate hover:text-primary hover:bg-surface rounded-lg transition-colors"
        >
          <Edit2 size={16} />
        </Link>
      </div>

      {hasBio ? (
        <p className="text-midnight text-[15px] leading-relaxed">{bio}</p>
      ) : (
        <Link
          href="/candidate/profile/edit"
          className="block p-6 border-2 border-dashed border-slate/30 rounded-lg text-center text-slate hover:border-primary hover:text-primary transition-colors"
        >
          <p className="text-sm">
            Add a bio to tell employers about yourself →
          </p>
        </Link>
      )}
    </motion.div>
  );
}
