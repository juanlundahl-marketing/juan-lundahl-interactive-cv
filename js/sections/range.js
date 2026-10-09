/* Range: "Many industries. One method."
   (a) industries I have worked in, each tied to real roles,
   (b) ways of working (on-site / remote / hybrid) with the companies under each,
   (c) "How I work": cross-team collaboration,
   (d) a LinkedIn recommendation, quoted verbatim. */
import { esc, rich, modeIcon } from '../utils.js';

export const styles = 'css/sections/range.css';

const EXT_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M7 17L17 7M8 7h9v9"/></svg>';

export default function render(el, ctx) {
  const { data, ui } = ctx;
  const range = data.range || {};
  const industries = range.industries || [];
  const modes = range.modes || [];
  const collab = range.collab || {};
  const items = collab.items || [];
  const rec = data.recommendation || null;
  const pad = (n) => String(n).padStart(2, '0');

  const industryCard = (ind, i) => `
    <li class="ind" data-reveal style="--reveal-delay:${(i % 3) * 70}ms">
      <span class="ind__n" aria-hidden="true">${pad(i + 1)}</span>
      <h4 class="ind__name">${esc(ind.name)}</h4>
      <p class="ind__text">${esc(ind.text)}</p>
      <ul class="ind__where" role="list" aria-label="${esc(ui.rangeWhere)}">
        ${(ind.where || []).map((w) => `<li class="chip">${esc(w)}</li>`).join('')}
      </ul>
    </li>`;

  const modeCol = (m, i) => `
    <li class="mode mode--${esc(m.id)}" data-reveal style="--reveal-delay:${i * 80}ms">
      <span class="mode__rivets" aria-hidden="true"></span>
      <span class="mode__icon">${modeIcon(m.id)}</span>
      <h4 class="mode__name">${esc((ui.modes && ui.modes[m.id]) || m.id)}</h4>
      <ul class="mode__list" role="list">
        ${(m.companies || []).map((c) => `<li>${esc(c.name)}${c.note ? ` <span class="mode__note">${esc(c.note)}</span>` : ''}</li>`).join('')}
      </ul>
    </li>`;

  const collabItem = (it, i) => `
    <li class="pair" data-reveal style="--reveal-delay:${i * 80}ms">
      <p class="pair__label"><span>Marketing</span><i aria-hidden="true">+</i><strong>${esc(it.team)}</strong></p>
      <p class="pair__text">${esc(it.text)}</p>
    </li>`;

  const recBlock = rec ? `
    <figure class="rec" data-reveal aria-label="${esc(ui.recLabel)}">
      <p class="rec__label">${esc(ui.recLabel)}</p>
      <blockquote class="rec__quote" lang="en">
        <p>${esc(rec.quote)}</p>
      </blockquote>
      ${rec.translation ? `
      <div class="rec__tr" lang="${esc(ctx.lang)}" role="group" aria-label="${esc(ui.recTranslationAria)}">
        <p class="rec__tr-label">${esc(ui.recTranslation)}</p>
        <p>${esc(rec.translation)}</p>
      </div>` : ''}
      <figcaption class="rec__by">
        <div>
          <p class="rec__name">${esc(rec.author)}</p>
          <p class="rec__role" lang="en">${esc(rec.role)}</p>
          <p class="rec__ctx">${esc(rec.context)}</p>
        </div>
        ${rec.url ? `<a class="btn btn--ghost rec__link" href="${esc(rec.url)}" target="_blank" rel="noopener noreferrer">${esc(ui.recSeeIt)}<span class="visually-hidden"> ${esc(ui.newTab)}</span>${EXT_ICON}</a>` : ''}
      </figcaption>
    </figure>` : '';

  el.innerHTML = `
    <div class="container">
      <header class="section-head">
        <p class="eyebrow" data-reveal>${esc(ui.rangeEyebrow)}</p>
        <h2 class="display" id="range-title" data-reveal style="--reveal-delay:60ms">${rich(ui.rangeTitle)}</h2>
        <p data-reveal style="--reveal-delay:120ms">${esc(ui.rangeIntro)}</p>
      </header>

      ${industries.length ? `
      <div class="range__block">
        <h3 class="range__sub" data-reveal><span class="range__line" aria-hidden="true">A</span><span>${esc(ui.rangeIndustries)}</span></h3>
        <ul class="ind-grid" role="list">${industries.map(industryCard).join('')}</ul>
      </div>` : ''}

      ${modes.length ? `
      <div class="range__block">
        <h3 class="range__sub" data-reveal><span class="range__line" aria-hidden="true">B</span><span>${esc(ui.rangeModes)}</span></h3>
        <ul class="modes" role="list">${modes.map(modeCol).join('')}</ul>
        ${range.modesNote ? `<p class="modes__note" data-reveal>${esc(range.modesNote)}</p>` : ''}
      </div>` : ''}

      ${items.length ? `
      <div class="range__block">
        <h3 class="range__sub" data-reveal><span class="range__line" aria-hidden="true">C</span><span>${esc(ui.rangeCollab)}</span></h3>
        ${collab.intro ? `<p class="collab__intro" data-reveal>${esc(collab.intro)}</p>` : ''}
        <ul class="pairs" role="list">${items.map(collabItem).join('')}</ul>
      </div>` : ''}

      ${recBlock}
    </div>`;

  ctx.reveal(el);
  return () => {};
}
