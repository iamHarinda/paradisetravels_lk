// Season data from docs/11 §3 (stable knowledge — re-verify yearly). Months are 1–12.
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;
export const MONTHS_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const REGIONS = {
  triangle: {
    name: 'Cultural Triangle',
    blurb: 'Rock fortresses, cave temples and ancient capitals.',
    bestMonths: [2, 3, 4, 5, 6, 7, 8, 9],
    seasonNote: 'Good much of the year; hottest March–May; north-east monsoon rain roughly October–January.',
  },
  hills: {
    name: 'Hill Country',
    blurb: 'Tea estates, cool air and the famous train ride.',
    bestMonths: [12, 1, 2, 3, 4],
    seasonNote: 'Best roughly December–April.',
  },
  south: {
    name: 'South Coast',
    blurb: 'Fort towns, whale watching, beaches and leopards.',
    bestMonths: [12, 1, 2, 3, 4],
    seasonNote: 'Best roughly December–April; south-west monsoon rain roughly May–September.',
  },
  west: {
    name: 'Colombo & West',
    blurb: 'The capital, the airport coast and easy beach towns.',
    bestMonths: [12, 1, 2, 3, 4],
    seasonNote: 'Best roughly December–April; south-west monsoon rain roughly May–September.',
  },
  east: {
    name: 'East Coast',
    blurb: 'Calm bays and surf when the west is wet.',
    bestMonths: [5, 6, 7, 8, 9],
    seasonNote: 'Best roughly April/May–September.',
  },
  north: {
    name: 'North',
    blurb: 'Jaffna and a very different side of the island.',
    bestMonths: [2, 3, 4, 5, 6, 7, 8, 9],
    seasonNote: 'North-east monsoon rain roughly October–January.',
  },
} as const;

export type RegionId = keyof typeof REGIONS;
export const REGION_IDS = Object.keys(REGIONS) as [RegionId, ...RegionId[]];

/** [1,2,3,12] → "Dec–Mar". Handles wrap-around over the new year. */
export function monthRange(months: readonly number[]): string {
  if (!months.length) return '';
  if (months.length === 12) return 'All year';
  const set = new Set(months);
  const runs: [number, number][] = [];
  // Start a run at a month whose predecessor isn't included.
  for (let m = 1; m <= 12; m++) {
    const prev = m === 1 ? 12 : m - 1;
    if (set.has(m) && !set.has(prev)) {
      let end = m;
      while (set.has((end % 12) + 1) && (end % 12) + 1 !== m) end = (end % 12) + 1;
      runs.push([m, end]);
    }
  }
  return runs.map(([a, b]) => (a === b ? MONTHS[a - 1] : `${MONTHS[a - 1]}–${MONTHS[b - 1]}`)).join(', ');
}
