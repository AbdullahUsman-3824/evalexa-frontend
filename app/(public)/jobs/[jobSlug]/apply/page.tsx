import JobApplyHeader from "@/components/public/jobs/apply/JobApplyHeader";
import JobApplyTabs from "@/components/public/jobs/apply/JobApplyTabs";
import ApplicationTab from "@/components/public/jobs/apply/ApplicationTab";
import { getPublicJobBySlug } from "@/lib/services/jobsService";

type Props = { params: { jobSlug: string } };

export default async function PublicJobApplyPage({ params }: Props) {
  const jobSlug = params?.jobSlug;
  const job = await getPublicJobBySlug(jobSlug);

  if (!job) {
    return (
      <div className="min-h-screen bg-[#EEF2F7] px-4 py-10 text-midnight">
        <div className="mx-auto max-w-180 rounded-[14px] border border-[#E8ECF4] bg-white p-7 text-center shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          Job not found.
        </div>
      </div>
    );
  }

  const mapped = {
    company: job?.company?.name ?? "",
    title: job?.title ?? "",
    workMode: job?.workModel ?? "",
    postedBy: job?.company?.name ?? "",
    location: job?.location ?? "",
  };

  return (
    <div className="min-h-screen bg-[#EEF2F7] text-midnight">
      <JobApplyHeader
        company={mapped.company}
        title={mapped.title}
        workMode={mapped.workMode}
        postedBy={mapped.postedBy}
        location={mapped.location}
      />

      <JobApplyTabs />

      <main className="mx-auto max-w-180 px-4 pb-12 pt-7">
        <ApplicationTab />
      </main>
    </div>
  );
}
