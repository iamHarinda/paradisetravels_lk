# CLAUDE.md — Paradise Travels Website

You are building the new website for **Paradise Travels (Pvt) Ltd**, a Sri Lankan travel agency (est. 2007, Nugegoda). Full specs live in `/docs`. Read `/docs/00-README.md` first, then the doc relevant to your current task.

## Stack (do not change without asking)
- **Astro** (latest stable) — static output by default; on-demand rendering only for API routes and pages that truly need it. Use `@astrojs/node` adapter (standalone mode).
- **Node.js 22 LTS** (Astro requires ≥ 22.12).
- **Tailwind CSS v4** with design tokens from `docs/04-ui-ux-design-system.md`.
- **TypeScript** strict mode.
- **GSAP** (incl. ScrollTrigger) for scroll/hover motion — loaded only on pages that use it, never in the critical path.
- **Keystatic** (GitHub mode) for content editing; content stored as Markdown/MDX/JSON in `src/content`.
- **Astro `<Image>` / `<Picture>`** for every raster image (AVIF + WebP, responsive `srcset`).
- Forms: Astro API routes + Cloudflare Turnstile + transactional email (SMTP or Resend) to `hello@paradisetravels.lk`.
- Hosting: Hostinger Node.js web app, auto-deploy from GitHub `main`. Cloudflare DNS/CDN in front.

## Hard rules
1. **Never invent facts.** No fake reviews, ratings, awards, licence numbers, staff names, prices or statistics. If content is missing, use a clearly marked placeholder `{{TODO: ...}}` and list it in `docs/CONTENT-TODO.md`.
2. **Never publish hotel net rates** without the owner confirming the hotel contract allows it (rate parity). Use the display modes in `docs/10-hotel-deals-and-booking.md`.
3. **Performance budget is a requirement, not a goal** (`docs/09-performance-budget.md`). A PR that breaks it is not done.
4. **Accessibility:** WCAG 2.2 AA. Every animation respects `prefers-reduced-motion`. Keyboard-navigable. Visible focus states. Alt text on all meaningful images.
5. **SEO on every page:** unique title + meta description, one H1, canonical, Open Graph image, JSON-LD per `docs/06-seo-strategy.md`, included in sitemap.
6. Travel facts (visa rules, fees, arrival stats) must carry a "Last checked: <date>" line and a source link in the frontmatter.
7. No client-side JS framework for static content. Use Astro islands only for interactive components (trip builder, filters, map, gallery).
8. No third-party scripts in `<head>` except consent-managed analytics. Load chat widgets/maps on interaction (facade pattern).

## Conventions
- Components: `src/components/<area>/<Name>.astro`, PascalCase.
- Content collections: `destinations`, `experiences`, `itineraries`, `services`, `hotels`, `guides` (blog), `faqs`, `testimonials`, `team`.
- URLs: lowercase, hyphenated, no trailing `.html`, trailing slash off. See `docs/03-sitemap-and-ia.md`.
- Commit style: Conventional Commits (`feat:`, `fix:`, `content:`, `perf:`, `seo:`).
- Branches: `main` (production, auto-deploys), feature branches → PR.

## Quality gates before marking any task done
- `npm run build` passes with zero warnings that matter.
- `npm run check` (astro check + tsc) clean.
- Lighthouse CI (mobile) ≥ 95 Performance, 100 Accessibility, 100 Best Practices, 100 SEO on changed templates.
- No layout shift from fonts/images (CLS < 0.05).
- Links checked; no 404s internally.

## Business facts (source of truth)
- Legal name: Paradise Travels (Pvt) Ltd — established 2007
- Address: No. 08, Old Kottawa Road, Mirihana, Nugegoda 10250, Sri Lanka
- Phone / WhatsApp / KakaoTalk: +94 77 393 9989
- Email (public on new site): hello@paradisetravels.lk
- Facebook: https://www.facebook.com/paradisetravelslk
- Chairman & Managing Director: Upul Trabrew (verify spelling with owner before publishing)
