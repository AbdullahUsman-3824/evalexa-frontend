"use client";

import { motion } from "framer-motion";
import { CalendarCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Interview {
  id: string;
  company: string;
  role: string;
  date: string;
  time: string;
}

const interviews: Interview[] = [
  {
    id: "1",
    company: "Innovation Labs",
    role: "Senior Frontend Developer",
    date: "Tomorrow",
    time: "2:00 PM",
  },
  {
    id: "2",
    company: "TechVision Inc.",
    role: "Full Stack Engineer",
    date: "Mar 25, 2026",
    time: "10:00 AM",
  },
];

function InterviewRow({
  interview,
  index,
}: {
  interview: Interview;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
      className="p-4 bg-surface/50 rounded-lg hover:bg-surface transition-colors"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex-1">
          <h4 className="font-semibold text-midnight text-sm mb-1">
            {interview.company}
          </h4>
          <p className="text-xs text-slate mb-2">{interview.role}</p>
          <div className="flex items-center gap-2 text-xs text-slate">
            <CalendarCheck size={14} className="text-warning" />
            <span>
              {interview.date} at {interview.time}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex-1 lg:flex-none px-4 py-2 bg-success text-white text-sm font-medium rounded-lg hover:bg-success/90 transition-colors">
            Accept
          </button>
          <button className="flex-1 lg:flex-none px-4 py-2 border border-danger text-danger text-sm font-medium rounded-lg hover:bg-danger/5 transition-colors">
            Decline
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function InterviewWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="bg-white rounded-xl p-6 border-l-4 border-l-warning border-y border-r border-slate/10"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
          <CalendarCheck size={20} className="text-warning" />
        </div>
        <h2 className="font-display text-lg font-semibold text-midnight">
          Upcoming Interviews
        </h2>
      </div>

      {/* Interview list */}
      <div className="space-y-3 mb-4">
        {interviews.map((interview, index) => (
          <InterviewRow
            key={interview.id}
            interview={interview}
            index={index}
          />
        ))}
      </div>

      {/* View all link */}
      <Link
        href="/candidate/interviews"
        className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:gap-3 transition-all duration-200"
      >
        View All Interviews
        <ArrowRight size={16} />
      </Link>
    </motion.div>
  );
}
