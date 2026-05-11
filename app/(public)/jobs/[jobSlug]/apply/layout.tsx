import { JobApplicationFormProvider } from "./job-application-form-context";
import ApplyToast from "@/components/public/jobs/apply/ApplyToast";

export default function JobApplyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <JobApplicationFormProvider>
      {children}
      <ApplyToast />
    </JobApplicationFormProvider>
  );
}
