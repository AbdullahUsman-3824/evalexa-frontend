"use client";

import { motion } from "framer-motion";
import { ArrowRight, Eye, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

interface Job {
  id: string;
  title: string;
  department: string;
  applicants: number;
  newToday: number;
  avgMatch: number;
  status: "Published" | "Draft" | "Closing Soon";
  target: number;
}

export default function ActiveJobsOverview() {
  const router = useRouter();

  const jobs: Job[] = [
    {
      id: "1",
      title: "Senior Frontend Developer",
      department: "Engineering",
      applicants: 42,
      newToday: 5,
      avgMatch: 87,
      status: "Published",
      target: 50,
    },
    {
      id: "2",
      title: "Product Marketing Manager",
      department: "Marketing",
      applicants: 38,
      newToday: 8,
      avgMatch: 92,
      status: "Published",
      target: 40,
    },
    {
      id: "3",
      title: "Data Scientist",
      department: "Data & Analytics",
      applicants: 29,
      newToday: 2,
      avgMatch: 78,
      status: "Closing Soon",
      target: 30,
    },
    {
      id: "4",
      title: "UX/UI Designer",
      department: "Design",
      applicants: 56,
      newToday: 12,
      avgMatch: 84,
      status: "Published",
      target: 60,
    },
  ];

  const getStatusColor = (status: Job["status"]) => {
    switch (status) {
      case "Published":
        return "bg-success/10 text-success";
      case "Draft":
        return "bg-slate/10 text-slate";
      case "Closing Soon":
        return "bg-warning/10 text-warning";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-syne text-xl font-semibold text-midnight">
          Active Job Posts
        </h2>
        <button
          onClick={() => router.push("/recruiter/jobs")}
          className="flex items-center gap-1.5 text-primary hover:text-blue-600 text-sm font-medium transition-colors"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="border border-gray-200 rounded-lg p-4 hover:border-primary/30 hover:shadow-md transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Left - Job Info */}
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-1">
                    <h3 className="font-syne text-base font-semibold text-midnight mb-1">
                      {job.title}
                    </h3>
                    <span className="inline-block px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      {job.department}
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      job.status,
                    )}`}
                  >
                    {job.status}
                  </span>
                </div>

                {/* Metrics */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span className="text-midnight font-medium">
                    {job.applicants} applicants
                  </span>
                  <span className="text-success font-medium">
                    +{job.newToday} today
                  </span>
                  <span className="text-cyan font-medium">
                    {job.avgMatch}% avg match
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-slate mb-1.5">
                    <span>Applicants Progress</span>
                    <span>
                      {job.applicants} / {job.target}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(job.applicants / job.target) * 100}%`,
                      }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>
              </div>

              {/* Right - Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push(`/recruiter/jobs/${job.id}`)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-surface hover:bg-gray-200 text-midnight text-sm font-medium rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() =>
                    router.push(`/recruiter/jobs/${job.id}/manage`)
                  }
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Manage
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
