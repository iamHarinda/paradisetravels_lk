import type { CollectionEntry } from 'astro:content';

export const STYLE_LABELS: Record<string, string> = {
  culture: 'Culture',
  wildlife: 'Wildlife',
  beach: 'Beach',
  honeymoon: 'Honeymoon',
  ayurveda: 'Ayurveda',
  family: 'Family',
  luxury: 'Luxury',
  budget: 'Budget',
  tea: 'Tea country',
  adventure: 'Adventure',
};

export const GUIDE_CATEGORIES: Record<string, string> = {
  planning: 'Planning',
  visa: 'Visa & ETA',
  seasons: 'Seasons & weather',
  destinations: 'Destinations',
  culture: 'Culture',
  transport: 'Getting around',
  data: 'Data & statistics',
};

export function tourPrice(t: CollectionEntry<'tours'>['data']) {
  return t.priceFromUSD ? `From US$ ${t.priceFromUSD.toLocaleString('en-US')} per person` : 'Price on request';
}

export const dateFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
