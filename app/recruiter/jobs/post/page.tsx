import JobForm from "@/components/recruiter/jobs/management/JobForm";
import CompanyGuard from "@/components/recruiter/CompanyGuard";

export default function CreateJobPage() {
  return (
    <CompanyGuard featureHint="job posting">
      <JobForm mode="create" />
    </CompanyGuard>
  );
}
