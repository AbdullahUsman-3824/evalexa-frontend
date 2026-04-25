const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

const AUTH_TOKEN_KEY = "access_token";

type ApiErrorShape = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
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

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? ((await response.json()) as T | ApiErrorShape)
    : await response.text();

  if (!response.ok) {
    if (typeof body === "string") {
      throw new Error(body || `Request failed (${response.status})`);
    }
    const apiError = body as ApiErrorShape;
    const parsedMessage = Array.isArray(apiError.message)
      ? apiError.message.join(", ")
      : apiError.message;
    throw new Error(
      parsedMessage || apiError.error || `Request failed (${response.status})`,
    );
  }

  return body as T;
}

function buildAuthHeaders(): Headers {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");

  const token = getAuthToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
}

/** Create a company for the authenticated recruiter — requires JWT auth. */
export async function createCompany(
  payload: CreateCompanyPayload,
): Promise<Company> {
  const headers = buildAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/companies`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  return parseApiResponse<Company>(response);
}

/** Fetch all companies created by the authenticated recruiter — requires JWT auth. */
export async function getCompanies(): Promise<Company[]> {
  const headers = buildAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/companies`, {
    method: "GET",
    headers,
  });

  return parseApiResponse<Company[]>(response);
}

/** Fetch a company by ID — requires JWT auth. */
export async function getCompany(id: number): Promise<Company> {
  const headers = buildAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
    method: "GET",
    headers,
  });

  return parseApiResponse<Company>(response);
}

/** Update a company by ID — requires JWT auth. */
export async function updateCompany(
  id: number,
  payload: Partial<CreateCompanyPayload>,
): Promise<Company> {
  const headers = buildAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(payload),
  });

  return parseApiResponse<Company>(response);
}

/** Delete a company by ID — requires JWT auth. */
export async function deleteCompany(id: number): Promise<Company> {
  const headers = buildAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
    method: "DELETE",
    headers,
  });

  return parseApiResponse<Company>(response);
}
