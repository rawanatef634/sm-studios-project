/**
 * Project data persistence via Vercel Blob.
 *
 * All projects are stored as a single JSON document at a fixed pathname.
 * Reads add a cache-busting timestamp so server-side fetches always see
 * the latest version rather than a CDN-cached copy.
 *
 * Concurrency assumption: SM Studios has a single staff member performing
 * writes. A lightweight read-modify-write approach is therefore safe.
 * If multiple admins are ever added, replace with a transactional store
 * (e.g. Vercel KV or PlanetScale).
 *
 * Safety rules:
 *  A) Missing Blob → seed once from projectsDetails.js, persist, return.
 *  B) Existing Blob (including []) → return as-is (never auto-replace with seed).
 *  C) Blob auth/network/parse failures → throw (never silent empty array / seed).
 *  D) Refuse accidental empty overwrites of a non-empty store.
 *  E) No Blob token → seed in-memory (+ best-effort local file).
 *     On Vercel without a token the FS is read-only; still return the seed so
 *     the public site is not blank. That path is not persistent storage.
 *
 * Blob store must be PUBLIC. Project images are public website assets.
 * put() uses access: "public" to match that store configuration.
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { list, put } from "@vercel/blob";
import { projects as seedProjects } from "../../src/data/projectsDetails.js";
import { blobAuth, hasBlobToken } from "./blobAuth.js";

export const PROJECTS_PATH = "sm-studios/projects.json";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
/** Local-only store so vercel-dev isolates share state without touching Blob. */
export const LOCAL_PROJECTS_FILE = resolve(ROOT, ".data/projects.local.json");

export class ProjectStoreError extends Error {
  /**
   * @param {string} message
   * @param {number} [status=500]
   */
  constructor(message, status = 500) {
    super(message);
    this.name = "ProjectStoreError";
    this.status = status;
  }
}

function cloneProjects(projects) {
  return JSON.parse(JSON.stringify(projects));
}

function readLocalFile() {
  if (!existsSync(LOCAL_PROJECTS_FILE)) return null;
  const data = JSON.parse(readFileSync(LOCAL_PROJECTS_FILE, "utf8"));
  if (!Array.isArray(data)) {
    throw new ProjectStoreError("Local project store is corrupt (not an array).", 500);
  }
  return data;
}

function writeLocalFile(projects) {
  mkdirSync(dirname(LOCAL_PROJECTS_FILE), { recursive: true });
  writeFileSync(LOCAL_PROJECTS_FILE, JSON.stringify(projects, null, 2), "utf8");
}

/**
 * Locate the projects.json blob entry by exact pathname only.
 * Distinguishes "missing" from "list failed" by throwing on failure.
 * Never falls back to an unrelated blob under the same prefix.
 */
async function findProjectsBlob() {
  const { blobs } = await list({ prefix: PROJECTS_PATH, ...blobAuth() });
  return blobs.find((b) => b.pathname === PROJECTS_PATH) || null;
}

/**
 * Read current store for empty-write guards without seeding.
 * @returns {Promise<unknown[]>}
 */
async function snapshotForGuard() {
  if (!hasBlobToken()) {
    return readLocalFile() || [];
  }

  const blob = await findProjectsBlob();
  if (!blob) return [];

  const resp = await fetch(`${blob.url}?t=${Date.now()}`);
  if (!resp.ok) {
    throw new ProjectStoreError(
      `Cannot verify project store before write (Blob fetch ${resp.status}).`,
      502,
    );
  }
  const data = await resp.json();
  if (!Array.isArray(data)) {
    throw new ProjectStoreError(
      "Cannot verify project store before write (Blob JSON is not an array).",
      502,
    );
  }
  return data;
}

function blobWriteError(err) {
  const message = err?.message || String(err);
  if (/private store/i.test(message) || /public access/i.test(message)) {
    return new ProjectStoreError(
      "Blob store access mismatch: this app requires a public Blob store.",
      500,
    );
  }
  return new ProjectStoreError("Failed to write project store.", 502);
}

