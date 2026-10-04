/**
 * Site settings (categories, hero projects, editable text) and admin
 * credentials, persisted as JSON documents in Vercel Blob.
 *
 * Same storage rules as projectStore.js: Blob when a token is configured,
 * otherwise a local file under .data/ for vercel dev.
 *
 * The Blob store is PUBLIC, so the admin password hash is encrypted with a key
 * derived from SESSION_SECRET before it is written.
 */
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { list, put } from "@vercel/blob";
import { blobAuth, hasBlobToken } from "./blobAuth.js";
import {
  CONTENT_FIELDS,
  DEFAULT_SETTINGS,
  MAX_CATEGORIES,
  MAX_CATEGORY_LENGTH,
  MAX_CONTENT_LENGTH,
  MAX_HERO_PROJECTS,
} from "../../src/data/siteSettings.js";

export const SETTINGS_PATH = "sm-studios/settings.json";
const CREDENTIALS_PATH = "sm-studios/admin-credentials.json";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const LOCAL_DIR = resolve(ROOT, ".data");

export class SettingsStoreError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = "SettingsStoreError";
    this.status = status;
  }
}

function localFileFor(pathname) {
  return resolve(LOCAL_DIR, basename(pathname).replace(/\.json$/, ".local.json"));
}

/** @returns {Promise<unknown | null>} null when the document does not exist */
async function readJson(pathname) {
  if (!hasBlobToken()) {
    const file = localFileFor(pathname);
    if (!existsSync(file)) return null;
    return JSON.parse(readFileSync(file, "utf8"));
  }

  let blob;
  try {
    const { blobs } = await list({ prefix: pathname, ...blobAuth() });
    blob = blobs.find((b) => b.pathname === pathname) || null;
  } catch (err) {
    console.error(`[settingsStore] Blob list failed for ${pathname}:`, err.message);
    throw new SettingsStoreError("Failed to access settings store.", 502);
  }
  if (!blob) return null;

  const resp = await fetch(`${blob.url}?t=${Date.now()}`);
  if (!resp.ok) {
    throw new SettingsStoreError(`Failed to read settings (Blob ${resp.status}).`, 502);
  }
  return resp.json();
}

async function writeJson(pathname, data) {
  if (!hasBlobToken()) {
    mkdirSync(LOCAL_DIR, { recursive: true });
    writeFileSync(localFileFor(pathname), JSON.stringify(data, null, 2), "utf8");
    return;
  }

  try {
    await put(pathname, JSON.stringify(data), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60,
      ...blobAuth(),
    });
  } catch (err) {
    console.error(`[settingsStore] Blob write failed for ${pathname}:`, err.message);
    throw new SettingsStoreError("Failed to save settings.", 502);
  }
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------
const CONTENT_KEYS = new Set(CONTENT_FIELDS.map((f) => f.key));

function normalizeSettings(raw) {
  const data = raw && typeof raw === "object" ? raw : {};
  return {
    categories: Array.isArray(data.categories)
      ? data.categories
      : DEFAULT_SETTINGS.categories,
    heroProjectIds: Array.isArray(data.heroProjectIds)
      ? data.heroProjectIds
      : DEFAULT_SETTINGS.heroProjectIds,
    content:
      data.content && typeof data.content === "object" ? data.content : {},
  };
}

export async function loadSettings() {
  return normalizeSettings(await readJson(SETTINGS_PATH));
}

function badRequest(message) {
  return new SettingsStoreError(message, 400);
}

function sanitizeCategories(value) {
  if (!Array.isArray(value)) throw badRequest("Categories must be a list.");
  const seen = new Set();
  const categories = [];
  for (const item of value) {
    const name = String(item ?? "").trim();
    if (!name) continue;
    if (name.length > MAX_CATEGORY_LENGTH) {
      throw badRequest(`Category names must be ${MAX_CATEGORY_LENGTH} characters or fewer.`);
    }
    const lower = name.toLowerCase();
    if (seen.has(lower)) throw badRequest(`Duplicate category: ${name}`);
    seen.add(lower);
    categories.push(name);
  }
  if (categories.length === 0) throw badRequest("Keep at least one category.");
  if (categories.length > MAX_CATEGORIES) {
    throw badRequest(`No more than ${MAX_CATEGORIES} categories.`);
  }
  return categories;
}

