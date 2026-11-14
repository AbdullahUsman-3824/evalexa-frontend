import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/lib/api-client";

type ApiErrorShape = {
  message?: string | string[];
  error?: string;
  code?: string;
  statusCode?: number;
};

export class InterviewApiError extends Error {
  status?: number;
  code?: string;
  payload?: unknown;

  constructor(
    message: string,
    extra: { status?: number; code?: string; payload?: unknown } = {},
  ) {
    super(message);
    this.name = "InterviewApiError";
    this.status = extra.status;
    this.code = extra.code;
    this.payload = extra.payload;
  }
}

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
        throw new InterviewApiError(
          envelope.message || envelope.code || "Request failed",
          {
            status: response.status,
            code: envelope.code,
            payload: envelope,
          },
        );
      }

      response.data = (envelope.data ?? null) as typeof response.data;
    }

    return response;
  },
  (error: AxiosError<ApiErrorShape | string>) => {
    if (error.response) {
      const { status, data } = error.response;

      if (typeof data === "string") {
        throw new InterviewApiError(data || `Request failed (${status})`, {
          status,
        });
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
        throw new InterviewApiError(
          "Too many requests. Please wait a moment and try again.",
          { status },
        );
      }

      throw new InterviewApiError(errorMessage, {
        status,
        code: data?.code,
        payload: data,
      });
    }

    throw new InterviewApiError(error.message || "Network error");
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