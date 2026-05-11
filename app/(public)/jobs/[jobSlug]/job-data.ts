export function getJobData(jobSlug: string): never {
  throw new Error(
    "job-data.ts was removed. Use lib/services/jobsService.getPublicJobBySlug instead.",
  );
}
