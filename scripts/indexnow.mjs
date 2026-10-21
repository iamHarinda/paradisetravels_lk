// IndexNow: tells Bing, Naver, Yandex, Seznam and other participating search engines which URLs changed, so they
// re-crawl them within minutes instead of waiting for the sitemap. Called by deploy-ftp.mjs after every upload.
// Manual use:  node scripts/indexnow.mjs            (submit every page in dist/sitemap.xml)
//              node scripts/indexnow.mjs /ko /tours (submit specific paths)
// The key is the public/<32 hex>.txt file (it must be public — that is how engines verify ownership).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = 'https://paradisetravels.lk';
// The shared endpoint forwards to every participating engine, but Bing's dashboard and Naver are more reliable when
// pinged directly, so we notify all three (each response is logged; a failure never fails a deploy).
const ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
  'https://searchadvisor.naver.com/indexnow',
];

export function indexNowKey() {
  const file = fs.readdirSync('public').find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
  return file?.slice(0, -4);
}

/** Pages behind changed/removed dist files: "ko/tours/golf/index.html" → "/ko/tours/golf". Skips noindex/redirect stubs. */
export function pagesFromFiles(files, dist = 'dist') {
  const out = new Set();
  for (const f of files) {
    const m = f.match(/^(?:(.*)\/)?index\.html$/);
    if (!m) continue;
    const full = path.join(dist, f);
    if (fs.existsSync(full)) {
      const html = fs.readFileSync(full, 'utf8').slice(0, 6000);
      if (html.includes('http-equiv="refresh"') || html.includes('noindex')) continue;
    }
    out.add(`/${m[1] ?? ''}`);
  }
  return [...out];
}

export async function submitIndexNow(paths) {
  const key = indexNowKey();
  if (!key) return console.log('  IndexNow: no key file in public/ — skipped.');
  if (!paths.length) return console.log('  IndexNow: no page changes to report.');
  const urlList = paths.map((p) => new URL(p, SITE).toString()).slice(0, 10_000);
  const body = JSON.stringify({ host: new URL(SITE).host, key, keyLocation: `${SITE}/${key}.txt`, urlList });
  for (const endpoint of ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body,
      });
      // 200/202 = accepted. 400 bad request, 403 key not valid, 422 URLs don't match host, 429 too many requests.
      const detail = res.ok ? '' : ` ${(await res.text()).slice(0, 200)}`;
      console.log(`  IndexNow ${new URL(endpoint).host}: ${urlList.length} URL(s) → HTTP ${res.status}${detail}`);
    } catch (err) {
      console.log(`  IndexNow ${new URL(endpoint).host}: request failed (${err instanceof Error ? err.message : err})`);
    }
  }
}

// CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const paths = args.length
    ? args
    : [...fs.readFileSync('dist/sitemap.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(
        (m) => new URL(m[1]).pathname,
      );
  await submitIndexNow(paths);
}
