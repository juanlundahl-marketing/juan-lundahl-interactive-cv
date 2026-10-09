/* Work: "Things I've built." timeline of expandable role cards.
   B2a "Porteño": each card header is a painted shop fascia (green enamel,
   gold inner line, company name in cream with a gold drop shadow). The
   current role carries a painted round seal and is open by default.
   E-Planning shows its deliverables as sub-cards. */
import { esc, rich, modeIcon } from '../utils.js';

export const styles = 'css/sections/work.css';

const isCurrent = (job) => /present|actualidad|actual\b|heute/i.test(job.period || '');

/* Small original sign-painter flick beside the company name (decorative). */
const FLICK = (flip) => `<svg class="job__flick${flip ? ' job__flick--l' : ''}" viewBox="0 0 44 22" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M42 11 H18 C10 11 4 6 8 3 C11 1 14 4 12 6"/><path d="M30 11 C26 17 18 19 16 15"/></g><path d="M22 11 C25 6 30 6 32 11 C30 15 25 15 22 11 Z" fill="currentColor" fill-opacity=".35" stroke="currentColor" stroke-width=".9"/></svg>`;

export default function render(el, ctx) {
  const { data, ui } = ctx;
  const jobs = data.work || [];

  const card = (job, i) => {
    const current = isCurrent(job);
    const bullets = job.bullets || [];
    const projects = job.projects || [];
    const hasDetails = bullets.length > 0 || projects.length > 0;
    const pid = `work-panel-${i}`;
    return `
      <li class="job${current ? ' job--current' : ''}" data-reveal style="--reveal-delay:${Math.min(i, 4) * 60}ms">
        <span class="job__dot" aria-hidden="true"></span>
        <article class="job__card">
          <header class="job__head">
            <h3 class="job__company">${FLICK(true)}<span>${esc(job.company)}</span>${FLICK(false)}</h3>
            ${current ? `<span class="job__badge"><i aria-hidden="true"></i>${esc(ui.workCurrent)}</span>` : ''}
          </header>
          <div class="job__body">
            <p class="job__role">${esc(job.role)}</p>
            <div class="job__meta">
              <span class="job__period">${esc(job.period)}</span>
              ${job.mode && ui.modes && ui.modes[job.mode] ? `<span class="mode-badge mode-badge--${esc(job.mode)}">${modeIcon(job.mode)}${esc(ui.modes[job.mode])}</span>` : ''}
            </div>
            <p class="job__summary">${esc(job.summary)}</p>
            ${hasDetails ? `
            <button class="job__toggle" type="button" aria-expanded="${current}" aria-controls="${pid}"
                    data-more="${esc(ui.workDetails)}" data-less="${esc(ui.workHide)}">
              <span class="job__toggle-label">${esc(current ? ui.workHide : ui.workDetails)}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <div class="job__panel${current ? ' is-open' : ''}" id="${pid}" role="region" aria-label="${esc(job.company)}">
              <div class="job__panel-inner">
                ${bullets.length ? `<ul class="job__bullets" role="list">${bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
                ${projects.length ? `
                <div class="job__deliverables">
                  <p class="job__deliv-label">${esc(ui.workDeliverables)}</p>
                  <ul class="job__subcards" role="list">
                    ${projects.map((p, n) => `<li class="subcard"><span class="subcard__n" aria-hidden="true">${String(n + 1).padStart(2, '0')}</span><span class="subcard__t">${esc(p)}</span></li>`).join('')}
                  </ul>
                </div>` : ''}
              </div>
            </div>` : ''}
          </div>
        </article>
      </li>`;
  };

  el.innerHTML = `
    <div class="container">
      <header class="section-head">
        <p class="eyebrow" data-reveal>${esc(ui.workEyebrow)}</p>
        <h2 class="display" id="work-title" data-reveal style="--reveal-delay:60ms">${rich(ui.workTitle)}</h2>
        <p data-reveal style="--reveal-delay:120ms">${esc(ui.workIntro)}</p>
      </header>
      <ol class="timeline" role="list">${jobs.map(card).join('')}</ol>
    </div>`;

  const onClick = (e) => {
    const btn = e.target.closest('.job__toggle');
    if (!btn) return;
    const open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(open));
    btn.querySelector('.job__toggle-label').textContent = open ? btn.dataset.less : btn.dataset.more;
    document.getElementById(btn.getAttribute('aria-controls')).classList.toggle('is-open', open);
  };
  el.addEventListener('click', onClick);

  ctx.reveal(el);
  return () => el.removeEventListener('click', onClick);
}
