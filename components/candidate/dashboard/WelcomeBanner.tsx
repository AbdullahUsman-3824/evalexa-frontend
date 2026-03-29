"use client";

import { motion } from "framer-motion";

export default function WelcomeBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden bg-gradient-to-r from-midnight to-navy rounded-2xl p-8 lg:p-10"
    >
      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left content */}
        <div className="flex-1">
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-white mb-2">
            Good morning, Ayesha 👋
          </h1>
          <p className="text-slate text-sm lg:text-base">
            You have{" "}
            <span className="text-cyan font-semibold">2 interview invites</span>{" "}
            and{" "}
            <span className="text-cyan font-semibold">3 new job matches</span>
          </p>
        </div>

        {/* Right illustration - animated geometric shapes */}
        <div className="relative w-full lg:w-64 h-40 lg:h-48">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-4 right-8 w-32 h-32 bg-primary/20 rounded-full blur-2xl"
          />
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-8 right-4 w-24 h-24 bg-cyan/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-12 right-16 w-20 h-20 border-4 border-primary/30 rounded-lg"
          />
          <motion.div
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 right-24 w-16 h-16 border-4 border-cyan/30 rounded-full"
          />

          {/* Simple desk illustration */}
          <svg
            className="absolute bottom-0 right-4 w-40 h-32 opacity-30"
            viewBox="0 0 160 128"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Monitor */}
            <rect
              x="40"
              y="20"
              width="80"
              height="50"
              rx="4"
              fill="currentColor"
              className="text-cyan"
            />
            <rect
              x="45"
              y="25"
              width="70"
              height="40"
              fill="currentColor"
              className="text-primary"
            />
            {/* Stand */}
            <rect
              x="70"
              y="70"
              width="20"
              height="20"
              fill="currentColor"
              className="text-cyan/80"
            />
            {/* Desk */}
            <rect
              x="10"
              y="90"
              width="140"
              height="8"
              rx="4"
              fill="currentColor"
              className="text-white/60"
            />
            {/* Legs */}
            <rect
              x="15"
              y="98"
              width="6"
              height="30"
              fill="currentColor"
              className="text-white/40"
            />
            <rect
              x="139"
              y="98"
              width="6"
              height="30"
              fill="currentColor"
              className="text-white/40"
            />
          </svg>
        </div>
      </div>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTM2IDEzNGg4djhIMzZ6bTAgMTZoOHY4SDM2em0xNi0xNmg4djhoLTh6bTE2IDBIOHY4aDh6bS0xNiAxNmg4djhoLTh6bTE2IDBIOHY4aDh6bTAtMTZoOHY4aC04em0xNiAwaDh2OGgtOHptMCAxNmg4djhoLTh6bTE2LTE2aDh2OGgtOHptMCAxNmg4djhoLTh6Ii8+PC9nPjwvZz48L3N2Zz4=')]" />
      </div>
    </motion.div>
  );
}
