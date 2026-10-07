# paradisetravels.lk

Website for Paradise Travels (Pvt) Ltd. Rules: [CLAUDE.md](CLAUDE.md). Specs: [docs/](docs/00-README.md). Owner to-do list: [docs/CONTENT-TODO.md](docs/CONTENT-TODO.md).

**Stack:** Astro 7 (static pages + Node API routes) · Tailwind CSS v4 · TypeScript strict · GSAP (lazy) · Keystatic CMS · Playwright · Lighthouse CI.

## Requirements

Node.js 22 LTS (≥ 22.12) — see `.nvmrc`.

## Commands

| Command                           | What it does                                                                     |
| --------------------------------- | -------------------------------------------------------------------------------- |
| `npm run dev`                     | Dev server at http://localhost:4321 — CMS at http://localhost:4321/keystatic     |
| `npm run build`                   | Production build into `dist/`                                                    |
| `npm start`                       | Serve the build (`node ./dist/server/entry.mjs`) — what Hostinger runs           |
| `npm run check`                   | `astro check` (types + Astro diagnostics)                                        |
| `npm run lint` / `npm run format` | ESLint / Prettier                                                                |
| `npm run test:e2e`                | Playwright tests against the build (run `npm run build` first)                   |
| `npm run lhci`                    | Lighthouse CI with the budgets from docs/09 (served compressed, like Cloudflare) |

## What's where

```
src/content/        Markdown/JSON content — edit in Keystatic (/keystatic) or directly
src/content.config.ts  zod schemas for every collection (mirrored in keystatic.config.ts)
src/pages/          Routes (one file per template) + /api form endpoints
src/components/     layout/, home/, tours/, hotels/, forms/, ui/, cards/
src/lib/            site facts, seasons, schema.org builders, server form pipeline
src/styles/         design tokens (tokens.css) + Tailwind theme (global.css)
docs/               project specs + CONTENT-TODO
```

Internal pages: `/styleguide` (all components, noindex).

## Content rules (from CLAUDE.md)

- Never invent facts. Missing info → `{{TODO: …}}` placeholder + an entry in `docs/CONTENT-TODO.md`.
- `reviewed: false` marks draft copy that still needs owner/local-expert review.
- `sample: true` entries render in dev/staging only and are **never** built in production.
- Hotels: set `rateDisplay` only after checking the contract (rate parity, docs/10).
- Reviews: real only, with `permission: true` — the build fails otherwise.
- Photo grading: originals live untouched in `assets-src/photos/`; `node scripts/grade-photos.mjs` writes the
  graded copies (warm, lifted shadows, protected highlights — docs/04 §8) to `src/assets/images/photos/`.
  `--preview /tmp/out` makes before/after sheets instead. Add new originals to `assets-src/photos/` and re-run.
- Images: put photos in content via Keystatic (≥ 2400 px wide); they're converted to AVIF/WebP automatically. Until then, labelled colour placeholders are shown.

## Environment

Copy `.env.example` → `.env`. Builds are **noindex** unless `SITE_ENV=production`, so staging is never indexed.

Forms work without any secrets locally (emails are logged to the console). Production needs: Turnstile keys, an email provider (Resend **or** SMTP) and optionally `LEAD_WEBHOOK_URL` for the lead store.

## Deploy (Hostinger Node.js app, docs/08 §2)

- Build command: `npm run build` · Start command: `npm start` · Node 22
- Env vars: `SITE_ENV=production` (production only) + the form/Keystatic secrets above.
- Cloudflare in front: SSL Full (strict), cache `/_astro/*` 1 year, bypass `/api/*`, Brotli on, don't enable Rocket Loader. Add security headers (CSP etc.) via Transform Rules (docs/08 §9).
