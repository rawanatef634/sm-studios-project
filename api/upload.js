import { randomUUID } from "crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { put } from "@vercel/blob";
import { verifySession, readJsonBody } from "./_utils/auth.js";

// ---------------------------------------------------------------------------
// Allowed MIME types and their file extensions
// ---------------------------------------------------------------------------
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);
const MIME_EXT = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
};

// ~3 MB binary ≈ ~4 MB base64 — stays under Vercel’s ~4.5 MB body limit
const MAX_BYTES = 3 * 1024 * 1024;

const ROOT = process.cwd();
/** Local-only uploads when BLOB_READ_WRITE_TOKEN is unset (served by Vite from /uploads). */
const LOCAL_UPLOAD_DIR = resolve(ROOT, "public/uploads");

function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/**
 * @param {Buffer} fileBuffer
 * @param {string} mimeType
 * @returns {Promise<string>}
 */
async function storeImage(fileBuffer, mimeType) {
  const ext = MIME_EXT[mimeType];
  const filename = `${randomUUID()}${ext}`;

  if (!hasBlobToken()) {
    mkdirSync(LOCAL_UPLOAD_DIR, { recursive: true });
    writeFileSync(resolve(LOCAL_UPLOAD_DIR, filename), fileBuffer);
    console.info(
      `[upload] No BLOB_READ_WRITE_TOKEN — saved locally as /uploads/${filename}`,
    );
    return `/uploads/${filename}`;
  }

  const pathname = `sm-studios/images/${filename}`;
  const blob = await put(pathname, fileBuffer, {
    access: "public",
    contentType: mimeType,
    addRandomSuffix: false,
  });
  return blob.url;
}

/**
 * Decode a data URL or raw base64 payload into a Buffer.
 * @param {string} data
 * @returns {{ buffer: Buffer, mimeFromDataUrl?: string }}
 */
function decodeBase64Payload(data) {
  const trimmed = String(data || "").trim();
  const match = /^data:([^;]+);base64,(.+)$/i.exec(trimmed);
  if (match) {
    return {
      mimeFromDataUrl: match[1].toLowerCase(),
      buffer: Buffer.from(match[2], "base64"),
    };
  }
  return { buffer: Buffer.from(trimmed, "base64") };
}

// ---------------------------------------------------------------------------
// Handler — JSON body: { contentType, data (base64 or data-URL) }
// Multipart is unreliable under vercel-dev (empty stream), so the dashboard
// sends JSON like the other working API routes.
// ---------------------------------------------------------------------------
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const session = verifySession(req);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    return res.status(400).json({ error: "Invalid JSON body." });
  }

  const contentTypeRaw = body?.contentType || body?.mimeType || "";
  const data = body?.data || body?.base64;
  if (!data || typeof data !== "string") {
    return res.status(400).json({
      error: "Expected JSON { contentType, data } with base64 image data.",
    });
  }

  let fileBuffer;
  let mimeFromDataUrl;
  try {
    ({ buffer: fileBuffer, mimeFromDataUrl } = decodeBase64Payload(data));
  } catch {
    return res.status(400).json({ error: "Invalid base64 image data." });
  }

  const mimeType = (mimeFromDataUrl || String(contentTypeRaw)).toLowerCase();
  if (!ALLOWED_MIME.has(mimeType)) {
    return res.status(415).json({
      error: "Unsupported file type. Allowed: JPEG, PNG, WebP, AVIF.",
    });
  }

  if (!fileBuffer.length) {
    return res.status(400).json({ error: "Empty image data." });
  }
  if (fileBuffer.length > MAX_BYTES) {
    return res.status(413).json({
      error: "File too large. Maximum size is 3 MB.",
    });
  }

  try {
    const url = await storeImage(fileBuffer, mimeType);
    return res.status(200).json({ url });
  } catch (err) {
    console.error("[upload] store error:", err.message);
    return res.status(500).json({
      error: hasBlobToken()
        ? "Image upload failed."
        : "Local image upload failed.",
    });
  }
}
