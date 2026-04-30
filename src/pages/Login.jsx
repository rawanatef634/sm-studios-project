import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const success = login(username, password);
    if (!success) {
      setError("Invalid credentials");
      return;
    }
    const redirectTo = location.state?.from?.pathname || "/dashboard";
    navigate(redirectTo, { replace: true });
  };

  return (
    <section className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-semibold mb-6">Admin Login</h1>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-sm text-gray-700">Username</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border rounded-md px-3 py-2"
              required
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm text-gray-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded-md px-3 py-2"
              required
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="bg-black text-white rounded-md px-4 py-2 font-medium"
          >
            Sign in
          </button>
        </form>
      </div>
    </section>
  );
}
