/* Contact: email (mailto) and LinkedIn.
   B2a "Porteño": the email is a painted shop fascia on a green enamel plate
   (rivets, gold inner line, chipped corner); the city sits on a colectivo
   destination sign. */
import { esc, rich } from '../utils.js';

export const styles = 'css/sections/contact.css';


const ICON = {
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4V21H3zM9.5 9.75h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.09V21h-4v-5.1c0-1.22-.02-2.78-1.7-2.78-1.7 0-1.96 1.33-1.96 2.69V21h-4z"/></svg>',
  dl: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7 11l5 5 5-5M4 20h16"/></svg>'
};

export default function render(el, ctx) {
  const { data, meta, ui } = ctx;
  const c = data.contact || {};
  const email = c.email || meta.email;
  const linkedin = c.linkedin || meta.linkedin;
  const city = c.location || '';

  el.innerHTML = `
    <div class="container contact__inner">
      <header class="section-head">
        <p class="eyebrow" data-reveal>${esc(ui.contactEyebrow)}</p>
        <h2 class="display" id="contact-title" data-reveal style="--reveal-delay:60ms">${rich(ui.contactTitle)}</h2>
        <p data-reveal style="--reveal-delay:120ms">${esc(ui.contactIntro)}</p>
      </header>

      <a class="contact__mail" href="mailto:${esc(email)}" data-reveal style="--reveal-delay:160ms">
        <span class="contact__rivets" aria-hidden="true"></span>
        <span class="contact__mail-label">${esc(c.cta || ui.contactEmail)}</span>
        <span class="contact__mail-addr">${esc(email).replace('@', '@<wbr>')}</span>
        <span class="contact__mail-arrow" aria-hidden="true">&#8599;</span>
      </a>

      <div class="contact__row" data-reveal style="--reveal-delay:220ms">
        <div class="contact__actions">
          <a class="btn" href="mailto:${esc(email)}">${ICON.mail}${esc(ui.contactEmail)}</a>
          <a class="btn btn--ghost" href="${esc(linkedin)}" target="_blank" rel="noopener noreferrer">${ICON.link}${esc(ui.contactLinkedin)}<span class="visually-hidden"> ${esc(ui.newTab)}</span></a>
        </div>
        ${city ? `<p class="contact__base"><b>${esc(ui.contactBase || '')}</b><i aria-hidden="true"></i><span>${esc(city)}</span></p>` : ''}
      </div>
    </div>`;

  ctx.reveal(el);
  return () => {};
}
