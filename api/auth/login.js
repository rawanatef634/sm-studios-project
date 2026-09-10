import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookieAttrs, readJsonBody } from "../_utils/auth.js";

// ---------------------------------------------------------------------------
// In-memory rate limiter (per serverless instance).
// Protects against brute-force on a low-traffic site. Because Vercel may
// spin up multiple instances, this is per-instance rather than global —
// a reasonable trade-off for a single-staff deployment.
// ---------------------------------------------------------------------------
const attempts = new Map(); // ip → { count, resetAt }
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getClientIp(req) {
  return (
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.headers["x-real-ip"] ||
    "unknown"
  );
}

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_ATTEMPTS) return false;
  entry.count += 1;
  return true;
}

function clearRateLimit(ip) {
  attempts.delete(ip);
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const ip = getClientIp(req);

  if (!checkRateLimit(ip)) {
    return res
      .status(429)
      .json({ error: "Too many login attempts. Please try again later." });
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    return res.status(400).json({ error: "Invalid request." });
  }

  const { username = "", password = "" } = body;

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  const sessionSecret = process.env.SESSION_SECRET;

  if (!adminUsername || !adminPasswordHash || !sessionSecret) {
    console.error("[auth/login] Missing required environment variables");
    return res.status(500).json({ error: "Server configuration error." });
  }

  // Run bcrypt unconditionally so response time doesn't reveal whether the
  // username exists (timing-safe comparison).
  const passwordMatch = await bcrypt.compare(password, adminPasswordHash);
  const usernameMatch = username === adminUsername;

  if (!usernameMatch || !passwordMatch) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  clearRateLimit(ip);

  const token = jwt.sign(
    { sub: adminUsername, role: "admin" },
    sessionSecret,
    { expiresIn: "24h" },
  );

  res.setHeader(
    "Set-Cookie",
    `sm_session=${token}; ${cookieAttrs(req)}; Max-Age=${24 * 60 * 60}`,
  );
  return res.status(200).json({ ok: true });
}
