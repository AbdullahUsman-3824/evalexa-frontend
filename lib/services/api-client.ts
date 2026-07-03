export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://evalexa-backend.vercel.app";

type ApiErrorShape = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

export async function parseApiResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? ((await response.json()) as T | ApiErrorShape)
    : await response.text();

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth:unauthorized"));
    }

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
): Promise<T> {
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  return parseApiResponse<T>(response);
}
