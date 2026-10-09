/* Certifications: "Always learning." two-column layout. Big heading + count
   on the left, list on the right. The hovered / focused row becomes a green
   enamel plate (B2a "Porteño") showing issuer and date. Languages sit below, compact
   (education has its own section: js/sections/education.js). */
import { esc, rich } from '../utils.js';

export const styles = 'css/sections/certifications.css';

const EXT_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M7 17L17 7M8 7h9v9"/></svg>';

export default function render(el, ctx) {
  const { data, ui } = ctx;
  const certs = data.certifications || [];
  const langs = data.languages || [];

  el.innerHTML = `
    <div class="container">
      <div class="certs">
        <header class="certs__head">
          <p class="eyebrow" data-reveal>${esc(ui.certEyebrow)}</p>
          <h2 class="display" id="certifications-title" data-reveal style="--reveal-delay:60ms">${rich(ui.certTitle)}</h2>
          <p class="certs__count" data-reveal style="--reveal-delay:120ms">
            <strong>${String(certs.length).padStart(2, '0')}</strong>
            <span>${esc(ui.certList)}</span>
          </p>
        </header>

        <ul class="certs__list" role="list" data-reveal aria-label="${esc(ui.certList)}">
          ${certs.map((c, i) => `
            <li class="cert${c.url ? ' cert--link' : ''}"${c.url ? '' : ' tabindex="0"'}>
              <span class="cert__n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
              <span class="cert__name">${esc(c.name)}</span>
              <span class="cert__info"><span class="cert__issuer">${esc(c.issuer)}</span><span class="cert__date">${esc(c.date)}</span></span>
              ${c.url ? `<a class="cert__link" href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">${esc(ui.certView)}<span class="visually-hidden">: ${esc(c.name)} ${esc(ui.newTab)}</span>${EXT_ICON}</a>` : ''}
            </li>`).join('')}
        </ul>
      </div>

      ${langs.length ? `
      <div class="certs__extra">
        <section class="extra extra--langs" data-reveal aria-labelledby="langs-label">
          <h3 class="eyebrow" id="langs-label">${esc(ui.languagesLabel)}</h3>
          <ul class="langs" role="list">
            ${langs.map((l) => `<li class="chip"><strong>${esc(l.name)}</strong><span>${esc(l.level)}</span></li>`).join('')}
          </ul>
        </section>
      </div>` : ''}
    </div>`;

  /* Dim siblings while one row is active (hover or focus); CSS handles the rest. */
  const list = el.querySelector('.certs__list');
  const set = (on) => list.classList.toggle('has-active', on);
  const onIn = (e) => { if (e.target.closest('.cert')) set(true); };
  const onOut = () => set(false);
  list.addEventListener('pointerover', onIn);
  list.addEventListener('pointerleave', onOut);
  list.addEventListener('focusin', onIn);
  list.addEventListener('focusout', onOut);

  ctx.reveal(el);
  return () => {
    list.removeEventListener('pointerover', onIn);
    list.removeEventListener('pointerleave', onOut);
    list.removeEventListener('focusin', onIn);
    list.removeEventListener('focusout', onOut);
  };
}
