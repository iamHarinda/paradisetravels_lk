# 08 — Technical Architecture

## 1. Why this stack
| Need | Choice | Reason |
|---|---|---|
| Fastest possible pages, great SEO | **Astro** (static output + islands) | Ships zero JS by default; HTML pre-rendered at build; image optimisation built in |
| Server logic (forms, quotes, hotel rate requests) | **Astro API routes on `@astrojs/node`** | Owner can use Node.js; Hostinger runs Node web apps |
| Styling | **Tailwind CSS v4** + CSS custom properties | Small CSS, design tokens from doc 04 |
| Motion | **GSAP + ScrollTrigger** (free, incl. plugins), CSS for simple effects | Smooth, battle-tested; lazy-loaded |
| Content editing by non-devs | **Keystatic** (GitHub mode) | Edits commit to GitHub → auto-deploy; no database to maintain |
| Interactive islands | Preact (small) or vanilla TS | Trip builder, filters, map |
| Hosting | **Hostinger Node.js web app** (Business Web Hosting or Cloud plan) | Owner already uses Hostinger; GitHub auto-deploy supported |
| CDN/DNS/Security | **Cloudflare** | Caching, WAF, Turnstile, redirects, analytics |
| Repo/CI | **GitHub** + GitHub Actions | Lint, type-check, Lighthouse CI on PRs |

Alternative considered: Next.js. Works on Hostinger too, but ships more JS by default and is heavier for a content site. Astro is the better fit for page speed.

## 2. Hostinger notes (verify in hPanel)
- Node.js web apps are available on **Business Web Hosting** and **Cloud** plans (VPS needs manual setup).
- Deploy flow: hPanel → Websites → Add Website → Node.js web app → Import Git repository → connect GitHub → select repo → Deploy. Auto-builds on push.
- Set Node version **22** (Astro 6+/7 needs ≥ 22.12).
- Build command: `npm run build`; start: `node ./dist/server/entry.mjs`.
- Environment variables set in the Hostinger app settings (never committed).
- Assume the filesystem is **not** durable storage for user data — don't write leads to local files. Use email + an external store (see §6).
- Fallback if Node plan isn't available: build Astro fully static (`output: 'static'`) to Hostinger static hosting and move form handling to a Cloudflare Worker.

## 3. Cloudflare configuration
- DNS proxied (orange cloud) for `paradisetravels.lk` and `www` (301 `www` → apex, or vice versa — pick one).
- SSL/TLS: **Full (strict)**; HSTS on after testing; Always Use HTTPS; TLS 1.3.
- **Cache Rules:**
  - `/_astro/*` and `/images/*` → Cache Everything, Edge TTL 1 year (files are content-hashed).
  - HTML pages → Cache Everything with Edge TTL ~4 h + "respect origin"/purge on deploy.
  - `/api/*` → Bypass cache.
- Purge cache on deploy: GitHub Action calls Cloudflare API after Hostinger deploy finishes (or purge by URL/tags).
- Brotli on; HTTP/3 on; Early Hints on.
- **Do not** enable Rocket Loader (breaks module scripts) or Auto Minify (deprecated/unnecessary).
- Turnstile for all forms.
- WAF managed rules + rate limit `/api/*` (e.g. 10 req/min/IP).
- Bulk Redirects for old URLs.
- Crawler Hints (IndexNow) on.
- Review Bot Fight Mode / AI crawler blocking so it doesn't block Googlebot/Bingbot or wanted AI crawlers (see doc 06 §7).
- Web Analytics (cookieless) as a free baseline.

## 4. Repo structure
```
paradisetravels-web/
├─ CLAUDE.md
├─ docs/                       # this documentation pack
├─ astro.config.mjs
├─ keystatic.config.ts
├─ package.json
├─ public/
│  ├─ robots.txt  llms.txt  favicon.svg  og-default.jpg
│  └─ fonts/
├─ src/
│  ├─ assets/images/           # source images (optimised at build)
│  ├─ components/
│  │  ├─ layout/  (Header, Footer, MegaMenu, StickyBar, Breadcrumbs, SEO)
│  │  ├─ home/    (Hero, Bento, IslandExplorer, SeasonPicker, ScrollStory)
│  │  ├─ tours/   (TourCard, ItineraryTimeline, RouteMap, PriceBox)
│  │  ├─ hotels/  (HotelCard, RateBadge, RateRequestForm)
│  │  ├─ forms/   (TripBuilder, EnquiryForm, Turnstile)
│  │  └─ ui/      (Button, Chip, Accordion, Tabs, Modal, Rating)
│  ├─ content/
│  │  ├─ destinations/*.mdx  experiences/*.mdx  tours/*.mdx
│  │  ├─ hotels/*.json  services/*.mdx  guides/*.mdx
│  │  ├─ faqs/*.json  testimonials/*.json  team/*.json
│  ├─ content.config.ts        # zod schemas for all collections
│  ├─ layouts/  (BaseLayout, ArticleLayout, DetailLayout)
│  ├─ lib/      (schema-org.ts, seo.ts, currency.ts, email.ts, validation.ts)
│  ├─ pages/
│  │  ├─ index.astro  plan-your-trip.astro  contact.astro ...
│  │  ├─ destinations/[slug].astro  tours/[slug].astro  hotel-deals/[slug].astro
│  │  ├─ travel-guide/[...slug].astro
│  │  └─ api/  enquiry.ts  rate-request.ts  trip-builder.ts
│  └─ styles/ (tokens.css, global.css)
├─ tests/  (playwright e2e, schema tests)
└─ .github/workflows/  ci.yml  lighthouse.yml  purge-cache.yml
```

