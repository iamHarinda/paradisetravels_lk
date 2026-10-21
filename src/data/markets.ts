// Countries most of Paradise Travels' tour clients come from — confirmed by the owner (21 October 2026),
// in the owner's order (Korea is the leading market). Flags: flag-icons (MIT), public/flags/.
export interface Market {
  code: string;
  name: string;
  nameKo: string;
  /** Main international airport(s) — used for flight arcs on the hero globe. */
  hub: { code: string; coords: [number, number] };
}

export const MARKETS: Market[] = [
  { code: 'kr', name: 'South Korea', nameKo: '대한민국', hub: { code: 'ICN', coords: [37.46, 126.44] } },
  { code: 'gb', name: 'United Kingdom', nameKo: '영국', hub: { code: 'LHR', coords: [51.47, -0.45] } },
  { code: 'au', name: 'Australia', nameKo: '호주', hub: { code: 'SYD', coords: [-33.94, 151.18] } },
  { code: 'it', name: 'Italy', nameKo: '이탈리아', hub: { code: 'FCO', coords: [41.8, 12.25] } },
  { code: 'at', name: 'Austria', nameKo: '오스트리아', hub: { code: 'VIE', coords: [48.11, 16.57] } },
  { code: 'cn', name: 'China', nameKo: '중국', hub: { code: 'PVG', coords: [31.14, 121.81] } },
  { code: 'jp', name: 'Japan', nameKo: '일본', hub: { code: 'NRT', coords: [35.77, 140.39] } },
  { code: 'in', name: 'India', nameKo: '인도', hub: { code: 'DEL', coords: [28.56, 77.1] } },
  { code: 'il', name: 'Israel', nameKo: '이스라엘', hub: { code: 'TLV', coords: [32.01, 34.89] } },
];

export const flagSrc = (code: string) => `/flags/${code}.svg`;
