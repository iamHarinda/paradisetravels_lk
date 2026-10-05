# paradisetravels.lk

Website for Paradise Travels (Pvt) Ltd. The rules are in [CLAUDE.md](CLAUDE.md) and the specs in [docs/](docs/00-README.md).

## Requirements

Node.js 22 LTS (≥ 22.12). See `.nvmrc`.

## Commands

| Command                           | What it does                                                           |
| --------------------------------- | ---------------------------------------------------------------------- |
| `npm run dev`                     | Dev server at http://localhost:4321 (Keystatic at `/keystatic`)        |
| `npm run build`                   | Production build into `dist/`                                          |
| `npm start`                       | Serve the build (`node ./dist/server/entry.mjs`) — what Hostinger runs |
| `npm run check`                   | `astro check` (types + Astro diagnostics)                              |
| `npm run lint` / `npm run format` | ESLint / Prettier                                                      |
| `npm run test:e2e`                | Playwright smoke tests against the build                               |
| `npm run lhci`                    | Lighthouse CI with the performance budgets from docs/09                |

## Environment

Copy `.env.example` → `.env`. Builds are **noindex** unless `SITE_ENV=production`, so staging is never indexed.

## Deploy (Hostinger Node.js app)

- Build command: `npm run build`
- Start command: `npm start`
- Node version: 22
- Env vars: `SITE_ENV=production` on production only.