## 5. Content schemas (zod — abbreviated)
```ts
tours: {
  title, slug, summary, durationDays: number, styles: string[],  // 'culture','wildlife','beach','honeymoon','ayurveda','family','luxury','budget'
  regions: string[], destinations: reference('destinations')[],
  priceFromUSD?: number, priceNote?: string, bestMonths: number[],
  days: { day: number, title: string, body: string, overnight?: string, meals?: string }[],
  inclusions: string[], exclusions: string[], hotels?: reference('hotels')[],
  heroImage: image(), gallery: image()[], faqs?: {q,a}[],
  seo: { title, description, keyword }
}
hotels: { name, slug, area, region, stars, type, heroImage, gallery, amenities[],
  rooms: { name, occupancy, rateDisplay: 'public'|'from'|'on-request', priceFromUSD?, mealPlan? }[],
  dealLabel?, validFrom?, validTo?, partnerSince?, seo }
guides: { title, description, author: reference('team'), published, updated, lastChecked,
  sources: {title,url}[], category, heroImage, relatedTours[], seo }
```

## 6. Forms & leads
- API routes validate with zod, verify Turnstile token server-side, then:
  1. Send notification email to hello@paradisetravels.lk (SMTP via Hostinger email, or Resend API).
  2. Send confirmation email to the traveller (branded HTML template, includes WhatsApp link).
  3. Store the lead in an external store — options (owner to choose): Google Sheet via service account, Airtable, or a small hosted DB (e.g. Turso/Neon free tier). Phase 2: simple admin view.
- Spam: Turnstile + honeypot + rate limit.
- Thank-you page with conversion event.
- WhatsApp deep links pre-filled: `https://wa.me/94773939989?text=<encoded message incl. page URL>`.
- KakaoTalk: use the business KakaoTalk Channel URL once created (current `kakao://chat/username` link on old site doesn't work on web).

## 7. Third-party embeds (performance-safe)
- Google Map: static map image/link with a "Load interactive map" facade.
- YouTube: `lite-youtube` facade.
- Reviews: build-time import from a JSON file (manually curated) — or Google Places API at build time (respect Google's attribution & display terms). No live widgets.
- Chat widgets: none at launch; WhatsApp button is enough.

## 8. Environments & workflow
- `main` → production (Hostinger auto-deploy).
- Feature branches → PR → CI (build, `astro check`, ESLint, Playwright smoke, Lighthouse CI budgets) → merge.
- Optional staging: second Hostinger Node app tracking a `staging` branch on `staging.paradisetravels.lk` (noindex + Cloudflare Access protection).
- Secrets: `SMTP_*`/`RESEND_API_KEY`, `TURNSTILE_SECRET`, `CF_API_TOKEN`, `CF_ZONE_ID`, lead-store creds.

## 9. Security & compliance
- Security headers (via Astro middleware or Cloudflare Transform Rules): CSP (strict, nonce-free since static), `X-Content-Type-Options`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `frame-ancestors 'none'`.
- Cookie consent only if non-essential cookies/analytics used (EU/UK visitors). Prefer cookieless analytics to avoid a banner.
- Privacy policy covering form data, WhatsApp, email; Sri Lanka Personal Data Protection Act + GDPR basics for EU/UK visitors.
- Never take card details on our own forms — payments via gateway-hosted pages only (doc 10).

## 10. Backups & monitoring
- Code + content = GitHub (versioned).
- Uptime monitoring (UptimeRobot / Better Stack free) on `/` and `/api/health`.
- Error logging: Hostinger runtime logs + optional Sentry (lightweight, server side only).
