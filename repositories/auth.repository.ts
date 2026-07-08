import { authService } from "@/services/auth.service";
import { store } from "@/store";
import { setAuthUser, setAuthLoading } from "@/store/slices/auth/auth.slice";
import type { AuthUser, LoginPayload } from "@/types/auth.types";

const AUTH_USER_KEY = "user";

export function normalizeAuthUser(user: AuthUser): AuthUser {
  const fullName = user.fullName?.trim();
  const name = user.name?.trim();

  if (fullName) return { ...user, name: fullName, fullName };
  if (name) return { ...user, name, fullName: name };
  return user;
}

export function persistUser(user: AuthUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(normalizeAuthUser(user)));
}

export function clearPersistedUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_USER_KEY);
}

export function readPersistedUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;

  try {
    return normalizeAuthUser(JSON.parse(raw) as AuthUser);
  } catch {
    clearPersistedUser();
    return null;
  }
}

// Call once on app mount to seed the slice from localStorage (see StoreProvider)
export function hydrateFromStorage(): void {
  store.dispatch(setAuthUser(readPersistedUser()));
}

export function setUser(user: AuthUser | null): void {
  if (user) persistUser(user);
  else clearPersistedUser();
  store.dispatch(setAuthUser(user));
}

export async function login(payload: LoginPayload): Promise<AuthUser> {
  const { user } = await authService.login(payload);
  setUser(user);
  return user;
}

export async function logout(): Promise<void> {
  try {
    await authService.logout();
  } finally {
    setUser(null);
  }
}

// Slice-first, API-fallback, as requested
export async function getProfile(): Promise<AuthUser> {
  const cached = store.getState().auth.user;
  if (cached) return cached;

  store.dispatch(setAuthLoading(true));
  const profile = await authService.getSession();
  setUser(profile);
  return profile;
}

export async function refreshProfile(): Promise<AuthUser> {
  const profile = await authService.getSession();
  setUser(profile);
  return profile;
}

if (typeof window !== "undefined") {
  window.addEventListener("auth:unauthorized", () => {
    if (store.getState().auth.user) setUser(null);
  });
}

export const authRepository = {
  hydrateFromStorage,
  login,
  logout,
  getProfile,
  refreshProfile,
  setUser,
};
