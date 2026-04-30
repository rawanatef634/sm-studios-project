import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { projects as seedProjects } from "../data/projectsDetails";

const STORAGE_KEY = "sm-studios-projects";
const ProjectsContext = createContext(null);

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // fall through to seed data
    }
    return seedProjects;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  /** @param {import("../types/project").Project} newProject */
  const addProject = (newProject) => {
    setProjects((prev) => [...prev, newProject]);
  };

  /** @param {import("../types/project").Project} updatedProject */
  const updateProject = (updatedProject) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)),
    );
  };

  /** @param {number} id */
  const deleteProject = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const value = useMemo(
    () => ({ projects, addProject, updateProject, deleteProject }),
    [projects],
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
