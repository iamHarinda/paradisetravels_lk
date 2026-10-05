import { config } from '@keystatic/core';

// Local storage while developing; GitHub mode in production builds (edits commit to the repo → auto-deploy).
// GitHub mode needs the KEYSTATIC_* env vars from the Keystatic GitHub App setup (see docs/08 §8).
export default config({
  storage: import.meta.env.PROD ? { kind: 'github', repo: 'iamHarinda/paradisetravels_lk' } : { kind: 'local' },
  // Collections are added in Phase 2 (docs/08 §5).
  collections: {},
});
