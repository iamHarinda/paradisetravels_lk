// Apache / LiteSpeed rules for Hostinger shared hosting (static build in public_html, forms in /api/*.php).
// astro.config.mjs writes the result to dist/.htaccess and dist/_astro/.htaccess after every build.

/** Old URL → new URL (owner feedback restructure, October 2026). Also passed to Astro's `redirects`. */
export const REDIRECTS = {
  '/hotel-deals': '/hotels',
  '/tours/day-tours': '/tours',
  '/services/flight-tickets': '/services/air-ticketing',
  '/services/visa-assistance': '/services/visa-consultation',
  '/services/ayurveda-packages': '/tours/ayurveda',
  '/services/hotel-reservations': '/hotels',
  '/services/transport-chauffeur': '/tours',
  '/services/tour-guides': '/tours',
  '/services/day-outings': '/tours',
  '/services/conferences-mice': '/services',
  '/services/event-management': '/services',
  '/services/workshops': '/services',
  '/services/interpreters': '/services',
  '/services/project-coordination': '/services',
  '/experiences/honeymoon': '/tours/honeymoon',
  '/experiences/ayurveda-wellness': '/tours/ayurveda',
  '/experiences/tea-country': '/tours/tea',
};

const quote = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function htaccess() {
  const redirects = Object.entries(REDIRECTS)
    .map(([from, to]) => `RewriteRule ^${quote(from.slice(1))}/?$ ${to} [R=301,L]`)
    .join('\n');
  return `# Generated at build time by deploy/apache.mjs — edit that file, not this one.
Options -Indexes
DirectoryIndex index.html
# Clean URLs without trailing slashes (canonical form, see astro.config.mjs trailingSlash: 'never').
DirectorySlash Off
ErrorDocument 404 /404.html
AddDefaultCharset utf-8
AddType image/avif .avif
AddType application/manifest+json .webmanifest

<IfModule mod_rewrite.c>
RewriteEngine On

# www → apex
RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]
RewriteRule ^(.*)$ https://%1/$1 [R=301,L]

# The shared form library is not an endpoint.
RewriteRule ^api/(_lead|paradise-config)\\.php$ - [F,L]

# Retired pages
${redirects}

# /some/page/ → /some/page
RewriteCond %{REQUEST_URI} !^/$
RewriteRule ^(.+)/$ /$1 [R=301,L]

# /some/page → /some/page/index.html (Astro builds one folder per page)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{DOCUMENT_ROOT}/$1/index.html -f
RewriteRule ^(.+)$ /$1/index.html [L]
</IfModule>

<IfModule mod_headers.c>
Header always set X-Content-Type-Options "nosniff"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set X-Frame-Options "SAMEORIGIN"
Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), interest-cohort=()"
<FilesMatch "\\.(html|xml|txt)$">
Header set Cache-Control "public, max-age=0, must-revalidate"
</FilesMatch>
<FilesMatch "\\.(svg|png|ico|webmanifest|json)$">
Header set Cache-Control "public, max-age=604800"
</FilesMatch>
</IfModule>

<IfModule mod_deflate.c>
AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml application/javascript application/json image/svg+xml application/manifest+json
</IfModule>
`;
}

/** /_astro/* files have content hashes in their names — cache them for a year. */
export const astroAssetsHtaccess = `# Generated at build time by deploy/apache.mjs
<IfModule mod_headers.c>
Header set Cache-Control "public, max-age=31536000, immutable"
</IfModule>
`;
