import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import { useProjects } from "../../context/ProjectsContext";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import { MAX_HERO_PROJECTS } from "../../data/siteSettings";

const MIN_SHARP_WIDTH = 1600;

function heroImageOf(project) {
  return project.heroImage || project.mainImage || project.img || "";
}

function ProjectThumb({ project }) {
  const [width, setWidth] = useState(null);
  const src = heroImageOf(project);

  return (
    <div className="flex items-center gap-3">
      {src ? (
        <img
          src={src}
          alt=""
          onLoad={(e) => setWidth(e.currentTarget.naturalWidth)}
          className="h-14 w-24 shrink-0 rounded object-cover border border-slate-700"
        />
      ) : (
        <div className="h-14 w-24 shrink-0 rounded border border-dashed border-slate-700" />
      )}
      <div>
        <p className="font-medium text-white">{project.title}</p>
        {!src && <p className="text-xs text-rose-400">No hero image set</p>}
        {width !== null && width < MIN_SHARP_WIDTH && (
          <p className="text-xs text-amber-400">
            Low resolution ({width}px wide) — may look blurry full-screen
          </p>
        )}
      </div>
    </div>
  );
}

export default function HeroSettings() {
  const { projects } = useProjects();
  const { settings, saveSettings } = useSiteSettings();
  const [ids, setIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    setIds(
      settings.heroProjectIds.filter((id) =>
        projects.some((p) => String(p.id) === String(id)),
      ),
    );
  }, [settings.heroProjectIds, projects]);

  const byId = (id) => projects.find((p) => String(p.id) === String(id));
  const selected = ids.map(byId).filter(Boolean);
  const available = projects.filter(
    (p) => !ids.some((id) => String(id) === String(p.id)),
  );

  const move = (index, delta) => {
    const next = [...ids];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setIds(next);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await saveSettings({ heroProjectIds: ids });
      setMessage({ type: "ok", text: "Hero banner saved." });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Hero banner</h2>
        <p className="mt-1 text-sm text-slate-400">
          Choose up to {MAX_HERO_PROJECTS} projects for the home page slideshow.
          Each slide uses the project&apos;s hero image — use photos at least{" "}
          {MIN_SHARP_WIDTH}px wide so they stay sharp.
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
        <p className="mb-3 text-xs uppercase tracking-wider text-slate-400">
          In the slideshow ({selected.length}/{MAX_HERO_PROJECTS})
        </p>
        {selected.length === 0 ? (
          <p className="text-sm text-slate-500">
            No projects selected — add at least one below.
          </p>
        ) : (
          <ol className="grid gap-2">
            {selected.map((project, index) => (
              <li
                key={project.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-slate-900 p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center text-sm text-slate-500">
                    {index + 1}
                  </span>
                  <ProjectThumb project={project} />
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label="Move up"
                    className="rounded border border-slate-600 p-1.5 text-slate-200 hover:bg-slate-800 disabled:opacity-30"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === selected.length - 1}
                    aria-label="Move down"
                    className="rounded border border-slate-600 p-1.5 text-slate-200 hover:bg-slate-800 disabled:opacity-30"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setIds(ids.filter((id) => String(id) !== String(project.id)))
                    }
                    aria-label="Remove from slideshow"
                    className="rounded border border-rose-800 p-1.5 text-rose-400 hover:bg-rose-950"
                  >
                    <X size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
        <p className="mb-3 text-xs uppercase tracking-wider text-slate-400">
          Other projects
        </p>
        <div className="grid gap-2">
          {available.map((project) => (
            <div
              key={project.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-slate-900 p-3"
            >
              <ProjectThumb project={project} />
              <button
                type="button"
                onClick={() => setIds([...ids, project.id])}
                disabled={ids.length >= MAX_HERO_PROJECTS || !heroImageOf(project)}
                className="inline-flex items-center gap-1 rounded-md border border-cyan-500/50 px-3 py-1.5 text-sm text-cyan-300 hover:bg-cyan-500/10 disabled:opacity-40"
              >
                <Plus size={14} />
                Add
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || ids.length === 0}
          className="rounded-md bg-cyan-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save hero banner"}
        </button>
        {message.text && (
          <p
            className={`text-sm ${message.type === "ok" ? "text-emerald-400" : "text-rose-400"}`}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}