// ---------------------------------------------------------------------------
// Load
// ---------------------------------------------------------------------------
export async function loadProjects() {
  // No credentials → return seed (file write is best-effort only).
  if (!hasBlobToken()) {
    try {
      const existing = readLocalFile();
      if (existing && existing.length > 0) return existing;
    } catch (err) {
      console.warn("[projectStore] Local store unreadable:", err.message);
    }

    const seed = cloneProjects(seedProjects);
    try {
      writeLocalFile(seed);
      console.info(
        `[projectStore] No Blob token — seeded local file store from projectsDetails.js (${seed.length} projects). ` +
          `Path: .data/projects.local.json.`,
      );
    } catch (err) {
      // Vercel serverless FS is read-only outside /tmp — still serve the seed.
      console.warn(
        `[projectStore] No Blob token and local write failed (${err.message}). ` +
          `Returning in-memory seed (${seed.length} projects). Set a public-store Blob token in Vercel for persistence.`,
      );
    }
    return seed;
  }

  let blob;
  try {
    blob = await findProjectsBlob();
  } catch (err) {
    console.error("[projectStore] Blob list failed:", err.message);
    throw new ProjectStoreError(
      "Failed to access project store (Blob list error). Seed was not applied.",
      502,
    );
  }

  // Rule A — object genuinely does not exist → seed once.
  if (!blob) {
    const seed = cloneProjects(seedProjects);
    await persistProjects(seed);
    console.info(
      `[projectStore] Seeded ${seed.length} projects to ${PROJECTS_PATH} (Blob was missing).`,
    );
    return seed;
  }

  // Rule B — existing object, including [], is the source of truth.
  try {
    const resp = await fetch(`${blob.url}?t=${Date.now()}`);
    if (!resp.ok) {
      throw new Error(`Blob fetch failed: ${resp.status}`);
    }
    const data = await resp.json();
    if (!Array.isArray(data)) {
      throw new Error("Blob project data is not an array.");
    }
    return data;
  } catch (err) {
    if (err instanceof ProjectStoreError) throw err;
    console.error("[projectStore] Blob read failed:", err.message);
    throw new ProjectStoreError(
      "Failed to read project store (Blob read error). Seed was not applied.",
      502,
    );
  }
}

// ---------------------------------------------------------------------------
// Persist
// ---------------------------------------------------------------------------
/**
 * @param {unknown[]} projects
 * @param {{ allowEmpty?: boolean }} [options]
 */
export async function persistProjects(projects, options = {}) {
  const { allowEmpty = false } = options;

  if (!Array.isArray(projects)) {
    throw new ProjectStoreError("Project payload must be an array.", 400);
  }

  // Rule D — never accidentally wipe a non-empty store with [].
  if (projects.length === 0 && !allowEmpty) {
    let existing;
    try {
      existing = await snapshotForGuard();
    } catch (err) {
      if (err instanceof ProjectStoreError) throw err;
      console.error("[projectStore] Guard snapshot failed:", err.message);
      throw new ProjectStoreError(
        "Refusing empty write: could not verify existing project store.",
        502,
      );
    }
    if (existing.length > 0) {
      throw new ProjectStoreError(
        "Refusing to overwrite a non-empty project store with an empty array.",
        409,
      );
    }
  }

  if (!hasBlobToken()) {
    writeLocalFile(projects);
    return;
  }

  try {
    await put(PROJECTS_PATH, JSON.stringify(projects), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      ...blobAuth(),
    });
  } catch (err) {
    if (err instanceof ProjectStoreError) throw err;
    console.error("[projectStore] Blob write failed:", err.message);
    throw blobWriteError(err);
  }
}

// ---------------------------------------------------------------------------
// Read-only inspection (no writes, no seeding of Blob)
// ---------------------------------------------------------------------------
/**
 * @returns {Promise<{
 *   mode: "local" | "blob",
 *   path: string,
 *   exists: boolean | null,
 *   count: number | null,
 *   error?: string,
 *   note?: string,
 * }>}
 */
export async function inspectProjectsStore() {
  if (!hasBlobToken()) {
    const existing = readLocalFile();
    return {
      mode: "local",
      path: PROJECTS_PATH,
      exists: null,
      count: existing ? existing.length : seedProjects.length,
      note:
        "Blob token unset — Blob was not contacted. Local file store: .data/projects.local.json",
      localFileExists: Boolean(existing),
    };
  }

  try {
    const blob = await findProjectsBlob();
    if (!blob) {
      return {
        mode: "blob",
        path: PROJECTS_PATH,
        exists: false,
        count: null,
      };
    }

    const resp = await fetch(`${blob.url}?t=${Date.now()}`);
    if (!resp.ok) {
      return {
        mode: "blob",
        path: PROJECTS_PATH,
        exists: true,
        count: null,
        error: `Fetch failed with status ${resp.status}`,
      };
    }
    const data = await resp.json();
    return {
      mode: "blob",
      path: PROJECTS_PATH,
      exists: true,
      count: Array.isArray(data) ? data.length : null,
      error: Array.isArray(data) ? undefined : "Blob JSON is not an array",
    };
  } catch (err) {
    return {
      mode: "blob",
      path: PROJECTS_PATH,
      exists: null,
      count: null,
      error: err.message || "Blob inspection failed",
    };
  }
}
