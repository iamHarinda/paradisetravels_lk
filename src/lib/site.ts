// Business facts — single source of truth (CLAUDE.md "Business facts"). Do not add unverified data here.
export const SITE = {
  name: 'Paradise Travels',
  legalName: 'Paradise Travels (Pvt) Ltd',
  url: 'https://paradisetravels.lk',
  foundingYear: 2007,
  email: 'hello@paradisetravels.lk',
  phone: '+94 77 393 9989',
  phoneE164: '+94773939989',
  whatsapp: 'https://wa.me/94773939989',
  address: {
    streetAddress: 'No. 08, Old Kottawa Road, Mirihana',
    addressLocality: 'Nugegoda',
    postalCode: '10250',
    addressCountry: 'LK',
  },
  addressLine: 'No. 08, Old Kottawa Road, Mirihana, Nugegoda 10250, Sri Lanka',
  /** Google Business Profile share link supplied by the owner (opens the listing in Google Maps / Search). */
  mapsUrl: 'https://share.google/Ixe87Dml0qTwFDNRL',
  /** Keyless Google Maps embed for the contact pages (loaded only when the visitor asks for it). */
  mapsEmbed:
    'https://www.google.com/maps?output=embed&hl=en&q=Paradise+Travels+(Pvt)+Ltd,+No.+08+Old+Kottawa+Road,+Mirihana,+Nugegoda',
  facebook: 'https://www.facebook.com/paradisetravelslk',
  sameAs: ['https://www.facebook.com/paradisetravelslk'],
  defaultOgImage: '/og-default.png',
} as const;

/** WhatsApp deep link, pre-filled with a message and the page the visitor came from (docs/08 §6). */
export function whatsappLink(
  message = 'Hello Paradise Travels, I would like help planning a trip to Sri Lanka.',
  pageUrl?: URL | string,
) {
  const text = pageUrl ? `${message}\n\n(${pageUrl.toString()})` : message;
  return `${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}
