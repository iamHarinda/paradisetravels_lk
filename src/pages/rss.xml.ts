import type { APIRoute } from 'astro';
import { rss } from '../lib/rss';
import { getEntries } from '../lib/content';

// English travel-guide feed (Naver, Bing and feed readers).
export const GET: APIRoute = async ({ site }) => {
  const guides = await getEntries('guides');
  return rss({
    site: site!,
    title: 'Paradise Travels — Sri Lanka Travel Guide',
    description:
      'Sri Lanka travel guides from a Colombo travel agency: seasons, ETA and visas, getting around and more.',
    path: '/rss.xml',
    lang: 'en',
    items: guides.map((g) => ({
      title: g.data.title,
      description: g.data.description,
      path: `/travel-guide/${g.id}`,
      date: g.data.updated ?? g.data.published,
    })),
  });
};
