import { createContext, useContext, useMemo, useState } from "react";

const AUTH_KEY = "isAdmin";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem(AUTH_KEY) === "true",
  );

  const login = (username, password) => {
    const valid = username === "admin" && password === "admin123";
    if (!valid) return false;
    localStorage.setItem(AUTH_KEY, "true");
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  };

  const value = useMemo(
    () => ({ isAuthenticated, login, logout }),
    [isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
