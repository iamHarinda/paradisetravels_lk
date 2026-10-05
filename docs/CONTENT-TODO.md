# Content TODO

Everything the site needs from the owner. Items marked **[launch]** block Phase 4 sign-off. Never fill these with invented data (CLAUDE.md hard rule 1).

## Brand
- [ ] **[launch]** Logo (SVG) + any brand colours to keep. `public/favicon.svg` is a temporary "PT" monogram.
- [ ] **[launch]** Default social share image. `public/og-default.png` is a temporary text-only placeholder, to be replaced with a real 1200×630 photo.
- [ ] Tagline choice (docs/05 §2).

## Business details
- [ ] **[launch]** Office opening hours and WhatsApp reply hours. Needed for `TravelAgency` schema and the "reply within X hours" promise.
- [ ] Map coordinates of the office (for `geo` in schema), taken from the Google Business Profile.
- [ ] Price range to state in schema (`priceRange`).
- [ ] Confirm the spelling of Chairman/MD "Upul Trabrew" + approved photo and bio.
- [ ] SLTDA registration number, IATA/other accreditations (only what can be proven).
- [ ] KakaoTalk Channel URL (the current `kakao://` link doesn't work on the web).
- [ ] Other social profiles for `sameAs` (Instagram, YouTube, LinkedIn, Tripadvisor URL, Google Maps URL).
- [ ] Languages the team can actually support.

## Decisions (docs/12 "Owner decisions needed")
- [ ] Payment gateway & deposit policy.
- [ ] Lead storage: Google Sheet / Airtable / hosted DB.
- [ ] Allow AI crawlers? Currently **allowed** in production `robots.txt` (recommended in docs/06 §7).

## Content (Phase 4 — full list in docs/01 §6)
- [ ] Real photos and videos.
- [ ] Real reviews + permission to display names.
- [ ] Hotel partner list with confirmed `rateDisplay` per hotel.
- [ ] Standard tour packages (route, days, inclusions, price ranges).
- [ ] Vehicle fleet details.
- [ ] Terms, cancellation policy, privacy requirements.
- [ ] Copy of the 2020 Daily News article.
