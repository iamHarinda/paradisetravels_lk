import type { APIRoute } from 'astro';
import { SITE_ENV } from 'astro:env/server';

// Staging builds block all crawlers; production allows everyone, incl. AI crawlers (docs/06 §7 — owner to confirm).
export const GET: APIRoute = ({ site }) => {
  const body =
    SITE_ENV === 'production'
      ? [
          'User-agent: *',
          'Allow: /',
          'Disallow: /api/',
          'Disallow: /thank-you',
          'Disallow: /keystatic',
          '',
          `Sitemap: ${new URL('sitemap-index.xml', site)}`,
        ].join('\n')
      : 'User-agent: *\nDisallow: /';
  return new Response(body + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
