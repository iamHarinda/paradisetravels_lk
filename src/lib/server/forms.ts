import { z } from 'astro/zod';
import {
  TURNSTILE_SECRET,
  RESEND_API_KEY,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  MAIL_FROM,
  MAIL_TO,
  LEAD_WEBHOOK_URL,
} from 'astro:env/server';
import { SITE, whatsappLink } from '../site';

// Shared lead pipeline for /api/enquiry, /api/rate-request and /api/trip-builder (docs/08 §6):
// validate (zod) → spam checks (honeypot, rate limit, Turnstile) → staff email → traveller confirmation → lead store.

const text = (max = 200) => z.string().trim().max(max);
const optional = (max = 200) =>
  text(max)
    .optional()
    .transform((v) => v || undefined);

export const contactFields = {
  name: text(120).min(2, 'Please tell us your name.'),
  email: z.email('Please enter a valid email address.').max(200),
  phoneCode: optional(8),
  phone: optional(30),
  country: optional(80),
  preferredContact: z.enum(['whatsapp', 'email', 'kakao', 'phone']).default('email'),
};

/** Tracking fields every form carries (docs/10 §7: landing page + UTM for reporting). */
const tracking = {
  page: optional(300),
  utm_source: optional(100),
  utm_medium: optional(100),
  utm_campaign: optional(100),
};

export const enquirySchema = z.object({
  ...contactFields,
  ...tracking,
  subject: optional(150),
  message: text(5000).min(5, 'Please add a short message.'),
});

export const rateRequestSchema = z.object({
  ...contactFields,
  ...tracking,
  hotel: text(150).min(1),
  checkIn: z.iso.date('Please choose a check-in date.'),
  checkOut: z.iso.date('Please choose a check-out date.'),
  rooms: z.coerce.number().int().min(1).max(50),
  adults: z.coerce.number().int().min(1).max(100),
  children: z.coerce.number().int().min(0).max(50).default(0),
  mealPlan: optional(30),
  notes: optional(2000),
});

const list = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((v) => (v === undefined ? [] : Array.isArray(v) ? v : [v]).map((s) => s.slice(0, 60)).slice(0, 20));

export const tripBuilderSchema = z.object({
  ...contactFields,
  ...tracking,
  startDate: optional(20),
  month: optional(20),
  flexible: optional(10),
  days: z.coerce.number().int().min(1).max(90).optional().catch(undefined),
  adults: z.coerce.number().int().min(1).max(100).default(2),
  children: z.coerce.number().int().min(0).max(50).default(0),
  childAges: optional(100),
  occasion: optional(40),
  interests: list,
  style: optional(40),
  hotelClass: optional(40),
  transport: optional(40),
  needFlights: optional(10),
  needVisa: optional(10),
  where: optional(200),
  tour: optional(200),
  notes: optional(3000),
});

export type FormKind = 'enquiry' | 'rate-request' | 'trip-builder';
const LABELS: Record<FormKind, string> = {
  enquiry: 'Enquiry',
  'rate-request': 'Hotel rate request',
  'trip-builder': 'Trip plan request',
};

// ---- Spam protection -------------------------------------------------------------------------

const HONEYPOT = 'company_website';
const hits = new Map<string, number[]>();
/** In-memory rate limit: 5 submissions / 10 minutes / IP (single Node process on Hostinger; Cloudflare adds a WAF rule). */
export function rateLimited(ip: string, limit = 5, windowMs = 10 * 60_000) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > limit;
}

export async function verifyTurnstile(token: string | null, ip: string) {
  if (!TURNSTILE_SECRET) {
    console.warn('[forms] TURNSTILE_SECRET not set — skipping Turnstile verification.');
    return true;
  }
  if (!token) return false;
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret: TURNSTILE_SECRET, response: token, remoteip: ip }),
  });
  const data = (await res.json()) as { success: boolean };
  return data.success;
}

// ---- Email -------------------------------------------------------------------------------------

const esc = (s: unknown) =>
  String(s ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );

interface Mail {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

async function sendMail(mail: Mail) {
  if (RESEND_API_KEY) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: MAIL_FROM,
        to: [mail.to],
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        reply_to: mail.replyTo,
      }),
    });
    if (!res.ok) throw new Error(`Resend failed: ${res.status} ${await res.text()}`);
    return;
  }
  if (SMTP_HOST) {
    const { createTransport } = await import('nodemailer');
    const transport = createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    });
    await transport.sendMail({ from: MAIL_FROM, ...mail });
    return;
  }
  console.warn(`[forms] No email provider configured — would send "${mail.subject}" to ${mail.to}`);
}

function fieldsTable(data: Record<string, unknown>) {
  const rows = Object.entries(data)
    .filter(([, v]) => v !== undefined && v !== '' && !(Array.isArray(v) && !v.length))
    .map(
      ([k, v]) =>
        `<tr><th align="left" style="padding:6px 12px 6px 0;vertical-align:top;color:#51607a">${esc(k)}</th><td style="padding:6px 0">${esc(Array.isArray(v) ? v.join(', ') : v)}</td></tr>`,
    )
    .join('');
  return `<table style="border-collapse:collapse;font:14px/1.5 Arial,sans-serif">${rows}</table>`;
}

