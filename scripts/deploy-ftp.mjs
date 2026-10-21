// FTP deploy to Hostinger (no Node.js on the server): uploads dist/ to public_html, changed files only.
// Usage:  npm run deploy           (builds first, then uploads)
//         npm run deploy -- --all  (re-upload everything, e.g. after uploading from another computer)
//         npm run deploy -- --dry  (show what would be uploaded)
//         npm run deploy -- --no-indexnow  (skip the IndexNow ping to Bing/Naver)
// Settings come from .env (never committed): FTP_HOST, FTP_USER, FTP_PASSWORD, optional FTP_PORT (21),
// FTP_REMOTE_DIR or FTP_SERVER_DIR (public_html), FTP_SECURE (true = FTPS; set false only if the server refuses TLS).
// Change detection: a manifest of file hashes from the last successful upload, kept in deploy/.last-deploy.json.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import tls from 'node:tls';
import { Client } from 'basic-ftp';
import { pagesFromFiles, submitIndexNow } from './indexnow.mjs';

const args = new Set(process.argv.slice(2));
const ALL = args.has('--all');
const DRY = args.has('--dry');

// Minimal .env reader (KEY=value lines) so the script has no extra dependency.
for (const line of fs.existsSync('.env') ? fs.readFileSync('.env', 'utf8').split('\n') : []) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
  if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
}
const { FTP_USER, FTP_PASSWORD } = process.env;
// Accept "ftp://1.2.3.4/" as well as "1.2.3.4".
const FTP_HOST = process.env.FTP_HOST?.replace(/^s?ftps?:\/\//i, '').replace(/\/.*$/, '');
const PORT = Number(process.env.FTP_PORT ?? 21);
// Web root on the server. "/public_html" (absolute) or "public_html" (relative to the login folder); if unset, the
// login folder itself when it already is public_html (Hostinger FTP accounts land there), else ./public_html.
const REMOTE_SETTING = (process.env.FTP_REMOTE_DIR || process.env.FTP_SERVER_DIR || '').trim();
const SECURE = process.env.FTP_SECURE !== 'false';
// Hostinger's FTP certificate is issued to *.hstgr.io, not to the server IP. When FTP_HOST is an IP, still verify
// the certificate chain, but check its name against FTP_TLS_NAME (default hstgr.io) instead of the IP.
const TLS_NAME = process.env.FTP_TLS_NAME || (/^[\d.]+$/.test(FTP_HOST ?? '') ? 'hstgr.io' : undefined);
const secureOptions = TLS_NAME
  ? { checkServerIdentity: (_host, cert) => tls.checkServerIdentity(TLS_NAME, cert) }
  : undefined;
if (!FTP_HOST || !FTP_USER || !FTP_PASSWORD) {
  console.error('Missing FTP_HOST / FTP_USER / FTP_PASSWORD in .env (see .env.example).');
  process.exit(1);
}
const DIST = path.resolve('dist');
// Never ship a staging build (noindex, no analytics) to the live site.
const home = fs.existsSync(path.join(DIST, 'index.html')) ? fs.readFileSync(path.join(DIST, 'index.html'), 'utf8') : '';
if (!home.includes('content="index, follow')) {
  console.error(
    'dist/ is missing or is not a production build — run `npm run deploy` (it builds with SITE_ENV=production).',
  );
  process.exit(1);
}
const MANIFEST = path.resolve('deploy/.last-deploy.json');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}
const hash = (file) => crypto.createHash('sha1').update(fs.readFileSync(file)).digest('hex');

const files = Object.fromEntries(walk(DIST).map((f) => [path.relative(DIST, f).split(path.sep).join('/'), hash(f)]));
const previous = !ALL && fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : {};
// Hashed assets never change content, so upload the rest (HTML, .htaccess) last: pages never point at missing files.
const changed = Object.keys(files)
  .filter((f) => previous[f] !== files[f])
  .sort((a, b) => Number(!a.startsWith('_astro/')) - Number(!b.startsWith('_astro/')) || a.localeCompare(b));
const removed = Object.keys(previous).filter((f) => !(f in files));

const configFile = path.resolve('paradise-config.php');
console.log(
  `${changed.length} file(s) to upload, ${removed.length} to delete, to ${FTP_USER}@${FTP_HOST}:${REMOTE_SETTING || 'public_html'}${DRY ? ' (dry run)' : ''}`,
);
if (DRY) {
  changed.slice(0, 50).forEach((f) => console.log('  +', f));
  removed.slice(0, 50).forEach((f) => console.log('  -', f));
  process.exit(0);
}

const client = new Client(30_000);
try {
  await client.access({
    host: FTP_HOST,
    port: PORT,
    user: FTP_USER,
    password: FTP_PASSWORD,
    secure: SECURE,
    secureOptions,
  });
  const login = await client.pwd();
  const webroot = REMOTE_SETTING.startsWith('/')
    ? path.posix.normalize(REMOTE_SETTING).replace(/\/$/, '') || '/'
    : REMOTE_SETTING
      ? path.posix.join(login, REMOTE_SETTING)
      : /\/public_html\/?$/.test(login)
        ? login
        : path.posix.join(login, 'public_html');
  console.log(`  web root: ${webroot}`);

  // Server-only settings (Turnstile secret, mail addresses) go one level ABOVE the web root, never inside it.
  if (fs.existsSync(configFile)) {
    await client.cd(path.posix.dirname(webroot));
    await client.uploadFrom(configFile, 'paradise-config.php');
    console.log('  uploaded paradise-config.php (outside the web root)');
  }

  let done = 0;
  let dir = '';
  for (const f of changed) {
    const d = path.posix.dirname(f);
    if (d !== dir) {
      await client.ensureDir(path.posix.join(webroot, d === '.' ? '' : d));
      dir = d;
    }
    await client.uploadFrom(path.join(DIST, f), path.posix.basename(f));
    if (++done % 50 === 0 || done === changed.length) process.stdout.write(`\r  uploaded ${done}/${changed.length}`);
  }
  if (changed.length) process.stdout.write('\n');

  for (const f of removed) {
    await client.remove(path.posix.join(webroot, f), true);
  }
  if (removed.length) console.log(`  deleted ${removed.length} old file(s)`);

  fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
  fs.writeFileSync(MANIFEST, JSON.stringify(files));

  // Tell Bing, Naver & co. which pages changed (IndexNow). Never fails the deploy.
  if (!args.has('--no-indexnow')) await submitIndexNow(pagesFromFiles([...changed, ...removed]));
  console.log('Done. Purge the Cloudflare cache if pages look stale.');
} catch (err) {
  console.error(`\nFTP deploy failed: ${err instanceof Error ? err.message : err}`);
  console.error('Nothing is marked as uploaded — run `npm run deploy` again to retry.');
  process.exitCode = 1;
} finally {
  client.close();
}
