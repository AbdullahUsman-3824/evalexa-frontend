// const API_BASE_URL =
const API_BASE_URL = "https://evalexa-backend.vercel.app";
// const API_BASE_URL = "http://localhost:3000";

const AUTH_TOKEN_KEY = "access_token";

type ApiErrorShape = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

export type UserProfile = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  companyId: number | null;
  isVerified: boolean;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateUserPayload = {
  fullName?: string;
  email?: string;
  password?: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
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

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  withAuth = false,
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (withAuth) {
    const token = getAuthToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  return parseApiResponse<T>(response);
}

/** Fetch a single user by ID (public endpoint). */
export async function getUser(id: number): Promise<UserProfile> {
  return apiRequest<UserProfile>(`/users/${id}`);
}

/** Fetch all users (public endpoint). */
export async function getAllUsers(): Promise<UserProfile[]> {
  return apiRequest<UserProfile[]>("/users");
}

/** Partially update a user — requires JWT auth. */
export async function updateUser(
  id: number,
  payload: UpdateUserPayload,
): Promise<UserProfile> {
  return apiRequest<UserProfile>(
    `/users/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
    true, // withAuth
  );
}

/** Delete a user — requires JWT auth. */
export async function deleteUser(id: number): Promise<UserProfile> {
  return apiRequest<UserProfile>(
    `/users/${id}`,
    { method: "DELETE" },
    true, // withAuth
  );
}
