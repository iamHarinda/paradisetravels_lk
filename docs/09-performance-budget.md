# 09 — Performance Budget

Speed is a feature and an SEO factor. Animated ≠ slow, if done right.

## 1. Targets (mobile, Moto G Power-class device, 4G throttling)
| Metric | Target | Hard limit |
|---|---|---|
| Lighthouse Performance | ≥ 95 | 90 |
| LCP | ≤ 2.0 s | 2.5 s |
| INP | ≤ 150 ms | 200 ms |
| CLS | ≤ 0.03 | 0.1 |
| TTFB (Cloudflare cached HTML) | ≤ 200 ms | 600 ms |
| Total transfer (home, initial) | ≤ 1.2 MB incl. hero poster | 1.8 MB |
| JS (initial, compressed) | ≤ 60 KB | 100 KB |
| CSS (compressed) | ≤ 30 KB | 50 KB |
| Fonts | ≤ 2 files preloaded, ≤ 120 KB total | |

Field data (CrUX / Search Console CWV) must be "Good" for all URL groups within 60 days of launch.

## 2. Images
- Source images ≥ 2400 px wide stored in `src/assets`; Astro generates AVIF + WebP at widths [400, 640, 960, 1280, 1600, 2000].
- Always set `width`/`height` (or aspect-ratio) → no CLS.
- LCP image: `loading="eager"`, `fetchpriority="high"`, preloaded; everything else `loading="lazy"`, `decoding="async"`.
- Hero poster ≤ 150 KB AVIF.
- Cards ≤ 60 KB each at 640 px.
- Use blurred LQIP placeholder (tiny base64) only where it adds value.

## 3. Hero video
- 8–12 s loop, 1280×720 max, no audio track, AV1/VP9 WebM ≤ 1.2 MB + H.264 MP4 fallback ≤ 1.8 MB.
- `<video muted playsinline loop preload="none" poster="...">` — start loading after `load` event or when idle; poster is the LCP element.
- Don't autoplay on `Save-Data` or `prefers-reduced-motion`; show poster with play button.
- Serve smaller mobile version (720×1280 portrait crop) via `<source media>`.

## 4. JavaScript
- No framework runtime on static pages. Islands hydrate with `client:visible` / `client:idle`; trip builder `client:load` only on its own page.
- GSAP + ScrollTrigger: dynamic import on sections that need them (~45 KB gz) — not on article pages.
- No jQuery, no carousel libraries, no animation libraries duplicating GSAP.
- Third-party: none in critical path. Analytics deferred.
- Long tasks < 50 ms; break up work with `requestIdleCallback`/`scheduler.yield()`.

## 5. CSS & fonts
- Tailwind with purging; critical CSS inlined by Astro for small pages.
- Fonts self-hosted WOFF2, subset (Latin + Latin-ext), variable; `font-display: swap`; metric-matched fallback via `size-adjust`/`ascent-override` to kill font CLS.

## 6. Caching
- Hashed assets: `Cache-Control: public, max-age=31536000, immutable`.
- HTML: short browser cache, longer Cloudflare edge cache, purged on deploy.
- Speculation Rules API for likely next pages (prefetch on hover/moderate eagerness) — Chromium browsers.
- Astro `prefetch` for internal links on hover.

## 7. Testing
- **Lighthouse CI** in GitHub Actions on every PR for: `/`, `/tours/sri-lanka-7-day-tour`, `/destinations/ella`, `/hotel-deals`, `/travel-guide/sri-lanka-visa-eta`, `/plan-your-trip`. Fail PR if budget exceeded (`lighthouserc.json` with assertions).
- PageSpeed Insights + WebPageTest (from a European and an Indian location) before launch.
- Real-user monitoring: Cloudflare Web Analytics / `web-vitals` library sending to analytics.
- Test on a real mid-range Android phone over mobile data.
