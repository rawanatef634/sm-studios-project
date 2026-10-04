import "../_utils/heronsignal.js";
import bcrypt from "bcryptjs";
import { readJsonBody, verifySession } from "../_utils/auth.js";
import {
  getAdminPasswordHash,
  setAdminPasswordHash,
  SettingsStoreError,
} from "../_utils/settingsStore.js";

const MIN_LENGTH = 8;
const MAX_LENGTH = 128;

const attempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function checkRateLimit(key) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_ATTEMPTS) return false;
  entry.count += 1;
  return true;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const session = verifySession(req);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  if (!checkRateLimit(session.sub || "admin")) {
    return res
      .status(429)
      .json({ error: "Too many attempts. Please try again later." });
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    return res.status(400).json({ error: "Invalid request body." });
  }

  const currentPassword = String(body.currentPassword || "");
  const newPassword = String(body.newPassword || "");

  if (newPassword.length < MIN_LENGTH || newPassword.length > MAX_LENGTH) {
    return res.status(400).json({
      error: `New password must be between ${MIN_LENGTH} and ${MAX_LENGTH} characters.`,
    });
  }
  if (newPassword === currentPassword) {
    return res
      .status(400)
      .json({ error: "New password must be different from the current one." });
  }

  try {
    const currentHash = await getAdminPasswordHash();
    if (!currentHash) {
      return res.status(500).json({ error: "Server configuration error." });
    }
    if (!(await bcrypt.compare(currentPassword, currentHash))) {
      return res.status(400).json({ error: "Current password is incorrect." });
    }

    await setAdminPasswordHash(await bcrypt.hash(newPassword, 12));
    attempts.delete(session.sub || "admin");
    return res.status(200).json({ ok: true });
  } catch (err) {
    if (err instanceof SettingsStoreError) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error("[auth/password] Failed:", err.message || err);
    return res.status(500).json({ error: "Could not change password." });
  }
}
