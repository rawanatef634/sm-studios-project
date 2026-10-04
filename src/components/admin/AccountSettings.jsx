import { useState } from "react";

const MIN_LENGTH = 8;

export default function AccountSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const mismatch = confirmPassword && newPassword !== confirmPassword;
  const canSubmit =
    currentPassword &&
    newPassword.length >= MIN_LENGTH &&
    newPassword === confirmPassword &&
    !saving;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not change password.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage({
        type: "ok",
        text: "Password changed. Use the new password next time you sign in.",
      });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100";

  return (
    <form onSubmit={handleSubmit} className="grid max-w-md gap-5">
      <div>
        <h2 className="text-xl font-semibold text-white">Change password</h2>
        <p className="mt-1 text-sm text-slate-400">
          At least {MIN_LENGTH} characters. The username stays the same.
        </p>
      </div>

      <label className="grid gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
          Current password
        </span>
        <input
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className={inputClass}
        />
      </label>
      <label className="grid gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
          New password
        </span>
        <input
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={inputClass}
        />
      </label>
      <label className="grid gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
          Confirm new password
        </span>
        <input
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={inputClass}
        />
        {mismatch && (
          <span className="text-xs text-rose-400">Passwords do not match.</span>
        )}
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-md bg-cyan-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving…" : "Change password"}
        </button>
      </div>
      {message.text && (
        <p
          className={`text-sm ${message.type === "ok" ? "text-emerald-400" : "text-rose-400"}`}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
