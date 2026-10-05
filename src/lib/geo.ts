// Approximate Sri Lanka coastline (lat, lon) and a simple equirectangular projection for SVG maps.
// Simplified outline — accurate enough for orientation, not for navigation.
export const COAST: [number, number][] = [
  [9.83, 80.25],
  [9.55, 80.6],
  [9.27, 80.81],
  [8.98, 80.97],
  [8.57, 81.23],
  [8.3, 81.35],
  [8.13, 81.43],
  [7.71, 81.7],
  [7.41, 81.83],
  [6.87, 81.84],
  [6.55, 81.7],
  [6.35, 81.52],
  [6.22, 81.33],
  [6.12, 81.12],
  [6.02, 80.79],
  [5.92, 80.59],
  [5.95, 80.46],
  [6.03, 80.22],
  [6.14, 80.1],
  [6.42, 79.99],
  [6.58, 79.96],
  [6.84, 79.86],
  [6.93, 79.85],
  [7.21, 79.83],
  [7.58, 79.79],
  [8.0, 79.75],
  [8.4, 79.73],
  [8.6, 79.88],
  [8.98, 79.9],
  [9.25, 80.05],
  [9.5, 80.2],
  [9.62, 80.08],
  [9.68, 79.86],
  [9.8, 80.0],
];

export const AIRPORT: [number, number] = [7.18, 79.88];

export const MAP_VIEWBOX = '-10 -10 270 430';

export const project = ([lat, lon]: [number, number]) => [(lon - 79.55) * 100, (9.95 - lat) * 100] as const;

export const pathFrom = (coords: [number, number][], close = false) =>
  coords
    .map(
      (c, i) =>
        `${i ? 'L' : 'M'}${project(c)
          .map((n) => n.toFixed(1))
          .join(' ')}`,
    )
    .join(' ') + (close ? 'Z' : '');

export const OUTLINE = pathFrom(COAST, true);
