import "./_utils/heronsignal.js";
import { handleUpload } from "@vercel/blob/client";
import { readJsonBody } from "./_utils/auth.js";
import {
  ATTACHMENT_CONTENT_TYPES,
  MAX_ATTACHMENT_BYTES,
  getContactBlobToken,
  isContactAttachmentPathname,
} from "./_utils/contactAttachment.js";

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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const token = getContactBlobToken();
  if (!token) {
    return res.status(503).json({ error: "File uploads are not configured." });
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    return res.status(400).json({ error: "Invalid request body." });
  }

  if (
    body?.type === "blob.generate-client-token" &&
    !checkRateLimit(getClientIp(req))
  ) {
    return res.status(429).json({
      error: "Too many uploads. Please wait a few minutes and try again.",
    });
  }

  try {
    const result = await handleUpload({
      token,
      request: req,
      body,
      onBeforeGenerateToken: async (pathname) => {
        if (!isContactAttachmentPathname(pathname)) {
          throw new Error("Invalid upload path.");
        }
        return {
          allowedContentTypes: ATTACHMENT_CONTENT_TYPES,
          maximumSizeInBytes: MAX_ATTACHMENT_BYTES,
          addRandomSuffix: true,
          validUntil: Date.now() + 10 * 60 * 1000,
        };
      },
    });
    return res.status(200).json(result);
  } catch (err) {
    console.error("[contact-upload] token error:", err.message || err);
    return res.status(400).json({ error: "Could not prepare the upload." });
  }
}
