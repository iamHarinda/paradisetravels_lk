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
| `npm run build:production`        | Production build + `paradisetravels-site.zip` for Hostinger upload               |
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

Forms are PHP (`public/api/*.php`, shared code in `_lead.php`) because the hosting has no Node.js. They send mail
with PHP `mail()` from `hello@paradisetravels.lk`. Server-side settings (Turnstile secret, mail addresses, optional
lead webhook) live in `~/paradise-config.php` on the server — copy `paradise-config.sample.php`, **one level above
`public_html`**, never inside it. Build-time settings (`SITE_ENV`, `TURNSTILE_SITE_KEY`, `NAVER_SITE_VERIFICATION`,
`GOOGLE_SITE_VERIFICATION`) go in `.env` before building.

## Deploy (Hostinger Premium Web Hosting — static + PHP, no Node.js)

1. Put the production values in `.env` (`SITE_ENV=production`, Naver/Google verification codes, Turnstile site key).
2. `npm run build:production` → builds `dist/` and zips it to `paradisetravels-site.zip`.
3. Upload: hPanel → File Manager → `public_html` → upload the zip → **Extract** (overwrite). Or upload the *contents*
   of `dist/` by FTP (FileZilla). Make sure the hidden `.htaccess` files are uploaded too.
4. First time only: upload `paradise-config.php` (from the sample) to the home folder **above** `public_html`, and
   create the `hello@paradisetravels.lk` mailbox in hPanel → Emails so PHP mail can send from it.
5. Cloudflare: purge cache after each upload. SSL Full (strict), cache `/_astro/*` 1 year, bypass `/api/*`,
   don't enable Rocket Loader. Check Security → Bots: Bot Fight Mode / WAF must not block Naver's **Yeti** crawler
   (add a skip rule for user agents containing `Yeti` if needed). Add SPF/DKIM records for Hostinger mail.

`dist/.htaccess` (generated from `deploy/apache.mjs`) gives clean URLs without trailing slashes, the 301 redirects for
retired pages, `/sitemap.xml`, caching and security headers. Keystatic only runs locally (`npm run dev` →
`/keystatic`); edits are committed to Git, then rebuilt and uploaded.
