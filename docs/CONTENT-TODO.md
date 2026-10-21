# Content TODO

Everything the site needs from the owner before launch. **[launch]** = blocks Phase 4 sign-off.
Never fill these with invented data (CLAUDE.md hard rule 1). Pages still containing `{{TODO}}` text are listed by the audit in the build notes.

## 0. Owner feedback, 21 October 2026 — what changed and what is still needed
The owner reviewed the site and confirmed: source markets (Korea first), 12 airlines, three services (Tours, Visa
consultation, Air ticketing), five tour types (Round Trips, Honeymoon, Golf, Tea, Ayurveda), the hotels used for tour
stays in six areas, a blue-and-gold look, Jetwing-style imagery and map, airline logos and country flags, and a
Korean-market / Naver plan (docs/13-korea-naver-plan.md). Built: `/tours/<type>`, `/hotels`, `/ko/…` pages, Island
Atlas map, new home page. Removed: hotel-deal rates, day tours and the other nine services (old URLs redirect).
Still needed from the owner:
- [ ] **[launch] Korean copy review by a native speaker** (or a hired Korean travel writer) — every `/ko` page incl. the six guides in `src/data/ko-guides.ts`, `/ko/itinerary/7-days`, `/ko/private-driver`, `/ko/about`, `nameKo`/`blurbKo` in `src/data/stays.ts`,
      `ko` blocks in `src/data/tour-types.ts` and `src/data/island-highlights.ts`, form labels, confirmation email.
- [ ] **[launch] Does the team reply in Korean?** The Korean pages make no claim either way. If yes, say so on
      `/ko/contact` ("한국어 상담 가능"); if not, say replies are in English.
- [ ] **[launch] KakaoTalk ID / Kakao Channel or Open Chat link** — Korean pages currently say "add the phone number as a friend".
- [ ] **[launch] Naver Search Advisor** verification code → `NAVER_SITE_VERIFICATION` env var (docs/13 §1).
- [ ] **스리랑카 호텔 할인 page** — only if the owner has real, publishable hotel discounts (rate parity, hard rule 2).
- [ ] **Colombo "Marriott"** — which property (Colombo Marriott Hotel / Courtyard by Marriott Colombo)? (`src/content/hotels/marriott.json`)
- [ ] **Dolphin Hotel** — confirm the town (listed under Negombo).
- [ ] Confirm hotel names as written (fixed "innamon Citadel" → "Cinnamon Citadel"; "RIU (Ahungalla)" → "RIU Ahungalla";
      "Habarana Lodge" → "Cinnamon Lodge Habarana"; "Amaya (Amaya Lake, Dambulla)" → "Amaya Lake").
- [ ] **Golf packages** — which courses the agency books (e.g. Royal Colombo GC, Nuwara Eliya GC, Victoria Golf & Country
      Resort, Shangri-La Hambantota) so they can be named on `/tours/golf`. No golf or tea itinerary exists yet.
- [ ] **Hotel photos** with permission — hotels are shown by name over a landscape of the area until then.
- [ ] Malaysia Airlines + SriLankan Airlines official logo files (no free licence exists; text wordmarks shown).

## 1. Review draft copy — [launch]
All launch content was drafted from the project docs and well-established facts, and is marked `reviewed: false`.
A local expert / the owner must check every entry before launch (docs/05 §7), especially:
- [ ] **Travel times and distances** on destination pages (marked "approx.").
- [ ] **Best months** per destination/tour (Yala, Udawalawe and wildlife tour months are general knowledge, not from docs/11).
- [ ] **Tour itineraries** (8 tours) — routes, pacing, overnight stops.
- [ ] **Tour inclusions / exclusions** — confirm whether entrance fees, safaris and meals are included.
- [ ] Service pages (Visa consultation, Air ticketing) — claims about how each service works (e.g. group/worker ticketing).
- [ ] Tour-type pages (`src/data/tour-types.ts`) and Island Atlas highlights (`src/data/island-highlights.ts`).
- [ ] Pillar guides need expanding to ~2,500 words (ETA, Best time to visit) + team review.
- [ ] Add authoritative sources (e.g. Department of Meteorology) to the seasons, getting-around and travel-tips guides — they currently list none.
- [ ] Publish the **official list of 40 ETA-free countries** in the ETA guide.
- [ ] Confirm current **Tourist Police** number (travel tips guide).
- [ ] Confirm annual **Yala park closure** dates.
→ When an entry is checked, tick "Reviewed" in Keystatic.

## 2. Brand — [launch]
- [x] Logo supplied (800×800 JPG, `src/assets/brand/logo-original.jpg`) — now used in header, footer, favicon, app icons and JSON-LD.
- [ ] Logo as a vector file (SVG/AI/EPS) from the designer — the current one is cut out of a JPG, so edges are soft at large sizes.
- [ ] Default social share image (1200×630). `public/og-default.png` is a text-only placeholder.
- [ ] Tagline choice (docs/05 §2) — the site currently uses the hero line "Sri Lanka, beautifully planned."
- [x] Colours: blue and gold (owner, Oct 2026) — `src/styles/tokens.css`.

