import { verifySession, readJsonBody } from "./_utils/auth.js";
import {
  loadProjects,
  persistProjects,
  ProjectStoreError,
} from "./_utils/projectStore.js";

function storeErrorResponse(res, err) {
  if (err instanceof ProjectStoreError) {
    return res.status(err.status).json({ error: err.message });
  }
  console.error("[projects] Unexpected error:", err.message || err);
  return res.status(500).json({ error: "Project store error." });
}

// ---------------------------------------------------------------------------
// Handler — all project CRUD in one route, routed by HTTP method
// ---------------------------------------------------------------------------
export default async function handler(req, res) {
  // -----------------------------------------------------------------------
  // GET — public: no auth required
  // -----------------------------------------------------------------------
  if (req.method === "GET") {
    try {
      const projects = await loadProjects();
      return res.status(200).json(projects);
    } catch (err) {
      return storeErrorResponse(res, err);
    }
  }

  // -----------------------------------------------------------------------
  // All mutations require a valid authenticated session
  // -----------------------------------------------------------------------
  const session = verifySession(req);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    return res.status(400).json({ error: "Invalid request body." });
  }

  let projects;
  try {
    projects = await loadProjects();
  } catch (err) {
    return storeErrorResponse(res, err);
  }

  // -----------------------------------------------------------------------
  // POST — create project
  // -----------------------------------------------------------------------
  if (req.method === "POST") {
    const project = body;
    if (!project || project.id === undefined || project.id === null || !project.title) {
      return res.status(400).json({ error: "Project must have id and title." });
    }
    if (projects.some((p) => p.id === project.id)) {
      return res.status(409).json({ error: "A project with this ID already exists." });
    }
    try {
      const updated = [...projects, project];
      await persistProjects(updated);
      return res.status(201).json(project);
    } catch (err) {
      return storeErrorResponse(res, err);
    }
  }

  // -----------------------------------------------------------------------
  // PUT — update project
  // -----------------------------------------------------------------------
  if (req.method === "PUT") {
    const project = body;
    if (!project || project.id === undefined || project.id === null) {
      return res.status(400).json({ error: "Project ID is required." });
    }
    if (!projects.some((p) => p.id === project.id)) {
      return res.status(404).json({ error: "Project not found." });
    }
    try {
      const updated = projects.map((p) => (p.id === project.id ? project : p));
      await persistProjects(updated);
      return res.status(200).json(project);
    } catch (err) {
      return storeErrorResponse(res, err);
    }
  }

  // -----------------------------------------------------------------------
  // DELETE — remove a single project by id
  // -----------------------------------------------------------------------
  if (req.method === "DELETE") {
    const { id } = body;
    if (id === undefined || id === null || id === "") {
      return res.status(400).json({ error: "Project ID is required." });
    }
    if (!projects.some((p) => p.id === id)) {
      // Missing/invalid id must never become a wipe of the store.
      return res.status(404).json({ error: "Project not found." });
    }

    const updated = projects.filter((p) => p.id !== id);

    // Deleting the last project leaves [] intentionally — allowEmpty only then.
    const allowEmpty = updated.length === 0 && projects.length === 1;

    try {
      await persistProjects(updated, { allowEmpty });
      return res.status(200).json({ ok: true });
    } catch (err) {
      return storeErrorResponse(res, err);
    }
  }

  return res.status(405).end("Method Not Allowed");
}
