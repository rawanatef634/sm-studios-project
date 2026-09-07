import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { projects as seedProjects } from "../data/projectsDetails";

const ProjectsContext = createContext(null);
const API = "/api/projects";

function normalizeProjects(data) {
  return Array.isArray(data) ? data : null;
}

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState(seedProjects);
  const loading = false;

  // Refresh from the server in the background. Keep seed on failure / empty.
  useEffect(() => {
    let cancelled = false;

    fetch(API)
      .then(async (r) => {
        const data = await r.json().catch(() => null);
        if (!r.ok) {
          throw new Error(
            (data && data.error) || `Projects API failed (${r.status})`,
          );
        }
        const list = normalizeProjects(data);
        if (!list) throw new Error("Projects API returned non-array JSON.");
        return list;
      })
      .then((list) => {
        if (cancelled || list.length === 0) return;
        setProjects(list);
      })
      .catch((err) => {
        console.warn(
          "[ProjectsContext] Keeping bundled seed:",
          err.message,
        );
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /** @param {import("../types/project").Project} newProject */
  const addProject = async (newProject) => {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(newProject),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Failed to create project.");
    }
    const created = await res.json();
    setProjects((prev) => [...prev, created]);
    return created;
  };

  /** @param {import("../types/project").Project} updatedProject */
  const updateProject = async (updatedProject) => {
    const res = await fetch(API, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updatedProject),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Failed to update project.");
    }
    const saved = await res.json();
    setProjects((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
    return saved;
  };

  /** @param {number} id */
  const deleteProject = async (id) => {
    const res = await fetch(API, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Failed to delete project.");
    }
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const value = useMemo(
    () => ({ projects, loading, addProject, updateProject, deleteProject }),
    [projects, loading],
  );

  return (
    <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectsContext);
  if (!ctx) {
    throw new Error("useProjects must be used within ProjectsProvider");
  }
  return ctx;
}
