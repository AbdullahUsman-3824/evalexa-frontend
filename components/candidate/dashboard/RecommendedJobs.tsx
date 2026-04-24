"use client";

import { motion } from "framer-motion";
import { MapPin, Bookmark, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  matchPercentage: number;
  skills: string[];
  salary: string;
  postedTime: string;
  companyInitials: string;
  companyColor: string;
}

const jobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "Remote",
    matchPercentage: 94,
    skills: ["React", "TypeScript", "Next.js"],
    salary: "$80k - $120k",
    postedTime: "2 days ago",
    companyInitials: "TC",
    companyColor: "#1E6FFF",
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    company: "Innovation Labs",
    location: "New York, NY",
    matchPercentage: 89,
    skills: ["Node.js", "React", "MongoDB"],
    salary: "$90k - $130k",
    postedTime: "3 days ago",
    companyInitials: "IL",
    companyColor: "#00C2D1",
  },
  {
    id: "3",
    title: "UI/UX Developer",
    company: "DesignHub",
    location: "San Francisco, CA",
    matchPercentage: 87,
    skills: ["Figma", "React", "Tailwind"],
    salary: "$75k - $110k",
    postedTime: "5 days ago",
    companyInitials: "DH",
    companyColor: "#00B37E",
  },
];

function JobCard({ job, index }: { job: Job; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
      className="bg-white rounded-xl p-5 border border-slate/10 hover:shadow-lg transition-all duration-300 flex-shrink-0 w-full lg:w-auto"
    >
      {/* Company logo */}
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-4"
        style={{ backgroundColor: job.companyColor }}
      >
        {job.companyInitials}
      </div>

      {/* Job title */}
      <h3 className="font-display text-base font-semibold text-midnight mb-1">
        {job.title}
      </h3>

      {/* Company & location */}
      <div className="flex items-center gap-2 text-sm text-slate mb-3">
        <span>{job.company}</span>
        <span>•</span>
        <div className="flex items-center gap-1">
          <MapPin size={14} />
          <span>{job.location}</span>
        </div>
      </div>

      {/* Match percentage badge */}
      <div className="inline-block px-2.5 py-1 bg-success/10 text-success text-xs font-semibold rounded-full mb-3">
        {job.matchPercentage}% Match
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {job.skills.map((skill) => (
          <span
            key={skill}
            className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Salary */}
      <p className="text-sm text-slate font-medium mb-4">{job.salary}</p>

      {/* Footer - Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate/10">
        <span className="text-xs text-slate">{job.postedTime}</span>
        <div className="flex items-center gap-2">
          <button
            className="p-2 text-slate hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
            aria-label="Save job"
          >
            <Bookmark size={18} />
          </button>
          <button className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors">
            Apply Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function RecommendedJobs() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-xl font-semibold text-midnight">
          Jobs Matched For You
        </h2>
        <Link
          href="/candidate/jobs/recommended"
          className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:gap-3 transition-all duration-200"
        >
          View All
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Job cards - horizontal scroll on mobile */}
      <div className="flex lg:grid lg:grid-cols-3 gap-4 overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0 lg:overflow-visible">
        {jobs.map((job, index) => (
          <JobCard key={job.id} job={job} index={index} />
        ))}
      </div>
    </motion.div>
  );
}
