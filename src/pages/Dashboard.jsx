import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProjectForm from "../components/ProjectForm";
import { useProjects } from "../context/ProjectsContext";
import { useAuth } from "../context/AuthContext";

/** @typedef {import("../types/project").Project} Project */

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const [isAdding, setIsAdding] = useState(false);
  const [editingProject, setEditingProject] = useState(/** @type {Project | null} */ (null));
  const [pendingViewId, setPendingViewId] = useState(null);

  useEffect(() => {
    if (!pendingViewId) return;
    const exists = projects.some((p) => p.id === pendingViewId);
    if (!exists) return;
    navigate(`/projects/${pendingViewId}`);
    setPendingViewId(null);
  }, [pendingViewId, projects, navigate]);

  /** @param {Project} project */
  const handleCreate = (project) => {
    addProject(project);
    setIsAdding(false);
    setPendingViewId(project.id);
  };

  /** @param {Project} project */
  const handleEditSave = (project) => {
    updateProject(project);
    setEditingProject(null);
    navigate(`/projects/${project.id}`);
  };

  return (
    <section className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white border rounded-xl p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h1 className="text-2xl font-semibold">Project Dashboard</h1>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingProject(null);
                  setIsAdding(true);
                }}
                className="bg-black text-white px-4 py-2 rounded-md"
              >
                Add Project
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate("/login", { replace: true });
                }}
                className="border border-gray-300 px-4 py-2 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>

          {(isAdding || editingProject) && (
            <div className="mb-6 border rounded-lg p-4 bg-gray-50">
              <ProjectForm
                initialProject={editingProject}
                onSubmit={editingProject ? handleEditSave : handleCreate}
                onCancel={() => {
                  setIsAdding(false);
                  setEditingProject(null);
                }}
                submitLabel={editingProject ? "Save Changes" : "Create Project"}
              />
            </div>
          )}

          {projects.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-600">
              No projects yet
            </div>
          ) : (
            <div className="grid gap-2">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="border rounded-lg p-3 flex flex-wrap items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-medium">{project.title}</p>
                    <p className="text-sm text-gray-500">ID: {project.id}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/projects/${project.id}`)}
                      className="border px-3 py-1.5 text-sm rounded-md"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setIsAdding(false);
                        setEditingProject(project);
                      }}
                      className="bg-black text-white px-3 py-1.5 text-sm rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        const ok = window.confirm(
                          `Delete project "${project.title}"?`,
                        );
                        if (ok) deleteProject(project.id);
                      }}
                      className="bg-red-600 text-white px-3 py-1.5 text-sm rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
