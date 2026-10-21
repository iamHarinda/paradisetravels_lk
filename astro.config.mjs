// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import { defineConfig, envField, fontProviders } from 'astro/config';

import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

import tailwindcss from '@tailwindcss/vite';
import { REDIRECTS, htaccess, astroAssetsHtaccess } from './deploy/apache.mjs';

// Hosting (October 2026): Hostinger shared hosting — no Node.js, uploaded by FTP / File Manager. So the build is fully
// static (`dist/`), forms are handled by PHP in public/api/, and Apache rules come from deploy/apache.mjs.
// Keystatic (and the Node adapter it needs) only run in `astro dev`, for editing content locally.
const DEV = process.argv.includes('dev');

// <lastmod> for sitemap.xml: a page's own "updated"/"lastChecked" date from its Markdown frontmatter when it has one,
// otherwise the date the site was last restructured.
const SITE_REBUILT = '2026-10-21';
const DATED = Object.fromEntries(
  ['guides', 'destinations'].flatMap((collection) => {
    const dir = new URL(`./src/content/${collection}/`, import.meta.url);
    return readdirSync(dir)
      .filter((f) => f.endsWith('.md'))
      .map((f) => {
        const fm = readFileSync(new URL(f, dir), 'utf8');
        const date = fm.match(/^(?:updated|lastChecked|published):\s*'?(\d{4}-\d{2}-\d{2})/m)?.[1];
        const base = collection === 'guides' ? 'travel-guide' : collection;
        return [`/${base}/${f.replace(/\.md$/, '')}`, date];
      })
      .filter(([, d]) => d && d > SITE_REBUILT);
  }),
);
/** @param {string} url */
const lastmod = (url) => DATED[new URL(url).pathname] ?? SITE_REBUILT;

/**
 * Writes dist/.htaccess (clean URLs, 301 redirects, caching, security headers) + dist/_astro/.htaccess.
 * @returns {import('astro').AstroIntegration}
 */
const apacheConfig = () => ({
  name: 'paradise-apache-config',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const { writeFile } = await import('node:fs/promises');
      await writeFile(new URL('.htaccess', dir), htaccess());
      // One sitemap at /sitemap.xml (what Naver Search Advisor and Google expect). @astrojs/sitemap writes
      // sitemap-index.xml + sitemap-0.xml; while everything fits in one file (< 45,000 URLs), keep just that file.
      const { rename, rm, access } = await import('node:fs/promises');
      const split = await access(new URL('sitemap-1.xml', dir)).then(
        () => true,
        () => false,
      );
      if (!split) {
        await rename(new URL('sitemap-0.xml', dir), new URL('sitemap.xml', dir));
        await rm(new URL('sitemap-index.xml', dir));
      }
      await writeFile(new URL('_astro/.htaccess', dir), astroAssetsHtaccess);
    },
  },
});

// Fontsource unicode ranges — we self-host Latin + Latin-ext only (docs/09 §5).
const LATIN =
  'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const LATIN_EXT =
  'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';

/** @param {string} pkg @param {string} file @param {{ latinExt?: boolean, italic?: boolean }} [opts] */
const variableFont = (pkg, file, { latinExt = true, italic = false } = {}) => {
  /** @param {string} subset @param {string} range @param {'normal' | 'italic'} [style] */
  const variant = (subset, range, style = 'normal') => ({
    src: /** @type {[string]} */ ([`${pkg}/files/${file}-${subset}-wght-${style}.woff2`]),
    weight: '100 900',
    style: /** @type {'normal' | 'italic'} */ (style),
    unicodeRange: /** @type {[string]} */ ([range]),
  });
  /** @type {[ReturnType<typeof variant>, ...ReturnType<typeof variant>[]]} */
  const variants = [variant('latin', LATIN)];
  if (latinExt) variants.push(variant('latin-ext', LATIN_EXT));
  // Italic is only used for accent words in headlines — never preloaded. It's a static weight-380, Latin-only
  // instance cut from the variable font with fonttools (45 KB → 15 KB); see src/assets/fonts/README.md.
  if (italic)
    variants.push({
      src: /** @type {[string]} */ (['./src/assets/fonts/fraunces-italic-380-latin.woff2']),
      weight: '380',
      style: /** @type {'italic'} */ ('italic'),
      unicodeRange: /** @type {[string]} */ ([LATIN]),
    });
  return { variants };
};

