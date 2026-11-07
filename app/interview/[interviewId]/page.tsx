import InterviewSetupScreen from "@/components/interview/candidate/setup/InterviewSetupScreen";

interface InterviewRoutePageProps {
  params: Promise<{ interviewId: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function InterviewRoutePage({
  params,
  searchParams,
}: InterviewRoutePageProps) {
  const { interviewId } = await params;
  const { token = "" } = await searchParams;

  return <InterviewSetupScreen interviewId={interviewId} token={token} />;
}
