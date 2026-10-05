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

/** @param {string} pkg @param {string} file @param {{ latinExt?: boolean }} [opts] */
const variableFont = (pkg, file, { latinExt = true } = {}) => {
  /** @param {string} subset @param {string} range */
  const variant = (subset, range) => ({
    src: /** @type {[string]} */ ([`${pkg}/files/${file}-${subset}-wght-normal.woff2`]),
    weight: '100 900',
    style: /** @type {const} */ ('normal'),
    unicodeRange: /** @type {[string]} */ ([range]),
  });
  /** @type {[ReturnType<typeof variant>, ...ReturnType<typeof variant>[]]} */
  const variants = [variant('latin', LATIN)];
  if (latinExt) variants.push(variant('latin-ext', LATIN_EXT));
  return { variants };
};

// https://astro.build/config
export default defineConfig({
  site: 'https://paradisetravels.lk',
  trailingSlash: 'never',
  build: { format: 'file' },

  adapter: node({
    mode: 'standalone',
  }),

  integrations: [sitemap(), mdx(), react(), keystatic()],

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
    },
  },

  fonts: [
    {
      name: 'Fraunces',
      cssVariable: '--font-fraunces',
      provider: fontProviders.local(),
      // Latin only: this is the one preloaded file (docs/04 §3); rare accented glyphs fall back to Georgia.
      options: variableFont('@fontsource-variable/fraunces', 'fraunces', { latinExt: false }),
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
