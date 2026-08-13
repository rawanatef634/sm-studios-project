import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // True while waiting for the server-side session check to complete.
  const [isChecking, setIsChecking] = useState(true);

  // Verify the session with the server on mount.
  // Auth state is always derived from the HTTP-only cookie — never localStorage.
  useEffect(() => {
    fetch("/api/auth/session", { credentials: "include" })
      .then((res) => setIsAuthenticated(res.ok))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsChecking(false));
  }, []);

  /**
   * POST credentials to the server.
   * Returns { ok: true } on success or { ok: false, error, status } on failure.
   */
  const login = async (username, password) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
        return { ok: true };
      }
      const data = await res.json().catch(() => ({}));
      return {
        ok: false,
        error: data.error || "Invalid credentials.",
        status: res.status,
      };
    } catch {
      return { ok: false, error: "Network error. Please try again.", status: 0 };
    }
  };

  /** Invalidates the server session and clears local auth state. */
  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    }).catch(() => {});
    setIsAuthenticated(false);
  };

  const value = useMemo(
    () => ({ isAuthenticated, isChecking, login, logout }),
    [isAuthenticated, isChecking],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
