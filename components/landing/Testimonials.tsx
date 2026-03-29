"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Quote } from "lucide-react";

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const testimonials = [
    {
      quote:
        "Evalexa cut our hiring time by 75%. We now spend our time interviewing only the best-matched candidates instead of sifting through hundreds of resumes.",
      name: "Sarah Johnson",
      role: "Head of Talent",
      company: "TechCorp",
      initials: "SJ",
      gradient: "from-primary to-cyan",
    },
    {
      quote:
        "The AI interview feature is game-changing. It asks relevant questions and provides detailed candidate insights that help us make better hiring decisions.",
      name: "Ahmed Hassan",
      role: "CEO",
      company: "NovaBuild",
      initials: "AH",
      gradient: "from-cyan to-success",
    },
    {
      quote:
        "As a candidate, I loved the transparent process. The AI feedback helped me improve my interview skills, and I got hired within two weeks!",
      name: "Sara Malik",
      role: "Software Engineer",
      company: "HireIQ Solutions",
      initials: "SM",
      gradient: "from-success to-primary",
    },
  ];

  return (
    <section ref={ref} className="bg-white py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-midnight mb-4">
            Loved by Recruiters & Candidates
          </h2>
          <p className="text-lg text-slate max-w-2xl mx-auto">
            See what our users have to say about transforming their hiring
            experience.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-surface border border-slate/20 rounded-2xl p-8 hover:shadow-xl hover:border-primary/30 transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Quote className="w-6 h-6 text-primary" />
                </div>
              </div>

              {/* Quote Text */}
              <blockquote className="text-midnight leading-relaxed mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center space-x-4">
                {/* Avatar with Gradient */}
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center text-white font-bold text-sm`}
                >
                  {testimonial.initials}
                </div>

                <div>
                  <div className="font-semibold text-midnight">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-slate">
                    {testimonial.role} • {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-success/10 text-success rounded-full font-semibold">
            <span>⭐</span>
            <span>4.9/5 average rating from 500+ companies</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
