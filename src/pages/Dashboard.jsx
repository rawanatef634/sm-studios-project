import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FolderKanban, LogOut, Pencil, Plus, Trash2, Eye } from "lucide-react";
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
  const [projectToDelete, setProjectToDelete] = useState(
    /** @type {Project | null} */ (null),
  );

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
    <section className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 shadow-2xl md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium tracking-wide text-cyan-300">
                <FolderKanban size={14} />
                ADMIN PANEL
              </p>
              <h1 className="text-3xl font-semibold text-white md:text-4xl">
                Project Dashboard
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                Manage project entries that render directly through the locked
                template.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingProject(null);
                  setIsAdding(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-cyan-400"
              >
                <Plus size={16} />
                Add Project
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate("/login", { replace: true });
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-white transition hover:bg-white/10"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-slate-900 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-400">
              Total Projects
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {projects.length}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-400">
              Form Status
            </p>
            <p className="mt-2 text-lg font-medium text-cyan-300">
              {editingProject ? "Editing" : isAdding ? "Creating" : "Idle"}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-400">
              Access Level
            </p>
            <p className="mt-2 text-lg font-medium text-emerald-300">
              Authenticated Admin
            </p>
          </div>
        </div>

        {(isAdding || editingProject) && (
          <div className="mb-6 rounded-2xl border border-white/10 bg-slate-900 p-4 md:p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">
              {editingProject ? "Edit Project" : "Create New Project"}
            </h2>
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

        <div className="rounded-2xl border border-white/10 bg-slate-900 p-4 md:p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">All Projects</h2>
          {projects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950 p-10 text-center">
              <p className="text-lg text-slate-300">No projects yet</p>
              <p className="mt-1 text-sm text-slate-500">
                Click Add Project to create your first entry.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-slate-950 p-4"
                >
                  <div>
                    <p className="text-lg font-semibold text-white">{project.title}</p>
                    <p className="text-sm text-slate-400">ID: {project.id}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/projects/${project.id}`)}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-600 px-3 py-1.5 text-sm text-slate-100 transition hover:bg-slate-800"
                    >
                      <Eye size={14} />
                      View
                    </button>
                    <button
                      onClick={() => {
                        setIsAdding(false);
                        setEditingProject(project);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="inline-flex items-center gap-1 rounded-md bg-cyan-500 px-3 py-1.5 text-sm font-medium text-slate-950 transition hover:bg-cyan-400"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => setProjectToDelete(project)}
                      className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-rose-500"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-slate-900 p-5 shadow-2xl">
            <h3 className="text-lg font-semibold text-white">Delete Project</h3>
            <p className="mt-2 text-sm text-slate-300">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-white">
                {projectToDelete.title}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setProjectToDelete(null)}
                className="rounded-md border border-slate-600 px-4 py-2 text-slate-100 transition hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteProject(projectToDelete.id);
                  setProjectToDelete(null);
                }}
                className="rounded-md bg-rose-600 px-4 py-2 font-medium text-white transition hover:bg-rose-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
