import type { APIRoute } from 'astro';
import { SITE_ENV } from 'astro:env/server';

// Staging builds block all crawlers; production allows everyone, incl. Naver (Yeti) and AI crawlers (docs/06 §7).
export const GET: APIRoute = ({ site }) => {
  const body =
    SITE_ENV === 'production'
      ? [
          // Naver's crawler (Yeti) is named explicitly so Korean search can never be blocked by accident.
          'User-agent: Yeti',
          'Allow: /',
          'Disallow: /api/',
          'Disallow: /keystatic',
          '',
          'User-agent: *',
          'Allow: /',
          'Disallow: /api/',
          'Disallow: /thank-you',
          'Disallow: /keystatic',
          '',
          `Sitemap: ${new URL('sitemap.xml', site)}`,
        ].join('\n')
      : 'User-agent: *\nDisallow: /';
  return new Response(body + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
