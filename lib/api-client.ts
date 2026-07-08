import axios, { AxiosError, AxiosRequestConfig } from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://evalexa-backend.vercel.app";

type ApiErrorShape = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Don't force JSON content-type for FormData — let axios set the boundary
apiClient.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorShape | string>) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401 && typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth:unauthorized"));
      }

      if (typeof data === "string") {
        throw new Error(data || `Request failed (${status})`);
      }

      const parsedMessage = Array.isArray(data?.message)
        ? data.message.join(", ")
        : data?.message;

      throw new Error(
        parsedMessage || data?.error || `Request failed (${status})`,
      );
    }

    throw new Error(error.message || "Network error");
  },
);

export async function apiRequest<T>(
  path: string,
  options: AxiosRequestConfig = {},
): Promise<T> {
  const response = await apiClient.request<T>({
    url: path,
    ...options,
  });

  return response.data;
}