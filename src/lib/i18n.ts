// Two languages: English (default, no prefix) and Korean (/ko/…) — the owner's leading market (October 2026).
// Korean pages exist for the core journeys only; `KO_PAGES` maps each English path to its Korean twin so both
// sides can emit hreflang alternates and the language switcher can link to the right page.
export type Lang = 'en' | 'ko';

export const KO_PAGES: Record<string, string> = {
  '/': '/ko',
  '/tours': '/ko/tours',
  '/tours/round-trips': '/ko/tours/round-trips',
  '/tours/honeymoon': '/ko/tours/honeymoon',
  '/tours/golf': '/ko/tours/golf',
  '/tours/tea': '/ko/tours/tea',
  '/tours/ayurveda': '/ko/tours/ayurveda',
  '/hotels': '/ko/hotels',
  '/services/visa-consultation': '/ko/visa',
  '/services/air-ticketing': '/ko/air-tickets',
  '/contact': '/ko/contact',
  '/about': '/ko/about',
  '/destinations': '/ko/destinations',
  '/destinations/sigiriya': '/ko/destinations/sigiriya',
  '/destinations/kandy': '/ko/destinations/kandy',
  '/destinations/ella': '/ko/destinations/ella',
  '/destinations/nuwara-eliya': '/ko/destinations/nuwara-eliya',
  '/destinations/galle': '/ko/destinations/galle',
  '/destinations/mirissa': '/ko/destinations/mirissa',
  '/tours/sri-lanka-7-day-tour': '/ko/itinerary/7-days',
};

const EN_PAGES = Object.fromEntries(Object.entries(KO_PAGES).map(([en, ko]) => [ko, en]));

/** Clean path ("/tours/golf") for the current URL — strips build artefacts and trailing slashes. */
export const cleanPath = (pathname: string) =>
  pathname
    .replace(/\.html$/, '')
    .replace(/\/index$/, '')
    .replace(/\/$/, '') || '/';

export const langFromPath = (pathname: string): Lang => (/^\/ko(\/|$)/.test(cleanPath(pathname)) ? 'ko' : 'en');

/** The same page in the other language, if it exists. */
export function alternates(pathname: string): { en?: string; ko?: string } {
  const p = cleanPath(pathname);
  if (langFromPath(p) === 'ko') return { ko: p, en: EN_PAGES[p] };
  return { en: p, ko: KO_PAGES[p] };
}
