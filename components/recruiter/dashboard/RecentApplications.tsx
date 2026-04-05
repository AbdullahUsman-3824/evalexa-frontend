"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

interface Application {
  id: string;
  candidateName: string;
  initials: string;
  avatarColor: string;
  role: string;
  matchScore: number;
  appliedTime: string;
  status: "New" | "Under Review" | "Shortlisted" | "Rejected";
}

export default function RecentApplications() {
  const router = useRouter();

  const applications: Application[] = [
    {
      id: "1",
      candidateName: "Sarah Johnson",
      initials: "SJ",
      avatarColor: "bg-blue-500",
      role: "Senior Frontend Developer",
      matchScore: 94,
      appliedTime: "2 hours ago",
      status: "New",
    },
    {
      id: "2",
      candidateName: "Michael Chen",
      initials: "MC",
      avatarColor: "bg-purple-500",
      role: "Data Scientist",
      matchScore: 88,
      appliedTime: "3 hours ago",
      status: "New",
    },
    {
      id: "3",
      candidateName: "Emily Rodriguez",
      initials: "ER",
      avatarColor: "bg-green-500",
      role: "Product Marketing Manager",
      matchScore: 91,
      appliedTime: "5 hours ago",
      status: "Under Review",
    },
    {
      id: "4",
      candidateName: "David Kim",
      initials: "DK",
      avatarColor: "bg-orange-500",
      role: "UX/UI Designer",
      matchScore: 86,
      appliedTime: "6 hours ago",
      status: "Shortlisted",
    },
    {
      id: "5",
      candidateName: "Lisa Anderson",
      initials: "LA",
      avatarColor: "bg-pink-500",
      role: "Senior Frontend Developer",
      matchScore: 82,
      appliedTime: "8 hours ago",
      status: "Under Review",
    },
    {
      id: "6",
      candidateName: "James Wilson",
      initials: "JW",
      avatarColor: "bg-indigo-500",
      role: "Data Scientist",
      matchScore: 79,
      appliedTime: "10 hours ago",
      status: "New",
    },
  ];

  const getStatusColor = (status: Application["status"]) => {
    switch (status) {
      case "New":
        return "bg-primary/10 text-primary";
      case "Under Review":
        return "bg-warning/10 text-warning";
      case "Shortlisted":
        return "bg-success/10 text-success";
      case "Rejected":
        return "bg-danger/10 text-danger";
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "bg-success/10 text-success border-success/20";
    if (score >= 80) return "bg-cyan/10 text-cyan border-cyan/20";
    if (score >= 70) return "bg-warning/10 text-warning border-warning/20";
    return "bg-slate/10 text-slate border-slate/20";
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-syne text-xl font-semibold text-midnight">
          Recent Applications
        </h2>
        <button
          onClick={() => router.push("/recruiter/applicants")}
          className="flex items-center gap-1.5 text-primary hover:text-blue-600 text-sm font-medium transition-colors"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        {applications.map((application, index) => (
          <motion.div
            key={application.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 hover:border-primary/30 hover:bg-surface/50 transition-all"
          >
            {/* Avatar */}
            <div
              className={`flex-shrink-0 w-11 h-11 ${application.avatarColor} rounded-full flex items-center justify-center text-white font-semibold text-sm`}
            >
              {application.initials}
            </div>

            {/* Candidate Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-midnight text-sm truncate">
                {application.candidateName}
              </h3>
              <p className="text-slate text-xs truncate">{application.role}</p>
            </div>

            {/* Match Score Badge */}
            <div
              className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold border ${getMatchScoreColor(
                application.matchScore,
              )}`}
            >
              {application.matchScore}%
            </div>

            {/* Status Badge */}
            <span
              className={`flex-shrink-0 px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(
                application.status,
              )}`}
            >
              {application.status}
            </span>

            {/* Applied Time */}
            <span className="hidden sm:block flex-shrink-0 text-slate text-xs">
              {application.appliedTime}
            </span>

            {/* Review Button */}
            <button
              onClick={() =>
                router.push(`/recruiter/applicants/${application.id}`)
              }
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              Review
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
