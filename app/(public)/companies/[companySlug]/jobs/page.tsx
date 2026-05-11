import PublicCompanyJobsSection from "@/components/public/companies/PublicCompanyJobsSection";

type CompanyJobsPageProps = {
  params: Promise<{
    companySlug: string;
  }>;
};

export default async function CompanyJobsPage({
  params,
}: CompanyJobsPageProps) {
  const { companySlug } = await params;

  return <PublicCompanyJobsSection companySlug={companySlug} />;
}
