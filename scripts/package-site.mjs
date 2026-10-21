// Zips dist/ (including the .htaccess files) into paradisetravels-site.zip for upload via Hostinger File Manager
// (upload → Extract into public_html). FTP users can upload the contents of dist/ instead.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const out = 'paradisetravels-site.zip';
fs.rmSync(out, { force: true });
execFileSync('zip', ['-qr', `../${out}`, '.'], { cwd: 'dist', stdio: 'inherit' });
console.log(
  `Created ${out} (${(fs.statSync(out).size / 1048576).toFixed(1)} MB) — upload and extract into public_html.`,
);
