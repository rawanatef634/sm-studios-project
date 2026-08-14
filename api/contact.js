import {
  CONTACT_TO,
  MailConfigError,
  rowsToHtml,
  rowsToText,
  sendStudioEmail,
} from "./_utils/mail.js";
import { readJsonBody } from "./_utils/auth.js";
import {
  CONTACT_LIMITS,
  isValidEmail,
  trimStr,
} from "./_utils/formLimits.js";

const attempts = new Map();
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000;

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

function validateContact(body) {
  const name = trimStr(body?.name, CONTACT_LIMITS.name);
  const email = trimStr(body?.email, CONTACT_LIMITS.email).toLowerCase();
  const phone = trimStr(body?.phone, CONTACT_LIMITS.phone);
  const project = trimStr(body?.project, CONTACT_LIMITS.project);
  const location = trimStr(body?.location, CONTACT_LIMITS.location);
  const area = trimStr(body?.area, CONTACT_LIMITS.area);
  const requirements = trimStr(body?.requirements, CONTACT_LIMITS.requirements);

  const errors = {};
  if (!name) errors.name = "Full Name is required";
  if (!email) errors.email = "Email is required";
  else if (!isValidEmail(email)) errors.email = "Invalid email address";
  if (!project) errors.project = "Project type is required";

  if (Object.keys(errors).length) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    fields: { name, email, phone, project, location, area, requirements },
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  if (!checkRateLimit(getClientIp(req))) {
    return res.status(429).json({
      error: "Too many submissions. Please wait a few minutes and try again.",
    });
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    return res.status(400).json({ error: "Invalid request body." });
  }

  const parsed = validateContact(body);
  if (!parsed.ok) {
    return res.status(400).json({
      error: "Please correct the highlighted fields.",
      errors: parsed.errors,
    });
  }

  const { name, email, phone, project, location, area, requirements } =
    parsed.fields;

  const title = "NEW WEBSITE CONTACT";
  const rows = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone],
    ["Project type", project],
    ["Location", location],
    ["Area (SQM)", area],
    ["Special requirements", requirements],
  ];

  try {
    await sendStudioEmail({
      subject: `${title} — ${name}`,
      html: rowsToHtml(title, rows),
      text: rowsToText(title, rows),
      replyTo: email,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    if (err instanceof MailConfigError) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error("[contact] send failed:", err.message || err);
    return res.status(err.status || 502).json({
      error: `Could not send your message to ${CONTACT_TO}. Please try again or email that address directly.`,
    });
  }
}
