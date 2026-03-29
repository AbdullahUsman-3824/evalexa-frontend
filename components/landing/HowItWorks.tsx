"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      number: "01",
      title: "Post a Job",
      description:
        "Create a job listing with requirements, skills, and experience needed. Our AI understands your needs.",
    },
    {
      number: "02",
      title: "Candidates Apply",
      description:
        "Candidates submit their resumes and profiles. They can apply through your career page or job boards.",
    },
    {
      number: "03",
      title: "AI Screens & Ranks",
      description:
        "Evalexa automatically screens resumes, ranks candidates by fit, and conducts initial AI interviews.",
    },
    {
      number: "04",
      title: "You Decide",
      description:
        "Review top candidates with complete insights and data. Make informed hiring decisions faster.",
    },
  ];

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="bg-midnight text-white py-20 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
            How Evalexa Works
          </h2>
          <p className="text-lg text-slate max-w-2xl mx-auto">
            Four simple steps to transform your hiring process and find the best
            talent faster.
          </p>
        </motion.div>

        {/* Desktop: Horizontal Flow */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-16 left-0 right-0 h-0.5 bg-slate/30"></div>

            <div className="grid grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="relative"
                >
                  {/* Step Number Circle */}
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl font-bold shadow-lg relative z-10">
                      {index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-xl font-display font-bold mb-3">
                      {step.title}
                    </h3>
                    <p className="text-slate leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow between steps (not on last step) */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-16 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-slate/50" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile & Tablet: Vertical Flow */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative flex items-start space-x-4"
            >
              {/* Step Number Circle */}
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                  {index + 1}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pt-2">
                <h3 className="text-xl font-display font-bold mb-2">
                  {step.title}
                </h3>
                <p className="text-slate leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
