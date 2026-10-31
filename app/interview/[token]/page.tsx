import InterviewSetupScreen from "@/components/interview/candidate/setup/InterviewSetupScreen";

interface InterviewRoutePageProps {
  params: Promise<{ token: string }>;
}

export default async function InterviewRoutePage({
  params,
}: InterviewRoutePageProps) {
  const { token } = await params;

  return <InterviewSetupScreen token={token} />;
}
