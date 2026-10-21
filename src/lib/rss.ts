// Minimal RSS 2.0 builder (no dependency). Naver Search Advisor accepts an RSS feed alongside the sitemap and uses
// it to discover new and updated pages faster (docs/13 §1).
export interface RssItem {
  title: string;
  description: string;
  path: string;
  date: Date;
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]!);

export function rss(opts: {
  site: URL;
  title: string;
  description: string;
  path: string;
  lang: string;
  items: RssItem[];
}) {
  const abs = (p: string) => new URL(p, opts.site).toString();
  const items = [...opts.items]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map(
      (i) =>
        `<item><title>${esc(i.title)}</title><link>${abs(i.path)}</link><guid isPermaLink="true">${abs(i.path)}</guid><description>${esc(i.description)}</description><pubDate>${i.date.toUTCString()}</pubDate></item>`,
    )
    .join('');
  const body = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${esc(opts.title)}</title><link>${abs(opts.path.replace(/\/?rss\.xml$/, '') || '/')}</link><description>${esc(opts.description)}</description><language>${opts.lang}</language><atom:link href="${abs(opts.path)}" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
