"use client";

import { ReactNode, useEffect } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { authRepository } from "@/repositories/auth.repository";
import { store } from "@/store";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    authRepository.hydrateFromStorage();
  }, []);

  return <ReduxProvider store={store}>{children}</ReduxProvider>;
}
