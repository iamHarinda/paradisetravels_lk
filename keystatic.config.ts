import { config, collection, fields } from '@keystatic/core';

// Keystatic CMS (docs/08 §1). Local storage while developing; GitHub mode in production builds, so edits
// commit to the repo and trigger an auto-deploy. GitHub mode needs the KEYSTATIC_* env vars (see README).
// Field names mirror src/content.config.ts — keep the two in sync.

const REGIONS = [
  { label: 'Cultural Triangle', value: 'triangle' },
  { label: 'Hill Country', value: 'hills' },
  { label: 'South Coast', value: 'south' },
  { label: 'Colombo & West', value: 'west' },
  { label: 'East Coast', value: 'east' },
  { label: 'North', value: 'north' },
] as const;

const TONES = [
  { label: 'Ocean', value: 'ocean' },
  { label: 'Tea', value: 'tea' },
  { label: 'Heritage', value: 'heritage' },
  { label: 'Wild', value: 'wild' },
  { label: 'Sand', value: 'sand' },
] as const;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((label, i) => ({
  label,
  value: String(i + 1),
}));

const seo = fields.object(
  {
    title: fields.text({ label: 'SEO title', validation: { length: { max: 60 } } }),
    description: fields.text({
      label: 'Meta description',
      multiline: true,
      validation: { length: { min: 120, max: 165 } },
    }),
    keyword: fields.text({ label: 'Target keyword' }),
  },
  { label: 'SEO' },
);

const faqs = fields.array(
  fields.object({ q: fields.text({ label: 'Question' }), a: fields.text({ label: 'Answer', multiline: true }) }),
  { label: 'FAQs', itemLabel: (p) => p.fields.q.value },
);

const workflow = {
  reviewed: fields.checkbox({ label: 'Reviewed by owner / local expert', defaultValue: false }),
  sample: fields.checkbox({
    label: 'Sample entry (template preview only — never published)',
    defaultValue: false,
  }),
};

const hero = (dir: string) => ({
  heroImage: fields.image({
    label: 'Hero image (≥ 2400px wide)',
    directory: `src/assets/images/${dir}`,
    publicPath: `../../assets/images/${dir}/`,
  }),
  heroAlt: fields.text({ label: 'Hero image alt text' }),
  tone: fields.select({
    label: 'Placeholder colour (used when there is no image)',
    options: TONES,
    defaultValue: 'ocean',
  }),
});

// Months are stored as numbers in content; Keystatic multiselect stores strings, so the schema coerces them.
const months = fields.multiselect({ label: 'Best months', options: MONTHS });

const body = fields.markdoc({ label: 'Body', extension: 'md' });

