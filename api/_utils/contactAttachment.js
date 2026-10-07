import { detectDocumentKind } from "./resumeFile.js";

export const MAX_ATTACHMENT_BYTES = 15 * 1024 * 1024;
export const ATTACHMENT_PREFIX = "contact-attachments/";

export const ATTACHMENT_CONTENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
];

const JPEG_MAGIC = Buffer.from([0xff, 0xd8, 0xff]);
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const UNSUPPORTED =
  "Unsupported file type. Please attach a PDF, DOC, DOCX, JPG, or PNG file.";

function startsWith(buffer, magic) {
  return buffer.length >= magic.length && buffer.subarray(0, magic.length).equals(magic);
}

export function safeAttachmentFilename(originalName, ext) {
  const cleaned = String(originalName || "attachment")
    .replace(/[/\\]/g, "")
    .replace(/[^\w.\- ]+/g, "")
    .trim()
    .slice(0, 80);
  const lower = cleaned.toLowerCase();
  const exts = ext === "jpg" ? ["jpg", "jpeg"] : [ext];
  if (exts.some((e) => lower.endsWith(`.${e}`))) return cleaned;
  return `attachment.${ext}`;
}

/** Contact attachments live in the private project store, never the public image store. */
export function getContactBlobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN || "";
}

/** @param {unknown} value */
export function isContactAttachmentPathname(value) {
  return (
    typeof value === "string" &&
    value.length <= 200 &&
    value.startsWith(ATTACHMENT_PREFIX) &&
    !value.includes("..") &&
    /^[\w./-]+$/.test(value)
  );
}

/**
 * Identify PDF / DOC / DOCX / JPG / PNG from magic bytes. Do not trust the browser MIME type.
 * @param {Buffer} buffer
 * @param {string} [filename]
 */
export function detectAttachmentKind(buffer, filename = "") {
  if (!buffer || !Buffer.isBuffer(buffer) || buffer.length < 4) {
    return { ok: false, error: "The attachment is empty or unreadable." };
  }
  if (buffer.length > MAX_ATTACHMENT_BYTES) {
    return { ok: false, error: "Attachment is too large. Maximum size is 15 MB." };
  }

  if (startsWith(buffer, JPEG_MAGIC)) {
    return { ok: true, ext: "jpg", contentType: "image/jpeg" };
  }
  if (startsWith(buffer, PNG_MAGIC)) {
    return { ok: true, ext: "png", contentType: "image/png" };
  }

  const kind = detectDocumentKind(buffer, filename);
  if (kind.ok) return kind;
  if (/^Unsupported file type/.test(kind.error)) {
    return { ok: false, error: UNSUPPORTED };
  }
  return { ok: false, error: kind.error.replace(/resume/gi, "attachment") };
}
