import type { APIRoute } from 'astro';
import { tripBuilderSchema, handleForm } from '../../lib/server/forms';

export const prerender = false;
export const POST: APIRoute = (ctx) => handleForm('trip-builder', tripBuilderSchema, ctx);
