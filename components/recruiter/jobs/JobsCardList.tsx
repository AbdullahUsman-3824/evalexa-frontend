"use client";

import { JobListRecord } from "@/types/job.types";
import JobPostCard from "./JobPostCard";

interface JobsCardListProps {
  jobs: JobListRecord[];
}

export default function JobsCardList({ jobs }: JobsCardListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {jobs.map((job) => (
        <JobPostCard key={job.id} job={job} />
      ))}
    </div>
  );
}
