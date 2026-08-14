import {
  CONTACT_TO,
  MailConfigError,
  rowsToHtml,
  rowsToText,
  sendStudioEmail,
} from "./_utils/mail.js";
import { readJsonBody } from "./_utils/auth.js";
import {
  CAREER_LIMITS,
  isValidEmail,
  trimStr,
} from "./_utils/formLimits.js";
import {
  MAX_RESUME_BYTES,
  decodeBase64Payload,
  detectResumeKind,
  safeResumeFilename,
} from "./_utils/resumeFile.js";

const attempts = new Map();
const MAX_ATTEMPTS = 20;
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

function validateCareer(body) {
  const name = trimStr(body?.name, CAREER_LIMITS.name);
  const email = trimStr(body?.email, CAREER_LIMITS.email).toLowerCase();
  const phone = trimStr(body?.phone, CAREER_LIMITS.phone);
  const position = trimStr(body?.position, CAREER_LIMITS.position);
  const message = trimStr(body?.message, CAREER_LIMITS.message);

  const errors = {};
  if (!name) errors.name = "Full Name is required";
  if (!email) errors.email = "Email is required";
  else if (!isValidEmail(email)) errors.email = "Invalid email address";

  if (Object.keys(errors).length) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    fields: { name, email, phone, position, message },
  };
}

function safeProviderMessage(message) {
  const text = String(message || "");
  if (/api[_-]?key|authorization|bearer|secret/i.test(text)) {
    return "";
  }
  return text.slice(0, 240);
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

  const parsed = validateCareer(body);
  if (!parsed.ok) {
    return res.status(400).json({
      error: "Please correct the highlighted fields.",
      errors: parsed.errors,
    });
  }

  const resumeMeta = body?.resume && typeof body.resume === "object" ? body.resume : {};
  const resumeData = resumeMeta.data || body?.resumeData;
  const resumeName = resumeMeta.filename || body?.resumeFilename || "resume";

  if (!resumeData || typeof resumeData !== "string") {
    return res.status(400).json({
      error: "Please upload your resume",
      errors: { file: "Please upload your resume" },
    });
  }

  let fileBuffer;
  try {
    fileBuffer = decodeBase64Payload(resumeData);
  } catch {
    return res.status(400).json({
      error: "The resume file is empty or unreadable.",
      errors: { file: "The resume file is empty or unreadable." },
    });
  }

  if (!fileBuffer.length) {
    return res.status(400).json({
      error: "Please upload your resume",
      errors: { file: "Please upload your resume" },
    });
  }

  if (fileBuffer.length > MAX_RESUME_BYTES) {
    return res.status(413).json({
      error: "Resume is too large. Maximum size is 3 MB.",
      errors: { file: "Resume is too large. Maximum size is 3 MB." },
    });
  }

  const kind = detectResumeKind(fileBuffer, resumeName);
  if (!kind.ok) {
    const status = /too large/i.test(kind.error) ? 413 : 415;
    return res.status(status).json({
      error: kind.error,
      errors: { file: kind.error },
    });
  }

  const { name, email, phone, position, message } = parsed.fields;
  const filename = safeResumeFilename(resumeName, kind.ext);
  const title = "NEW CAREER APPLICATION";
  const rows = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone],
    ["Desired position", position],
    ["Message", message],
    ["Resume", filename],
  ];

  try {
    await sendStudioEmail({
      subject: `${title} — ${name}`,
      html: rowsToHtml(title, rows),
      text: rowsToText(title, rows),
      replyTo: email,
      attachments: [
        {
          filename,
          content: fileBuffer.toString("base64"),
          contentType: kind.contentType,
        },
      ],
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    if (err instanceof MailConfigError) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error("[careers] send failed:", err.message || err);
    const tooLarge =
      /too large|maximum|payload|413|attachment/i.test(err.message || "");
    const provider = safeProviderMessage(err.message);
    return res.status(err.status || 502).json({
      error: tooLarge
        ? "The resume could not be sent because of size limits. Please email a smaller PDF to info@smstudios-om.com."
        : provider
          ? `Could not send your application: ${provider}`
          : `Could not send your application to ${CONTACT_TO}. Please try again or email that address directly.`,
    });
  }
}
