import { getImage } from 'astro:assets';
import { photo, type PhotoName } from './photos';

/**
 * 1200×630 JPEG share image cut from one of our photos — used for og:image so links shared on Naver Blog/Cafe,
 * KakaoTalk, Facebook and WhatsApp show a real photograph instead of the text-only default.
 */
export async function ogImage(name: PhotoName) {
  const img = await getImage({
    src: photo(name).image,
    width: 1200,
    height: 630,
    fit: 'cover',
    format: 'jpg',
    quality: 72,
  });
  return { image: img.src, imageAlt: photo(name).alt };
}
