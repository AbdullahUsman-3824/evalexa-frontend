const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://evalexa-backend.vercel.app";

const AUTH_TOKEN_KEY = "access_token";
const AUTH_USER_KEY = "user";

type ApiErrorShape = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

export type AuthUser = {
  id: number;
  name?: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  companyId: number | null;
  isVerified: boolean;
  isActive: boolean;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role?: "recruiter" | "candidate";
};

export type LoginResponse = {
  access_token: string;
  user: AuthUser;
};

function normalizeAuthUser(user: AuthUser): AuthUser {
  const normalizedName = user.name?.trim();
  const normalizedFullName = user.fullName?.trim();

  if (normalizedFullName) {
    return {
      ...user,
      // Keep UI display consistent by treating fullName as source of truth.
      name: normalizedFullName,
      fullName: normalizedFullName,
    };
  }

  if (normalizedName) {
    return {
      ...user,
      name: normalizedName,
      fullName: normalizedName,
    };
  }

  return user;
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

  if (withAuth && typeof window !== "undefined") {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
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

export function persistAuthSession(data: LoginResponse): void {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedUser = normalizeAuthUser(data.user);
  localStorage.setItem(AUTH_TOKEN_KEY, data.access_token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(normalizedUser));
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const userRaw = localStorage.getItem(AUTH_USER_KEY);
  if (!userRaw) {
    return null;
  }

  try {
    return normalizeAuthUser(JSON.parse(userRaw) as AuthUser);
  } catch {
    clearAuthSession();
    return null;
  }
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(AUTH_TOKEN_KEY);
}

function decodeJwtPayload(token: string): { sub?: number } | null {
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    return JSON.parse(atob(paddedBase64)) as { sub?: number };
  } catch {
    return null;
  }
}

export function getStoredUserId(): number | null {
  const storedUser = getStoredUser();
  if (storedUser?.id) {
    return storedUser.id;
  }

  const token = getAuthToken();
  if (!token) {
    return null;
  }

  const payload = decodeJwtPayload(token);
  return typeof payload?.sub === "number" ? payload.sub : null;
}

export async function registerUser(
  payload: RegisterPayload,
): Promise<AuthUser> {
  return apiRequest<AuthUser>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const data = await apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  persistAuthSession(data);
  return data;
}

export async function logoutUser(): Promise<void> {
  // Current backend has no /auth/logout endpoint; clear local auth state.
  clearAuthSession();
}

export async function getProfile(): Promise<AuthUser> {
  const profile = await apiRequest<AuthUser>(
    "/auth/session",
    { method: "GET" },
    true,
  );
  const normalizedProfile = normalizeAuthUser(profile);
  const token = getAuthToken();
  if (token) {
    persistAuthSession({
      access_token: token,
      user: normalizedProfile,
    });
  }

  return normalizedProfile;
}
