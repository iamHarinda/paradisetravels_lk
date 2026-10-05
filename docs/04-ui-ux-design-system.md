# 04 — UI/UX Design System ("Paradise 2030")

## 1. Design direction

**Concept: "The Island in One Place."**
An editorial, cinematic, calm-luxury experience — think premium travel magazine meets modern product UI. The site should feel like *one living island*: the user scrolls and travels from coast to hills to ancient cities, and every service is a tile in one connected "bento" world.

Keywords: **immersive, editorial, warm, confident, effortless, fast.**

Avoid: stock-template look, carousels everywhere, autoplay sliders, cluttered banners, pop-ups on load, heavy parallax that hurts performance.

## 2. Colour tokens

Derived from Sri Lankan nature: ocean, tea hills, temple gold, laterite earth, monsoon sky.

```css
:root {
  /* Brand */
  --c-ocean-900: #062A35;   /* deep Indian Ocean — primary dark */
  --c-ocean-700: #0B4A5C;
  --c-ocean-500: #127A8C;   /* primary accent */
  --c-lagoon-300: #7FD1C7;  /* fresh highlight */
  --c-tea-600:   #2F6B3F;   /* tea-country green */
  --c-gold-500:  #D9A441;   /* temple gold — CTAs, highlights */
  --c-gold-300:  #F0CF85;
  --c-laterite-500: #C2603C;/* earth/spice — sparing accent */

  /* Neutrals */
  --c-sand-50:  #FBF8F2;    /* page background (light) */
  --c-sand-100: #F3EDE2;
  --c-stone-400:#9A958C;
  --c-ink-900:  #14181B;    /* body text */

  /* Semantic */
  --c-bg: var(--c-sand-50);
  --c-surface: #FFFFFF;
  --c-text: var(--c-ink-900);
  --c-text-muted: #5A5F63;
  --c-primary: var(--c-ocean-700);
  --c-cta: var(--c-gold-500);
  --c-cta-text: var(--c-ocean-900);
  --c-focus: #1E90FF;
}
@media (prefers-color-scheme: dark) { /* optional dark theme for night browsing */
  :root:not([data-theme="light"]) {
    --c-bg: #071C23; --c-surface: #0C2A33; --c-text: #EEF2F2; --c-text-muted: #A9B6B8;
  }
}
```
All text/background pairs must pass WCAG AA (4.5:1 body, 3:1 large). Gold CTA uses dark ocean text, not white.

## 3. Typography
- **Display:** a variable serif with character — e.g. *Fraunces* (variable, self-hosted, subset Latin). Used for H1/H2 and pull-quotes.
- **UI/Body:** *Inter* or *Geist* variable, self-hosted, subset.
- Self-host as WOFF2, `font-display: swap`, preload only the display font's single weight used above the fold. Use `size-adjust` fallback metrics to avoid CLS.
- Fluid type scale with `clamp()`:
  - H1: `clamp(2.5rem, 6vw + 1rem, 6rem)`, tight leading (1.0–1.05), slight negative tracking
  - H2: `clamp(2rem, 3.5vw + 1rem, 3.75rem)`
  - Body: `clamp(1rem, 0.3vw + 0.95rem, 1.125rem)`, line-height 1.6, max 68ch
- Korean pages: add *Pretendard* (subset) when `/ko` launches.

## 4. Layout & grid
- 12-col grid, max width 1440px, generous gutters (24–40px), 16px side gutter on mobile.
- Spacing scale (4px base): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160.
- Radius: 12px cards, 24px large media, 999px pills.
- **Bento grid** for the "all-in-one services" section — mixed tile sizes, each tile = one service with icon/micro-animation.

