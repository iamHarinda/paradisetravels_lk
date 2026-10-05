import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content';
import { SITE_ENV } from 'astro:env/server';

type Key = CollectionKey;

/** Production builds never include `sample: true` placeholder entries. */
export async function getEntries<C extends Key>(collection: C): Promise<CollectionEntry<C>[]> {
  const all = (await getCollection(collection)) as CollectionEntry<C>[];
  return all.filter((entry) => SITE_ENV !== 'production' || !(entry.data as { sample?: boolean }).sample);
}

export function byOrder<T extends { data: { order?: number; title?: string } }>(a: T, b: T) {
  return (a.data.order ?? 100) - (b.data.order ?? 100) || (a.data.title ?? '').localeCompare(b.data.title ?? '');
}
