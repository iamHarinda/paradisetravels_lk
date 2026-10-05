// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';

import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

import tailwindcss from '@tailwindcss/vite';

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
  // Italic is only used for accent words in headlines — never preloaded.
  if (italic) variants.push(variant('latin', LATIN, 'italic'));
  return { variants };
};

// https://astro.build/config
export default defineConfig({
  site: 'https://paradisetravels.lk',
  trailingSlash: 'never',
  build: { format: 'directory' },

  adapter: node({
    mode: 'standalone',
  }),

  integrations: [sitemap({ filter: (page) => !/\/(thank-you|styleguide)$/.test(page) }), mdx(), react(), keystatic()],

  prefetch: { defaultStrategy: 'hover' },

  env: {
    schema: {
      // Only an explicit `production` build is indexable; everything else (staging, local) is noindex.
      SITE_ENV: envField.enum({
        context: 'server',
        access: 'public',
        values: ['production', 'staging'],
        default: 'staging',
      }),
      // Forms (Phase 3). Everything is optional so local/staging builds work without secrets;
      // see .env.example and README for what production needs.
      TURNSTILE_SITE_KEY: envField.string({ context: 'client', access: 'public', optional: true }),
      TURNSTILE_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      SMTP_HOST: envField.string({ context: 'server', access: 'secret', optional: true }),
      SMTP_PORT: envField.number({ context: 'server', access: 'secret', default: 465 }),
      SMTP_USER: envField.string({ context: 'server', access: 'secret', optional: true }),
      SMTP_PASS: envField.string({ context: 'server', access: 'secret', optional: true }),
      MAIL_FROM: envField.string({
        context: 'server',
        access: 'secret',
        default: 'Paradise Travels <hello@paradisetravels.lk>',
      }),
      MAIL_TO: envField.string({ context: 'server', access: 'secret', default: 'hello@paradisetravels.lk' }),
      LEAD_WEBHOOK_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },

  fonts: [
    {
      name: 'Fraunces',
      cssVariable: '--font-fraunces',
      provider: fontProviders.local(),
      // Latin only: this is the one preloaded file (docs/04 §3); rare accented glyphs fall back to Georgia.
      options: variableFont('@fontsource-variable/fraunces', 'fraunces', { latinExt: false, italic: true }),
      fallbacks: ['Georgia', 'serif'],
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
