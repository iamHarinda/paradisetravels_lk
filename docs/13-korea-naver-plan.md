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
7. Also under 요청: 웹 페이지 수집 (request crawling) for `https://paradisetravels.lk/ko`.

**Cloudflare:** Bot Fight Mode or a WAF rule can block Naver's crawler (Yeti) and make verification fail. In
Cloudflare → Security → Bots, check it; if needed add a WAF *skip* rule for requests whose User-Agent contains `Yeti`.

Indexing is not guaranteed and can take time under Naver's policies — check the report weekly.

## 2. Korean pages done properly

- Machine-translated Korean reads unnaturally and Naver users notice. All Korean copy on the site is a **first draft
  for a native speaker to review** before launch (docs/CONTENT-TODO.md §0).
- Keep `og:title`, `og:description` and `og:image` accurate — Naver uses them for previews in Blog/Cafe/KakaoTalk links.
- Do keyword research in Naver's own tools (Naver Search Advisor, Naver DataLab, Naver Ads keyword tool) — Korean
  search phrasing differs from English.
- Next Korean pages worth adding: a Korean Sigiriya guide, a "스리랑카 7일 여행 일정" itinerary, Korean FAQ.

## 3. Naver Blog (best source of Korean traffic)

Naver's results mix in Naver Blog, Cafe and News, so the business should exist across that ecosystem.

- Open a **Naver Blog** for Paradise Travels and post Sri Lanka travel content in Korean, e.g. "시기리야 여행 가이드",
  "스리랑카 7일 여행 일정", honeymoon and golf posts — each linking back to the matching `/ko/…` page.
- Account verification without a Korean phone number: the plan the owner received says Naver added **passport
  verification for users without a Korean number from 4 June 2026** — confirm this on Naver's help pages when signing up.
- Consider a KakaoTalk Channel (카카오톡 채널) so Korean pages can link straight to chat; add its URL to the site
  (docs/CONTENT-TODO.md §0).

## 4. Owner checklist

- [ ] Naver Search Advisor: register, verify (HTML tag → `NAVER_SITE_VERIFICATION`), submit sitemap.
- [ ] Native-speaker review of all Korean copy.
- [ ] Confirm whether enquiries can be answered in Korean.
- [ ] KakaoTalk Channel / Open Chat link.
- [ ] Naver Blog account + first 3 posts linking to `/ko` pages.
- [ ] Google Search Console too (`GOOGLE_SITE_VERIFICATION`).
