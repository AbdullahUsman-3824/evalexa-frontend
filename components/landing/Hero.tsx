"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-midnight text-white overflow-hidden flex items-center pt-20">
      {/* Animated Gradient Orbs Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-cyan/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left space-y-6 md:space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-cyan text-cyan text-sm font-medium"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Recruitment Platform</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
            >
              Hire Smarter. <span className="text-cyan">Hire Faster.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-secondary max-w-2xl"
            >
              Evalexa helps you hire faster with AI screening, candidate
              ranking, and interview support, while also letting you explore
              jobs and companies before you sign in.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 items-center lg:items-start"
            >
              <Link href="/signup" className="w-full sm:w-auto">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-8 py-4 bg-primary text-midnight font-bold rounded-lg hover:bg-primary/90 transition-colors duration-200 text-center cursor-pointer"
                >
                  Start Hiring Free
                </motion.div>
              </Link>
              <Link href="/jobs" className="w-full sm:w-auto">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-8 py-4 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-midnight transition-all duration-200 text-center cursor-pointer"
                >
                  Explore Jobs
                </motion.div>
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-secondary/90"
            >
              Browse jobs and companies without signing up.
            </motion.p>
          </motion.div>

          {/* Right Content - Product Screenshot */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:flex justify-center items-center"
          >
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative w-full max-w-2xl"
            >
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src="/preview/dashboard.png"
                    alt="Evalexa recruiter dashboard preview"
                    fill
                    priority
                    sizes="(min-width: 1024px) 42rem, 100vw"
                    // className="object-cover"
                  />
                </div>

              {/* Floating Elements Around Card */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-1 -right-1 w-8 h-8 bg-success rounded-lg shadow-lg"
              ></motion.div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-1 -left-1 w-6 h-6 bg-cyan rounded-full shadow-lg"
              ></motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