## 3. Photos & video
Interim photos: 48 Creative Commons / public-domain photos from Wikimedia Commons are in `src/assets/images/photos/`,
credited on `/photo-credits` (required by their CC BY / CC BY-SA licences — keep that page while they are used).
- [ ] Replace with the owner's own photography over time (docs/04 §8) — own photos build more trust than stock. Keep `/photo-credits` in sync (`src/data/photo-credits.json`).
- [ ] Hero video (8–12 s, see docs/09 §3) — the home hero is a 5-photo slideshow (Coconut Tree Hill, Sigiriya, Ella, tea country, stilt fishermen).
- [ ] The owner wants Jetwing-level imagery: professional photos of Sri Lanka (licensed stock or a shoot) will lift the site further than any code change.
- [ ] Hotel photos (from each partner hotel, with permission).
- [ ] Office, team and Chairman/MD photos.
- [ ] Ayurveda: no free Sri Lankan Ayurveda-treatment photo found — the Ayurveda pages use a Kandy spice stall and frangipani for now.

## 3a. Airline logos
The home page and Air Ticketing page show the 12 airlines the owner confirmed (21 October 2026): SriLankan (UL),
Singapore (SQ), Cathay Pacific (CX), China Eastern (MU), Korean Air (KE), Emirates (EK), Malaysia (MH), Air India (AI),
flydubai (FZ), Thai (TG), Turkish (TK), British Airways (BA). List: `src/data/airlines.ts`.
- [ ] **SriLankan Airlines and Malaysia Airlines logos** — no freely licensed files exist; shown as a text wordmark. Get the official logo from the airline's agent/partner portal and add it to `public/logos/airlines/`.
- [ ] Check each airline's agent brand-usage rules (some airlines provide official logo files to agents) and replace the community-sourced artwork if required.
- [ ] Keep the list current — remove any airline the agency stops ticketing.

## 4. Business details
- [ ] **[launch]** Office opening hours and WhatsApp reply hours → contact page, `TravelAgency` schema, and the "we reply within X" promise on the thank-you page.
- [ ] Office map coordinates (for `geo` in schema) — from the Google Business Profile.
- [ ] Price range for schema (`priceRange`).
- [x] Chairman/MD photo supplied (2026-10-21) — `src/assets/team/upul.jpg` (original in `assets-src/team/`).
- [ ] **[launch]** Confirm spelling: site says "Upul Trabrew"; the owner's message wrote "Upul Thabrew". Plus a short approved bio (team entry).
- [ ] Company history milestones, the Korea connection, and the 2020 Daily News repatriation article (About page).
- [ ] SLTDA registration number, IATA/other accreditations (only what can be proven).
- [ ] KakaoTalk Channel URL (contact links currently show the phone number).
- [ ] Other profiles for `sameAs` and the footer: Instagram, YouTube, LinkedIn, Tripadvisor, Google Maps URL, Google review link.
- [ ] Languages the team actually supports (see the Korean question in §0).

## 5. Prices & hotels
- [ ] **[launch]** Tour prices ("from US$ X pp") — all tours show "Price on request" until set (`priceFromUSD`).
- [x] Hotel list for tour stays (30 hotels, 6 areas) — supplied by the owner; shown by name only, no rates (hard rule 2).

## 6. Reviews
- [ ] **[launch]** Real Google/Facebook/Tripadvisor reviews with permission (add in Keystatic → Reviews). The review wall shows a "gathering reviews" message until then.

## 7. Legal — [launch]
- [ ] Terms & conditions (`/terms` — draft, noindex).
- [ ] Cancellation policy (`/cancellation-policy` — draft, noindex).
- [ ] Privacy policy legal review + data retention period (`/privacy` — draft, noindex).
- [ ] Accepted payment methods and deposit policy (FAQ "How do I pay?").

## 8. Decisions (docs/12 "Owner decisions needed")
- [ ] Payment gateway & deposit policy.
- [ ] Lead storage: Google Sheet / Airtable / hosted DB → set `LEAD_WEBHOOK_URL`.
- [ ] Allow AI crawlers? Currently **allowed** in production `robots.txt` (recommended in docs/06 §7).
- [ ] Analytics tool (GA4 with consent, or cookieless Plausible/Umami/Cloudflare). Click and lead events are already pushed to `dataLayer`.

## 9. Setup (owner / developer accounts)
- [ ] GitHub: protect `main`; decide how `dev-2026` merges into `main`.
- [ ] Hostinger Node.js app connected to GitHub (README → Deploy).
- [ ] Cloudflare: DNS, SSL Full (strict), cache rules, Turnstile keys, security headers.
- [ ] Email provider (Resend or Hostinger SMTP) for `hello@paradisetravels.lk`.
- [ ] Keystatic GitHub App (visit `/keystatic` on the deployed site and follow the setup).
