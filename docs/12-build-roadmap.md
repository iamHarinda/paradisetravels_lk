# 12 — Build Roadmap

Work phase by phase. At the end of each phase, Claude Code stops and reports: what was built, screenshots/links, Lighthouse scores, open TODOs.

## Phase 0 — Setup (1–2 days)
- [ ] GitHub repo `paradisetravels-web`, `main` protected, PR template.
- [ ] Astro + TypeScript strict + Tailwind v4 + `@astrojs/node` + `@astrojs/sitemap` + MDX + Keystatic.
- [ ] ESLint, Prettier, `astro check`, Playwright, Lighthouse CI configured.
- [ ] Design tokens (`src/styles/tokens.css`) from doc 04; self-hosted fonts.
- [ ] BaseLayout with SEO component (title, meta, canonical, OG, JSON-LD slot).
- [ ] Hostinger Node.js web app connected to GitHub; deploys a "coming soon" build to a staging subdomain (noindex).
- [ ] Cloudflare: DNS, SSL Full (strict), cache rules, Turnstile site key.
- [ ] `docs/CONTENT-TODO.md` created.
**Done when:** push to `main` deploys automatically; Lighthouse 100s on the blank layout.

## Phase 1 — Design system & core components (4–6 days)
- [ ] UI kit: Button, Chip, Card, Accordion, Tabs, Modal, Breadcrumbs, Rating display, Badge.
- [ ] Header (mega menu, mobile drawer), Footer, sticky mobile contact bar, floating contact button.
- [ ] Hero (video + poster + reduced-motion), Bento services grid, Island Explorer SVG map, Season Picker, Review wall, CTA blocks.
- [ ] Motion utilities (reveal, stagger, hover lift) + GSAP lazy loader + reduced-motion handling.
- [ ] `/styleguide` page (noindex) showing every component.
**Done when:** owner approves the look on mobile and desktop.

## Phase 2 — Content model & templates (5–7 days)
- [ ] Content collections + zod schemas (doc 08 §5); Keystatic config for all.
- [ ] Templates: home, hub/listing with filters, destination, experience, tour (timeline + route map), hotel, service, guide article, trip builder, contact, legal, 404.
- [ ] JSON-LD generators per template (doc 06 §4).
- [ ] OG image generation for tours/guides.
- [ ] Internal linking components (related tours/destinations/hotels).
**Done when:** each template renders with sample (clearly marked) content and passes budgets.

## Phase 3 — Forms, leads & integrations (3–4 days)
- [ ] `/api/enquiry`, `/api/rate-request`, `/api/trip-builder` with zod + Turnstile + honeypot + rate limiting.
- [ ] Email notifications + confirmation emails to hello@paradisetravels.lk.
- [ ] Lead storage (owner's choice: Google Sheet / Airtable / hosted DB).
- [ ] WhatsApp pre-filled links, KakaoTalk Channel link, click tracking events.
- [ ] Thank-you page + analytics conversions.
**Done when:** test submissions arrive by email and in the lead store; spam test blocked.

## Phase 4 — Launch content (parallel, owner + writer)
- [ ] Home, About (history since 2007, Chairman/MD, press), Contact, 12 service pages.
- [ ] 15 destinations, 8 experiences, 8 tours (3/5/7/10/14-day + honeymoon + Ayurveda + wildlife).
- [ ] 15 partner hotels (with confirmed `rateDisplay`).
- [ ] 10 guides incl. ETA 2026 pillar and Best Time to Visit pillar.
- [ ] Real reviews imported; FAQ page; legal pages.
- [ ] All photos graded and optimised; alt text.
**Done when:** `CONTENT-TODO.md` has zero launch-blocking items.

## Phase 5 — QA & launch (2–3 days)
- [ ] Cross-browser/device testing (iOS Safari, Android Chrome, desktop Chrome/Firefox/Safari/Edge).
- [ ] Accessibility audit (axe + keyboard + screen reader spot checks).
- [ ] Lighthouse/PSI/WebPageTest on all templates; fix regressions.
- [ ] Broken link check; redirects from old URLs; 404 test.
- [ ] Search Console + Bing Webmaster verified; sitemaps submitted; IndexNow.
- [ ] Analytics + conversions verified.
- [ ] Switch DNS / production deploy; purge Cloudflare cache; monitor 48h.
- [ ] Update Google Business Profile, Tripadvisor, Facebook with new site link.

## Phase 6 — Growth (ongoing, monthly)
- 8 guide articles, 2 new tours, monthly arrivals data update.
- Review requests after every trip; reply to all reviews.
- Monthly SEO + CWV report; fix anything not "Good".
- Phase 2 features: instant hotel quote estimates, `/hotel-deals/<region>` pages, month-by-month guides, day-tour pages.
- Phase 3: Korean (`/ko`) and German (`/de`) sections with human-reviewed translation; Chinese later based on data.

## Owner decisions needed (blockers)
1. Tagline choice (doc 05 §2).
2. Payment gateway & deposit policy (doc 10 §4).
3. Lead storage choice (doc 08 §6).
4. Hotel list + `rateDisplay` per hotel.
5. Response-time promise & office/WhatsApp hours.
6. Allow AI crawlers? (doc 06 §7 — recommended: yes).
7. Languages the team can truly support.
