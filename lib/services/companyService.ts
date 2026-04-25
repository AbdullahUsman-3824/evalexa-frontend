import { apiRequest } from "@/lib/services/apiClient";

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
  return apiRequest<Company>(
    "/companies",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    true,
  );
}

/** Fetch all companies created by the authenticated recruiter — requires JWT auth. */
export async function getCompanies(): Promise<Company[]> {
  return apiRequest<Company[]>(
    "/companies",
    {
      method: "GET",
    },
    true,
  );
}

/** Fetch a company by ID — requires JWT auth. */
export async function getCompany(id: number): Promise<Company> {
  return apiRequest<Company>(
    `/companies/${id}`,
    {
      method: "GET",
    },
    true,
  );
}

/** Update a company by ID — requires JWT auth. */
export async function updateCompany(
  id: number,
  payload: Partial<CreateCompanyPayload>,
): Promise<Company> {
  return apiRequest<Company>(
    `/companies/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
    true,
  );
}

/** Delete a company by ID — requires JWT auth. */
export async function deleteCompany(id: number): Promise<Company> {
  return apiRequest<Company>(
    `/companies/${id}`,
    {
      method: "DELETE",
    },
    true,
  );
}
