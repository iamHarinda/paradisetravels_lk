import { MARKETS } from '../data/markets';

// Flight-map backdrop projection + route data. Equirectangular, 10 units per degree.
// Region: lon -15°…155°, lat 62°N…42°S (Europe → Australia, centred on Sri Lanka).
export const FLIGHT_MAP = { lon0: -15, lat0: 62, k: 10, width: 1700, height: 1040 } as const;

export const projectWorld = ([lat, lon]: [number, number]) =>
  [(lon - FLIGHT_MAP.lon0) * FLIGHT_MAP.k, (FLIGHT_MAP.lat0 - lat) * FLIGHT_MAP.k] as const;

export const CMB: [number, number] = [7.18, 79.88];

/** Source-market airports (src/data/markets.ts) + hubs of the airlines we ticket (src/data/airlines.ts). */
export const DESTINATIONS: { code: string; coords: [number, number] }[] = [
  ...MARKETS.map((m) => m.hub),
  { code: 'SIN', coords: [1.36, 103.99] },
  { code: 'HKG', coords: [22.31, 113.92] },
  { code: 'DXB', coords: [25.25, 55.36] },
  { code: 'KUL', coords: [2.74, 101.7] },
  { code: 'BKK', coords: [13.69, 100.75] },
  { code: 'IST', coords: [41.26, 28.74] },
];

/** Quadratic arc from Colombo bowing "north" of the straight line, like a great-circle on a flat map. */
export function arc(to: [number, number]) {
  const [x1, y1] = projectWorld(CMB);
  const [x2, y2] = projectWorld(to);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dist = Math.hypot(x2 - x1, y2 - y1);
  // Perpendicular offset, always bending upwards on screen.
  let nx = -(y2 - y1) / dist;
  let ny = (x2 - x1) / dist;
  if (ny > 0) {
    nx = -nx;
    ny = -ny;
  }
  const bend = Math.min(dist * 0.22, 180);
  return `M${x1.toFixed(0)} ${y1.toFixed(0)}Q${(mx + nx * bend).toFixed(0)} ${(my + ny * bend).toFixed(0)} ${x2.toFixed(0)} ${y2.toFixed(0)}`;
}
