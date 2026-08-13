/**
 * Launches `vercel dev` without putting "vercel dev" in package.json's
 * "dev" script (the CLI rejects that as recursive invocation).
 *
 * Uses `vercel-dev.json` via `--local-config` so the production SPA rewrite
 * in `vercel.json` is not applied locally. That rewrite makes `vercel dev`
 * serve index.html for Vite module URLs (/src/*, HMR, etc.), which then
 * fails in vite:import-analysis.
 *
 * Frontend command comes from vercel-dev.json `devCommand`.
 * API routes under /api are executed by the Vercel local runtime.
 * Vite's own history fallback covers client routes in local dev.
 *
 * Loads `.env.local` / `.env` into the child environment so auth and Blob
 * tokens work in `--local` mode without printing secret values.
 */
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { existsSync, readFileSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";
import process from "node:process";

const require = createRequire(import.meta.url);

/** Reset ephemeral local project store so each `npm run dev` starts from seed. */
function clearLocalProjectStore() {
  const localStore = resolve(process.cwd(), ".data/projects.local.json");
  if (existsSync(localStore)) {
    unlinkSync(localStore);
    console.info("[dev] Cleared .data/projects.local.json (fresh seed for this session)");
  }
}

function loadEnvFile(filePath, target) {
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
    if (!(key in target)) {
      target[key] = val;
    }
  }
  return true;
}

function resolveVercelBin() {
  try {
    return require.resolve("vercel/dist/vc.js");
  } catch {
    try {
      return require.resolve("vercel/vc.js");
    } catch {
      return null;
    }
  }
}

const root = process.cwd();
clearLocalProjectStore();
const childEnv = { ...process.env };
const loadedLocal = loadEnvFile(resolve(root, ".env.local"), childEnv);
const loadedEnv = loadEnvFile(resolve(root, ".env"), childEnv);

console.info(
  `[dev] env: .env.local=${loadedLocal ? "loaded" : "missing"}, .env=${loadedEnv ? "loaded" : "missing"}, BLOB_READ_WRITE_TOKEN=${childEnv.BLOB_READ_WRITE_TOKEN ? "present" : "absent"}`,
);

const vercelBin = resolveVercelBin();
if (!vercelBin) {
  console.error(
    "[dev] Vercel CLI not found. Run: npm install (devDependency: vercel)",
  );
  process.exit(1);
}

const listen = process.env.PORT ? String(process.env.PORT) : "3000";
const localConfig = resolve(root, "vercel-dev.json");
const args = [
  vercelBin,
  "dev",
  "--local",
  "--local-config",
  localConfig,
  "--listen",
  listen,
  "--yes",
];

const child = spawn(process.execPath, args, {
  stdio: "inherit",
  env: childEnv,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
