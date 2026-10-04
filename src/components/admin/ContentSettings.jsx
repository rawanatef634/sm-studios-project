import { useEffect, useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import { CONTENT_FIELDS, MAX_CONTENT_LENGTH } from "../../data/siteSettings";

export default function ContentSettings() {
  const { settings, saveSettings } = useSiteSettings();
  const [drafts, setDrafts] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    setDrafts(
      Object.fromEntries(
        CONTENT_FIELDS.map((f) => [f.key, settings.content[f.key] ?? f.default]),
      ),
    );
  }, [settings.content]);

  const sections = useMemo(() => {
    const groups = new Map();
    for (const field of CONTENT_FIELDS) {
      if (!groups.has(field.section)) groups.set(field.section, []);
      groups.get(field.section).push(field);
    }
    return [...groups.entries()];
  }, []);

  const handleSave = async () => {
    setMessage({ type: "", text: "" });
    const content = {};
    for (const field of CONTENT_FIELDS) {
      const value = (drafts[field.key] ?? "").trim();
      if (value && value !== field.default) content[field.key] = value;
    }

    setSaving(true);
    try {
      await saveSettings({ content });
      setMessage({ type: "ok", text: "Website text saved." });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Website text</h2>
        <p className="mt-1 text-sm text-slate-400">
          Edit the wording shown on the public site. Leaving a field empty
          restores its original text. Line breaks are kept.
        </p>
      </div>

      {sections.map(([section, fields]) => (
        <fieldset
          key={section}
          className="grid gap-4 rounded-xl border border-white/10 bg-slate-950 p-4"
        >
          <legend className="px-1 text-sm font-semibold text-cyan-300">
            {section}
          </legend>
          {fields.map((field) => {
            const value = drafts[field.key] ?? "";
            const changed = value.trim() !== field.default;
            const inputClass =
              "w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500";
            return (
              <label key={field.key} className="grid gap-1.5">
                <span className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
                  {field.label}
                  {changed && (
                    <button
                      type="button"
                      onClick={() =>
                        setDrafts((d) => ({ ...d, [field.key]: field.default }))
                      }
                      className="inline-flex items-center gap-1 text-[11px] font-normal normal-case text-slate-400 hover:text-white"
                    >
                      <RotateCcw size={11} />
                      Reset to original
                    </button>
                  )}
                </span>
                {field.multiline ? (
                  <textarea
                    value={value}
                    maxLength={MAX_CONTENT_LENGTH}
                    placeholder={field.default}
                    onChange={(e) =>
                      setDrafts((d) => ({ ...d, [field.key]: e.target.value }))
                    }
                    rows={Math.min(6, Math.max(2, Math.ceil(field.default.length / 90)))}
                    className={`${inputClass} resize-y`}
                  />
                ) : (
                  <input
                    value={value}
                    maxLength={MAX_CONTENT_LENGTH}
                    placeholder={field.default}
                    onChange={(e) =>
                      setDrafts((d) => ({ ...d, [field.key]: e.target.value }))
                    }
                    className={inputClass}
                  />
                )}
              </label>
            );
          })}
        </fieldset>
      ))}

      <div className="sticky bottom-4 flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/95 p-3 backdrop-blur">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-md bg-cyan-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save website text"}
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
