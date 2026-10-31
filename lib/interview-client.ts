import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/lib/api-client";

const INTERVIEW_TOKEN_STORAGE_KEY = "evalexa_interview_session_token";
let inMemoryInterviewToken: string | null = null;

type ApiErrorShape = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

export function getInterviewSessionToken(): string | null {
  if (typeof window !== "undefined") {
    const sessionValue = sessionStorage.getItem(INTERVIEW_TOKEN_STORAGE_KEY);
    if (sessionValue) {
      inMemoryInterviewToken = sessionValue;
      return sessionValue;
    }

    const localValue = localStorage.getItem(INTERVIEW_TOKEN_STORAGE_KEY);
    if (localValue) {
      inMemoryInterviewToken = localValue;
      return localValue;
    }
  }

  return inMemoryInterviewToken;
}

export function setInterviewSessionToken(token: string | null): void {
  inMemoryInterviewToken = token;

  if (typeof window === "undefined") return;

  if (token) {
    sessionStorage.setItem(INTERVIEW_TOKEN_STORAGE_KEY, token);
    return;
  }

  sessionStorage.removeItem(INTERVIEW_TOKEN_STORAGE_KEY);
  localStorage.removeItem(INTERVIEW_TOKEN_STORAGE_KEY);
}

export function clearInterviewSessionToken(): void {
  setInterviewSessionToken(null);
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

  const token = getInterviewSessionToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  config.headers = headers;

  return config;
});

interviewClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorShape | string>) => {
    if (error.response) {
      const { status, data } = error.response;

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

export async function interviewRequest<T>(
  path: string,
  options: AxiosRequestConfig = {},
): Promise<T> {
  const response = await interviewClient.request<T>({
    url: path,
    ...options,
  });

  return response.data;
}
