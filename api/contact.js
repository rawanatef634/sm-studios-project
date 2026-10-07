import "./_utils/heronsignal.js";
import { waitUntil } from "@vercel/functions";
import {
  CONTACT_TO,
  MailConfigError,
  getResend,
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
import { del, get, list } from "@vercel/blob";
import {
  ATTACHMENT_PREFIX,
  MAX_ATTACHMENT_BYTES,
  detectAttachmentKind,
  getContactBlobToken,
  isContactAttachmentPathname,
  safeAttachmentFilename,
} from "./_utils/contactAttachment.js";

const STALE_ATTACHMENT_MS = 24 * 60 * 60 * 1000;

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
  if (!phone) errors.phone = "Phone number is required";
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

  const attachmentMeta =
    body?.attachment && typeof body.attachment === "object"
      ? body.attachment
      : null;
  if (attachmentMeta && !isContactAttachmentPathname(attachmentMeta.pathname)) {
    return res.status(400).json({
      error: "Invalid attachment. Please re-attach the file and try again.",
      errors: { attachment: "Invalid attachment. Please re-attach the file." },
    });
  }

  try {
    getResend();
  } catch (err) {
    if (err instanceof MailConfigError) {
      return res.status(err.status).json({ error: err.message });
    }
    throw err;
  }

  // Failures after this point only reach the server logs, not the visitor.
  waitUntil(
    sendContactEmail({
      fields: parsed.fields,
      attachmentMeta,
    }).catch((err) => {
      console.error(
        `[contact] send to ${CONTACT_TO} failed for ${parsed.fields.email}:`,
        err.message || err,
      );
    }),
  );

  return res.status(200).json({ ok: true });
}

async function loadAttachment({ pathname, filename }) {
  const token = getContactBlobToken();
  try {
    const result = await get(pathname, {
      access: "private",
      token,
      useCache: false,
    });
    if (!result || result.statusCode !== 200) {
      throw new Error("attachment not found");
    }
    if (result.blob.size > MAX_ATTACHMENT_BYTES) {
      await result.stream.cancel();
      return { note: "Rejected: larger than 15 MB" };
    }
    const buffer = Buffer.from(await new Response(result.stream).arrayBuffer());
    const kind = detectAttachmentKind(buffer, filename);
    if (!kind.ok) {
      return { note: `Rejected: ${kind.error}` };
    }
    const safeName = safeAttachmentFilename(filename, kind.ext);
    return {
      note: safeName,
      attachment: {
        filename: safeName,
        content: buffer.toString("base64"),
        contentType: kind.contentType,
      },
    };
  } catch (err) {
    console.error("[contact] attachment load failed:", err.message || err);
    return { note: "Could not be retrieved — ask the sender to email it" };
  } finally {
    await del(pathname, { token }).catch(() => {});
  }
}

async function deleteStaleAttachments() {
  const token = getContactBlobToken();
  if (!token) return;
  const cutoff = Date.now() - STALE_ATTACHMENT_MS;
  const { blobs } = await list({ prefix: ATTACHMENT_PREFIX, token });
  const stale = blobs
    .filter((blob) => new Date(blob.uploadedAt).getTime() < cutoff)
    .map((blob) => blob.url);
  if (stale.length) await del(stale, { token });
}

async function sendContactEmail({ fields, attachmentMeta }) {
  const { name, email, phone, project, location, area, requirements } = fields;

  const loaded = attachmentMeta
    ? await loadAttachment(attachmentMeta)
    : { note: "" };

  const title = "NEW WEBSITE CONTACT";
  const rows = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone],
    ["Project type", project],
    ["Location", location],
    ["Area (SQM)", area],
    ["Any notice", requirements],
    ["Attachment", loaded.note],
  ];

  try {
    await sendStudioEmail({
      subject: `${title} — ${name}`,
      html: rowsToHtml(title, rows),
      text: rowsToText(title, rows),
      replyTo: email,
      attachments: loaded.attachment ? [loaded.attachment] : undefined,
    });
  } finally {
    await deleteStaleAttachments().catch((err) => {
      console.error("[contact] stale attachment cleanup failed:", err.message || err);
    });
  }
}
