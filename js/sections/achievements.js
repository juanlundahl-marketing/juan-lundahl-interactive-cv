/* Achievements: "Proud moments." horizontal scroll-snap cards with animated
   counters. B2a "Porteño": counters are café pizarras (chalkboards), the
   Markets card is a colectivo route panel ending at Argentina (cabecera).
   The ADEPA counter card carries the award title and issuer. */
import { esc, rich, countUp, onceVisible, prefersReducedMotion, marketChips } from '../utils.js';

const CHEV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 9l6 6 6-6"/></svg>';
const EXT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M7 17L17 7M8 7h9v9"/></svg>';

export const styles = 'css/sections/achievements.css';

export default function render(el, ctx) {
  const { data, ui } = ctx;
  const ach = data.achievements || {};
  const counters = ach.counters || [];
  const awards = ach.awards || [];
  const used = new Set();

  const cards = counters.map((c) => {
    const isAdepa = /adepa/i.test(c.label);
    let award = null;
    if (isAdepa) {
      award = awards.find((a) => /adepa/i.test(`${a.title} ${a.issuer}`)) || null;
      if (award) used.add(award);
    }
    return { ...c, award, featured: isAdepa };
  });
  // Any other award becomes its own text card
  awards.filter((a) => !used.has(a)).forEach((a) => cards.push({ award: a, featured: true, text: true }));

  const certs = data.certifications || [];
  const panelId = 'ach-certs-panel';

  const card = (c, i) => {
    if (c.type === 'markets') {
      return `
    <li class="ach ach--markets" tabindex="-1" style="--i:${i}">
      <div class="route__hd">
        <span class="route__line" aria-hidden="true">${esc(c.value)}</span>
        <p class="ach__label">${esc(c.label)}</p>
      </div>
      <div class="ach__markets">
        ${marketChips(ui, { className: 'mkt' })}
        <p class="ach__home"><span class="ach__home-pin" aria-hidden="true"></span>${esc(ui.achMarketsHome)}</p>
        <ul class="ach__legend" role="list">
          <li>${esc(ui.achMarketsNA)}</li>
          <li>${esc(ui.achMarketsEMEA)}</li>
          <li>${esc(ui.achMarketsLATAM)}</li>
        </ul>
      </div>
    </li>`;
    }
    const isCerts = c.type === 'certs' && certs.length;
    const val = isCerts ? certs.length : c.value;
    return `
    <li class="ach${c.featured ? ' ach--featured' : ''}${isCerts ? ' ach--certs' : ''}" tabindex="-1" style="--i:${i}">
      ${c.text ? '' : `<p class="ach__num" aria-hidden="true"><span data-count="${val}" data-suffix="${esc(c.suffix || '')}">0${esc(c.suffix || '')}</span></p>`}
      ${c.text ? `<p class="ach__tag">${esc(ui.achAward)}</p>` : `<p class="ach__label"><span class="visually-hidden">${val}${esc(c.suffix || '')} </span>${esc(c.label)}</p>`}
      ${c.award ? `<div class="ach__award"><p class="ach__award-title">${esc(c.award.title)}</p><p class="ach__award-issuer">${esc(c.award.issuer)}</p>${c.award.context ? `<p class="ach__award-context">${esc(c.award.context)}</p>` : ''}</div>` : ''}
      ${isCerts ? `<button class="ach__toggle" type="button" aria-expanded="false" aria-controls="${panelId}" data-show="${esc(ui.achShowCerts)}" data-hide="${esc(ui.achHideCerts)}"><span class="ach__toggle-text">${esc(ui.achShowCerts)}</span>${CHEV}</button>` : ''}
    </li>`;
  };

  const certPanel = certs.length ? `
    <div class="ach-certs" id="${panelId}" role="region" aria-label="${esc(ui.certList)}">
      <div class="ach-certs__clip">
        <div class="container">
          <ol class="ach-certs__list">
            ${certs.map((c) => `
              <li class="ach-cert">
                <span class="ach-cert__name">${esc(c.name)}</span>
                <span class="ach-cert__meta">${esc(c.issuer)} · ${esc(c.date)}</span>
                ${c.url ? `<a class="ach-cert__link" href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">${esc(ui.certView)}<span class="visually-hidden">: ${esc(c.name)} ${esc(ui.newTab)}</span>${EXT}</a>` : ''}
              </li>`).join('')}
          </ol>
        </div>
      </div>
    </div>` : '';

  el.innerHTML = `
    <div class="container">
      <header class="section-head ach-head">
        <p class="eyebrow" data-reveal>${esc(ui.achEyebrow)}</p>
        <h2 class="display" id="achievements-title" data-reveal style="--reveal-delay:60ms">${rich(ui.achTitle)}</h2>
      </header>
    </div>
    <div class="ach-wrap" data-reveal>
      <ul class="ach-strip" role="list" tabindex="0" aria-label="${esc(ui.achEyebrow)}">
        ${cards.map(card).join('')}
      </ul>
    </div>
    ${certPanel}
    <div class="container ach-ctrl">
      <p class="ach-hint">${esc(ui.achHint)}</p>
      <div class="ach-btns">
        <button class="icon-btn ach-btn" type="button" data-dir="-1" aria-label="${esc(ui.achPrev)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button>
        <button class="icon-btn ach-btn" type="button" data-dir="1" aria-label="${esc(ui.achNext)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button>
      </div>
    </div>`;

  const strip = el.querySelector('.ach-strip');
  const reduced = prefersReducedMotion();

  const onBtn = (e) => {
    const b = e.target.closest('[data-dir]');
    if (!b) return;
    const step = (strip.querySelector('.ach')?.offsetWidth || 280) + 16;
    strip.scrollBy({ left: Number(b.dataset.dir) * step, behavior: reduced ? 'auto' : 'smooth' });
  };
  el.querySelector('.ach-ctrl').addEventListener('click', onBtn);

  const onKey = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const step = (strip.querySelector('.ach')?.offsetWidth || 280) + 16;
    strip.scrollBy({ left: (e.key === 'ArrowRight' ? 1 : -1) * step, behavior: reduced ? 'auto' : 'smooth' });
  };
  strip.addEventListener('keydown', onKey);

  const toggle = el.querySelector('.ach__toggle');
  const panel = el.querySelector('.ach-certs');
  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.ach__toggle-text').textContent = open ? toggle.dataset.hide : toggle.dataset.show;
    panel.classList.toggle('is-open', open);
    if ('inert' in panel) panel.inert = !open;
    if (open && !reduced) setTimeout(() => panel.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 120);
  };
  const onToggle = () => setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  if (toggle && panel) {
    setOpen(false);
    toggle.addEventListener('click', onToggle);
  }

  const stop = onceVisible(strip, () => {
    strip.querySelectorAll('[data-count]').forEach((n, i) => {
      setTimeout(() => countUp(n, Number(n.dataset.count), { suffix: n.dataset.suffix || '', duration: 1500 }), reduced ? 0 : i * 120);
    });
  }, 0.25);

  ctx.reveal(el);
  return () => {
    stop();
    strip.removeEventListener('keydown', onKey);
    if (toggle) toggle.removeEventListener('click', onToggle);
  };
}
