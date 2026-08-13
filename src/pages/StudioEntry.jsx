import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Bookmarkable staff entry point. Not an auth boundary —
 * redirects based on the existing session check only.
 */
export default function StudioEntry() {
  const { isAuthenticated, isChecking } = useAuth();

  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <span className="text-slate-400 text-sm">Verifying session…</span>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
}
