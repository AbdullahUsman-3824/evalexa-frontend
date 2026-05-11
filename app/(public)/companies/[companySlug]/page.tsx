import PublicCompanyDetailsSection from "@/components/public/companies/PublicCompanyDetailsSection";

type CompanyDetailPageProps = {
  params: Promise<{
    companySlug: string;
  }>;
};

export default async function CompanyDetailPage({
  params,
}: CompanyDetailPageProps) {
  const { companySlug } = await params;

  return <PublicCompanyDetailsSection companySlug={companySlug} />;
}
