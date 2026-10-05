# 06 — SEO Strategy (Google, Bing & AI search)

## 1. Targeting
- **Primary:** foreigners researching/booking Sri Lanka travel. Top source markets in 2026: India, UK, China, Germany, Australia, Russia (see doc 11).
- **Secondary:** Colombo-area locals for flights, visas, day outings, events; Korean market.
- Search engines: Google (primary), Bing (also powers ChatGPT search, Copilot, DuckDuckGo results), Yandex (Russian market — phase 2), Naver (Korean — phase 3).

## 2. Keyword strategy (map one primary keyword per page)

| Cluster | Example keywords | Page |
|---|---|---|
| Itineraries | sri lanka 7 day itinerary, sri lanka 10 day tour, 2 weeks in sri lanka | /tours/sri-lanka-N-day-tour |
| Tours | sri lanka tour packages, private tour sri lanka with driver | /tours |
| Driver/transport | sri lanka car with driver, colombo airport transfer | /services/transport-chauffeur |
| Visa | sri lanka eta 2026, sri lanka visa free countries | /travel-guide/sri-lanka-visa-eta |
| Seasons | best time to visit sri lanka, sri lanka in december | pillar + month pages |
| Destinations | things to do in ella, sigiriya tickets, yala safari | /destinations/* |
| Experiences | ayurveda retreat sri lanka, sri lanka honeymoon package | /experiences/* |
| Hotels | best hotels in galle, ella hotels with view, discount hotels sri lanka | /hotel-deals/* |
| Local | travel agency nugegoda, travel agent colombo, air ticket agency colombo | /, /contact, /services/flight-tickets |
| MICE | conference organisers sri lanka, corporate events colombo | /services/conferences-mice |
| Korea | 스리랑카 여행, 스리랑카 투어 (phase 3) | /ko/* |

Use Ahrefs (connected) / Google Keyword Planner to size each before writing; record target KW + volume in each page's frontmatter (`seo.keyword`).

## 3. Technical SEO checklist
- [ ] Static HTML for all content pages (Astro) — fast, crawlable.
- [ ] `sitemap-index.xml` via `@astrojs/sitemap`, with `lastmod`; split by type.
- [ ] `robots.txt` allowing all, pointing to sitemap; block `/api/`, `/thank-you`.
- [ ] Canonical on every page; self-referencing.
- [ ] Clean URLs (doc 03); 301s from old `.html`.
- [ ] One H1; logical H2/H3.
- [ ] Title ≤ 60 chars, meta description 140–160 chars, unique.
- [ ] Open Graph + Twitter cards with a real 1200×630 image per page (auto-generate OG images at build with `satori` for guides/tours).
- [ ] Breadcrumbs + BreadcrumbList schema.
- [ ] Image alt text, descriptive filenames (`sigiriya-rock-fortress-sunrise.avif`), image sitemap.
- [ ] Core Web Vitals green (doc 09).
- [ ] HTTPS, HSTS (Cloudflare), no mixed content.
- [ ] 404 page with search + popular links; no soft 404s.
- [ ] Pagination with real links (no infinite scroll-only).
- [ ] `hreflang` when languages launch (`en`, `ko`, `de`, `x-default`) using subfolders.
- [ ] IndexNow (Bing/Yandex) ping on deploy — Cloudflare "Crawler Hints" can do this automatically.
- [ ] Google Search Console + Bing Webmaster Tools verified (DNS TXT via Cloudflare); submit sitemaps.

## 4. Structured data (JSON-LD)
| Page | Schema |
|---|---|
| All | `Organization` (+ `logo`, `sameAs`: Facebook, Tripadvisor, Google Maps, Instagram, YouTube, LinkedIn), `WebSite` |
| Home/Contact | `TravelAgency` (subtype of LocalBusiness) with address, geo, telephone, email, openingHoursSpecification, priceRange, areaServed |
| Tours | `TouristTrip` with `itinerary` (ItemList of places), `offers` (Offer with price, priceCurrency, availability) — or `Product` + `Offer` |
| Destinations | `TouristDestination` / `TouristAttraction` |
| Hotels | `Hotel` (name, address, starRating, image) — **no** fake `aggregateRating` |
| Guides | `Article` / `BlogPosting` with author (Person), datePublished, dateModified |
| FAQs | `FAQPage` (Google shows FAQ rich results only for authoritative gov/health sites now, but it still helps Bing and AI assistants understand content) |
| Breadcrumbs | `BreadcrumbList` |
| Events (MICE) | `Event` only for real public events |

**Review rich snippets:** Google does not show star snippets for a business marking up reviews about itself (self-serving reviews on LocalBusiness/Organization). Show reviews visually; don't rely on stars in SERPs. Never mark up fabricated ratings.

Validate with Google Rich Results Test and Schema.org validator in CI where possible.

## 5. Local SEO (Google & Bing)
- **Google Business Profile:** primary category *Travel agency*; secondary *Tour operator*, *Tour agency*, *Visa consulting service* (pick what's accurate). Add services list (all 12), products (top tours, hotel deals), 30+ photos, real hours, website UTM link, booking link to /plan-your-trip, Q&A seeded with real FAQs, weekly posts.
- **Bing Places:** import from Google Business Profile.
- **Apple Business Connect:** claim (Apple Maps users — many UK/AU/US travellers).
- NAP (name, address, phone) identical everywhere: "Paradise Travels (Pvt) Ltd, No. 08, Old Kottawa Road, Mirihana, Nugegoda 10250, Sri Lanka, +94 77 393 9989".

## 6. E-E-A-T (trust signals Google looks for)
- About page with real history since 2007, leadership with photo & bio, press mention (Daily News 2020), registrations/licences with numbers (only verified ones).
- Author pages for guide writers (real staff).
- Contact info visible site-wide; physical address; map.
- Clear policies (terms, cancellation, privacy).
- Real reviews linked to source platforms.

## 7. AI search / LLM visibility (2026 reality)
Travellers increasingly ask ChatGPT, Gemini, Perplexity, Copilot "plan my Sri Lanka trip / which agency". To be cited:
- Be listed and reviewed on the platforms AIs cite (Tripadvisor, Google, Reddit mentions, travel blogs, Wikipedia-style sources, news).
- Write clear, factual, well-structured answers (question-style H2s, concise first paragraph, tables).
- Keep entity data consistent (same name, address, founding year everywhere) + `Organization` schema with `sameAs`.
- Publish an `/llms.txt` summarising the company, services and key pages (low cost, emerging convention).
- Don't block reputable AI crawlers in robots.txt (decide with owner; default allow GPTBot/ClaudeBot/PerplexityBot/Google-Extended for visibility). Check Cloudflare's "AI bot" blocking setting — it may block these by default; turn off if visibility is wanted.
- Track brand mentions in AI answers (Ahrefs Brand Radar is available in the connected Ahrefs account).

## 8. Measurement
- Google Search Console, Bing Webmaster Tools, GA4 (or privacy-friendly Plausible/Umami) with consent.
- Conversions: trip-builder submit, WhatsApp click, Kakao click, phone click, email click, hotel-rate request.
- UTM on all social/GBP links.
- Monthly SEO report: clicks, impressions, top queries, new keywords in top 10, enquiries by landing page.

## 9. Timeline expectations
New content typically takes 3–6 months to rank meaningfully; head terms like "Sri Lanka tours" 9–18 months with consistent publishing and links. Long-tail and local terms first.