export default config({
  storage: import.meta.env.PROD ? { kind: 'github', repo: 'iamHarinda/paradisetravels_lk' } : { kind: 'local' },
  ui: { brand: { name: 'Paradise Travels' } },
  collections: {
    destinations: collection({
      label: 'Destinations',
      path: 'src/content/destinations/*',
      slugField: 'title',
      format: { contentField: 'body' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Name' } }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        region: fields.select({ label: 'Region', options: REGIONS, defaultValue: 'triangle' }),
        coords: fields.array(fields.number({ label: 'Value' }), {
          label: 'Coordinates [latitude, longitude]',
          validation: { length: { min: 2, max: 2 } },
        }),
        bestMonths: months,
        idealStay: fields.text({ label: 'Ideal stay' }),
        gettingThere: fields.text({ label: 'Getting there', multiline: true }),
        thingsToDo: fields.array(
          fields.object({ title: fields.text({ label: 'Title' }), tip: fields.text({ label: 'Tip' }) }),
          { label: 'Top things to do', itemLabel: (p) => p.fields.title.value },
        ),
        tips: fields.array(fields.text({ label: 'Tip' }), { label: 'Practical tips', itemLabel: (p) => p.value }),
        faqs,
        ...hero('destinations'),
        featured: fields.checkbox({ label: 'Show in menu', defaultValue: false }),
        order: fields.integer({ label: 'Order', defaultValue: 100 }),
        seo,
        ...workflow,
        body,
      },
    }),
    experiences: collection({
      label: 'Experiences',
      path: 'src/content/experiences/*',
      slugField: 'title',
      format: { contentField: 'body' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        bestMonths: months,
        destinations: fields.array(fields.relationship({ label: 'Destination', collection: 'destinations' }), {
          label: 'Destinations',
          itemLabel: (p) => p.value ?? '',
        }),
        highlights: fields.array(fields.text({ label: 'Highlight' }), {
          label: 'Highlights',
          itemLabel: (p) => p.value,
        }),
        faqs,
        ...hero('experiences'),
        order: fields.integer({ label: 'Order', defaultValue: 100 }),
        seo,
        ...workflow,
        body,
      },
    }),
    tours: collection({
      label: 'Tours',
      path: 'src/content/tours/*',
      slugField: 'title',
      format: { contentField: 'body' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        durationDays: fields.integer({ label: 'Duration (days)', validation: { min: 1 } }),
        styles: fields.multiselect({
          label: 'Styles',
          options: [
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
          ].map((v) => ({ label: v, value: v })),
        }),
        regions: fields.multiselect({ label: 'Regions', options: REGIONS }),
        destinations: fields.array(fields.relationship({ label: 'Destination', collection: 'destinations' }), {
          label: 'Route (in order)',
          itemLabel: (p) => p.value ?? '',
        }),
        priceFromUSD: fields.integer({ label: 'Price from (USD per person) — leave empty for "Price on request"' }),
        priceNote: fields.text({ label: 'Price note' }),
        bestMonths: months,
        days: fields.array(
          fields.object({
            day: fields.integer({ label: 'Day', validation: { min: 1 } }),
            title: fields.text({ label: 'Title' }),
            body: fields.text({ label: 'Description', multiline: true }),
            overnight: fields.text({ label: 'Overnight' }),
          }),
          { label: 'Days', itemLabel: (p) => `Day ${p.fields.day.value}: ${p.fields.title.value}` },
        ),
        inclusions: fields.array(fields.text({ label: 'Item' }), { label: 'Included', itemLabel: (p) => p.value }),
        exclusions: fields.array(fields.text({ label: 'Item' }), { label: 'Not included', itemLabel: (p) => p.value }),
        hotels: fields.array(fields.relationship({ label: 'Hotel', collection: 'hotels' }), {
          label: 'Hotels used',
          itemLabel: (p) => p.value ?? '',
        }),
        faqs,
        ...hero('tours'),
        featured: fields.checkbox({ label: 'Featured on home page', defaultValue: false }),
        order: fields.integer({ label: 'Order', defaultValue: 100 }),
        seo,
        ...workflow,
        body,
      },
    }),
    services: collection({
      label: 'Services',
      path: 'src/content/services/*',
      slugField: 'title',
      format: { contentField: 'body' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        short: fields.text({ label: 'Short line (cards)' }),
        icon: fields.text({ label: 'Icon name (see /styleguide)' }),
        audience: fields.text({ label: 'Who it is for' }),
        steps: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            body: fields.text({ label: 'Text', multiline: true }),
          }),
          { label: 'How it works', itemLabel: (p) => p.fields.title.value },
        ),
        faqs,
        order: fields.integer({ label: 'Order', defaultValue: 100 }),
        seo,
        ...workflow,
        body,
      },
    }),
    hotels: collection({
      label: 'Hotels',
      path: 'src/content/hotels/*',
      slugField: 'name',
      format: { data: 'json' },
      schema: {
        name: fields.slug({ name: { label: 'Hotel name' } }),
        area: fields.text({ label: 'Area' }),
        region: fields.select({ label: 'Region', options: REGIONS, defaultValue: 'south' }),
        destination: fields.relationship({ label: 'Nearest destination page', collection: 'destinations' }),
        stars: fields.integer({ label: 'Stars', validation: { min: 1, max: 5 } }),
        type: fields.array(fields.text({ label: 'Type' }), {
          label: 'Type (beach, boutique, …)',
          itemLabel: (p) => p.value,
        }),
        rateDisplay: fields.select({
          label: 'Rate display — check the hotel contract first (rate parity)',
          options: [
            { label: 'On request (no price shown)', value: 'on-request' },
            { label: 'Package price only', value: 'package' },
            { label: 'Public "from" price', value: 'public' },
          ],
          defaultValue: 'on-request',
        }),
        priceFromUSD: fields.integer({ label: 'Public price from (USD / night) — only if contract allows' }),
        packageOffer: fields.text({ label: 'Package offer text (package mode)' }),
        rooms: fields.array(
          fields.object({
            name: fields.text({ label: 'Room' }),
            occupancy: fields.integer({ label: 'Max guests', defaultValue: 2 }),
            mealPlans: fields.multiselect({
              label: 'Meal plans',
              options: ['RO', 'BB', 'HB', 'FB', 'AI'].map((v) => ({ label: v, value: v })),
            }),
          }),
          { label: 'Rooms', itemLabel: (p) => p.fields.name.value },
        ),
        deal: fields.object(
          { label: fields.text({ label: 'Deal (real offers only)' }), validTo: fields.date({ label: 'Valid until' }) },
          { label: 'Deal' },
        ),
        highlights: fields.array(fields.text({ label: 'Highlight' }), {
          label: 'Highlights',
          itemLabel: (p) => p.value,
        }),
        ...hero('hotels'),
        seo,
        ...workflow,
      },
    }),
    guides: collection({
      label: 'Travel guides',
      path: 'src/content/guides/*',
      slugField: 'title',
      format: { contentField: 'body' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        category: fields.select({
          label: 'Category',
          options: ['planning', 'visa', 'seasons', 'destinations', 'culture', 'transport', 'data'].map((v) => ({
            label: v,
            value: v,
          })),
          defaultValue: 'planning',
        }),
        pillar: fields.checkbox({ label: 'Pillar article', defaultValue: false }),
        published: fields.date({ label: 'Published', validation: { isRequired: true } }),
        updated: fields.date({ label: 'Updated' }),
        lastChecked: fields.date({ label: 'Facts last checked', validation: { isRequired: true } }),
        sources: fields.array(
          fields.object({ title: fields.text({ label: 'Title' }), url: fields.url({ label: 'URL' }) }),
          {
            label: 'Sources',
            itemLabel: (p) => p.fields.title.value,
          },
        ),
        author: fields.relationship({ label: 'Author', collection: 'team' }),
        relatedTours: fields.array(fields.relationship({ label: 'Tour', collection: 'tours' }), {
          label: 'Related tours',
          itemLabel: (p) => p.value ?? '',
        }),
        relatedDestinations: fields.array(fields.relationship({ label: 'Destination', collection: 'destinations' }), {
          label: 'Related destinations',
          itemLabel: (p) => p.value ?? '',
        }),
        relatedServices: fields.array(fields.relationship({ label: 'Service', collection: 'services' }), {
          label: 'Related services',
          itemLabel: (p) => p.value ?? '',
        }),
        ...hero('guides'),
        seo,
        ...workflow,
        body,
      },
    }),
    faqs: collection({
      label: 'FAQs',
      path: 'src/content/faqs/*',
      slugField: 'question',
      format: { data: 'json' },
      schema: {
        question: fields.slug({ name: { label: 'Question' } }),
        answer: fields.text({ label: 'Answer', multiline: true }),
        category: fields.select({
          label: 'Category',
          options: ['booking', 'travel', 'payments', 'services'].map((v) => ({ label: v, value: v })),
          defaultValue: 'booking',
        }),
        order: fields.integer({ label: 'Order', defaultValue: 100 }),
        ...workflow,
      },
    }),
    testimonials: collection({
      label: 'Reviews (real only, with permission)',
      path: 'src/content/testimonials/*',
      slugField: 'name',
      format: { data: 'json' },
      schema: {
        name: fields.slug({ name: { label: 'Reviewer name (as they allowed)' } }),
        country: fields.text({ label: 'Country' }),
        source: fields.select({
          label: 'Source',
          options: ['google', 'tripadvisor', 'facebook', 'email'].map((v) => ({ label: v, value: v })),
          defaultValue: 'google',
        }),
        url: fields.url({ label: 'Link to the original review' }),
        date: fields.date({ label: 'Review date', validation: { isRequired: true } }),
        rating: fields.integer({ label: 'Rating (1–5)', validation: { min: 1, max: 5 } }),
        text: fields.text({ label: 'Review text (do not edit wording)', multiline: true }),
        permission: fields.checkbox({ label: 'Reviewer gave permission to display', defaultValue: false }),
        ...workflow,
      },
    }),
    team: collection({
      label: 'Team',
      path: 'src/content/team/*',
      slugField: 'name',
      format: { data: 'json' },
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        role: fields.text({ label: 'Role' }),
        bio: fields.text({ label: 'Bio', multiline: true }),
        photo: fields.image({
          label: 'Photo',
          directory: 'src/assets/images/team',
          publicPath: '../../assets/images/team/',
        }),
        languages: fields.array(fields.text({ label: 'Language' }), { label: 'Languages', itemLabel: (p) => p.value }),
        order: fields.integer({ label: 'Order', defaultValue: 100 }),
        ...workflow,
      },
    }),
  },
});
