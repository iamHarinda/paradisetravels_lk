import type { APIRoute } from 'astro';
import { getEntries, byOrder } from '../lib/content';
import { SITE } from '../lib/site';
import { TOUR_TYPES } from '../data/tour-types';
import { AIRLINES } from '../data/airlines';
import { MARKETS } from '../data/markets';

// /llms.txt — concise company summary + key pages for AI assistants (docs/06 §7).
export const GET: APIRoute = async ({ site }) => {
  const url = (p: string) => new URL(p, site).toString();
  const [services, destinations, tours, guides] = await Promise.all([
    getEntries('services'),
    getEntries('destinations'),
    getEntries('tours'),
    getEntries('guides'),
  ]);
  const section = (title: string, items: string[]) => `## ${title}\n\n${items.join('\n')}\n`;
  const body = [
    `# ${SITE.legalName}\n`,
    `> Travel agency in Colombo, Sri Lanka, established ${SITE.foundingYear}. Three services: tailor-made Sri Lanka tours (round trips, honeymoon tours, golf packages, tea tours, Ayurveda tours), visa consultation, and air ticketing on ${AIRLINES.length} airlines (${AIRLINES.map((a) => a.name).join(', ')}). Most travellers come from ${MARKETS.map((m) => m.name).join(', ')}. Korean pages: ${url('/ko')}\n`,
    `- Address: ${SITE.addressLine}\n- Phone / WhatsApp / KakaoTalk: ${SITE.phone}\n- Email: ${SITE.email}\n- Plan a trip: ${url('/plan-your-trip')}\n`,
    section(
      'Services',
      services.sort(byOrder).map((s) => `- [${s.data.title}](${url(`/services/${s.id}`)}): ${s.data.short}`),
    ),
    section(
      'Tour types',
      TOUR_TYPES.map((t) => `- [${t.en.name}](${url(`/tours/${t.id}`)}): ${t.en.tagline} ${t.en.intro}`),
    ),
    section('Hotels', [`- [Hotels we book for tours, by area](${url('/hotels')})`]),
    section(
      'Itineraries',
      tours
        .sort(byOrder)
        .map((t) => `- [${t.data.title}](${url(`/tours/${t.id}`)}): ${t.data.durationDays} days. ${t.data.summary}`),
    ),
    section(
      'Destinations',
      destinations.sort(byOrder).map((d) => `- [${d.data.title}](${url(`/destinations/${d.id}`)}): ${d.data.summary}`),
    ),
    section(
      'Travel guides',
      guides.map((g) => `- [${g.data.title}](${url(`/travel-guide/${g.id}`)}): ${g.data.description}`),
    ),
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
