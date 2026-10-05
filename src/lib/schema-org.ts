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
    parentOrganization: { '@id': ORG_ID },
  };
}
