# 13 — Korea market & Naver plan

**Why:** Korea is Paradise Travels' leading source market (owner, 21 October 2026). Korean travellers search on
**Naver** first, so the site must be registered there, have real Korean pages, and the business should show up across
Naver's own ecosystem (Blog, Cafe), not only on our website.

## What the website already does (built October 2026)

| Item | Where |
|---|---|
| Korean pages: home, tours hub, 5 tour types, hotels, visa, air tickets, contact, thank-you | `src/pages/ko/` |
| `<html lang="ko">`, `og:locale` `ko_KR`, Korean title + description per page | `BaseLayout.astro`, `SEO.astro` |
| `hreflang` en / ko / x-default on every page that has a twin | `src/lib/i18n.ts` (`KO_PAGES`), `SEO.astro` |
| Naver ownership tag `<meta name="naver-site-verification">` from an env var | `NAVER_SITE_VERIFICATION` |
| Google ownership tag (same pattern) | `GOOGLE_SITE_VERIFICATION` |
| `robots.txt` names Naver's crawler **Yeti** explicitly and allows it (production only) | `src/pages/robots.txt.ts` |
| Sitemap including all `/ko` pages | `/sitemap.xml` |
| KakaoTalk shown first on Korean pages; Korean form labels; Korean confirmation email | `KoContactBand.astro`, forms |
| Language switch (한국어 / EN) in the header, footer link | `Header.astro`, `Footer.astro` |

Korean keywords used in titles/descriptions: 스리랑카 여행, 스리랑카 패키지, 스리랑카 일주 여행, 스리랑카 허니문,
스리랑카 골프, 실론티, 아유르베다, 시기리야. Re-check them with Naver's own keyword tools before launch (see §2).

## 1. Register on Naver Search Advisor (required)

Naver Search Advisor is Naver's equivalent of Google Search Console.

1. Go to **searchadvisor.naver.com** → 웹마스터 도구 (Webmaster Tools) → 사이트 등록 (Register site).
2. Enter **`https://paradisetravels.lk`** — Naver registers domains or subdomains only, not sub-folders, so register
   the main domain; the Korean pages under `/ko/` are covered by it.
3. Choose the **HTML tag** method. Naver shows a tag like `<meta name="naver-site-verification" content="abc123…" />`.
4. Copy only the `content` value into `.env` as `NAVER_SITE_VERIFICATION=abc123…`, run
   `npm run build:production` and upload (README → Deploy). Every page then carries the tag in `<head>`.
5. Click verify in Naver Search Advisor.
6. 요청 → 사이트맵 제출 (Request → Submit sitemap): submit `https://paradisetravels.lk/sitemap.xml`
   (it lists every English and `/ko` page; `robots.txt` points to it too).
   Also submit the Korean RSS feed `https://paradisetravels.lk/ko/rss.xml` (요청 → RSS 제출) — Naver uses it to find new pages faster.
7. Also under 요청: 웹 페이지 수집 (request crawling) for `https://paradisetravels.lk/ko`.

**Cloudflare:** Bot Fight Mode or a WAF rule can block Naver's crawler (Yeti) and make verification fail. In
Cloudflare → Security → Bots, check it; if needed add a WAF *skip* rule for requests whose User-Agent contains `Yeti`.

Indexing is not guaranteed and can take time under Naver's policies — check the report weekly.

## 2. Keyword map — one Korean page per keyword

How Naver's results work: a search like "스리랑카 여행" shows sections — 파워링크 (paid ads) at the top, then 블로그 /
카페 posts (most clicks), 지식iN (Q&A), and 웹사이트 / 웹문서 (normal sites like ours), often low on the page. So the
website alone will not reach the top for big keywords — the plan works on **every section**, and the website targets
**long-tail keywords** first, where Korean agencies (Hana Tour, Mode Tour) and big blogs are not competing.

