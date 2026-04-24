"use client";

import { motion } from "framer-motion";
import { Edit2, Plus } from "lucide-react";
import Link from "next/link";

const primarySkills = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "JavaScript",
];
const secondarySkills = ["Node.js", "Git", "Figma", "REST APIs", "Redux"];

export default function SkillsSection() {
  const hasSkills = primarySkills.length > 0 || secondarySkills.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-xl p-6 border border-slate/10"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-semibold text-midnight">
          Skills
        </h2>
        <Link
          href="/candidate/profile/edit"
          className="p-2 text-slate hover:text-primary hover:bg-surface rounded-lg transition-colors"
        >
          <Edit2 size={16} />
        </Link>
      </div>

      {hasSkills ? (
        <div className="space-y-4">
          {/* Primary Skills */}
          {primarySkills.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate uppercase tracking-wide mb-2">
                Primary Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {primarySkills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-lg"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          {/* Secondary Skills */}
          {secondarySkills.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate uppercase tracking-wide mb-2">
                Secondary Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {secondarySkills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.2,
                      delay: (primarySkills.length + index) * 0.05,
                    }}
                    className="px-3 py-1.5 border border-slate/30 text-slate text-sm font-medium rounded-lg hover:border-primary hover:text-primary transition-colors"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          {/* Add More Button */}
          <Link
            href="/candidate/profile/edit"
            className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:underline"
          >
            <Plus size={16} />
            <span>Add more skills</span>
          </Link>
        </div>
      ) : (
        <Link
          href="/candidate/profile/edit"
          className="block p-6 border-2 border-dashed border-slate/30 rounded-lg text-center text-slate hover:border-primary hover:text-primary transition-colors"
        >
          <p className="text-sm">Add skills to showcase your expertise →</p>
        </Link>
      )}
    </motion.div>
  );
}
