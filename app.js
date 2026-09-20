const menu = document.querySelector('.menu');
const nav = document.querySelector('#nav-links');
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!open));
  nav?.classList.toggle('open', !open);
});
nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menu?.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
}));
document.querySelector('#year').textContent = new Date().getFullYear();

const form = document.querySelector('#lead-form');
const status = document.querySelector('#form-status');
fetch('/api/public-config').then((response) => response.ok ? response.json() : null).then((config) => {
  if (config?.bookingUrl) {
    document.querySelectorAll('[data-booking-link]').forEach((link) => {
      link.href = config.bookingUrl;
      link.target = '_blank';
      link.rel = 'noopener';
      link.setAttribute('aria-label', 'Abrir calendario seguro para agendar consulta de $1,000');
    });
  }
  if (config?.turnstileSiteKey) {
    const slot = document.querySelector('#turnstile-slot');
    slot.className = 'cf-turnstile'; slot.dataset.sitekey = config.turnstileSiteKey; slot.dataset.theme = 'light';
    const script = document.createElement('script'); script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'; script.async = true; script.defer = true;
    document.head.append(script);
  }
}).catch(() => {});
form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true; status.textContent = 'Enviando solicitud…'; status.className = 'form-status';
  const data = Object.fromEntries(new FormData(form)); data.consent = form.elements.consent.checked;
  data.turnstile = data['cf-turnstile-response'] || '';
  const params = new URLSearchParams(location.search);
  data.source = ['utm_source','utm_medium','utm_campaign'].map((key) => params.get(key)).filter(Boolean).join(' / ').slice(0, 120);
  try {
    const response = await fetch('/api/lead', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'No se pudo enviar');
    status.textContent = result.message; status.className = 'form-status success'; form.reset();
  } catch (error) {
    status.textContent = `${error.message}. También puedes llamar o escribir por WhatsApp al 871 385 2579.`; status.className = 'form-status error';
  } finally { button.disabled = false; if (window.turnstile) window.turnstile.reset(); }
});