| Keyword (Korean) | Meaning | Page | Status |
|---|---|---|---|
| 스리랑카 현지 여행사 | Sri Lanka local travel agency | `/ko/about` (+ `/ko`) | built |
| 스리랑카 기사 포함 투어 | Sri Lanka tour with driver | `/ko/private-driver` | built |
| 스리랑카 7일 여행 코스 / 일정 | 7-day itinerary | `/ko/itinerary/7-days` | built |
| 시기리야 여행 (코스) | Sigiriya travel | `/ko/destinations/sigiriya` | built |
| 캔디 여행 (코스) | Kandy travel | `/ko/destinations/kandy` | built |
| 엘라 여행 (코스) / 엘라 기차 | Ella travel / train | `/ko/destinations/ella` | built |
| 누와라엘리야 여행 | Nuwara Eliya travel | `/ko/destinations/nuwara-eliya` | built |
| 갈레 여행 / 갈레 포트 | Galle travel | `/ko/destinations/galle` | built |
| 미리사 여행 / 고래 투어 | Mirissa / whale watching | `/ko/destinations/mirissa` | built |
| 스리랑카 허니문 · 골프 · 실론티 · 아유르베다 | tour types | `/ko/tours/<type>` | built |
| 스리랑카 비자 / ETA | visa | `/ko/visa` | built |
| 스리랑카 항공권 / 대한항공 콜롬보 | air tickets | `/ko/air-tickets` | built |
| 스리랑카 호텔 할인 | Sri Lanka hotel discount | — | **on hold**: we may not publish rates (rate parity, CLAUDE.md rule 2) or promise discounts until the owner confirms which hotel deals are real |

Rules for every Korean page: written (or rewritten) by a **native Korean travel writer** — machine translation reads
unnaturally and Naver users notice (Fiverr / Kmong writers are an option). All current `/ko` copy is a **draft** from
the English facts, flagged in docs/CONTENT-TODO.md §0. Keep facts in sync with the English page (hreflang twin).
Every page has: unique Korean title + description, a photo `og:image` for Naver/Kakao previews, hreflang, JSON-LD,
breadcrumbs, a KakaoTalk contact block, and is in `/sitemap.xml` and `/ko/rss.xml`.

To add a page for a new keyword: add an entry to `src/data/ko-guides.ts` (destinations) or a page under `src/pages/ko/`,
add its English twin to `KO_PAGES` in `src/lib/i18n.ts`, then `npm run deploy`.

## 3. Naver ecosystem (off-site — the owner's team)

**Naver Blog** — the easiest way to reach the top of the 블로그 section.
- Open a Naver Blog for Paradise Travels. Account verification without a Korean phone number: the plan the owner
  received says Naver offers **passport verification from 4 June 2026** — confirm on Naver's help pages at sign-up.
- Post **2–3 times a week** in natural Korean, with your own photos. Each post targets one keyword from §2 and links
  to the matching `/ko/…` page (e.g. a Sigiriya post → `/ko/destinations/sigiriya`). Ideas: 시기리야 오르는 팁,
  엘라 기차 예약 방법, 스리랑카 7일 일정 후기, 스리랑카 허니문 호텔, 스리랑카 골프 여행, 실론티 공장 견학.

**지식iN** — answer real Korean questions about Sri Lanka travel (visa/ETA, best season, transport) helpfully,
with a link to the relevant `/ko` page. Answers must be genuinely useful, not adverts.

**Reviews & influencers** — invite Korean travel bloggers for a free or discounted tour in exchange for an honest
review on their Naver Blog (disclosed as sponsored, as Korean advertising rules require). Naver users rely heavily on these.

**파워링크 ads** (searchad.naver.com) — the fastest way to appear at the top. Foreign businesses may need
business-registration documents; the owner should check whether Paradise Travels (Pvt) Ltd can open an account.
Start with the long-tail keywords in §2 and a small daily budget.

**Monthly routine** — new sites take weeks, sometimes months, to rank on Naver. Each month: Search Advisor →
리포트 (clicks, impressions, keywords) → improve the pages and blog posts that get impressions but few clicks, and
add pages for keywords that are rising.

## 4. Owner checklist

- [x] Naver Search Advisor: site registered; ownership verified with the HTML file (`public/naverebac4e6bfa964fbfa515b36ab8e02b8b.html`).
- [ ] Submit `https://paradisetravels.lk/sitemap.xml` and `https://paradisetravels.lk/ko/rss.xml` (요청 → 사이트맵 제출 / RSS 제출).
- [ ] Native-speaker review of all Korean copy.
- [ ] Confirm whether enquiries can be answered in Korean.
- [ ] KakaoTalk Channel / Open Chat link.
- [ ] Naver Blog account + 2–3 posts a week, each linking to a `/ko` page (§3).
- [ ] 지식iN answers; 1–2 Korean travel bloggers for sponsored reviews; check 파워링크 eligibility.
- [ ] Monthly: Search Advisor 리포트 review (§3).
- [ ] Google Search Console too (`GOOGLE_SITE_VERIFICATION`).
