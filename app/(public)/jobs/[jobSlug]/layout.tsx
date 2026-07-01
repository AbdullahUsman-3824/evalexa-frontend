import { notFound } from "next/navigation";
import JobApplyHeader from "@/components/public/jobs/apply/JobApplyHeader";
import { getPublicJobBySlug } from "@/lib/services/jobs-service";

type Props = Readonly<{
  children: React.ReactNode;
  params: Promise<{ jobSlug: string }>;
}>;

export default async function JobDetailLayout({ children, params }: Props) {
  const { jobSlug } = await params;
  if (!jobSlug) notFound();

  const job = await getPublicJobBySlug(jobSlug);
  if (!job) notFound();

  return (
    <div className="min-h-screen bg-[#EEF2F7] text-midnight">
      <JobApplyHeader
        company={job.company?.name ?? ""}
        title={job.title ?? ""}
        workMode={job.workModel ?? ""}
        postedBy={job.company?.name ?? ""}
        location={job.location ?? ""}
      />
      {children}
    </div>
  );
}
