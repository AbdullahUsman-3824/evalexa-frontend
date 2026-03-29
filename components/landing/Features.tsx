"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  FileSearch,
  BarChart2,
  MessageSquare,
  LayoutDashboard,
  ShieldCheck,
  PieChart,
} from "lucide-react";

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: FileSearch,
      title: "AI Resume Screening",
      description:
        "Automatically scan and parse thousands of resumes in seconds, extracting key skills and experience.",
    },
    {
      icon: BarChart2,
      title: "Smart Candidate Ranking",
      description:
        "AI-powered algorithms rank candidates based on job fit, skills match, and experience relevance.",
    },
    {
      icon: MessageSquare,
      title: "AI Interview System",
      description:
        "Conduct automated video or text interviews with intelligent follow-up questions and analysis.",
    },
    {
      icon: LayoutDashboard,
      title: "Recruiter Dashboard",
      description:
        "Comprehensive dashboard to manage candidates, track pipeline, and collaborate with your team.",
    },
    {
      icon: ShieldCheck,
      title: "Bias-Free Hiring",
      description:
        "Remove unconscious bias with anonymous screening and objective, data-driven candidate evaluation.",
    },
    {
      icon: PieChart,
      title: "Data Analytics",
      description:
        "Track hiring metrics, time-to-hire, candidate sources, and optimize your recruitment process.",
    },
  ];

  return (
    <section id="features" ref={ref} className="bg-white py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-midnight mb-4">
            Everything You Need to Hire Right
          </h2>
          <p className="text-lg text-slate max-w-2xl mx-auto">
            Powerful features designed to streamline your recruitment process
            and help you find the perfect candidates.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group bg-white border border-slate/20 rounded-xl p-6 hover:shadow-xl hover:border-primary/30 transition-all duration-300 cursor-pointer"
            >
              {/* Icon */}
              <div className="mb-5">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-display font-bold text-midnight mb-3">
                {feature.title}
              </h3>
              <p className="text-slate leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