function sanitizeHeroProjectIds(value) {
  if (!Array.isArray(value)) throw badRequest("Hero projects must be a list.");
  const ids = [];
  for (const id of value) {
    if (typeof id !== "number" && typeof id !== "string") continue;
    if (id === "" || ids.some((existing) => String(existing) === String(id))) continue;
    ids.push(id);
  }
  if (ids.length === 0) throw badRequest("Choose at least one hero project.");
  if (ids.length > MAX_HERO_PROJECTS) {
    throw badRequest(`Choose no more than ${MAX_HERO_PROJECTS} hero projects.`);
  }
  return ids;
}

function sanitizeContent(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw badRequest("Content must be an object.");
  }
  const content = {};
  for (const [key, text] of Object.entries(value)) {
    if (!CONTENT_KEYS.has(key)) continue;
    const str = String(text ?? "").replace(/\r\n/g, "\n").trim();
    if (!str) continue;
    if (str.length > MAX_CONTENT_LENGTH) {
      throw badRequest(`Text is too long (max ${MAX_CONTENT_LENGTH} characters).`);
    }
    content[key] = str;
  }
  return content;
}

/**
 * Apply a partial update. Only the provided top-level fields are replaced.
 * @param {{ categories?: unknown, heroProjectIds?: unknown, content?: unknown }} patch
 */
export async function updateSettings(patch) {
  const current = await loadSettings();
  const next = { ...current };
  if (patch.categories !== undefined) next.categories = sanitizeCategories(patch.categories);
  if (patch.heroProjectIds !== undefined) {
    next.heroProjectIds = sanitizeHeroProjectIds(patch.heroProjectIds);
  }
  if (patch.content !== undefined) next.content = sanitizeContent(patch.content);
  await writeJson(SETTINGS_PATH, next);
  return next;
}

// ---------------------------------------------------------------------------
// Admin credentials (encrypted at rest)
// ---------------------------------------------------------------------------
function credentialKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;
  return createHash("sha256").update(`${secret}:sm-admin-credentials`).digest();
}

function encryptRecord(record) {
  const key = credentialKey();
  if (!key) throw new SettingsStoreError("Server configuration error.", 500);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const data = Buffer.concat([
    cipher.update(JSON.stringify(record), "utf8"),
    cipher.final(),
  ]);
  return {
    v: 1,
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    data: data.toString("base64"),
  };
}

function decryptRecord(envelope) {
  const key = credentialKey();
  if (!key || !envelope || envelope.v !== 1) return null;
  try {
    const decipher = createDecipheriv(
      "aes-256-gcm",
      key,
      Buffer.from(envelope.iv, "base64"),
    );
    decipher.setAuthTag(Buffer.from(envelope.tag, "base64"));
    const plain = Buffer.concat([
      decipher.update(Buffer.from(envelope.data, "base64")),
      decipher.final(),
    ]);
    return JSON.parse(plain.toString("utf8"));
  } catch {
    return null;
  }
}

/**
 * The password set from the dashboard wins; ADMIN_PASSWORD_HASH is the
 * fallback when none was set (or SESSION_SECRET changed and it can't be read).
 */
export async function getAdminPasswordHash() {
  const envelope = await readJson(CREDENTIALS_PATH);
  if (envelope) {
    const record = decryptRecord(envelope);
    if (record?.passwordHash) return record.passwordHash;
    console.warn(
      "[settingsStore] Stored admin password could not be decrypted (SESSION_SECRET changed?). Using ADMIN_PASSWORD_HASH.",
    );
  }
  return process.env.ADMIN_PASSWORD_HASH || null;
}

export async function setAdminPasswordHash(passwordHash) {
  await writeJson(
    CREDENTIALS_PATH,
    encryptRecord({ passwordHash, updatedAt: new Date().toISOString() }),
  );
}
