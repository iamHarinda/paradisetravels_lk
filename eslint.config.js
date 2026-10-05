import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['dist/', '.astro/', 'node_modules/', 'playwright-report/', 'test-results/', '.lighthouseci/'] },
  js.configs.recommended,
  ...tseslint.configs.strict,
  ...astro.configs.recommended,
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  // `el!` after a DOM lookup on markup we render ourselves is idiomatic in small progressive-enhancement scripts.
  { rules: { '@typescript-eslint/no-non-null-assertion': 'off' } },
];
