// Analytics accounts supplied by the owner (October 2026). IDs are public (they appear in every page's HTML).
// Loaded only on production builds (SITE_ENV=production), after the page has loaded — never in the critical path:
// - Ahrefs Web Analytics: cookieless, no personal data → runs for everyone.
// - Google Analytics 4: Consent Mode v2, analytics_storage "denied" until the visitor accepts (cookieless pings only).
// - Microsoft Clarity (session replay / heatmaps): only after the visitor accepts.
export const ANALYTICS = {
  ga4: 'G-6TZ3ZRLCEC',
  clarity: 'yy07n3hl1l',
  ahrefs: 'ZKjWqGlRcQ0QHYyJBTq+gA',
} as const;

type Gtag = (...args: unknown[]) => void;

/** Conversion / interaction event → GA4 (queued in dataLayer until gtag.js loads). No-op outside production. */
export function track(name: string, params: Record<string, unknown> = {}) {
  (window as unknown as { gtag?: Gtag }).gtag?.('event', name, params);
}
