import type { APIRoute } from 'astro';
import { enquirySchema, handleForm } from '../../lib/server/forms';

export const prerender = false;
export const POST: APIRoute = (ctx) => handleForm('enquiry', enquirySchema, ctx);
