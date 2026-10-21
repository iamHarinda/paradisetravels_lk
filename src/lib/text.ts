const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/**
 * Editorial headline accents: "Sri Lanka, *planned* end-to-end." → italic accent word. Returns safe HTML.
 * A "|" marks a line break used only on phones, for headlines that would otherwise sit exactly on the edge of
 * fitting one line — those re-wrap when the web font swaps in and shift the page.
 */
export const accent = (title: string) =>
  esc(title)
    .replace(/\*([^*]+)\*/g, '<em class="accent">$1</em>')
    .replace(/\s*\|\s*/g, '<br class="sm:hidden" /> ');

/** Plain text version of an accented title (for aria-labels, <title> etc.). */
export const plain = (title: string) => title.replace(/\*/g, '').replace(/\s*\|\s*/g, ' ');

/** "7.95°N 80.76°E" */
export const coordLabel = ([lat, lon]: [number, number]) => `${lat.toFixed(2)}°N ${lon.toFixed(2)}°E`;

/** Three-letter "airport-style" code for ticket cards: Sigiriya → SIG, Nuwara Eliya → NUW. */
export const placeCode = (name: string) =>
  name
    .replace(/[^A-Za-z]/g, '')
    .slice(0, 3)
    .toUpperCase();

/** Lower-case a title for use mid-sentence, keeping acronyms: "Conferences (MICE)" → "conferences (MICE)". */
export const inSentence = (title: string) =>
  title.replace(/[A-Za-z]+/g, (w) => (/[A-Z].*[A-Z]/.test(w) ? w : w.toLowerCase()));
