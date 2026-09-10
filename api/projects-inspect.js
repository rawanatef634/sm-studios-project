/**
 * Read-only diagnostic for the projects store.
 * Does not seed, write, or overwrite Blob data.
 *
 * GET /api/projects-inspect
 * Optional: require auth in production-like setups; left public for local
 * diagnostics but never mutates state and never returns secrets.
 */
import { inspectProjectsStore } from "./_utils/projectStore.js";
import { getBlobTokenSource, hasBlobToken } from "./_utils/blobAuth.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const result = await inspectProjectsStore();
    return res.status(200).json({
      ...result,
      // Never echo credentials or raw env values.
      tokenConfigured: hasBlobToken(),
      tokenSource: getBlobTokenSource(),
    });
  } catch (err) {
    console.error("[projects-inspect] error:", err.message);
    return res.status(500).json({ error: "Inspection failed." });
  }
}
