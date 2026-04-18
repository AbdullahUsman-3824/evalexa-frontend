"use client";

import { motion } from "framer-motion";

type SkillDatum = {
  skill: string;
  count: number;
  total: number;
  highlight?: boolean;
};

export default function SkillsPool() {
  const skills: SkillDatum[] = [
    { skill: "React.js", count: 186, total: 248, highlight: true },
    { skill: "JavaScript", count: 178, total: 248, highlight: true },
    { skill: "TypeScript", count: 142, total: 248, highlight: true },
    { skill: "Node.js", count: 124, total: 248 },
    { skill: "Git", count: 98, total: 248 },
    { skill: "Tailwind CSS", count: 76, total: 248, highlight: true },
    { skill: "Docker", count: 45, total: 248 },
    { skill: "AWS", count: 38, total: 248 },
  ].sort((a, b) => b.count - a.count);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="font-syne text-xl font-semibold text-midnight">
        Most Common Skills in Applicant Pool
      </h3>
      <p className="mt-1 text-sm text-slate">Across all active job applications</p>

      <div className="mt-6 space-y-4">
        {skills.map((item, index) => {
          const percentage = Math.round((item.count / item.total) * 100);
          return (
            <motion.div
              key={item.skill}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
              className="grid grid-cols-[140px_70px_1fr_40px] items-center gap-3 md:grid-cols-[170px_90px_1fr_52px]"
            >
              <p className="text-sm font-medium text-midnight">{item.skill}</p>
              <p className="text-xs font-semibold text-slate">
                {item.count}/{item.total}
              </p>
              <div className="relative h-3 rounded-full bg-primary/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.7, delay: index * 0.08 }}
                  className="relative h-3 rounded-full bg-primary"
                >
                  {item.highlight ? (
                    <span className="absolute inset-0 rounded-full bg-cyan/30" />
                  ) : null}
                </motion.div>
              </div>
              <p className="text-right text-xs font-semibold text-midnight">{percentage}%</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