/**
 * Every link that leaves the site (WhatsApp, Facebook, Google Maps, official sources, photo credits…) opens in a new
 * tab, so visitors keep their place on our site. Done once on the built HTML rather than in every component.
 * @returns {import('astro').AstroIntegration}
 */
const externalLinksInNewTab = () => ({
  name: 'paradise-external-links',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const { readdir, readFile, writeFile } = await import('node:fs/promises');
      const files = (await readdir(dir, { recursive: true })).filter((f) => f.endsWith('.html'));
      const external = /\shref="(?:https?:)?\/\/(?!(?:www\.)?paradisetravels\.lk[/"?#])[^"]+"/;
      for (const f of files) {
        const file = new URL(f, dir);
        const html = await readFile(file, 'utf8');
        const out = html.replace(/<a\b[^>]*>/g, (tag) => {
          if (!external.test(tag) || /\starget=/.test(tag)) return tag;
          let t = tag.replace(/<a\b/, '<a target="_blank"');
          if (/\srel="/.test(t))
            t = t.replace(/\srel="([^"]*)"/, (_, r) => ` rel="${/noopener/.test(r) ? r : `${r} noopener`.trim()}"`);
          else t = t.replace(/<a\b/, '<a rel="noopener"');
          return t;
        });
        if (out !== html) await writeFile(file, out);
      }
    },
  },
});

// https://astro.build/config
export default defineConfig({
  site: 'https://paradisetravels.lk',
  trailingSlash: 'never',
  build: { format: 'directory' },

  ...(DEV ? { adapter: node({ mode: 'standalone' }) } : {}),

  integrations: [
    sitemap({
      // Only indexable pages: noindex pages (thank-you, styleguide, draft legal pages) stay out of the sitemap.
      filter: (page) => !/\/(thank-you|styleguide|terms|privacy|cancellation-policy)\/?$/.test(page),
      serialize: (item) => ({ ...item, lastmod: lastmod(item.url) }),
    }),
    mdx(),
    react(),
    ...(DEV ? [keystatic()] : []),
    apacheConfig(),
    externalLinksInNewTab(),
  ],

  prefetch: { defaultStrategy: 'hover' },

  // October 2026 restructure (owner feedback). Also emitted as real 301s in dist/.htaccess.
  redirects: REDIRECTS,

  env: {
    schema: {
      // Only an explicit `production` build is indexable; everything else (staging, local) is noindex.
      SITE_ENV: envField.enum({
        context: 'server',
        access: 'public',
        values: ['production', 'staging'],
        default: 'staging',
      }),
      // Search-engine ownership tags (content values from Naver Search Advisor / Google Search Console). Naver is
      // essential for the Korean market (docs/13-korea-naver-plan.md).
      NAVER_SITE_VERIFICATION: envField.string({ context: 'server', access: 'public', optional: true }),
      GOOGLE_SITE_VERIFICATION: envField.string({ context: 'server', access: 'public', optional: true }),
      BING_SITE_VERIFICATION: envField.string({ context: 'server', access: 'public', optional: true }),
      // Forms: only the Turnstile *site* key is needed at build time. Mail settings and the Turnstile secret live in
      // ~/paradise-config.php on the server (paradise-config.sample.php).
      TURNSTILE_SITE_KEY: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },

  fonts: [
    {
      name: 'Fraunces',
      cssVariable: '--font-fraunces',
      provider: fontProviders.local(),
      // Latin only: this is the one preloaded file (docs/04 §3); rare accented glyphs fall back to Georgia.
      options: variableFont('@fontsource-variable/fraunces', 'fraunces', { latinExt: false, italic: true }),
      // Hand-tuned metric fallback (global.css): Astro's generated one runs ~11% wide at heading weights, which
      // re-wraps headlines when Fraunces swaps in and shifts the page (CLS).
      fallbacks: ['Fraunces Fallback', 'Georgia', 'serif'],
      optimizedFallbacks: false,
      display: 'swap',
    },
    {
      name: 'Inter',
      cssVariable: '--font-inter',
      provider: fontProviders.local(),
      options: variableFont('@fontsource-variable/inter', 'inter'),
      fallbacks: ['Arial', 'sans-serif'],
      display: 'swap',
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
