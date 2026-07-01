import { apiRequest } from "@/lib/services/api-client";

export type PublicCompany = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  industry: string;
  companySize: string;
  website: string | null;
  location: string;
  description: string | null;
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

export type PublicCompaniesQuery = {
  page?: number;
  limit?: number;
  search?: string;
  industry?: string;
  sort?: "newest" | "name-asc" | "name-desc" | "jobs-high" | "jobs-low";
};

export type PublicCompanyDetails = PublicCompany;

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

export type Company = {
  id: number;
  name: string;
  logo: string | null;
  industry: string;
  companySize: string;
  website: string | null;
  location: string;
  description: string | null;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateCompanyPayload = {
  name: string;
  logo?: string;
  industry: string;
  companySize: string;
  website?: string;
  location: string;
  description?: string;
};

/** Create a company for the authenticated recruiter — requires JWT auth. */
export async function createCompany(
  payload: CreateCompanyPayload,
): Promise<Company> {
  return apiRequest<Company>("/companies", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Fetch all companies created by the authenticated recruiter — requires JWT auth. */
export async function getCompanies(): Promise<Company[]> {
  return apiRequest<Company[]>("/companies", {
    method: "GET",
  });
}

/** Fetch public companies with open job counts. */
export async function getPublicCompanies(
  query: PublicCompaniesQuery = {},
): Promise<PublicCompaniesResponse> {
  const params = new URLSearchParams();

  if (query.page !== undefined) {
    params.set("page", String(query.page));
  }

  if (query.limit !== undefined) {
    params.set("limit", String(query.limit));
  }

  if (query.search?.trim()) {
    params.set("search", query.search.trim());
  }

  if (query.industry?.trim()) {
    params.set("industry", query.industry.trim());
  }

  if (query.sort) {
    params.set("sort", query.sort);
  }

  const path = params.toString()
    ? `/public/companies?${params.toString()}`
    : "/public/companies";

  return apiRequest<PublicCompaniesResponse>(path, {
    method: "GET",
  });
}

/** Fetch a public-safe company profile with an open jobs count. */
export async function getPublicCompany(
  companySlug: string,
): Promise<PublicCompanyDetails> {
  return apiRequest<PublicCompanyDetails>(
    `/public/companies/${encodeURIComponent(companySlug)}`,
    {
      method: "GET",
    },
  );
}

/** Fetch public open jobs for a specific company. */
export async function getPublicCompanyJobs(
  companySlug: string,
  query: PublicCompanyJobsQuery = {},
): Promise<PublicCompanyJobsResponse> {
  const params = new URLSearchParams();

  if (query.page !== undefined) {
    params.set("page", String(query.page));
  }

  if (query.limit !== undefined) {
    params.set("limit", String(query.limit));
  }

  if (query.search?.trim()) {
    params.set("search", query.search.trim());
  }

  if (query.jobType) {
    params.set("jobType", query.jobType);
  }

  if (query.workModel) {
    params.set("workModel", query.workModel);
  }

  if (query.sort) {
    params.set("sort", query.sort);
  }

  const queryString = params.toString();
  const path = queryString
    ? `/public/companies/${encodeURIComponent(companySlug)}/jobs?${queryString}`
    : `/public/companies/${encodeURIComponent(companySlug)}/jobs`;

  return apiRequest<PublicCompanyJobsResponse>(path, {
    method: "GET",
  });
}

/** Fetch a company by ID — requires JWT auth. */
export async function getCompany(id: number): Promise<Company> {
  return apiRequest<Company>(`/companies/${id}`, {
    method: "GET",
  });
}

/** Update a company by ID — requires JWT auth. */
export async function updateCompany(
  id: number,
  payload: Partial<CreateCompanyPayload>,
): Promise<Company> {
  return apiRequest<Company>(`/companies/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

/** Delete a company by ID — requires JWT auth. */
export async function deleteCompany(id: number): Promise<Company> {
  return apiRequest<Company>(`/companies/${id}`, {
    method: "DELETE",
  });
}
