"use client";

import { motion } from "framer-motion";
import { GraduationCap, Plus } from "lucide-react";
import Link from "next/link";

interface Education {
  id: string;
  degree: string;
  field: string;
  institution: string;
  startYear: string;
  endYear: string;
  grade: string;
}

const education: Education[] = [
  {
    id: "1",
    degree: "Bachelor's in Computer Science",
    field: "Computer Science",
    institution: "University of Engineering & Technology",
    startYear: "2016",
    endYear: "2020",
    grade: "3.8 CGPA",
  },
];

function EducationItem({ edu, index }: { edu: Education; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative pl-10 pb-6 last:pb-0"
    >
      {/* Timeline line */}
      {index < education.length - 1 && (
        <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-slate/10" />
      )}

      {/* Icon circle */}
      <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-success/15 flex items-center justify-center flex-shrink-0">
        <GraduationCap size={16} className="text-success" />
      </div>

      {/* Content */}
      <div>
        <h3 className="font-display text-base font-semibold text-midnight mb-1">
          {edu.degree}
        </h3>
        <p className="text-sm font-medium text-slate mb-1">{edu.institution}</p>
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate">
          <span>
            {edu.startYear} - {edu.endYear}
          </span>
          <span>•</span>
          <span className="text-success font-medium">{edu.grade}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function EducationSection() {
  const hasEducation = education.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-xl p-6 border border-slate/10"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-lg font-semibold text-midnight">
          Education
        </h2>
        <Link
          href="/candidate/profile/edit"
          className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
        >
          <Plus size={16} />
          <span>Add Education</span>
        </Link>
      </div>

      {hasEducation ? (
        <div>
          {education.map((edu, index) => (
            <EducationItem key={edu.id} edu={edu} index={index} />
          ))}
        </div>
      ) : (
        <Link
          href="/candidate/profile/edit"
          className="flex items-center justify-center gap-3 p-8 border-2 border-dashed border-slate/30 rounded-lg text-slate hover:border-primary hover:text-primary transition-colors"
        >
          <GraduationCap size={20} />
          <span className="text-sm font-medium">Add your education →</span>
        </Link>
      )}
    </motion.div>
  );
}
