import { init } from "@heronsignal/node";

let hasInitializedHeronSignal = false;

export function ensureHeronSignal() {
  if (hasInitializedHeronSignal) return;

  const token = process.env.HERONSIGNAL_SERVER_TOKEN;
  if (!token) return;

  init({
    token,
    service: "sm-studios-project",
    flushIntervalMs: process.env.VERCEL ? 0 : 2000,
  });

  hasInitializedHeronSignal = true;
}

ensureHeronSignal();
