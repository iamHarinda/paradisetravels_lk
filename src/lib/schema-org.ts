import { SITE } from './site';

type JsonLd = Record<string, unknown>;

const ORG_ID = `${SITE.url}/#organization`;

/** `Organization` + `WebSite` — on every page (docs/06 §4). */
export function siteSchema(): JsonLd[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': ORG_ID,
      name: SITE.legalName,
      alternateName: SITE.name,
      url: SITE.url,
      foundingDate: String(SITE.foundingYear),
      email: SITE.email,
      telephone: SITE.phoneE164,
      sameAs: SITE.sameAs,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE.url}/#website`,
      name: SITE.name,
      url: SITE.url,
      publisher: { '@id': ORG_ID },
    },
  ];
}

/**
 * `TravelAgency` (LocalBusiness) — home and contact pages.
 * Opening hours, geo and priceRange are added once the owner confirms them (docs/CONTENT-TODO.md).
 */
export function travelAgencySchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': `${SITE.url}/#travelagency`,
    name: SITE.legalName,
    url: SITE.url,
    email: SITE.email,
    telephone: SITE.phoneE164,
    foundingDate: String(SITE.foundingYear),
    address: { '@type': 'PostalAddress', ...SITE.address },
    areaServed: { '@type': 'Country', name: 'Sri Lanka' },
    parentOrganization: { '@id': ORG_ID },
  };
}

const abs = (path: string) => new URL(path, SITE.url).toString();

/** FAQPage — helps Bing and AI assistants even though Google rarely shows the rich result (docs/06 §4). */
export function faqSchema(faqs: { q: string; a: string }[]): JsonLd | undefined {
  const real = faqs.filter((f) => !f.a.includes('{{TODO'));
  if (!real.length) return undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: real.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

export function touristDestinationSchema(d: {
  title: string;
  summary: string;
  path: string;
  coords: [number, number];
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: `${d.title}, Sri Lanka`,
    description: d.summary,
    url: abs(d.path),
    geo: { '@type': 'GeoCoordinates', latitude: d.coords[0], longitude: d.coords[1] },
    containedInPlace: { '@type': 'Country', name: 'Sri Lanka' },
  };
}

export function touristTripSchema(t: {
  title: string;
  summary: string;
  path: string;
  places: string[];
  priceFromUSD?: number | null;
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: t.title,
    description: t.summary,
    url: abs(t.path),
    provider: { '@id': `${SITE.url}/#organization` },
    itinerary: {
      '@type': 'ItemList',
      itemListElement: t.places.map((name, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: { '@type': 'Place', name },
      })),
    },
    // Only real prices are marked up — never placeholders.
    ...(t.priceFromUSD && {
      offers: {
        '@type': 'Offer',
        price: t.priceFromUSD,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    }),
  };
}

export function hotelSchema(h: { name: string; area: string; path: string; stars?: number | null }): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: h.name,
    url: abs(h.path),
    address: { '@type': 'PostalAddress', addressLocality: h.area, addressCountry: 'LK' },
    // No aggregateRating — never mark up ratings we don't have (docs/06 §4).
    ...(h.stars && { starRating: { '@type': 'Rating', ratingValue: h.stars } }),
  };
}

export function articleSchema(a: {
  title: string;
  description: string;
  path: string;
  published: Date;
  updated?: Date | null;
  author?: string | null;
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    url: abs(a.path),
    mainEntityOfPage: abs(a.path),
    datePublished: a.published.toISOString(),
    dateModified: (a.updated ?? a.published).toISOString(),
    author: a.author ? { '@type': 'Person', name: a.author } : { '@id': `${SITE.url}/#organization` },
    publisher: { '@id': `${SITE.url}/#organization` },
    image: abs(SITE.defaultOgImage),
  };
}

export function serviceSchema(s: { title: string; description: string; path: string }): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.title,
    description: s.description,
    url: abs(s.path),
    provider: { '@id': `${SITE.url}/#organization` },
    areaServed: { '@type': 'Country', name: 'Sri Lanka' },
  };
}

export function itemListSchema(items: { name: string; path: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, url: abs(it.path) })),
  };
}
