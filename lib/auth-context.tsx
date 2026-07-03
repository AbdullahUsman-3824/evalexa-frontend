"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  ReactNode,
} from "react";
import {
  AuthUser,
  getAuthSessionSnapshot,
  getProfile,
  loginUser,
  logoutUser,
  setAuthSessionLoading,
  setAuthSessionUser,
  subscribeAuthSession,
  LoginPayload,
} from "@/lib/services/auth-service";

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
};

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

  useEffect(() => {
    function handleUnauthorized() {
      setAuthSessionUser(null);
    }

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  async function login(payload: LoginPayload) {
    const loggedInUser = await loginUser(payload);
    setAuthSessionUser(loggedInUser);
    return loggedInUser;
  }

  async function logout() {
    await logoutUser();
    setAuthSessionUser(null);
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
