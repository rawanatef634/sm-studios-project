/**
 * Shared auth helpers for Vercel API routes.
 * Files under api/_utils/ are private and are NOT exposed as HTTP routes.
 */
import jwt from "jsonwebtoken";

// ---------------------------------------------------------------------------
// Cookie parsing
// ---------------------------------------------------------------------------
export function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  for (const part of cookieHeader.split(";")) {
    const eqIdx = part.indexOf("=");
    if (eqIdx === -1) continue;
    const key = part.slice(0, eqIdx).trim();
    const val = part.slice(eqIdx + 1).trim();
    if (key) cookies[key] = val;
  }
  return cookies;
}

// ---------------------------------------------------------------------------
// Session verification — returns JWT payload or null
// ---------------------------------------------------------------------------
export function verifySession(req) {
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) return null;

  const cookies = parseCookies(req.headers.cookie);
  const token = cookies.sm_session;
  if (!token) return null;

  try {
    const payload = jwt.verify(token, sessionSecret);
    if (payload.role !== "admin") return null;
    return payload;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Cookie attributes helper — omits Secure flag on localhost
// ---------------------------------------------------------------------------
export function cookieAttrs(req) {
  const host = req.headers.host || "";
  const isLocalhost =
    host.startsWith("localhost") || host.startsWith("127.0.0.1");
  const secure = isLocalhost ? "" : "; Secure";
  return `HttpOnly; SameSite=Lax; Path=/${secure}`;
}

// ---------------------------------------------------------------------------
// Request body reader — handles both pre-parsed (Vercel) and raw stream
// ---------------------------------------------------------------------------
export function readJsonBody(req) {
  // Vercel may already parse application/json bodies into req.body
  if (req.body && typeof req.body === "object") {
    return Promise.resolve(req.body);
  }
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => { raw += chunk; });
    req.on("end", () => {
      try {
        resolve(JSON.parse(raw || "{}"));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}
