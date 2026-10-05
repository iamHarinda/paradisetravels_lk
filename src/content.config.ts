import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { REGION_IDS } from './lib/seasons';

// Content schemas (docs/08 §5). Keep in sync with keystatic.config.ts.

const tone = z.enum(['ocean', 'tea', 'heritage', 'wild', 'sand']).default('ocean');
// Keystatic stores multiselect values as strings — coerce. Empty Keystatic fields are saved as null, hence .nullish().
const months = z.array(z.coerce.number().int().min(1).max(12)).default([]);
const faqs = z.array(z.object({ q: z.string(), a: z.string() })).default([]);
const seo = z.object({
  title: z.string().max(60),
  description: z.string().min(120).max(165),
  keyword: z.string().nullish(),
});
const source = z.object({ title: z.string(), url: z.url() });
/**
 * `reviewed: false` = draft copy that still needs a local expert / owner check before launch (docs/05 §7).
 * `sample: true` = placeholder entry used only to render templates; never built in production.
 */
const workflow = {
  reviewed: z.boolean().default(false),
  sample: z.boolean().default(false),
};

const destinations = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/destinations' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      region: z.enum(REGION_IDS),
      coords: z.tuple([z.number(), z.number()]),
      bestMonths: months,
      idealStay: z.string(),
      gettingThere: z.string(),
      thingsToDo: z.array(z.object({ title: z.string(), tip: z.string() })).default([]),
      tips: z.array(z.string()).default([]),
      faqs,
      tone,
      heroImage: image().nullish(),
      heroAlt: z.string().nullish(),
      featured: z.boolean().default(false),
      order: z.number().default(100),
      seo,
      ...workflow,
    }),
});

const experiences = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/experiences' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      bestMonths: months,
      destinations: z.array(reference('destinations')).default([]),
      highlights: z.array(z.string()).default([]),
      faqs,
      tone,
      heroImage: image().nullish(),
      heroAlt: z.string().nullish(),
      order: z.number().default(100),
      seo,
      ...workflow,
    }),
});

const tourStyles = z.enum([
  'culture',
  'wildlife',
  'beach',
  'honeymoon',
  'ayurveda',
  'family',
  'luxury',
  'budget',
  'tea',
  'adventure',
]);

const tours = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/tours' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      durationDays: z.number().int().positive(),
      styles: z.array(tourStyles).default([]),
      regions: z.array(z.enum(REGION_IDS)).default([]),
      destinations: z.array(reference('destinations')).default([]),
      priceFromUSD: z.number().positive().nullish(),
      priceNote: z.string().nullish(),
      bestMonths: months,
      days: z.array(
        z.object({
          day: z.number().int().positive(),
          title: z.string(),
          body: z.string(),
          overnight: z.string().nullish(),
        }),
      ),
      inclusions: z.array(z.string()).default([]),
      exclusions: z.array(z.string()).default([]),
      hotels: z.array(reference('hotels')).default([]),
      faqs,
      tone,
      heroImage: image().nullish(),
      heroAlt: z.string().nullish(),
      featured: z.boolean().default(false),
      order: z.number().default(100),
      seo,
      ...workflow,
    }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    short: z.string(),
    icon: z.string(),
    audience: z.string(),
    steps: z.array(z.object({ title: z.string(), body: z.string() })).default([]),
    faqs,
    order: z.number(),
    seo,
    ...workflow,
  }),
});

const hotels = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/hotels' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      area: z.string(),
      region: z.enum(REGION_IDS),
      destination: reference('destinations').nullish(),
      stars: z.number().int().min(1).max(5).nullish(),
      type: z.array(z.string()).default([]),
      // Rate-parity display mode, set per hotel after the owner checks the contract (docs/10 §1).
      rateDisplay: z.enum(['public', 'package', 'on-request']),
      priceFromUSD: z.number().positive().nullish(),
      packageOffer: z.string().nullish(),
      rooms: z
        .array(z.object({ name: z.string(), occupancy: z.number().int(), mealPlans: z.array(z.string()).default([]) }))
        .default([]),
      deal: z.object({ label: z.string(), validTo: z.coerce.date().nullish() }).nullish(),
      highlights: z.array(z.string()).default([]),
      heroImage: image().nullish(),
      heroAlt: z.string().nullish(),
      tone,
      seo,
      ...workflow,
    }),
});

const guides = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      category: z.enum(['planning', 'visa', 'seasons', 'destinations', 'culture', 'transport', 'data']),
      pillar: z.boolean().default(false),
      published: z.coerce.date(),
      updated: z.coerce.date().nullish(),
      lastChecked: z.coerce.date(),
      sources: z.array(source).default([]),
      author: reference('team').nullish(),
      relatedTours: z.array(reference('tours')).default([]),
      relatedDestinations: z.array(reference('destinations')).default([]),
      relatedServices: z.array(reference('services')).default([]),
      tone,
      heroImage: image().nullish(),
      heroAlt: z.string().nullish(),
      seo,
      ...workflow,
    }),
});

const faqsCollection = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/faqs' }),
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    category: z.enum(['booking', 'travel', 'payments', 'services']),
    order: z.number().default(100),
    ...workflow,
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/testimonials' }),
  schema: z.object({
    name: z.string(),
    country: z.string().nullish(),
    source: z.enum(['google', 'tripadvisor', 'facebook', 'email']),
    url: z.url().or(z.literal('')).nullish(),
    date: z.coerce.date(),
    rating: z.number().int().min(1).max(5).nullish(),
    text: z.string(),
    // Only real reviews, displayed with the reviewer's permission (CLAUDE.md hard rule 1).
    permission: z.literal(true),
    ...workflow,
  }),
});

const team = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/team' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      bio: z.string().nullish(),
      photo: image().nullish(),
      languages: z.array(z.string()).default([]),
      order: z.number().default(100),
      ...workflow,
    }),
});

export const collections = {
  destinations,
  experiences,
  tours,
  services,
  hotels,
  guides,
  faqs: faqsCollection,
  testimonials,
  team,
};
