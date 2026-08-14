import Busboy from "busboy";
import {
  CONTACT_TO,
  MailConfigError,
  rowsToHtml,
  rowsToText,
  sendStudioEmail,
} from "./_utils/mail.js";
import {
  CAREER_LIMITS,
  isValidEmail,
  trimStr,
} from "./_utils/formLimits.js";
import {
  MAX_RESUME_BYTES,
  detectResumeKind,
  safeResumeFilename,
} from "./_utils/resumeFile.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

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

function readRawBody(req) {
  if (Buffer.isBuffer(req.body)) return Promise.resolve(req.body);
  if (typeof req.body === "string") return Promise.resolve(Buffer.from(req.body));
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function parseMultipart(req) {
  const contentType = req.headers["content-type"] || "";
  if (!/multipart\/form-data/i.test(contentType)) {
    const err = new Error("Expected multipart form data.");
    err.status = 400;
    throw err;
  }

  const raw = await readRawBody(req);

  return new Promise((resolve, reject) => {
    const bb = Busboy({
      headers: req.headers,
      limits: {
        files: 1,
        fileSize: MAX_RESUME_BYTES,
        fields: 10,
        fieldSize: 20 * 1024,
      },
    });

    const fields = {};
    let fileBuffer = null;
    let filename = "";
    let truncated = false;

    bb.on("field", (name, value) => {
      fields[name] = value;
    });

    bb.on("file", (_name, file, info) => {
      filename = info.filename || "";
      const chunks = [];
      file.on("data", (chunk) => chunks.push(chunk));
      file.on("limit", () => {
        truncated = true;
        file.resume();
      });
      file.on("end", () => {
        fileBuffer = Buffer.concat(chunks);
      });
    });

    bb.on("error", reject);
    bb.on("finish", () => {
      resolve({ fields, fileBuffer, filename, truncated });
    });

    bb.end(raw);
  });
}

function validateCareer(fields) {
  const name = trimStr(fields?.name, CAREER_LIMITS.name);
  const email = trimStr(fields?.email, CAREER_LIMITS.email).toLowerCase();
  const phone = trimStr(fields?.phone, CAREER_LIMITS.phone);
  const position = trimStr(fields?.position, CAREER_LIMITS.position);
  const message = trimStr(fields?.message, CAREER_LIMITS.message);

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

  let parsedForm;
  try {
    parsedForm = await parseMultipart(req);
  } catch (err) {
    return res.status(err.status || 400).json({
      error: err.message || "Invalid form submission.",
    });
  }

  const parsed = validateCareer(parsedForm.fields);
  if (!parsed.ok) {
    return res.status(400).json({
      error: "Please correct the highlighted fields.",
      errors: parsed.errors,
    });
  }

  if (parsedForm.truncated) {
    return res.status(413).json({
      error: "Resume is too large. Maximum size is 3.5 MB.",
    });
  }

  if (!parsedForm.fileBuffer || !parsedForm.fileBuffer.length) {
    return res.status(400).json({
      error: "Please upload your resume",
      errors: { file: "Please upload your resume" },
    });
  }

  const kind = detectResumeKind(parsedForm.fileBuffer, parsedForm.filename);
  if (!kind.ok) {
    const status = /too large/i.test(kind.error) ? 413 : 415;
    return res.status(status).json({
      error: kind.error,
      errors: { file: kind.error },
    });
  }

  const { name, email, phone, position, message } = parsed.fields;
  const filename = safeResumeFilename(parsedForm.filename, kind.ext);
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
          content: parsedForm.fileBuffer,
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
    return res.status(err.status || 502).json({
      error: tooLarge
        ? "The resume could not be sent because of size limits. Please email a smaller PDF to info@smstudios-om.com."
        : `Could not send your application to ${CONTACT_TO}. Please try again or email that address directly.`,
    });
  }
}
