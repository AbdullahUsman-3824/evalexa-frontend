"use client";

import { motion } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface Job {
  id: string;
  title: string;
  applicants: number;
}

export default function ActiveJobsPreview() {
  const router = useRouter();

  const activeJobs: Job[] = [
    { id: "1", title: "Senior Frontend Developer", applicants: 42 },
    { id: "2", title: "Product Marketing Manager", applicants: 38 },
    { id: "3", title: "Data Scientist", applicants: 29 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-xl border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-syne text-lg font-semibold text-midnight">
          Currently Hiring For
        </h2>
        <button
          onClick={() => router.push("/recruiter/jobs")}
          className="flex items-center gap-1.5 text-primary hover:text-blue-600 text-sm font-medium transition-colors"
        >
          See all job posts
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {activeJobs.map((job, index) => (
          <motion.button
            key={job.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={() => router.push(`/recruiter/jobs/${job.id}`)}
            className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary/30 hover:bg-surface/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                <span className="text-xl">💼</span>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-midnight text-sm mb-1">
                  {job.title}
                </h3>
                <div className="flex items-center gap-1.5 text-slate text-xs">
                  <Users className="w-3.5 h-3.5" />
                  {job.applicants} applicants
                </div>
              </div>
            </div>

            <ArrowRight className="w-5 h-5 text-slate group-hover:text-primary transition-colors" />
          </motion.button>
        ))}

        {activeJobs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate text-sm mb-3">No active job posts</p>
            <button
              onClick={() => router.push("/recruiter/jobs/post")}
              className="px-4 py-2 bg-primary hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Post a Job
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
