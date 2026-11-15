import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "../types";
import * as authApi from "../store/authApi";
import { ensureSeed } from "../store/db";

interface AuthContextValue {
  session: Session | null;
  refresh: () => void;
  login: (email: string, password: string) => ReturnType<typeof authApi.login>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  ensureSeed();
  const [session, setSession] = useState<Session | null>(() =>
    authApi.currentSession(),
  );

  const refresh = useCallback(() => {
    setSession(authApi.currentSession());
  }, []);

  const login = useCallback((email: string, password: string) => {
    const result = authApi.login(email, password);
    if (result.ok) setSession(authApi.currentSession());
    return result;
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({ session, refresh, login, logout }),
    [session, refresh, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
