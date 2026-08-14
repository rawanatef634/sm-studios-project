# SM Studios

Staff-facing React site for SM Studios project portfolio, with Vercel serverless APIs and Vercel Blob persistence.

## Stack

- **Frontend:** React + Vite
- **Production host:** Vercel
- **API:** Vercel serverless routes under `/api/*`
- **Project + image storage:** Vercel Blob (`sm-studios/projects.json`, `sm-studios/images/*`)
- **Initial seed only:** `src/data/projectsDetails.js` (never auto-replaces an existing Blob document)

## Prerequisites

- Node.js 20+
- [Vercel CLI](https://vercel.com/docs/cli) (installed as a project `devDependency`)

## Local development

```bash
npm install
vercel link          # once — connect this folder to the Vercel project (optional but recommended)
vercel env pull .env.local
npm run dev          # Vercel local runtime + Vite (see scripts/run-dev.mjs)
```

Open the URL printed by the CLI (default `http://localhost:3000`; if that port is busy, Vercel picks the next free port).

For staff login locally you need `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, and `SESSION_SECRET` in `.env.local` (pulled from Vercel or copied from `.env.example`).

`npm run dev` runs the Vercel local runtime (`vercel dev --local`) via `scripts/run-dev.mjs`. That starts the Vite frontend using `devCommand` in `vercel.json` and executes `/api/*` as serverless functions.

> Note: `package.json` cannot set `"dev": "vercel dev"` directly — the Vercel CLI rejects that as recursive invocation. The launcher script is the supported workaround.

Do **not** use plain Vite alone for staff/dashboard work: it serves `/api/*` as static JavaScript source and the dashboard appears empty.

Optional frontend-only Vite (no API execution):

```bash
npm run dev:vite
```

### Environment notes

| Variable | Purpose |
|----------|---------|
| `ADMIN_USERNAME` / `ADMIN_PASSWORD_HASH` | Staff login |
| `SESSION_SECRET` | Signed session cookie |
| `SMS_PUBLIC_READ_WRITE_TOKEN` | Preferred Vercel Blob token (public store) |
| `BLOB_READ_WRITE_TOKEN` | Fallback Blob token (ignored if the public-store token is set) |
| `RESEND_API_KEY` | Server-only Resend key for Contact (`/api/contact`) and Careers (`/api/careers`) emails |
| `RESEND_FROM_EMAIL` | Verified From address, e.g. `SM Studios <noreply@smstudios-om.com>` |

Without a Blob token:

- `/api/projects` uses a **local file-backed** copy of the 10 seed projects from `projectsDetails.js` (`.data/projects.local.json`)
- Create / edit / delete work for the current `npm run dev` session (shared across API isolates)
- The local file is cleared when `npm run dev` starts, so you always begin from the seed
- Blob is **not** read or written
- Image upload (`/api/upload`) requires a Blob token and will fail without it

With a Blob token:

- Production-like Blob persistence
- Missing `sm-studios/projects.json` → seed once from `projectsDetails.js`
- Existing Blob (including empty `[]`) → returned as-is; **never** auto-replaced by the seed
- Blob auth/network errors → API error (no silent seed fallback)

The Blob store must be **public**. Project images are public website assets. A private store rejects `access: "public"` writes.

### Contact and Careers email

Form submissions are posted to `/api/contact` and `/api/careers`. Those routes send mail with [Resend](https://resend.com) to `info@smstudios-om.com`. The API key must never be exposed to the browser.

1. Create a Resend API key and add `RESEND_API_KEY` in Vercel Environment Variables (Production, Preview, Development).
2. Verify the `smstudios-om.com` domain in Resend.
3. Set `RESEND_FROM_EMAIL` to a verified sender such as `SM Studios <noreply@smstudios-om.com>`.
4. Pull locally with `vercel env pull .env.local`.

Without `RESEND_API_KEY`, the forms return an error and do not pretend the message was sent. Careers resumes are attached to the email (PDF / DOC / DOCX, max 3.5 MB) and are not stored.

### Inspect Blob (read-only)

```bash
npm run blob:inspect
```

Or open `GET /api/projects-inspect` while `npm run dev` is running.

This reports whether `sm-studios/projects.json` exists and how many projects it contains. It does **not** seed or overwrite anything.

## Production

Deploy on Vercel. Set the env vars in the Vercel project dashboard (or sync via CLI). Build command remains:

```bash
npm run build
```

## Scripts

| Script | Command |
|--------|---------|
| `npm run dev` | Vercel local runtime + Vite (`scripts/run-dev.mjs`) |
| `npm run dev:vite` | Vite only (no API handlers) |
| `npm run build` | Production frontend build |
| `npm run blob:inspect` | Read-only projects store check |
| `npm run generate-hash` | Create bcrypt password hash |

## Safety

- Existing Vercel Blob project data is never automatically replaced by `projectsDetails.js`
- Accidental empty-array writes to a non-empty store are rejected
- `projectsDetails.js` is the canonical **initial** seed only — do not treat it as the live production database once Blob is seeded
