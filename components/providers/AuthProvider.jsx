"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const AuthContext = createContext({ user: null, setUser: () => {}, refresh: async () => {}, logout: async () => {} });

export function AuthProvider({ initialUser = null, children }) {
  const [user, setUser] = useState(initialUser);

  const refresh = useCallback(async () => {
    const response = await fetch("/api/auth/me", { cache: "no-store" });
    const data = await response.json().catch(() => ({}));
    setUser(data.user || null);
    return data.user || null;
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    // Full navigation so every client cache and the server-rendered layout reset.
    window.location.href = "/";
  }, []);

  const value = useMemo(() => ({ user, setUser, refresh, logout }), [user, refresh, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