function layout(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#F5F9FE;padding:24px;font:15px/1.6 Arial,sans-serif;color:#0b1730">
<div style="max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden">
<div style="background:#071a33;color:#FFFFFF;padding:20px 24px;font:700 20px Georgia,serif">${esc(SITE.name)}</div>
<div style="padding:24px"><h1 style="font:600 22px Georgia,serif;margin:0 0 16px">${esc(title)}</h1>${body}</div>
<div style="padding:16px 24px;background:#E8F0FB;font-size:12px;color:#51607a">${esc(SITE.legalName)} · ${esc(SITE.addressLine)} · ${esc(SITE.phone)}</div>
</div></body></html>`;
}

// ---- Pipeline ----------------------------------------------------------------------------------

export function formDataToObject(fd: FormData) {
  const out: Record<string, string | string[]> = {};
  for (const key of new Set(fd.keys())) {
    const all = fd.getAll(key).filter((v): v is string => typeof v === 'string');
    out[key] = all.length > 1 ? all : (all[0] ?? '');
  }
  return out;
}

const wantsJson = (request: Request) => request.headers.get('accept')?.includes('application/json');

function errorResponse(request: Request, status: number, message: string, fieldErrors: Record<string, string> = {}) {
  if (wantsJson(request)) return Response.json({ ok: false, message, fieldErrors }, { status });
  // No-JS fallback: a minimal page explaining the problem with a way back.
  const list = Object.values(fieldErrors)
    .map((e) => `<li>${esc(e)}</li>`)
    .join('');
  return new Response(
    layout(
      'We could not send your request',
      `<p>${esc(message)}</p>${list ? `<ul>${list}</ul>` : ''}<p><a href="javascript:history.back()">Go back and try again</a> or WhatsApp us on ${esc(SITE.phone)}.</p>`,
    ),
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );
}

export async function handleForm<S extends z.ZodType<Record<string, unknown>>>(
  kind: FormKind,
  schema: S,
  { request, clientAddress }: { request: Request; clientAddress: string },
) {
  const ip = request.headers.get('cf-connecting-ip') ?? clientAddress ?? 'unknown';
  let fd: FormData;
  try {
    fd = await request.formData();
  } catch {
    return errorResponse(request, 400, 'The form could not be read.');
  }

  // Honeypot: bots fill every field. Pretend success so they don't retry.
  if (String(fd.get(HONEYPOT) ?? '') !== '') return success(request, kind);
  if (rateLimited(ip))
    return errorResponse(request, 429, 'Too many requests — please wait a few minutes, or message us on WhatsApp.');
  if (!(await verifyTurnstile(fd.get('cf-turnstile-response') as string | null, ip))) {
    return errorResponse(request, 400, 'The spam check failed. Please try again.');
  }

  const parsed = schema.safeParse(formDataToObject(fd));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
    return errorResponse(request, 422, 'Please check the highlighted fields.', fieldErrors);
  }
  const data = parsed.data as Record<string, unknown> & {
    name: string;
    email: string;
    phone?: string;
    phoneCode?: string;
  };
  const phone = data.phone ? `${data.phoneCode ?? ''} ${data.phone}`.trim() : undefined;
  const lead = { kind, receivedAt: new Date().toISOString(), ...data, phone };

  try {
    const waDigits = phone?.replace(/[^\d]/g, '');
    await sendMail({
      to: MAIL_TO,
      replyTo: data.email,
      subject: `${LABELS[kind]} — ${data.name}`,
      text: JSON.stringify(lead, null, 2),
      html: layout(
        `${LABELS[kind]} from ${data.name}`,
        `${waDigits ? `<p><a href="https://wa.me/${waDigits}" style="color:#0e3b7d;font-weight:700">Reply on WhatsApp</a></p>` : ''}${fieldsTable(lead)}`,
      ),
    });
    await sendMail({
      to: data.email,
      subject: `We’ve received your request — ${SITE.name}`,
      text: `Hello ${data.name},\n\nThank you — we have received your ${LABELS[kind].toLowerCase()} and will reply as soon as possible.\n\nIf it is urgent, message us on WhatsApp: ${SITE.phone}\n\n${SITE.legalName}`,
      html: layout(
        `Thank you, ${data.name}`,
        `<p>We have received your ${esc(LABELS[kind].toLowerCase())} and a member of our Colombo team will reply as soon as possible.</p>
<p>If it is urgent, <a href="${esc(whatsappLink())}" style="color:#0e3b7d;font-weight:700">message us on WhatsApp</a> (${esc(SITE.phone)}).</p>`,
      ),
    });
    if (LEAD_WEBHOOK_URL) {
      await fetch(LEAD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      });
    }
  } catch (err) {
    console.error('[forms] delivery failed', err);
    return errorResponse(
      request,
      502,
      `Sorry — something went wrong sending your request. Please email ${SITE.email} or WhatsApp ${SITE.phone}.`,
    );
  }

  return success(request, kind);
}

function success(request: Request, kind: FormKind) {
  const location = `/thank-you?type=${kind}`;
  if (wantsJson(request)) return Response.json({ ok: true, redirect: location });
  return new Response(null, { status: 303, headers: { Location: location } });
}
