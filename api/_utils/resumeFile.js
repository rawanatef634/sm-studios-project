export const MAX_RESUME_BYTES = Math.floor(3.5 * 1024 * 1024);

const PDF_MAGIC = Buffer.from("%PDF", "ascii");
const OLE_MAGIC = Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
const ZIP_MAGIC = Buffer.from([0x50, 0x4b, 0x03, 0x04]);
const EXE_MAGIC = Buffer.from([0x4d, 0x5a]); // MZ

function startsWith(buffer, magic) {
  return buffer.length >= magic.length && buffer.subarray(0, magic.length).equals(magic);
}

export function safeResumeFilename(originalName, ext) {
  const cleaned = String(originalName || "resume")
    .replace(/[/\\]/g, "")
    .replace(/[^\w.\- ]+/g, "")
    .trim()
    .slice(0, 80);
  const lower = cleaned.toLowerCase();
  if (lower.endsWith(`.${ext}`)) return cleaned;
  return `resume.${ext}`;
}

/**
 * Identify PDF / DOC / DOCX from magic bytes. Do not trust the browser MIME type.
 * @param {Buffer} buffer
 * @param {string} [filename]
 */
export function detectResumeKind(buffer, filename = "") {
  if (!buffer || !Buffer.isBuffer(buffer) || buffer.length < 4) {
    return { ok: false, error: "The resume file is empty or unreadable." };
  }
  if (buffer.length > MAX_RESUME_BYTES) {
    return {
      ok: false,
      error: "Resume is too large. Maximum size is 3.5 MB.",
    };
  }

  if (startsWith(buffer, EXE_MAGIC)) {
    return { ok: false, error: "Executable files are not allowed." };
  }
  if (buffer[0] === 0x23 && buffer[1] === 0x21) {
    return { ok: false, error: "Script files are not allowed." };
  }

  const name = String(filename).toLowerCase();

  if (startsWith(buffer, PDF_MAGIC)) {
    return {
      ok: true,
      ext: "pdf",
      contentType: "application/pdf",
    };
  }

  if (buffer.length >= 8 && startsWith(buffer, OLE_MAGIC)) {
    if (name.endsWith(".xls") || name.endsWith(".ppt") || name.endsWith(".msi")) {
      return {
        ok: false,
        error: "Unsupported file type. Please upload a PDF, DOC, or DOCX resume.",
      };
    }
    return {
      ok: true,
      ext: "doc",
      contentType: "application/msword",
    };
  }

  if (startsWith(buffer, ZIP_MAGIC)) {
    const hasWordDir = buffer.includes(Buffer.from("word/"));
    if (!hasWordDir) {
      return {
        ok: false,
        error: "Unsupported file type. Please upload a PDF, DOC, or DOCX resume.",
      };
    }
    return {
      ok: true,
      ext: "docx",
      contentType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };
  }

  return {
    ok: false,
    error: "Unsupported file type. Please upload a PDF, DOC, or DOCX resume.",
  };
}
