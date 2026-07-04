import { authService } from "@/services/auth.service";
import type { AuthUser, LoginPayload } from "@/types/auth.types";

const AUTH_USER_KEY = "user";

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
    return { ...user, name: normalizedFullName, fullName: normalizedFullName };
  }
  if (normalizedName) {
    return { ...user, name: normalizedName, fullName: normalizedName };
  }
  return user;
}

function persistAuthUser(user: AuthUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(normalizeAuthUser(user)));
}

function clearAuthUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_USER_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const userRaw = localStorage.getItem(AUTH_USER_KEY);
  if (!userRaw) return null;

  try {
    return normalizeAuthUser(JSON.parse(userRaw) as AuthUser);
  } catch {
    clearAuthUser();
    return null;
  }
}

export function getStoredUserId(): string | null {
  return getStoredUser()?.id ?? null;
}

export function setAuthSessionUser(user: AuthUser | null): void {
  if (user) {
    persistAuthUser(user);
  } else {
    clearAuthUser();
  }
  updateAuthSession({ user, loading: false });
}

export function setAuthSessionLoading(loading: boolean): void {
  updateAuthSession({ loading });
}

// Orchestrates: call the service, then sync local session state
export async function login(payload: LoginPayload): Promise<AuthUser> {
  const { user } = await authService.login(payload);
  setAuthSessionUser(user);
  return user;
}

export async function logout(): Promise<void> {
  try {
    await authService.logout();
  } finally {
    setAuthSessionUser(null);
  }
}

export async function getProfile(): Promise<AuthUser> {
  const stored = getStoredUser();
  if (stored) return stored;

  const profile = await authService.getSession();
  setAuthSessionUser(profile);
  return profile;
}

if (typeof window !== "undefined") {
  window.addEventListener("auth:unauthorized", () => {
    if (getAuthSessionSnapshot().user) {
      setAuthSessionUser(null);
    }
  });
}