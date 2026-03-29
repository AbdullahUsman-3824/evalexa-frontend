"use client";

import { motion } from "framer-motion";

interface LeftPanelProps {
  headline: string;
  subtext: string;
}

export default function LeftPanel({ headline, subtext }: LeftPanelProps) {
  return (
    <div className="hidden lg:flex lg:flex-col lg:w-[45%] bg-midnight text-white relative overflow-hidden min-h-screen">
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-0 w-64 h-64 bg-cyan/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content Container */}
      <div className="relative flex flex-col h-full p-12">
        {/* Logo */}
        <div className="mb-auto">
          <a
            href="/"
            className="flex items-center space-x-1 font-display text-3xl font-bold"
          >
            <span className="text-white">Eval</span>
            <span className="text-primary">exa</span>
          </a>
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col justify-center space-y-8">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl xl:text-4xl font-bold leading-tight max-w-md"
          >
            {headline}
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-slate text-base max-w-md leading-relaxed"
          >
            {subtext}
          </motion.p>

          {/* Floating Candidate Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-5 max-w-sm"
            >
              {/* Card Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-cyan rounded-full flex items-center justify-center text-lg font-bold">
                  AK
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Ayesha Khan
                  </h3>
                  <p className="text-slate text-sm">Frontend Developer</p>
                </div>
              </div>

              {/* AI Match Score */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate">
                    AI Match Score
                  </span>
                  <span className="text-lg font-bold text-success">94%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "94%" }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                    className="h-full bg-gradient-to-r from-primary to-cyan rounded-full"
                  ></motion.div>
                </div>
              </div>

              {/* Skill Tags */}
              <div className="flex flex-wrap gap-2">
                {["React", "TypeScript"].map((skill, index) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    className="px-3 py-1 bg-primary/30 text-white text-xs font-medium rounded-full border border-primary/50"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Spacing */}
        <div className="mt-auto"></div>
      </div>
    </div>
  );
}
