// Serves the static build (dist/) with gzip/brotli and the same clean-URL rules as dist/.htaccess on Hostinger,
// so Lighthouse CI and Playwright measure what visitors get. With PHP_PROXY set (e.g. a `php -S` server, see
// playwright.config.ts) requests to /api/* are forwarded to it, so the PHP form handlers can be tested too.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import compression from 'compression';
import { REDIRECTS } from '../deploy/apache.mjs';

const root = path.resolve('dist');
const port = Number(process.env.PORT ?? 4321);
const compress = compression({ brotli: { enabled: true } });
const PHP_PROXY = process.env.PHP_PROXY;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

function resolve(urlPath) {
  const file = path.join(root, decodeURIComponent(urlPath));
  if (!file.startsWith(root)) return null;
  if (fs.existsSync(file) && fs.statSync(file).isFile()) return file;
  const index = path.join(file, 'index.html');
  return fs.existsSync(index) ? index : null;
}

http
  .createServer((req, res) =>
    compress(req, res, () => {
      const url = new URL(req.url ?? '/', 'http://localhost');
      const p = url.pathname === '/sitemap.xml' ? '/sitemap-0.xml' : url.pathname;
      if (PHP_PROXY && p.startsWith('/api/')) {
        const target = new URL(p.endsWith('.php') ? p : `${p}.php`, PHP_PROXY);
        const upstream = http.request(target, { method: req.method, headers: req.headers }, (r) => {
          res.writeHead(r.statusCode ?? 502, r.headers);
          r.pipe(res);
        });
        upstream.on('error', () => {
          res.writeHead(502);
          res.end();
        });
        return req.pipe(upstream);
      }
      if (REDIRECTS[p.replace(/\/$/, '')]) {
        res.writeHead(301, { Location: REDIRECTS[p.replace(/\/$/, '')] });
        return res.end();
      }
      if (p.length > 1 && p.endsWith('/')) {
        res.writeHead(301, { Location: p.slice(0, -1) + url.search });
        return res.end();
      }
      const file = resolve(p);
      const status = file ? 200 : 404;
      const target = file ?? path.join(root, '404.html');
      res.writeHead(status, { 'Content-Type': TYPES[path.extname(target)] ?? 'application/octet-stream' });
      fs.createReadStream(target).pipe(res);
    }),
  )
  .listen(port, '127.0.0.1', () => console.log(`Server listening on http://localhost:${port}`));
