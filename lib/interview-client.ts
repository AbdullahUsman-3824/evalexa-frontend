import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/lib/api-client";

type ApiErrorShape = {
  message?: string | string[];
  error?: string;
  code?: string;
  statusCode?: number;
};

export const interviewClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

interviewClient.interceptors.request.use((config) => {
  const headers = new AxiosHeaders(config.headers ?? {});

  if (config.data instanceof FormData) {
    headers.delete("Content-Type");
  }

  config.headers = headers;
  return config;
});

interviewClient.interceptors.response.use(
  (response) => {
    const payload = response.data;

    if (payload && typeof payload === "object" && "success" in payload) {
      const envelope = payload as {
        success: boolean;
        data?: unknown;
        message?: string;
        code?: string;
      };

      if (envelope.success === false) {
        const error = new Error(
          envelope.message || envelope.code || "Request failed",
        ) as Error & { code?: string; payload?: typeof envelope };
        error.code = envelope.code;
        error.payload = envelope;
        throw error;
      }

      response.data = (envelope.data ?? null) as typeof response.data;
    }

    return response;
  },
  (error: AxiosError<ApiErrorShape | string>) => {
    if (error.response) {
      const { status, data } = error.response;

      if (typeof data === "string") {
        throw new Error(data || `Request failed (${status})`);
      }

      const parsedMessage = Array.isArray(data?.message)
        ? data.message.join(", ")
        : data?.message;

      const errorMessage =
        parsedMessage ||
        data?.error ||
        data?.code ||
        `Request failed (${status})`;

      if (status === 429) {
        throw new Error(
          "Too many requests. Please wait a moment and try again.",
        );
      }

      throw new Error(errorMessage);
    }

    throw new Error(error.message || "Network error");
  },
);

export async function interviewRequest<T>(
  path: string,
  options: AxiosRequestConfig = {},
): Promise<T> {
  const response = await interviewClient.request<T>({
    url: path,
    ...options,
  });

  return response.data as T;
}
