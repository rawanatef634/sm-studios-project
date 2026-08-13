import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isChecking } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Wait for the server session check to finish before deciding what to render.
  if (isChecking) return null;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const result = await login(username, password);
      if (!result.ok) {
        // Show the rate-limit message verbatim; otherwise use a generic string.
        setError(
          result.status === 429 ? result.error : "Invalid credentials.",
        );
        return;
      }
      const redirectTo = location.state?.from?.pathname || "/dashboard";
      navigate(redirectTo, { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,#1e293b_0%,#0f172a_45%,#020617_100%)] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/80 p-7 shadow-2xl backdrop-blur">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-cyan-300">
          Secure Access
        </p>
        <h1 className="mb-1 text-3xl font-semibold text-white">Admin Login</h1>
        <p className="mb-6 text-sm text-slate-400">
          Sign in to manage projects and dashboard content.
        </p>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
              Username
            </span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500"
              autoComplete="username"
              required
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500"
              autoComplete="current-password"
              required
            />
          </label>
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-1 rounded-md bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </section>
  );
}
