import { notFound } from "next/navigation";
import { getPublicJobBySlug } from "@/repositories/job.repository";

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
      {children}
    </div>
  );
}