import "./_utils/heronsignal.js";
import { randomUUID } from "crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { put } from "@vercel/blob";
import { verifySession, readJsonBody } from "./_utils/auth.js";
import { blobAuth, hasBlobToken } from "./_utils/blobAuth.js";
import { optimizeImageVariants } from "./_utils/optimizeImage.js";

// ---------------------------------------------------------------------------
// Allowed MIME types (input). Output is always optimized WebP.
// ---------------------------------------------------------------------------
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

// ~3 MB binary ≈ ~4 MB base64 — stays under Vercel’s ~4.5 MB body limit
const MAX_BYTES = 3 * 1024 * 1024;

const ROOT = process.cwd();
/** Local-only uploads when no Blob token is set (served by Vite from /uploads). */
const LOCAL_UPLOAD_DIR = resolve(ROOT, "public/uploads");

/**
 * Stores the full-size image plus its narrower copies side by side
 * (`r/<id>.webp`, `r/<id>-800.webp`, …) so OptimizedImage can build a srcset.
 *
 * @param {{ main: Buffer, variants: { width: number, buffer: Buffer }[] }} images
 * @returns {Promise<string>} URL of the full-size image
 */
async function storeImage(images) {
  const id = randomUUID();
  const files = [
    { name: `${id}.webp`, buffer: images.main },
    ...images.variants.map((v) => ({
      name: `${id}-${v.width}.webp`,
      buffer: v.buffer,
    })),
  ];

  if (!hasBlobToken()) {
    const dir = resolve(LOCAL_UPLOAD_DIR, "r");
    mkdirSync(dir, { recursive: true });
    for (const file of files) {
      writeFileSync(resolve(dir, file.name), file.buffer);
    }
    console.info(`[upload] No Blob token — saved locally as /uploads/r/${id}.webp`);
    return `/uploads/r/${id}.webp`;
  }

  try {
    const [mainBlob] = await Promise.all(
      files.map((file) =>
        put(`sm-studios/images/r/${file.name}`, file.buffer, {
          access: "public",
          contentType: "image/webp",
          addRandomSuffix: false,
          cacheControlMaxAge: 31536000,
          ...blobAuth(),
        }),
      ),
    );
    return mainBlob.url;
  } catch (err) {
    const message = err?.message || String(err);
    if (/private store/i.test(message) || /public access/i.test(message)) {
      throw new Error("Blob store access mismatch: uploads require a public Blob store.");
    }
    throw err;
  }
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
// Automatically optimizes to WebP (max ~1920px) before storage.
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
    const images = await optimizeImageVariants(fileBuffer);
    const url = await storeImage(images);
    return res.status(200).json({
      url,
      optimized: true,
      bytes: images.main.length,
    });
  } catch (err) {
    console.error("[upload] store/optimize error:", err.message);
    return res.status(500).json({
      error: hasBlobToken()
        ? "Image upload failed."
        : "Local image upload failed.",
    });
  }
}