## 5. Signature components
1. **Cinematic hero** — full-bleed video (≤ 1.5 MB, 8–12 s loop, muted, poster image as LCP), H1 + search-like "Where do you want to go?" trip-builder entry, trust strip below (Since 2007 · reviews rating · WhatsApp 24/7).
2. **Island Explorer** — interactive SVG map of Sri Lanka; hover/tap a region (Cultural Triangle, Hill Country, South Coast, East Coast, North, Colombo & West) to reveal destinations, best months and a CTA. Accessible: also renders as a list.
3. **Season Wheel / Month picker** — "When are you travelling?" → highlights which coasts are in season (west/south Dec–Apr; east Apr/May–Sep). Data-driven from content.
4. **All-in-one Bento** — 12 services as tiles; hover = tile lifts, icon animates (Lottie-free: CSS/SVG only).
5. **Itinerary timeline** — day-by-day vertical timeline with route line drawing on scroll (GSAP DrawSVG-like via stroke-dashoffset).
6. **Hotel deal cards** — image, area, star rating, "Paradise rate" badge, "Request this rate" button.
7. **Review wall** — masonry of real reviews with source logo (Google/Tripadvisor/Facebook) and date.
8. **Sticky enquiry bar** (mobile) — WhatsApp · Call · Plan My Trip.
9. **Trip builder** — 5 steps with progress bar, big tappable chips, autosave to sessionStorage (wrapped in try/catch), final review screen.
10. **Floating contact** — single button expanding to WhatsApp / KakaoTalk / Email / Call. Loads no third-party script.

## 6. Motion & interaction spec
Motion should feel like *travel* — smooth, directional, never gimmicky.

| Pattern | Where | Spec |
|---|---|---|
| Reveal on scroll | Section headings, cards | Fade + 24px rise, 600ms, `cubic-bezier(.2,.7,.2,1)`, stagger 60ms. Use IntersectionObserver or CSS `animation-timeline: view()` with fallback |
| Pinned storytelling | Home "Journey across the island" | GSAP ScrollTrigger pin: coast → hills → ancient cities → wildlife, images crossfade, text slides |
| Parallax (subtle) | Hero media, big images | Max 8–12% translate; disabled on low-end/`prefers-reduced-motion` |
| Route draw | Itinerary maps | SVG stroke draw tied to scroll |
| Hover lift | Cards, bento tiles | translateY(-4px) + shadow, 200ms; image scale 1.04 inside clipped frame |
| Magnetic CTA | Primary buttons (desktop only) | ≤ 6px pull; off on touch |
| Page transitions | All pages | Astro View Transitions (shared element for card → detail hero image) |
| Counters | Trust stats | Count up once when visible |
| Cursor | Desktop only, optional | Small custom cursor that grows over media ("View") — must not hide native cursor for accessibility; skip if it costs perf |

Rules:
- Animate only `transform` and `opacity`.
- Every effect has a `prefers-reduced-motion: reduce` fallback (instant/no movement).
- No scroll-jacking. If smooth scrolling (Lenis) is tested, it must be opt-out-able and off on touch devices — default **off**.
- GSAP loaded via dynamic `import()` only on pages using it.

## 7. UX principles
- **One primary CTA per screen**: "Plan My Trip" (gold). Secondary: WhatsApp.
- Prices shown as "from US$ X per person" with currency switcher; never hidden behind forms where we can show them.
- Forms: max 5 fields per step, inline validation, phone with country code picker, preferred contact method (WhatsApp/Email/Kakao).
- Trust near every CTA: response time ("Reply within 2 hours, 8am–10pm SL time" — confirm with owner), since 2007, reviews.
- Mobile-first: thumb-reachable sticky bar, 48px tap targets.
- Content readable without JS.

## 8. Imagery & art direction
- Real photography preferred; warm, natural light, people experiencing (not posing). Mix of wide landscapes and close textures (tea leaves, spices, sarongs, temple details).
- Consistent grade: slightly warm, lifted shadows, not over-saturated.
- Every image: AVIF/WebP, explicit width/height, `loading="lazy"` except LCP, descriptive alt.
- Do not use images of identifiable people without releases.
- Owner's photo-editing skills (Lightroom) → create a Paradise preset for consistent grading.

## 9. Accessibility checklist (WCAG 2.2 AA)
- Focus visible on all interactive elements; skip-to-content link.
- Map, carousels and tabs operable by keyboard; ARIA patterns per APG.
- Video has no essential audio; pause control on hero video.
- Colour not the only indicator (season wheel uses labels too).
- Form errors announced (aria-live).
- Minimum target size 24×24 CSS px (we use 48).
