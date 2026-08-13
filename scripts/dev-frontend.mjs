/**
 * Cross-platform Vite frontend command for `vercel.json` `devCommand`.
 * Uses process.env.PORT from the Vercel local runtime (works on Windows).
 */
import { spawn } from "node:child_process";
import process from "node:process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const port = String(process.env.PORT || 5173);

const vitePkg = dirname(require.resolve("vite/package.json"));
const candidates = [
  join(vitePkg, "bin", "vite.js"),
  join(root, "node_modules", "vite", "bin", "vite.js"),
];
const viteBin = candidates.find((p) => existsSync(p));
if (!viteBin) {
  console.error("[dev-frontend] Could not resolve vite binary");
  process.exit(1);
}

const child = spawn(process.execPath, [viteBin, "--port", port], {
  stdio: "inherit",
  env: process.env,
  cwd: root,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
