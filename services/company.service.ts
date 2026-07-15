// services/company.service.ts
import { apiRequest } from "@/lib/api-client";
import type {
  Company,
  CreateCompanyPayload,
  UpdateCompanyPayload,
  PublicCompaniesQuery,
  PublicCompaniesResponse,
  PublicCompanyDetails,
  PublicCompanyJobsQuery,
  PublicCompanyJobsResponse,
  CompanyStats,
} from "@/types/company.types";
import { API } from "@/constants/api";

// ─── FormData builder (service-internal, not exported) ─────

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

  if (logo) form.append("logo", logo);
  if (banner) form.append("banner", banner);

  if (verificationDocuments?.length) {
    for (const doc of verificationDocuments) {
      form.append("verificationDocuments", doc);
    }
  }

  return form;
}

function buildPublicCompaniesQueryString(query: PublicCompaniesQuery): string {
  const params = new URLSearchParams();
  if (query.page !== undefined) params.set("page", String(query.page));
  if (query.limit !== undefined) params.set("limit", String(query.limit));
  if (query.search?.trim()) params.set("search", query.search.trim());
  if (query.industry?.trim()) params.set("industry", query.industry.trim());
  if (query.sort) params.set("sort", query.sort);
  return params.toString();
}

function buildPublicCompanyJobsQueryString(
  query: PublicCompanyJobsQuery,
): string {
  const params = new URLSearchParams();
  if (query.page !== undefined) params.set("page", String(query.page));
  if (query.limit !== undefined) params.set("limit", String(query.limit));
  if (query.search?.trim()) params.set("search", query.search.trim());
  if (query.jobType) params.set("jobType", query.jobType);
  if (query.workModel) params.set("workModel", query.workModel);
  if (query.sort) params.set("sort", query.sort);
  return params.toString();
}

export const companyService = {
  // ─── Recruiter-facing ──────────────────────────

  createCompany(payload: CreateCompanyPayload): Promise<Company> {
    return apiRequest<Company>(API.company.create, {
      method: "POST",
      data: buildCompanyFormData(payload),
    });
  },

  getCompanies(): Promise<Company[]> {
    return apiRequest<Company[]>(API.company.list, { method: "GET" });
  },

  getCompany(id: string): Promise<Company> {
    return apiRequest<Company>(API.company.getOne(id), { method: "GET" });
  },

  updateCompany(id: string, payload: UpdateCompanyPayload): Promise<Company> {
    return apiRequest<Company>(API.company.update(id), {
      method: "PATCH",
      data: buildCompanyFormData(payload),
    });
  },

  deleteCompany(id: string): Promise<Company> {
    return apiRequest<Company>(API.company.delete(id), { method: "DELETE" });
  },

  getVerificationDocumentUrls(companyId: string): Promise<string[]> {
    return apiRequest<string[]>(API.company.verificationDocuments(companyId), {
      method: "GET",
    });
  },

  // ─── Stats ─────────────────────────────────────

  getCompanyStats(companyId: string): Promise<CompanyStats> {
    return apiRequest<CompanyStats>(API.company.getStats(companyId), {
      method: "GET",
    });
  },
  // ─── Public ─────────────────────────────────────

  getPublicCompanies(
    query: PublicCompaniesQuery = {},
  ): Promise<PublicCompaniesResponse> {
    const queryString = buildPublicCompaniesQueryString(query);
    const path = queryString
      ? `${API.company.listPublic}?${queryString}`
      : API.company.listPublic;
    return apiRequest<PublicCompaniesResponse>(path, { method: "GET" });
  },

  getPublicCompany(companySlug: string): Promise<PublicCompanyDetails> {
    return apiRequest<PublicCompanyDetails>(
      API.company.getOnePublic(companySlug),
      { method: "GET" },
    );
  },

  getPublicCompanyJobs(
    companySlug: string,
    query: PublicCompanyJobsQuery = {},
  ): Promise<PublicCompanyJobsResponse> {
    const queryString = buildPublicCompanyJobsQueryString(query);
    const path = queryString
      ? `${API.company.listPublicJobs(companySlug)}?${queryString}`
      : API.company.listPublicJobs(companySlug);
    return apiRequest<PublicCompanyJobsResponse>(path, { method: "GET" });
  },
};
