import JobApplyHeader from "@/components/public/jobs/apply/JobApplyHeader";
import JobApplyTabs from "@/components/public/jobs/apply/JobApplyTabs";
import JobOverviewSection from "@/components/public/jobs/apply/JobOverviewSection";
import { getPublicJobBySlug } from "@/lib/services/jobsService";

type Props = { params: Promise<{ jobSlug: string }> };

export default async function JobDetailPage({ params }: Props) {
  const { jobSlug } = await params;
  if (!jobSlug) {
    throw new Error("Job slug is required");
  }
  const job = await getPublicJobBySlug(jobSlug);

  const mapped = {
    company: job?.company?.name ?? "",
    title: job?.title ?? "",
    workMode: job?.workModel ?? "",
    postedBy: job?.company?.name ?? "",
    location: job?.location ?? "",
    jobData: {
      description: job?.description ?? "",
      responsibilities: [],
      requirements: [],
    },
  };

  return (
    <main className="mx-auto mb-24 max-w-6xl px-4 sm:px-6">
      <div className="mx-auto mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr,380px]">
        <div>
          <JobApplyHeader
            company={mapped.company}
            title={mapped.title}
            workMode={mapped.workMode}
            postedBy={mapped.postedBy}
            location={mapped.location}
          />

          <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[1fr,360px]">
            <JobOverviewSection
              jobData={mapped.jobData}
              applyHref={`/jobs/${jobSlug}/apply`}
            />

            <aside>
              <JobApplyTabs />
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
