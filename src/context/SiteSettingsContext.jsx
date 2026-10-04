import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CONTENT_DEFAULTS, DEFAULT_SETTINGS } from "../data/siteSettings";

const SiteSettingsContext = createContext(null);
const API = "/api/settings";

function normalize(data) {
  return {
    categories:
      Array.isArray(data?.categories) && data.categories.length > 0
        ? data.categories
        : DEFAULT_SETTINGS.categories,
    heroProjectIds:
      Array.isArray(data?.heroProjectIds) && data.heroProjectIds.length > 0
        ? data.heroProjectIds
        : DEFAULT_SETTINGS.heroProjectIds,
    content:
      data?.content && typeof data.content === "object" ? data.content : {},
  };
}

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  // Bundled defaults render immediately; stored overrides replace them.
  // Refetched whenever the tab is shown so dashboard edits appear.
  useEffect(() => {
    let cancelled = false;
    const load = () =>
      fetch(API, { cache: "no-store" })
        .then(async (r) => {
          if (!r.ok) throw new Error(`Settings API failed (${r.status})`);
          return r.json();
        })
        .then((data) => {
          if (!cancelled) setSettings(normalize(data));
        })
        .catch((err) => {
          console.warn("[SiteSettingsContext] Using defaults:", err.message);
        });

    const onVisible = () => {
      if (document.visibilityState === "visible") load();
    };

    load();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const t = useCallback(
    (key) => settings.content[key] || CONTENT_DEFAULTS[key] || "",
    [settings.content],
  );

  /**
   * @param {{ categories?: string[], heroProjectIds?: (number|string)[], content?: Record<string,string>, renamedCategories?: Record<string,string> }} patch
   * @returns {Promise<{ settings: object, projects: object[] | null }>}
   */
  const saveSettings = useCallback(async (patch) => {
    const res = await fetch(API, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(patch),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Failed to save settings.");
    setSettings(normalize(data.settings));
    return data;
  }, []);

  const value = useMemo(
    () => ({ settings, t, saveSettings }),
    [settings, t, saveSettings],
  );

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) {
    throw new Error("useSiteSettings must be used within SiteSettingsProvider");
  }
  return ctx;
}
