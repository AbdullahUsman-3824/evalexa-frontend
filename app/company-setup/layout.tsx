import { ProtectedRoute } from "@/components/protected-route";

export default function CompanySetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}