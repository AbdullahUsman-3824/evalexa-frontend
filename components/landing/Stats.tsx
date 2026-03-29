"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { number: "10x", label: "Faster Hiring", delay: 0 },
    { number: "94%", label: "Match Accuracy", delay: 0.1 },
    { number: "500+", label: "Companies", delay: 0.2 },
    { number: "50K+", label: "Candidates Screened", delay: 0.3 },
  ];

  return (
    <section
      ref={ref}
      className="bg-surface py-16 md:py-24 border-y border-slate/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: stat.delay }}
              className="text-center"
            >
              <div className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-base sm:text-lg text-slate font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
