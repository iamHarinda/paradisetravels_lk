import type { APIRoute } from 'astro';
import { rateRequestSchema, handleForm } from '../../lib/server/forms';

export const prerender = false;
export const POST: APIRoute = (ctx) => handleForm('rate-request', rateRequestSchema, ctx);
