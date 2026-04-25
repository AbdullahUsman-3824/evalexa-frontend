export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://evalexa-backend.vercel.app";

export const AUTH_TOKEN_KEY = "access_token";

type ApiErrorShape = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export async function parseApiResponse<T>(response: Response): Promise<T> {
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

export async function apiRequest<T>(
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
