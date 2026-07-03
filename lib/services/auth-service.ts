import { apiRequest } from "@/lib/services/api-client";

const AUTH_USER_KEY = "user";

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
  user: AuthUser;
};

export type VerifyEmailOtpPayload = {
  email: string;
  otp: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  email: string;
  otp: string;
  newPassword: string;
};

type MessageResponse = {
  message?: string;
};

type AuthSession = {
  user: AuthUser | null;
  loading: boolean;
};

type AuthSessionListener = () => void;

let authSession: AuthSession = {
  user: getStoredUser(),
  loading: true,
};

const authSessionListeners = new Set<AuthSessionListener>();

function emitAuthSessionChange(): void {
  for (const listener of authSessionListeners) {
    listener();
  }
}

function updateAuthSession(nextSession: Partial<AuthSession>): void {
  authSession = { ...authSession, ...nextSession };
  emitAuthSessionChange();
}

export function getAuthSessionSnapshot(): AuthSession {
  return authSession;
}

export function subscribeAuthSession(
  listener: AuthSessionListener,
): () => void {
  authSessionListeners.add(listener);
  return () => {
    authSessionListeners.delete(listener);
  };
}

function normalizeAuthUser(user: AuthUser): AuthUser {
  const normalizedName = user.name?.trim();
  const normalizedFullName = user.fullName?.trim();

  if (normalizedFullName) {
    return {
      ...user,
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

export function persistAuthUser(user: AuthUser): void {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedUser = normalizeAuthUser(user);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(normalizedUser));
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(AUTH_USER_KEY);
}

export function setAuthSessionUser(user: AuthUser | null): void {
  if (user) {
    persistAuthUser(user);
  } else {
    clearAuthSession();
  }

  updateAuthSession({ user, loading: false });
}

export function setAuthSessionLoading(loading: boolean): void {
  updateAuthSession({ loading });
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

export function getStoredUserId(): number | null {
  const storedUser = getStoredUser();
  return storedUser?.id ?? null;
}

export async function registerUser(
  payload: RegisterPayload,
): Promise<AuthUser> {
  return apiRequest<AuthUser>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: LoginPayload): Promise<AuthUser> {
  const data = await apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const normalizedUser = normalizeAuthUser(data.user);
  persistAuthUser(normalizedUser);
  updateAuthSession({ user: normalizedUser, loading: false });
  return normalizedUser;
}

export async function verifyEmailOtp(
  payload: VerifyEmailOtpPayload,
): Promise<MessageResponse> {
  return apiRequest<MessageResponse>("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({
      email: payload.email,
      otp: payload.otp,
    }),
  });
}

export async function resendVerificationOtp(
  email: string,
): Promise<MessageResponse> {
  return apiRequest<MessageResponse>("/auth/resend-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function forgotPassword(
  payload: ForgotPasswordPayload,
): Promise<MessageResponse> {
  return apiRequest<MessageResponse>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email: payload.email }),
  });
}

export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<MessageResponse> {
  return apiRequest<MessageResponse>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({
      email: payload.email,
      otp: payload.otp,
      newPassword: payload.newPassword,
    }),
  });
}

export async function logoutUser(): Promise<void> {
  try {
    await apiRequest<MessageResponse>("/auth/logout", { method: "POST" });
  } finally {
    clearAuthSession();
    updateAuthSession({ user: null, loading: false });
  }
}

export async function getProfile(): Promise<AuthUser> {
  const storedUser = getStoredUser();
  if (storedUser) {
    persistAuthUser(storedUser);
    return storedUser;
  }

  const profile = await apiRequest<AuthUser>("/auth/session", {
    method: "GET",
  });
  const normalizedProfile = normalizeAuthUser(profile);
  persistAuthUser(normalizedProfile);
  return normalizedProfile;
}

if (typeof window !== "undefined") {
  window.addEventListener("auth:unauthorized", () => {
    if (authSession.user) {
      setAuthSessionUser(null);
    }
  });
}