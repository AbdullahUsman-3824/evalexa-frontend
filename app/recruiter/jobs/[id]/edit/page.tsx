"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, TriangleAlert } from "lucide-react";
import JobForm from "@/components/recruiter/jobs/management/JobForm";
import { getJob, type JobRecord } from "@/lib/services/jobsService";

export default function EditJobPage() {
  const params = useParams<{ id: string }>();
  const jobId = params?.id;

  const [isLoading, setIsLoading] = useState(true);
  const [job, setJob] = useState<JobRecord | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadJob = async () => {
      if (!jobId) {
        if (isActive) {
          setLoadError("Invalid job ID");
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setLoadError(null);

      try {
        const jobRecord = await getJob(jobId);
        if (isActive) {
          setJob(jobRecord);
        }
      } catch (error) {
        if (isActive) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Unable to load job details",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadJob();

    return () => {
      isActive = false;
    };
  }, [jobId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface p-6 text-midnight">
        <div className="flex items-center gap-3 text-slate">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          Loading job details...
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface p-6 text-midnight">
        <div className="rounded-xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger">
          <div className="flex items-center gap-2">
            <TriangleAlert className="h-4 w-4" />
            <span>{loadError}</span>
          </div>
        </div>
      </div>
    );
  }

  return <JobForm mode="edit" data={job} />;
}
