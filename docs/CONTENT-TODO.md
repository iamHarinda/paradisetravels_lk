# Content TODO

Everything the site needs from the owner before launch. **[launch]** = blocks Phase 4 sign-off.
Never fill these with invented data (CLAUDE.md hard rule 1). Pages still containing `{{TODO}}` text are listed by the audit in the build notes.

## 1. Review draft copy — [launch]
All launch content was drafted from the project docs and well-established facts, and is marked `reviewed: false`.
A local expert / the owner must check every entry before launch (docs/05 §7), especially:
- [ ] **Travel times and distances** on destination pages (marked "approx.").
- [ ] **Best months** per destination/tour (Yala, Udawalawe and wildlife tour months are general knowledge, not from docs/11).
- [ ] **Tour itineraries** (8 tours) — routes, pacing, overnight stops.
- [ ] **Tour inclusions / exclusions** — confirm whether entrance fees, safaris and meals are included.
- [ ] Service pages — claims about how each service works (e.g. "licensed guides", group/worker ticketing).
- [ ] Pillar guides need expanding to ~2,500 words (ETA, Best time to visit) + team review.
- [ ] Add authoritative sources (e.g. Department of Meteorology) to the seasons, getting-around and travel-tips guides — they currently list none.
- [ ] Publish the **official list of 40 ETA-free countries** in the ETA guide.
- [ ] Confirm current **Tourist Police** number (travel tips guide).
- [ ] Confirm annual **Yala park closure** dates.
→ When an entry is checked, tick "Reviewed" in Keystatic.

## 2. Brand — [launch]
- [ ] Logo (SVG) + any brand colours to keep. The "PT" mark in the header and `public/favicon.svg` are temporary.
- [ ] Default social share image (1200×630). `public/og-default.png` is a text-only placeholder.
- [ ] Tagline choice (docs/05 §2) — the site currently uses the hero line "Sri Lanka, planned end-to-end."

## 3. Photos & video
Interim photos: 28 Creative Commons / public-domain photos from Wikimedia Commons are in `src/assets/images/photos/`,
credited on `/photo-credits` (required by their CC BY / CC BY-SA licences — keep that page while they are used).
- [ ] Replace with the owner's own photography over time (docs/04 §8) — own photos build more trust than stock. Keep `/photo-credits` in sync (`src/data/photo-credits.json`).
- [ ] Hero video (8–12 s, see docs/09 §3) — the home hero currently uses a still photo of Sigiriya.
- [ ] Hotel photos (from each partner hotel, with permission).
- [ ] Office, team and Chairman/MD photos.
- [ ] Ayurveda: no suitable free photo found — the Ayurveda pages use a hill-country landscape for now.

## 4. Business details
- [ ] **[launch]** Office opening hours and WhatsApp reply hours → contact page, `TravelAgency` schema, and the "we reply within X" promise on the thank-you page.
- [ ] Office map coordinates (for `geo` in schema) — from the Google Business Profile.
- [ ] Price range for schema (`priceRange`).
- [ ] **[launch]** Confirm spelling of Chairman/MD "Upul Trabrew" + approved photo and short bio (team entry).
- [ ] Company history milestones, the Korea connection, and the 2020 Daily News repatriation article (About page).
- [ ] SLTDA registration number, IATA/other accreditations (only what can be proven).
- [ ] KakaoTalk Channel URL (contact links currently show the phone number).
- [ ] Other profiles for `sameAs` and the footer: Instagram, YouTube, LinkedIn, Tripadvisor, Google Maps URL, Google review link.
- [ ] Languages the team / guides / interpreters actually support (tour guides + interpreters pages).
- [ ] Vehicle fleet details (transport page).

## 5. Prices & hotels
- [ ] **[launch]** Tour prices ("from US$ X pp") — all tours show "Price on request" until set (`priceFromUSD`).
- [ ] **[launch]** Hotel partner list (15 for launch) with `rateDisplay` confirmed against each contract (docs/10). Only a `sample: true` template hotel exists, which is excluded from production.
- [ ] Day-tour list and prices.

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
