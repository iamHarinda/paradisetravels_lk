// Airlines Paradise Travels issues tickets for — confirmed by the owner (October 2026).
// Logos: Simple Icons (CC0) / Wikimedia Commons (public domain). All logos are trademarks of the airlines.
// An airline without a free logo file is shown as a text wordmark until the official file is supplied.
export interface Airline {
  name: string;
  logo?: string;
  source?: string;
  license?: string;
  url?: string;
  /** Optical size correction for logos with lots of built-in padding or very wide wordmarks. */
  scale?: number;
}

export const AIRLINES: Airline[] = [
  {
    name: 'SriLankan Airlines',
  },
  {
    name: 'Emirates',
    logo: '/logos/airlines/emirates.svg',
    source: 'Simple Icons',
    license: 'CC0 1.0 (icon); trademark of the airline',
    url: 'https://simpleicons.org/?q=emirates',
  },
  {
    name: 'Qatar Airways',
    logo: '/logos/airlines/qatar-airways.svg',
    source: 'Simple Icons',
    license: 'CC0 1.0 (icon); trademark of the airline',
    url: 'https://simpleicons.org/?q=qatarairways',
  },
  {
    name: 'Etihad Airways',
    scale: 1.9,
    logo: '/logos/airlines/etihad.svg',
    source: 'Simple Icons',
    license: 'CC0 1.0 (icon); trademark of the airline',
    url: 'https://simpleicons.org/?q=etihadairways',
  },
  {
    name: 'flydubai',
    scale: 0.75,
    logo: '/logos/airlines/flydubai.svg',
    source: 'Wikimedia Commons',
    license: 'Public domain (logo); trademark of the airline',
    url: 'https://commons.wikimedia.org/wiki/File:Fly_Dubai_logo_2010_03.svg',
  },
  {
    name: 'Air Arabia',
    scale: 0.7,
    logo: '/logos/airlines/air-arabia.svg',
    source: 'Wikimedia Commons',
    license: 'Public domain (logo); trademark of the airline',
    url: 'https://commons.wikimedia.org/wiki/File:Air_Arabia_logo_2018.svg',
  },
  {
    name: 'Singapore Airlines',
    logo: '/logos/airlines/singapore-airlines.svg',
    source: 'Simple Icons',
    license: 'CC0 1.0 (icon); trademark of the airline',
    url: 'https://simpleicons.org/?q=singaporeairlines',
  },
  {
    name: 'Turkish Airlines',
    logo: '/logos/airlines/turkish-airlines.svg',
    source: 'Simple Icons',
    license: 'CC0 1.0 (icon); trademark of the airline',
    url: 'https://simpleicons.org/?q=turkishairlines',
  },
  {
    name: 'Cathay Pacific',
    scale: 0.8,
    logo: '/logos/airlines/cathay-pacific.svg',
    source: 'Wikimedia Commons',
    license: 'Public domain (logo); trademark of the airline',
    url: 'https://commons.wikimedia.org/wiki/File:Cathay_Pacific_Ltd._logo.svg',
  },
  {
    name: 'IndiGo',
    logo: '/logos/airlines/indigo.svg',
    source: 'Simple Icons',
    license: 'CC0 1.0 (icon); trademark of the airline',
    url: 'https://simpleicons.org/?q=indigo',
  },
  {
    name: 'Air India',
    logo: '/logos/airlines/air-india.svg',
    source: 'Simple Icons',
    license: 'CC0 1.0 (icon); trademark of the airline',
    url: 'https://simpleicons.org/?q=airindia',
  },
  {
    name: 'Korean Air',
    scale: 0.75,
    logo: '/logos/airlines/korean-air.svg',
    source: 'Wikimedia Commons',
    license: 'Public domain (logo); trademark of the airline',
    url: 'https://commons.wikimedia.org/wiki/File:Korean_Air_2025.svg',
  },
];
