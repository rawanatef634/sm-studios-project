import "./_utils/heronsignal.js";
import { verifySession, readJsonBody } from "./_utils/auth.js";
import {
  loadSettings,
  updateSettings,
  SettingsStoreError,
} from "./_utils/settingsStore.js";
import {
  loadProjects,
  persistProjects,
  ProjectStoreError,
} from "./_utils/projectStore.js";

function errorResponse(res, err) {
  if (err instanceof SettingsStoreError || err instanceof ProjectStoreError) {
    return res.status(err.status).json({ error: err.message });
  }
  console.error("[settings] Unexpected error:", err.message || err);
  return res.status(500).json({ error: "Settings error." });
}

/** Move projects from renamed/removed categories so none are left orphaned. */
async function applyCategoryRenames(renames) {
  const pairs = Object.entries(renames || {}).filter(
    ([from, to]) => typeof from === "string" && typeof to === "string" && from !== to,
  );
  if (pairs.length === 0) return null;

  const map = new Map(pairs);
  const projects = await loadProjects();
  let changed = false;
  const updated = projects.map((project) => {
    if (project && map.has(project.category)) {
      changed = true;
      return { ...project, category: map.get(project.category) };
    }
    return project;
  });
  if (!changed) return null;
  await persistProjects(updated);
  return updated;
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const settings = await loadSettings();
      res.setHeader("Cache-Control", "no-store");
      return res.status(200).json(settings);
    } catch (err) {
      return errorResponse(res, err);
    }
  }

  if (req.method !== "PUT") {
    res.setHeader("Allow", "GET, PUT");
    return res.status(405).json({ error: "Method not allowed." });
  }

  if (!verifySession(req)) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    return res.status(400).json({ error: "Invalid request body." });
  }

  try {
    const settings = await updateSettings({
      categories: body.categories,
      heroProjectIds: body.heroProjectIds,
      content: body.content,
    });
    const projects = await applyCategoryRenames(body.renamedCategories);
    return res.status(200).json({ settings, projects });
  } catch (err) {
    return errorResponse(res, err);
  }
}
