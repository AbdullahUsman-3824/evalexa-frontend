import { apiRequest } from "@/lib/services/api-client";

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
  // required
  name: string;
  industry: string;
  location: string;
  // optional text fields
  description?: string;
  size?: CompanySize;
  foundedYear?: number;
  type?: CompanyType;
  website?: string;
  email?: string;
  // optional file fields
  logo?: File;
  banner?: File;
  verificationDocuments?: File[];
};

export type UpdateCompanyPayload = Partial<CreateCompanyPayload>;

// ─── FormData builder ──────────────────────────────────────

function buildCompanyFormData(
  payload: CreateCompanyPayload | UpdateCompanyPayload,
): FormData {
  const form = new FormData();
  const { logo, banner, verificationDocuments, ...fields } = payload;

  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined && value !== null) {
      form.append(key, String(value));
    }
  }

  if (logo) {
    form.append("logo", logo);
  }

  if (banner) {
    form.append("banner", banner);
  }

  if (verificationDocuments?.length) {
    for (const doc of verificationDocuments) {
      form.append("verificationDocuments", doc);
    }
  }

  return form;
}

// ─── Recruiter-facing functions ──────────────────────────────────────

/** Create a company for the authenticated recruiter — requires JWT auth. */
export async function createCompany(
  payload: CreateCompanyPayload,
): Promise<Company> {
  return apiRequest<Company>("/companies", {
    method: "POST",
    body: buildCompanyFormData(payload),
  });
}

/** Fetch all companies created by the authenticated recruiter — requires JWT auth. */
export async function getCompanies(): Promise<Company[]> {
  return apiRequest<Company[]>("/companies", {
    method: "GET",
  });
}

/** Fetch a company by ID — requires JWT auth. */
export async function getCompany(id: string): Promise<Company> {
  return apiRequest<Company>(`/companies/${id}`, {
    method: "GET",
  });
}

/** Update a company by ID — requires JWT auth. */
export async function updateCompany(
  id: string,
  payload: UpdateCompanyPayload,
): Promise<Company> {
  return apiRequest<Company>(`/companies/${id}`, {
    method: "PATCH",
    body: buildCompanyFormData(payload),
  });
}

/** Delete a company by ID — requires JWT auth. */
export async function deleteCompany(id: string): Promise<Company> {
  return apiRequest<Company>(`/companies/${id}`, {
    method: "DELETE",
  });
}

/**
 * Get short-lived signed URLs for a company's verification documents.
 * URLs expire after 5 minutes — call fresh each time, don't cache.
 * Requires JWT auth.
 */
export async function getVerificationDocumentUrls(
  companyId: string,
): Promise<string[]> {
  return apiRequest<string[]>(
    `/companies/${companyId}/verification-documents`,
    { method: "GET" },
  );
}

// ─── Public functions ─────────────────────────────────────────────────────────

/** Fetch public companies with open job counts. */
export async function getPublicCompanies(
  query: PublicCompaniesQuery = {},
): Promise<PublicCompaniesResponse> {
  const params = new URLSearchParams();

  if (query.page !== undefined) params.set("page", String(query.page));
  if (query.limit !== undefined) params.set("limit", String(query.limit));
  if (query.search?.trim()) params.set("search", query.search.trim());
  if (query.industry?.trim()) params.set("industry", query.industry.trim());
  if (query.sort) params.set("sort", query.sort);

  const queryString = params.toString();
  const path = queryString
    ? `/public/companies?${queryString}`
    : "/public/companies";

  return apiRequest<PublicCompaniesResponse>(path, { method: "GET" });
}

/** Fetch a public-safe company profile with an open jobs count. */
export async function getPublicCompany(
  companySlug: string,
): Promise<PublicCompanyDetails> {
  return apiRequest<PublicCompanyDetails>(
    `/public/companies/${encodeURIComponent(companySlug)}`,
    { method: "GET" },
  );
}

/** Fetch public open jobs for a specific company. */
export async function getPublicCompanyJobs(
  companySlug: string,
  query: PublicCompanyJobsQuery = {},
): Promise<PublicCompanyJobsResponse> {
  const params = new URLSearchParams();

  if (query.page !== undefined) params.set("page", String(query.page));
  if (query.limit !== undefined) params.set("limit", String(query.limit));
  if (query.search?.trim()) params.set("search", query.search.trim());
  if (query.jobType) params.set("jobType", query.jobType);
  if (query.workModel) params.set("workModel", query.workModel);
  if (query.sort) params.set("sort", query.sort);

  const queryString = params.toString();
  const path = queryString
    ? `/public/companies/${encodeURIComponent(companySlug)}/jobs?${queryString}`
    : `/public/companies/${encodeURIComponent(companySlug)}/jobs`;

  return apiRequest<PublicCompanyJobsResponse>(path, { method: "GET" });
}