"use client";

import { motion } from "framer-motion";
import JobCard, { Job } from "./JobCard";

interface JobsGridProps {
  jobs: Job[];
  onSave?: (jobId: string) => void;
  onApply?: (jobId: string) => void;
  onViewDetails?: (jobId: string) => void;
}

export default function JobsGrid({
  jobs,
  onSave,
  onApply,
  onViewDetails,
}: JobsGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {jobs.map((job, index) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
        >
          <JobCard
            job={job}
            onSave={onSave}
            onApply={onApply}
            onViewDetails={onViewDetails}
          />
        </motion.div>
      ))}
    </div>
  );
}
