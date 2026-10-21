// Site-wide progressive enhancement, kept tiny (docs/09 §4 — JS budget ≤ 60 KB).
import { track } from '../lib/analytics';
document.documentElement.classList.add('js');

// Reveal on scroll (docs/04 §6): fade + rise, stagger 60ms within a batch.
const reveal = new IntersectionObserver(
  (entries) => {
    let i = 0;
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const el = entry.target as HTMLElement;
      el.style.transitionDelay = `${Math.min(i++, 5) * 60}ms`;
      el.classList.add('is-visible');
      reveal.unobserve(el);
    }
  },
  { rootMargin: '0px 0px -6% 0px' },
);
document.querySelectorAll('.reveal').forEach((el) => reveal.observe(el));

// Conversion click events (docs/06 §8) → GA4 via the consent-managed gtag queue (src/lib/analytics.ts).
document.addEventListener('click', (e) => {
  const el = (e.target as Element).closest<HTMLElement>('[data-track]');
  if (!el) return;
  track('contact_click', { method: el.dataset.track, page_path: location.pathname });
});
