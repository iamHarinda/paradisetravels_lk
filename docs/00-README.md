# Paradise Travels — Website Rebuild Documentation Pack

**Project:** Full rebuild of https://paradisetravels.lk
**Prepared:** 5 October 2026
**Audience for these docs:** Claude Code (and any developer) building the new site.

This pack is written the way a senior web agency would hand over a project: business brief → research → strategy → design system → content → SEO → architecture → roadmap. Read in order the first time; afterwards use as reference.

## How to use with Claude Code

1. Create the GitHub repo (e.g. `paradisetravels-web`).
2. Copy `CLAUDE.md` to the **repo root** — Claude Code reads it automatically every session.
3. Copy all other files into `/docs` in the repo.
4. Start Claude Code in the repo and say:
   > "Read CLAUDE.md and docs/00-README.md, then start Phase 0 from docs/12-build-roadmap.md. Work phase by phase and stop for my review at the end of each phase."
5. For each phase, point Claude Code at the relevant doc (e.g. "build the hotel deals module per docs/10-hotel-deals-and-booking.md").

## File index

| File | What it covers |
|---|---|
| `CLAUDE.md` | Always-on rules for Claude Code: stack, conventions, hard rules, quality gates |
| `01-project-brief.md` | Business facts, goals, audience, verified facts vs. things to verify |
| `02-competitor-analysis.md` | Jetwing, Aitken Spence, 2nd Chance & others — what to copy, what to beat |
| `03-sitemap-and-ia.md` | Full sitemap, URL structure, navigation, page templates |
| `04-ui-ux-design-system.md` | "2030" design direction, tokens, typography, motion & interaction spec |
| `05-content-strategy.md` | Brand voice, page-by-page content, rewritten service copy, Sri Lanka content plan |
| `06-seo-strategy.md` | Technical SEO, keywords, schema, international/hreflang, AI-search visibility |
| `07-listings-and-offpage.md` | Where to list the business, review strategy, backlinks, social |
| `08-tech-architecture.md` | Astro + Node on Hostinger, Cloudflare, GitHub, repo structure, CMS |
| `09-performance-budget.md` | Core Web Vitals targets, image/video/font/JS rules, testing |
| `10-hotel-deals-and-booking.md` | Selling discounted hotel rates, enquiry → quote → payment flow, data model |
| `11-sri-lanka-travel-facts-2026.md` | Current tourism facts (ETA, arrivals, seasons) with sources — re-verify before publishing |
| `12-build-roadmap.md` | Phased build plan with tasks and acceptance criteria |

## Key decisions at a glance

- **Stack:** Astro (static-first, islands) + Node adapter for API routes, Tailwind CSS, GSAP for motion, Keystatic CMS (Git-based). Deployed as a Node.js web app on Hostinger from GitHub, Cloudflare in front.
- **Positioning:** "Everything for your Sri Lanka journey — in one place." Flights, visas, hotels, transport, guides, events, Ayurveda — one trusted team since 2007.
- **Primary audience:** Foreign travellers researching Sri Lanka (UK, India, Germany, Australia, China, Russia, Korea and more).
- **Conversion model:** Enquiry/quote-first (WhatsApp, email, trip-builder form), with exclusive hotel rates as the hook. Online payment via payment link after quote.
- **Performance target:** Lighthouse 95+ mobile on all templates, LCP < 2.0 s on 4G.
- **Contact email for site:** hello@paradisetravels.lk

## Things the owner must supply (blocking content)

See the checklist at the bottom of `01-project-brief.md`. Most important: real photos/videos, real Google/Facebook reviews (with permission), the hotel partner list and rates, logo files, licences/accreditations with numbers.
