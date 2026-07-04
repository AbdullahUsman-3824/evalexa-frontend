"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  ReactNode,
} from "react";
import {
  getAuthSessionSnapshot,
  getProfile,
  login as loginSession,
  logout as logoutSession,
  setAuthSessionLoading,
  setAuthSessionUser,
  subscribeAuthSession,
} from "@/store/auth-session";
import type { AuthContextType, LoginPayload } from "@/types/auth.types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useSyncExternalStore(
    subscribeAuthSession,
    getAuthSessionSnapshot,
    getAuthSessionSnapshot,
  );

  async function refetchUser() {
    try {
      const profile = await getProfile();
      setAuthSessionUser(profile);
    } catch {
      setAuthSessionUser(null);
    }
  }

  useEffect(() => {
    void refetchUser().finally(() => setAuthSessionLoading(false));
  }, []);

  async function login(payload: LoginPayload) {
    return loginSession(payload);
  }

  async function logout() {
    await logoutSession();
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}