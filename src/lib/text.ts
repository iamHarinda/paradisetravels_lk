const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** Editorial headline accents: "Sri Lanka, *planned* end-to-end." → italic accent word. Returns safe HTML. */
export const accent = (title: string) => esc(title).replace(/\*([^*]+)\*/g, '<em class="accent">$1</em>');

/** Plain text version of an accented title (for aria-labels, <title> etc.). */
export const plain = (title: string) => title.replace(/\*/g, '');

/** "7.95°N 80.76°E" */
export const coordLabel = ([lat, lon]: [number, number]) => `${lat.toFixed(2)}°N ${lon.toFixed(2)}°E`;

/** Three-letter "airport-style" code for ticket cards: Sigiriya → SIG, Nuwara Eliya → NUW. */
export const placeCode = (name: string) =>
  name
    .replace(/[^A-Za-z]/g, '')
    .slice(0, 3)
    .toUpperCase();
