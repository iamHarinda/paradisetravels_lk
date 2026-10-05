import type { ImageMetadata } from 'astro';
import credits from '../data/photo-credits.json';

// Licensed photos (Wikimedia Commons — see src/data/photo-credits.json and /photo-credits).
// Replace with the owner's own photography over time (docs/04 §8).
const files = import.meta.glob<{ default: ImageMetadata }>('../assets/images/photos/*.jpg', { eager: true });

export type PhotoName = keyof typeof credits;

export function photo(name: PhotoName) {
  const file = files[`../assets/images/photos/${name}.jpg`];
  if (!file) throw new Error(`Missing photo: ${name}`);
  return { image: file.default, alt: credits[name].alt };
}

export const PHOTO_CREDITS = credits;
