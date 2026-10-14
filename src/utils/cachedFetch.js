/**
 * Last successful public API response, kept in localStorage so repeat visits
 * render real content immediately instead of the bundled seed.
 */
export function readCache(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeCache(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or disabled — the in-memory state is still correct.
  }
}

/**
 * Public GETs are edge-cached for a few seconds; the dashboard bypasses that
 * cache so admins always see their own saves.
 */
export function publicApiUrl(path) {
  const isAdmin = /^\/(dashboard|login|studio)/.test(window.location.pathname);
  return isAdmin ? `${path}?fresh=${Date.now()}` : path;
}
