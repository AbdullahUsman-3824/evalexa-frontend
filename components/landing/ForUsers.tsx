"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ForUsers() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const recruiterBenefits = [
    "Save 90% of screening time with AI automation",
    "Access ranked candidates with match scores",
    "Reduce time-to-hire by up to 10x",
    "Eliminate bias with objective evaluations",
    "Integrate with existing ATS systems",
    "Track analytics and hiring metrics",
  ];

  const candidateBenefits = [
    "Fair, bias-free evaluation process",
    "Instant feedback on your application",
    "AI-powered skill matching to right roles",
    "Practice with AI interview simulations",
    "Track application status in real-time",
    "Get noticed by top companies faster",
  ];

  return (
    <section className="bg-surface py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* For Recruiters - Dark Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            ref={ref}
            className="bg-midnight text-white rounded-2xl p-8 lg:p-10 shadow-xl"
          >
            <div className="mb-8">
              <div className="inline-block px-4 py-2 bg-primary/20 text-primary rounded-lg text-sm font-semibold mb-4">
                FOR RECRUITERS
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Hire Better, Faster
              </h2>
              <p className="text-slate text-lg">
                Streamline your recruitment process and focus on what matters —
                connecting with the right candidates.
              </p>
            </div>

            <ul className="space-y-4">
              {recruiterBenefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="flex items-start space-x-3"
                >
                  <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-white/90 leading-relaxed">
                    {benefit}
                  </span>
                </motion.li>
              ))}
            </ul>

            <Link href="/signup">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="block w-full text-center mt-8 px-6 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-200 cursor-pointer"
              >
                Start Recruiting
              </motion.div>
            </Link>
          </motion.div>

          {/* For Candidates - Light Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="bg-white border-2 border-slate/20 rounded-2xl p-8 lg:p-10 shadow-xl"
          >
            <div className="mb-8">
              <div className="inline-block px-4 py-2 bg-cyan/10 text-cyan rounded-lg text-sm font-semibold mb-4">
                FOR CANDIDATES
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-midnight mb-4">
                Get Hired Faster
              </h2>
              <p className="text-slate text-lg">
                Stand out with AI-powered matching and get discovered by
                companies looking for your exact skills.
              </p>
            </div>

            <ul className="space-y-4">
              {candidateBenefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="flex items-start space-x-3"
                >
                  <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-midnight/90 leading-relaxed">
                    {benefit}
                  </span>
                </motion.li>
              ))}
            </ul>

            <Link href="/signup">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="block w-full text-center mt-8 px-6 py-4 bg-midnight text-white font-semibold rounded-lg hover:bg-navy transition-colors duration-200 cursor-pointer"
              >
                Find Jobs
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
