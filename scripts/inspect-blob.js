/**
 * Read-only inspection of the projects store.
 * Does NOT seed, write, or overwrite Blob data.
 *
 * Usage:
 *   npm run blob:inspect
 *
 * Loads .env.local if present (never prints secret values).
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return false;
  const text = readFileSync(filePath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = val;
    }
  }
  return true;
}

const root = resolve(process.cwd());
const loadedLocal = loadEnvFile(resolve(root, ".env.local"));
const loadedEnv = loadEnvFile(resolve(root, ".env"));

const { inspectProjectsStore, PROJECTS_PATH } = await import(
  "../api/_utils/projectStore.js"
);

const hasToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

console.log("SM Studios — projects store inspection (read-only)");
console.log("--------------------------------------------------");
console.log(`Env files: .env.local=${loadedLocal ? "loaded" : "missing"}, .env=${loadedEnv ? "loaded" : "missing"}`);
console.log(`BLOB_READ_WRITE_TOKEN: ${hasToken ? "present" : "absent"}`);
console.log(`Target path: ${PROJECTS_PATH}`);
console.log("");

const result = await inspectProjectsStore();
console.log(JSON.stringify(result, null, 2));

if (result.mode === "local") {
  console.log("");
  console.log(
    "Note: Without a Blob token the API uses a local file store seeded from projectsDetails.js.",
  );
  console.log("Blob was not contacted and no Blob data was modified.");
} else if (result.exists === false) {
  console.log("");
  console.log(
    "Blob object does not exist yet. It will be seeded only on the next authenticated/server loadProjects() call when the token is set — not by this script.",
  );
} else if (result.exists === true) {
  console.log("");
  console.log(`Blob object exists with count=${result.count}. No data was modified.`);
}
