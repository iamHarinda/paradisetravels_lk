// Progressive enhancement for lead forms ([data-form]). Without JS the forms post normally and the server
// redirects to /thank-you; with JS we submit via fetch, show inline errors and keep the page.

// Remember the landing page + UTM parameters for the session (docs/10 §7 reporting).
const TRACK = ['utm_source', 'utm_medium', 'utm_campaign'] as const;
function tracking() {
  let stored: Record<string, string> = {};
  try {
    stored = JSON.parse(sessionStorage.getItem('pt-tracking') ?? '{}');
  } catch {
    /* storage unavailable */
  }
  const params = new URLSearchParams(location.search);
  if (!stored.landing) stored.landing = location.pathname;
  for (const k of TRACK) if (params.get(k)) stored[k] = params.get(k)!;
  try {
    sessionStorage.setItem('pt-tracking', JSON.stringify(stored));
  } catch {
    /* ignore */
  }
  return stored;
}

let turnstileLoading = false;
function loadTurnstile() {
  if (turnstileLoading || !document.querySelector('.cf-turnstile')) return;
  turnstileLoading = true;
  const s = document.createElement('script');
  s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
  s.async = true;
  document.head.append(s);
}

export function enhanceForm(form: HTMLFormElement) {
  const t = tracking();
  const set = (name: string, value?: string) => {
    const input = form.elements.namedItem(name) as HTMLInputElement | null;
    if (input && value) input.value = value;
  };
  set('page', `${location.pathname} (landing: ${t.landing})`);
  for (const k of TRACK) set(k, t[k]);

  // Load Turnstile only once the visitor starts using a form (facade — no third-party script on page load).
  form.addEventListener('focusin', loadTurnstile, { once: true });

  const message = form.querySelector<HTMLElement>('[data-form-message]');
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
    form.querySelectorAll('.field-error').forEach((el) => el.remove());
    if (message) message.textContent = '';
    if (submit) {
      submit.disabled = true;
      submit.dataset.label = submit.textContent ?? '';
      submit.textContent = 'Sending…';
    }
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      const data = (await res.json()) as {
        ok: boolean;
        redirect?: string;
        message?: string;
        fieldErrors?: Record<string, string>;
      };
      if (data.ok && data.redirect) {
        location.assign(data.redirect);
        return;
      }
      if (message) message.textContent = data.message ?? 'Something went wrong. Please try again.';
      let first: HTMLElement | null = null;
      for (const [name, err] of Object.entries(data.fieldErrors ?? {})) {
        const field = form.querySelector<HTMLElement>(`[name="${name}"]`);
        if (!field) continue;
        field.setAttribute('aria-invalid', 'true');
        const p = document.createElement('p');
        p.className = 'field-error';
        p.id = `${field.id || name}-error`;
        p.textContent = err;
        field.setAttribute('aria-describedby', p.id);
        (field.closest('div') ?? field).append(p);
        first ??= field;
      }
      first?.focus();
      (window as unknown as { turnstile?: { reset: () => void } }).turnstile?.reset();
    } catch {
      if (message) message.textContent = 'Network error — please check your connection, or message us on WhatsApp.';
    } finally {
      if (submit) {
        submit.disabled = false;
        submit.textContent = submit.dataset.label ?? 'Send';
      }
    }
  });
}

document.querySelectorAll<HTMLFormElement>('form[data-form]').forEach(enhanceForm);
