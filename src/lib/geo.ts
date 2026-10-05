import { SRI_LANKA } from './geo-data';

// SVG map projection for Sri Lanka: equirectangular, with longitude scaled by cos(latitude) so the island
// keeps its true proportions. 1 unit ≈ 1 km / 1.11.
const LAT0 = 9.88;
const LON0 = 79.6;
const KX = 100 * Math.cos((7.9 * Math.PI) / 180);
const KY = 100;

export const project = ([lat, lon]: [number, number]) => [(lon - LON0) * KX, (LAT0 - lat) * KY] as const;

export const MAP_VIEWBOX = '-14 -10 262 428';

/** Bandaranaike International Airport (CMB), Katunayake. */
export const AIRPORT: [number, number] = [7.18, 79.88];

export const pathFrom = (coords: [number, number][], close = false) =>
  coords
    .map(
      (c, i) =>
        `${i ? 'L' : 'M'}${project(c)
          .map((n) => n.toFixed(1))
          .join(' ')}`,
    )
    .join('') + (close ? 'Z' : '');

/** Real coastline (Natural Earth), including Mannar and the Jaffna islands. */
export const OUTLINE = SRI_LANKA.map((poly) => pathFrom(poly, true)).join('');
