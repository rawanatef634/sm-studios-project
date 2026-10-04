import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useProjects } from "../../context/ProjectsContext";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import { MAX_CATEGORIES, MAX_CATEGORY_LENGTH } from "../../data/siteSettings";

/** @typedef {{ key: number, original: string | null, name: string }} Row */

let nextKey = 1;
const toRows = (names) =>
  names.map((name) => ({ key: nextKey++, original: name, name }));

export default function CategorySettings() {
  const { projects, replaceProjects } = useProjects();
  const { settings, saveSettings } = useSiteSettings();
  const [rows, setRows] = useState(/** @type {Row[]} */ ([]));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    setRows(toRows(settings.categories));
  }, [settings.categories]);

  const countFor = (name) =>
    name ? projects.filter((p) => p.category === name).length : 0;

  const uncategorized = projects.filter(
    (p) => !p.category || !settings.categories.includes(p.category),
  );

  const updateRow = (key, name) =>
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, name } : r)));

  const handleSave = async () => {
    setMessage({ type: "", text: "" });
    const categories = rows.map((r) => r.name.trim()).filter(Boolean);
    const renamedCategories = Object.fromEntries(
      rows
        .filter((r) => r.original && r.name.trim() && r.name.trim() !== r.original)
        .map((r) => [r.original, r.name.trim()]),
    );

    setSaving(true);
    try {
      const result = await saveSettings({ categories, renamedCategories });
      if (result.projects) replaceProjects(result.projects);
      setMessage({ type: "ok", text: "Categories saved." });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Project categories</h2>
        <p className="mt-1 text-sm text-slate-400">
          These appear as filters on the Projects and Services pages. Renaming a
          category also updates every project in it. Set each project&apos;s
          category from the project&apos;s Edit form.
        </p>
      </div>

      <div className="grid gap-2 rounded-xl border border-white/10 bg-slate-950 p-4">
        {rows.map((row) => {
          const count = countFor(row.original);
          return (
            <div
              key={row.key}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-white/10 bg-slate-900 p-3"
            >
              <input
                value={row.name}
                maxLength={MAX_CATEGORY_LENGTH}
                onChange={(e) => updateRow(row.key, e.target.value)}
                placeholder="Category name"
                className="min-w-[220px] flex-1 rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500"
              />
              <span className="w-24 text-sm text-slate-400">
                {count} project{count === 1 ? "" : "s"}
              </span>
              <button
                type="button"
                onClick={() => setRows(rows.filter((r) => r.key !== row.key))}
                disabled={count > 0}
                title={
                  count > 0
                    ? "Move its projects to another category first, or rename it instead"
                    : "Delete category"
                }
                className="inline-flex items-center gap-1 rounded-md border border-rose-800 px-3 py-1.5 text-sm text-rose-400 hover:bg-rose-950 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() =>
            setRows([...rows, { key: nextKey++, original: null, name: "" }])
          }
          disabled={rows.length >= MAX_CATEGORIES}
          className="mt-1 inline-flex w-fit items-center gap-1 rounded-md border border-cyan-500/50 px-3 py-1.5 text-sm text-cyan-300 hover:bg-cyan-500/10 disabled:opacity-40"
        >
          <Plus size={14} />
          Add category
        </button>
      </div>

      {uncategorized.length > 0 && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-950/30 px-4 py-3 text-sm text-amber-300">
          {uncategorized.length} project
          {uncategorized.length === 1 ? " is" : "s are"} not in any listed
          category and only show under &quot;All&quot;:{" "}
          {uncategorized.map((p) => p.title).join(", ")}. Edit{" "}
          {uncategorized.length === 1 ? "it" : "them"} in the Projects tab to
          pick a category.
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-md bg-cyan-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save categories"}
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
