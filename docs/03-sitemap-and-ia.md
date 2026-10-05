# 03 — Sitemap & Information Architecture

## Principles
- Every service, destination, experience and itinerary gets **its own indexable page** (the current one-page site can't rank).
- Max 3 clicks to any page. Every page ends with a clear next step (enquire / WhatsApp / related content).
- Primary nav aimed at foreign travellers; outbound (flights/visa) still one click away.

## Primary navigation
```
Logo | Destinations ▾ | Experiences ▾ | Tours ▾ | Hotel Deals | Services ▾ | Travel Guide | About | [Plan My Trip] (CTA button)
```
Utility bar (desktop) / drawer (mobile): language switcher, WhatsApp, phone, currency selector (USD/EUR/GBP/LKR/INR — display only).

Mega-menus show images + short descriptions (lazy-loaded, no layout shift).

## Full sitemap (phase 1 = ●, phase 2 = ◐, phase 3 = ○)

```
/                                   ● Home
/plan-your-trip                     ● Multi-step trip builder (main conversion page)
/contact                            ● Contact, map (facade), office hours, WhatsApp/Kakao

/destinations                       ● Interactive island map + grid
  /destinations/colombo             ●
  /destinations/kandy               ●
  /destinations/sigiriya            ●
  /destinations/dambulla            ●
  /destinations/anuradhapura        ●
  /destinations/polonnaruwa         ●
  /destinations/nuwara-eliya        ●
  /destinations/ella                ●
  /destinations/yala                ●
  /destinations/udawalawe           ◐
  /destinations/galle               ●
  /destinations/mirissa             ◐
  /destinations/bentota             ◐
  /destinations/negombo             ●
  /destinations/mount-lavinia       ◐
  /destinations/arugam-bay          ●
  /destinations/trincomalee         ◐  (incl. Nilaveli)
  /destinations/jaffna              ◐
  /destinations/ratnapura           ◐
  /destinations/minneriya           ◐
  /destinations/knuckles            ○
  /destinations/kalpitiya           ○

/experiences                        ●
  /experiences/wildlife-safaris     ●
  /experiences/beaches              ●
  /experiences/culture-heritage     ●  (Cultural Triangle, UNESCO sites)
  /experiences/scenic-train-journeys●
  /experiences/tea-country          ●
  /experiences/ayurveda-wellness    ●
  /experiences/whale-watching       ◐
  /experiences/surfing              ◐
  /experiences/honeymoon            ●
  /experiences/family-holidays      ◐
  /experiences/adventure            ◐  (rafting Kitulgala, hiking, ballooning)
  /experiences/food-culinary        ◐
  /experiences/ramayana-trail       ◐  (big for Indian market)
  /experiences/buddhist-pilgrimage  ○

/tours                              ● All packages with filters (duration, style, budget, month)
  /tours/sri-lanka-3-day-tour       ●
  /tours/sri-lanka-5-day-tour       ●
  /tours/sri-lanka-7-day-tour       ●
  /tours/sri-lanka-10-day-tour      ●
  /tours/sri-lanka-14-day-tour      ●
  /tours/sri-lanka-21-day-tour      ◐
  /tours/<package-slug>             ● Individual packages (e.g. classic-cultural-triangle-7-days)
  /tours/day-tours                  ●  (Day Outing Packages lives here too)
  /tours/day-tours/<slug>           ◐

/hotel-deals                        ● Partner hotels with exclusive rates (see doc 10)
  /hotel-deals/<region>             ◐  (e.g. /hotel-deals/galle)
  /hotel-deals/<hotel-slug>         ●

/services                           ● "Everything in one place" overview
  /services/flight-tickets          ●  (Air Package Ticketing)
  /services/visa-assistance         ●  (inbound ETA help + outbound visas)
  /services/hotel-reservations      ●
  /services/transport-chauffeur     ●
  /services/tour-guides             ●
  /services/interpreters            ●
  /services/project-coordination    ●
  /services/event-management        ●
  /services/conferences-mice        ●
  /services/workshops               ●
  /services/day-outings             ●
  /services/ayurveda-packages       ●

/travel-guide                       ● Blog / guide hub, categorised
  /travel-guide/sri-lanka-visa-eta  ●  (pillar)
  /travel-guide/best-time-to-visit-sri-lanka ● (pillar)
  /travel-guide/<slug>              ● ongoing
  /travel-guide/category/<cat>      ●

/about                              ● Story since 2007, leadership, values, press
/about/press                        ◐
/reviews                            ● Aggregated, real reviews + links to Google/Tripadvisor
/faq                                ●
/terms                              ●
/privacy                            ●
/cancellation-policy                ●
/sitemap                            ◐ HTML sitemap

/ko/...                             ○ Korean pages (start: home, services, flights-from-korea, plan-your-trip)
/de/...                             ○ German (Ayurveda + round trips)
```

## Page templates (build once, reuse)
1. **Home**
2. **Hub/listing** (destinations, experiences, tours, hotel deals, guide, services) — filterable grid
3. **Destination detail** — hero, why go, top things to do, best time (month chart), how to get there, where to stay (links to hotel deals), sample itineraries, FAQs, enquiry CTA
4. **Experience detail** — similar to destination, organised by theme
5. **Tour/package detail** — hero, route map (static SVG), day-by-day accordion, inclusions/exclusions, price "from", hotels used, dates, FAQs, sticky "Enquire / Customise" bar
6. **Hotel detail** — gallery, location, room types, "Paradise rate" display (doc 10), nearby experiences
7. **Service detail** — problem → how we help → process steps → FAQs → CTA
8. **Guide article** — TOC, last-checked date, author, sources, related tours, CTA box
9. **Trip builder** — multi-step form
10. **Utility** (contact, legal, 404)

## Internal linking rules
- Destination ↔ experiences available there ↔ tours that visit it ↔ hotels there.
- Every guide links to ≥ 2 commercial pages (tour/service/hotel) and ≥ 2 other guides.
- Breadcrumbs on all non-home pages (with BreadcrumbList schema).

## Redirects from old site
- `/index.html` → `/` (301)
- Any old image URLs indexed in Google Images → keep or 301 to new equivalents.
- Configure in Cloudflare Bulk Redirects or Astro `redirects` config.
