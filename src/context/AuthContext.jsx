import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { api, getToken, setToken, ApiError } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSession = useCallback(async () => {
    if (!getToken()) { setLoading(false); return; }
    try {
      const { admin } = await api.get("/auth/me", { auth: true });
      setAdmin(admin);
    } catch {
      setToken(null); setAdmin(null);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadSession(); }, [loadSession]);

  const login = useCallback(async (email, password) => {
    try {
      const { token, admin } = await api.post("/auth/login", { email, password });
      setToken(token); setAdmin(admin);
      return { ok: true, mustChangePassword: admin.mustChangePassword };
    } catch (err) {
      return { ok: false, error: err instanceof ApiError ? err.message : "Unable to sign in." };
    }
  }, []);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      await api.post("/auth/change-password", { currentPassword, newPassword }, { auth: true });
      setAdmin((a) => (a ? { ...a, mustChangePassword: false } : a));
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof ApiError ? err.message : "Unable to change password." };
    }
  }, []);

  const logout = useCallback(() => { setToken(null); setAdmin(null); }, []);

  const value = useMemo(() => ({
    admin, loading, isAuthenticated: Boolean(admin),
    mustChangePassword: Boolean(admin?.mustChangePassword),
    login, logout, changePassword,
  }), [admin, loading, login, logout, changePassword]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
