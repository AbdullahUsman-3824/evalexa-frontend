// ─── Enums ──────────────────────────────────────────

export type CompanySize =
  | "STARTUP_1_10"
  | "SMALL_11_50"
  | "MEDIUM_51_200"
  | "LARGE_201_500"
  | "ENTERPRISE_500_PLUS";

export type CompanyType =
  | "STARTUP"
  | "AGENCY"
  | "ENTERPRISE"
  | "NON_PROFIT"
  | "GOVERNMENT";

export type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export type SubscriptionPlan = "FREE" | "BASIC" | "PRO" | "ENTERPRISE";

// ─── Public types (candidate-facing) ───────────────────────

export type PublicCompany = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  banner: string | null;
  industry: string;
  size: CompanySize | null;
  type: CompanyType | null;
  website: string | null;
  location: string;
  description: string | null;
  verificationStatus: VerificationStatus;
  createdAt: string;
  updatedAt: string;
  openJobsCount: number;
};

export type PublicCompaniesPagination = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PublicCompaniesResponse = {
  items: PublicCompany[];
  pagination: PublicCompaniesPagination;
};

export type PublicCompaniesSort =
  | "newest"
  | "name-asc"
  | "name-desc"
  | "jobs-high"
  | "jobs-low";

export type PublicCompaniesQuery = {
  page?: number;
  limit?: number;
  search?: string;
  industry?: string;
  sort?: PublicCompaniesSort;
};

export type PublicCompanyDetails = PublicCompany;

// ─── Public job types ────────────────────────────────────

export type PublicJobSort = "newest" | "deadline";

export type PublicCompanyJob = {
  id: string;
  slug: string;
  title: string;
  location: string;
  workModel: "ONSITE" | "REMOTE" | "HYBRID";
  jobType: "FULL_TIME" | "PART_TIME" | "CONTRACT";
  salaryMin: number | null;
  salaryMax: number | null;
  applicationDeadline: string;
  createdAt: string;
  updatedAt: string;
};

export type PublicJobsPagination = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PublicCompanyJobsResponse = {
  items: PublicCompanyJob[];
  pagination: PublicJobsPagination;
};

export type PublicCompanyJobsQuery = {
  page?: number;
  limit?: number;
  search?: string;
  jobType?: "FULL_TIME" | "PART_TIME" | "CONTRACT";
  workModel?: "ONSITE" | "REMOTE" | "HYBRID";
  sort?: PublicJobSort;
};

// ─── Owner/recruiter types ───────────────────────────────────

export type Company = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  banner: string | null;
  industry: string;
  size: CompanySize | null;
  foundedYear: number | null;
  type: CompanyType | null;
  website: string | null;
  location: string;
  description: string | null;
  email: string | null;
  verificationDocuments: string[];
  verificationStatus: VerificationStatus;
  subscriptionPlan: SubscriptionPlan;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateCompanyPayload = {
  name: string;
  industry: string;
  location: string;
  description?: string;
  size?: CompanySize;
  foundedYear?: number;
  type?: CompanyType;
  website?: string;
  email?: string;
  logo?: File;
  banner?: File;
  verificationDocuments?: File[];
};

// ─── Company stats ────────────────────────────────────

export type CompanyStats = {
  activeJobs: number;
  totalJobsPosted: number;
  totalApplicants: number;
  totalShortlisted: number;
  totalInterviews: number;
  totalHires: number;
  avgResponseTimeHours: number;
  avgTimeToHireDays: number;
  candidateRating: number;
};

export type UpdateCompanyPayload = Partial<CreateCompanyPayload>;
