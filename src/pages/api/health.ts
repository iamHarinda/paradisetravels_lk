import type { APIRoute } from 'astro';

// Uptime monitoring endpoint (docs/08 §10).
export const prerender = false;
export const GET: APIRoute = () =>
  Response.json({ ok: true, time: new Date().toISOString() }, { headers: { 'Cache-Control': 'no-store' } });
