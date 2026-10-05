# 10 — Hotel Deals & Booking Flow

Paradise Travels has discounted partner rates with hotels. The site must sell these — without breaking hotel contracts or building an expensive booking engine on day one.

## 1. The rate-parity problem (read first)
Many hotel contracts with travel agents (contracted/"net" rates) **forbid publicly advertising a room-only price lower than the hotel's own public price**. Breaking this can lose the contract. So each hotel has a `rateDisplay` mode, set per hotel after the owner checks the contract:

| Mode | What the site shows | When to use |
|---|---|---|
| `public` | "From US$ 85 / night (room only)" | Hotel allows public display |
| `package` | Price only inside a package: "3 nights Galle + transfers from US$ 290 pp" | Hotel allows only packaged/opaque pricing (most common, and still attractive) |
| `on-request` | "Paradise partner rate — typically below online prices. Request your rate." | Hotel forbids any public price |

Never show "cheaper than Booking.com" claims unless proven at time of display.

## 2. Phase 1 — Enquiry-led selling (launch)
1. `/hotel-deals` hub: filters by region, stars, type (beach, hill, boutique, Ayurveda, safari lodge), price band, month.
2. Hotel page: gallery, highlights, map link, room types, deal label (e.g. "Free airport transfer with 3+ nights" — only real offers), validity dates, rate display per mode, nearby experiences/tours.
3. **"Request this rate" form** (short): dates, rooms, adults/children, meal plan, name, email, WhatsApp, country → `/api/rate-request`.
4. Staff reply with a quote (target < 2 h in working hours) by email/WhatsApp.
5. Traveller confirms → staff send **payment link** (see §4) → voucher issued.
6. Upsell in quote: airport transfer, car + driver, tours.

This is how most competitors actually sell, and it fits the "real people" brand.

## 3. Phase 2 — Instant quotes
- Owner enters seasonal rates per hotel/room/meal plan in Keystatic (or a small admin backed by a hosted DB).
- Site computes an **estimated total** instantly (dates × nightly rate × rooms, seasonal bands, child policy) — displayed only for `public` mode hotels or inside packages.
- Still confirmed by staff (availability is not live).

## 4. Payments
- No card data on our servers — use a hosted payment page / payment link.
- Options to evaluate in Sri Lanka (owner to confirm merchant eligibility, foreign card support, USD/EUR/GBP settlement, fees): **PayHere**, a bank IPG (Commercial Bank, Sampath, HNB, etc.), or international links like PayPal for foreign clients. (Stripe does not onboard Sri Lankan businesses directly as of our knowledge — verify.)
- Deposit model: e.g. 25–30% to confirm, balance before arrival — per owner's policy.
- Show accepted payment logos only after the account is live.

## 5. Phase 3 — Live availability (only if volume justifies)
- Connect to a bedbank/channel API or partner extranet. Expensive and complex — revisit once monthly hotel bookings justify it.

## 6. Data model (Keystatic / JSON)
```json
{
  "name": "Example Fort Hotel",
  "slug": "example-fort-hotel-galle",
  "area": "Galle Fort",
  "region": "south-coast",
  "stars": 4,
  "type": ["boutique", "heritage"],
  "rateDisplay": "package",
  "rooms": [
    { "name": "Deluxe Double", "occupancy": 2, "mealPlans": ["BB", "HB"], "priceFromUSD": null }
  ],
  "seasons": [
    { "label": "Peak", "from": "2026-12-20", "to": "2027-01-10" }
  ],
  "deal": { "label": "Complimentary airport transfer for 4+ nights", "validTo": "2027-03-31" },
  "highlights": ["Inside the UNESCO-listed fort", "Rooftop pool"],
  "images": ["..."],
  "nearby": ["galle", "mirissa", "whale-watching"],
  "seo": { "title": "...", "description": "..." }
}
```
*(Example only — do not publish placeholder hotels.)*

## 7. Trip builder (main conversion tool) — steps
1. **When?** dates or month + flexible toggle, number of days
2. **Who?** adults, children (ages), occasion (honeymoon, family, solo, group, corporate)
3. **What?** interests chips (culture, wildlife, beach, tea country, Ayurveda, adventure, food, surfing, pilgrimage)
4. **How?** travel style (budget / comfort / luxury), hotel class, private driver vs. train mix, need flights? need visa/ETA help?
5. **You:** name, email, WhatsApp (with country code), country, preferred contact (WhatsApp / Email / KakaoTalk), notes
→ Review screen → submit → thank-you page with "What happens next" (reply time, named consultant).

Lead payload includes landing page, UTM params and interests for reporting.

## 8. Emails (templates to build)
- Staff notification (all fields, clickable WhatsApp link)
- Traveller confirmation ("We've got your request — reply within X hours")
- Quote template (for staff; HTML in Gmail/Outlook)
- Post-trip review request (Google + Tripadvisor links)
