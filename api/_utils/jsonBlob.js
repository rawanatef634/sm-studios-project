/**
 * Versioned JSON documents in a public Vercel Blob store.
 *
 * Overwriting a blob at a fixed URL is not instant: the Blob CDN can keep
 * serving the previous copy for up to ~60s, even with a cache-busting query.
 * Each write therefore goes to a new URL (`<name>-<random>.json`) and reads
 * pick the most recently uploaded version, so changes are visible on the
 * next request. Older versions are pruned after a successful write.
 */
import { del, list, put } from "@vercel/blob";
import { blobAuth } from "./blobAuth.js";

/** Versions kept behind the latest, so a reader mid-fetch never hits a 404. */
const KEEP_PREVIOUS = 1;

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Matches the legacy fixed pathname and every versioned copy of it. */
function versionMatcher(pathname) {
  const base = escapeRegExp(pathname.replace(/\.json$/, ""));
  return new RegExp(`^${base}(-[A-Za-z0-9]+)?\\.json$`);
}

async function listVersions(pathname) {
  const matches = versionMatcher(pathname);
  const prefix = pathname.replace(/\.json$/, "");
  const versions = [];
  let cursor;
  do {
    const page = await list({ prefix, cursor, ...blobAuth() });
    versions.push(...page.blobs.filter((b) => matches.test(b.pathname)));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return versions.sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
  );
}

/**
 * @returns {Promise<{ url: string } | null>} the latest version, or null if none exists
 * @throws when the Blob list call fails
 */
export async function findLatestJsonBlob(pathname) {
  const [latest] = await listVersions(pathname);
  return latest || null;
}

/** @returns {Promise<Response>} raw fetch of the given version */
export function fetchJsonBlob(blob) {
  return fetch(blob.url, { cache: "no-store" });
}

/** @throws when the Blob put call fails; pruning failures are only logged */
export async function writeJsonBlob(pathname, data) {
  const created = await put(pathname, JSON.stringify(data), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: true,
    cacheControlMaxAge: 60,
    ...blobAuth(),
  });

  try {
    const stale = (await listVersions(pathname))
      .filter((b) => b.url !== created.url)
      .slice(KEEP_PREVIOUS)
      .map((b) => b.url);
    if (stale.length > 0) await del(stale, blobAuth());
  } catch (err) {
    console.warn(`[jsonBlob] Could not prune old versions of ${pathname}:`, err.message);
  }
  return created;
}
