// Flight-map backdrop projection + route data. Equirectangular, 10 units per degree.
// Region: lon -15°…155°, lat 62°N…42°S (Europe → Australia, centred on Sri Lanka).
export const FLIGHT_MAP = { lon0: -15, lat0: 62, k: 10, width: 1700, height: 1040 } as const;

export const projectWorld = ([lat, lon]: [number, number]) =>
  [(lon - FLIGHT_MAP.lon0) * FLIGHT_MAP.k, (FLIGHT_MAP.lat0 - lat) * FLIGHT_MAP.k] as const;

export const CMB: [number, number] = [7.18, 79.88];

/** Hubs of the airlines we ticket (src/data/airlines.ts) + key source markets (docs/11 §2). */
export const DESTINATIONS: { code: string; coords: [number, number] }[] = [
  { code: 'DXB', coords: [25.25, 55.36] },
  { code: 'DOH', coords: [25.27, 51.61] },
  { code: 'AUH', coords: [24.43, 54.65] },
  { code: 'SHJ', coords: [25.33, 55.52] },
  { code: 'IST', coords: [41.26, 28.74] },
  { code: 'LHR', coords: [51.47, -0.45] },
  { code: 'FRA', coords: [50.03, 8.56] },
  { code: 'SVO', coords: [55.97, 37.41] },
  { code: 'DEL', coords: [28.56, 77.1] },
  { code: 'BOM', coords: [19.09, 72.87] },
  { code: 'MAA', coords: [12.99, 80.17] },
  { code: 'MLE', coords: [4.19, 73.53] },
  { code: 'SIN', coords: [1.36, 103.99] },
  { code: 'KUL', coords: [2.74, 101.7] },
  { code: 'BKK', coords: [13.69, 100.75] },
  { code: 'HKG', coords: [22.31, 113.92] },
  { code: 'PVG', coords: [31.14, 121.81] },
  { code: 'ICN', coords: [37.46, 126.44] },
  { code: 'SYD', coords: [-33.94, 151.18] },
  { code: 'MEL', coords: [-37.67, 144.84] },
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
