// Airlines Paradise Travels issues tickets for — confirmed by the owner (21 October 2026), in the owner's order.
// Logos: Simple Icons (CC0) / Wikimedia Commons (public domain). All logos are trademarks of the airlines.
// An airline without a free logo file is shown as a text wordmark until the official file is supplied
// (docs/CONTENT-TODO.md).
export interface Airline {
  name: string;
  /** IATA designator, shown as a code chip ("UL", "KE"…). */
  iata: string;
  logo?: string;
  source?: string;
  license?: string;
  url?: string;
  /** Optical size correction for logos with lots of built-in padding or very wide wordmarks. */
  scale?: number;
}

const SI = { source: 'Simple Icons', license: 'CC0 1.0 (icon); trademark of the airline' } as const;
const WC = { source: 'Wikimedia Commons', license: 'Public domain (logo); trademark of the airline' } as const;

export const AIRLINES: Airline[] = [
  { name: 'SriLankan Airlines', iata: 'UL' },
  {
    name: 'Singapore Airlines',
    iata: 'SQ',
    scale: 1.35,
    logo: '/logos/airlines/singapore-airlines.svg',
    ...SI,
    url: 'https://simpleicons.org/?q=singaporeairlines',
  },
  {
    name: 'Cathay Pacific',
    iata: 'CX',
    scale: 0.8,
    logo: '/logos/airlines/cathay-pacific.svg',
    ...WC,
    url: 'https://commons.wikimedia.org/wiki/File:Cathay_Pacific_Ltd._logo.svg',
  },
  {
    name: 'China Eastern',
    iata: 'MU',
    scale: 1.35,
    logo: '/logos/airlines/china-eastern.svg',
    ...SI,
    url: 'https://simpleicons.org/?q=chinaeasternairlines',
  },
  {
    name: 'Korean Air',
    iata: 'KE',
    scale: 0.75,
    logo: '/logos/airlines/korean-air.svg',
    ...WC,
    url: 'https://commons.wikimedia.org/wiki/File:Korean_Air_2025.svg',
  },
  {
    name: 'Emirates',
    iata: 'EK',
    scale: 1.35,
    logo: '/logos/airlines/emirates.svg',
    ...SI,
    url: 'https://simpleicons.org/?q=emirates',
  },
  { name: 'Malaysia Airlines', iata: 'MH' },
  {
    name: 'Air India',
    iata: 'AI',
    scale: 1.35,
    logo: '/logos/airlines/air-india.svg',
    ...SI,
    url: 'https://simpleicons.org/?q=airindia',
  },
  {
    name: 'flydubai',
    iata: 'FZ',
    scale: 0.75,
    logo: '/logos/airlines/flydubai.svg',
    ...WC,
    url: 'https://commons.wikimedia.org/wiki/File:Fly_Dubai_logo_2010_03.svg',
  },
  {
    name: 'Thai Airways',
    iata: 'TG',
    scale: 0.85,
    logo: '/logos/airlines/thai-airways.svg',
    ...WC,
    url: 'https://commons.wikimedia.org/wiki/File:Thai_Airways_logo.svg',
  },
  {
    name: 'Turkish Airlines',
    iata: 'TK',
    scale: 1.35,
    logo: '/logos/airlines/turkish-airlines.svg',
    ...SI,
    url: 'https://simpleicons.org/?q=turkishairlines',
  },
  {
    name: 'British Airways',
    iata: 'BA',
    scale: 1.35,
    logo: '/logos/airlines/british-airways.svg',
    ...SI,
    url: 'https://simpleicons.org/?q=britishairways',
  },
];
