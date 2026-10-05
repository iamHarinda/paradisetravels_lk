// Serves the production build with gzip/brotli, like Cloudflare does in front of Hostinger.
// Used by Lighthouse CI so budgets are measured on compressed transfer sizes (docs/09).
import http from 'node:http';
import compression from 'compression';

process.env.ASTRO_NODE_AUTOSTART = 'disabled';
const { handler } = await import('../dist/server/entry.mjs');

const port = Number(process.env.PORT ?? 4321);
const compress = compression({ brotli: { enabled: true } });
http
  .createServer((req, res) => compress(req, res, () => handler(req, res)))
  .listen(port, '127.0.0.1', () => console.log(`Server listening on http://localhost:${port}`));
