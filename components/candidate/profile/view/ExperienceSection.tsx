"use client";

import { motion } from "framer-motion";
import { Briefcase, Plus } from "lucide-react";
import Link from "next/link";

interface Experience {
  id: string;
  title: string;
  company: string;
  type: string;
  startDate: string;
  endDate: string | null;
  location: string;
  description: string[];
  companyInitials: string;
  companyColor: string;
}

const experiences: Experience[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    type: "Full-time",
    startDate: "Jan 2022",
    endDate: null,
    location: "Remote",
    description: [
      "Led development of company's main product dashboard using React and TypeScript",
      "Improved application performance by 40% through code optimization",
      "Mentored 3 junior developers and conducted code reviews",
    ],
    companyInitials: "TC",
    companyColor: "#1E6FFF",
  },
  {
    id: "2",
    title: "Frontend Developer",
    company: "StartupHub",
    type: "Full-time",
    startDate: "Mar 2020",
    endDate: "Dec 2021",
    location: "Lahore, Pakistan",
    description: [
      "Built responsive web applications using React and Next.js",
      "Collaborated with design team to implement pixel-perfect UIs",
      "Integrated RESTful APIs and managed state with Redux",
    ],
    companyInitials: "SH",
    companyColor: "#00C2D1",
  },
];

function ExperienceItem({
  experience,
  index,
}: {
  experience: Experience;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative pl-10 pb-8 last:pb-0"
    >
      {/* Timeline line */}
      {index < experiences.length - 1 && (
        <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-slate/10" />
      )}

      {/* Icon circle */}
      <div
        className="absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
        style={{ backgroundColor: experience.companyColor }}
      >
        {experience.companyInitials}
      </div>

      {/* Content */}
      <div>
        <h3 className="font-display text-base font-semibold text-midnight mb-1">
          {experience.title}
        </h3>
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate mb-2">
          <span className="font-medium">{experience.company}</span>
          <span>•</span>
          <span>{experience.type}</span>
          <span>•</span>
          <span>
            {experience.startDate} - {experience.endDate || "Present"}
          </span>
        </div>
        <p className="text-sm text-slate mb-2">{experience.location}</p>

        {/* Description bullets */}
        <ul className="space-y-1">
          {experience.description.map((item, i) => (
            <li key={i} className="text-sm text-midnight flex gap-2">
              <span className="text-primary mt-1.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default function ExperienceSection() {
  const hasExperience = experiences.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-xl p-6 border border-slate/10"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-lg font-semibold text-midnight">
          Work Experience
        </h2>
        <Link
          href="/profile/edit"
          className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
        >
          <Plus size={16} />
          <span>Add Experience</span>
        </Link>
      </div>

      {hasExperience ? (
        <div>
          {experiences.map((exp, index) => (
            <ExperienceItem key={exp.id} experience={exp} index={index} />
          ))}
        </div>
      ) : (
        <Link
          href="/profile/edit"
          className="flex items-center justify-center gap-3 p-8 border-2 border-dashed border-slate/30 rounded-lg text-slate hover:border-primary hover:text-primary transition-colors"
        >
          <Briefcase size={20} />
          <span className="text-sm font-medium">
            Add your work experience →
          </span>
        </Link>
      )}
    </motion.div>
  );
}
