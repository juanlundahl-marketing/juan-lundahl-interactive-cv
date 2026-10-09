/* Education: "From journalism to the funnel."
   B2a "Porteño":
   (a) the university programme as a framed plate (filete corners from the
       shared sprite, gold double rule): programme, institution and years,
       like a plain CV line, plus a ribbon medal for the prize won during
       that time (content.json education[].award -> achievements.awards,
       matched by name, so ADEPA keeps living in Achievements too);
   (b) a "libreta" (ruled study log) timeline, oldest first, with each course
       as a matrícula card dealt in on scroll. A course with modules gets a
       small school-timetable grid: one bar per module across its months.
   Dates come from content.json as "YYYY" or "YYYY-MM"; month names are
   localized from ui.months. Reduced motion: everything static. */
import { esc, rich } from '../utils.js';

export const styles = 'css/sections/education.css';

const parse = (s) => {
  const [y, m] = String(s || '').split('-').map(Number);
  return { y, m: m || null, raw: String(s || '') };
};
const monthIndex = (d) => d.y * 12 + ((d.m || 1) - 1);

/* Original prize medal: rosette + two ribbon tails. Fixed enamel colours (same in both themes). */
const medal = (label) => `
  <svg class="medal" viewBox="0 0 96 120" aria-hidden="true" focusable="false">
    <path d="M30 58 L18 116 L31 106 L40 118 L48 64 Z" fill="#7A2430"/>
    <path d="M66 58 L78 116 L65 106 L56 118 L48 64 Z" fill="#2D5F8A"/>
    <path d="M36 70 L28 108 M60 70 L68 108" stroke="#F3EBDA" stroke-opacity=".55" stroke-width="1.4" fill="none"/>
    <g transform="translate(48 44)">
      ${Array.from({ length: 16 }, (_, i) => `<circle r="7" cx="${(33 * Math.cos((i * Math.PI) / 8)).toFixed(2)}" cy="${(33 * Math.sin((i * Math.PI) / 8)).toFixed(2)}" fill="#C08A2E"/>`).join('')}
      <circle r="33" fill="#C08A2E"/>
      <circle r="27" fill="#EBC66E" stroke="#8A6424" stroke-width="1.5"/>
      <circle r="22.5" fill="none" stroke="#8A6424" stroke-width=".9" stroke-dasharray="2 2.6"/>
      <text y="7.5" text-anchor="middle" font-family="Sansita, Georgia, serif" font-weight="900" font-size="${label.length > 2 ? 17 : 21}" fill="#1C1B19">${esc(label)}</text>
    </g>
  </svg>`;

export default function render(el, ctx) {
  const { data, ui } = ctx;
  const list = Array.isArray(data.education) ? data.education : [];
  if (!list.length) { el.innerHTML = ''; return () => {}; }

  const months = ui.months || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fmt = (d) => (d.m ? `${months[d.m - 1]} ${d.y}` : `${d.y}`);
  const time = (s) => { const d = parse(s); return `<time datetime="${esc(d.raw)}">${esc(fmt(d))}</time>`; };
  const span = (a, b) => `${time(a)} – ${time(b)}`;

  const uni = list.find((e) => e.featured) || null;
  const awards = (data.achievements && data.achievements.awards) || [];
  const award = uni && uni.award
    ? awards.find((a) => new RegExp(uni.award, 'i').test(`${a.title} ${a.issuer}`)) || null
    : null;

  const sorted = [...list].sort((a, b) => monthIndex(parse(a.start)) - monthIndex(parse(b.start)));
  const first = sorted.length ? parse(sorted[0].start).y : '';
  const last = sorted.length ? Math.max(...sorted.map((e) => parse(e.end || e.start).y)) : '';

  /* Mini timetable for a course with dated modules */
  const timetable = (e) => {
    const mods = (e.details || []).filter((d) => d && typeof d === 'object' && d.start && d.end);
    if (!mods.length) return '';
    const s0 = monthIndex(parse(e.start));
    const n = monthIndex(parse(e.end)) - s0 + 1;
    const cols = Array.from({ length: n }, (_, i) => months[(s0 + i) % 12]);
    return `
      <div class="tt" style="--cols:${n}">
        <p class="tt__label">${esc(ui.eduModules)}</p>
        <div class="tt__head" aria-hidden="true">${cols.map((m) => `<span>${esc(m)}</span>`).join('')}</div>
        <ul class="tt__rows" role="list">
          ${mods.map((m, i) => {
            const a = monthIndex(parse(m.start)) - s0;
            const b = monthIndex(parse(m.end)) - s0;
            return `
            <li class="tt__row" style="--from:${a + 1};--to:${b + 2};--i:${i}">
              <span class="tt__name">${esc(m.name)}</span>
              <span class="tt__when">${span(m.start, m.end)}</span>
              <span class="tt__track" aria-hidden="true"><i class="tt__bar"></i></span>
            </li>`;
          }).join('')}
        </ul>
      </div>`;
  };

  const card = (e, i) => {
    const isUni = e === uni;
    return `
    <li class="tl__item${isUni ? ' tl__item--uni' : ''}" data-reveal style="--reveal-delay:${Math.min(i, 3) * 90}ms">
      <span class="tl__year" aria-hidden="true">${esc(parse(e.start).y)}</span>
      <div class="mat">
        <p class="mat__when">${span(e.start, e.end || e.start)}</p>
        <h4 class="mat__title">${esc(e.program)}</h4>
        <p class="mat__inst">${esc(e.institution)}</p>
        ${e.note ? `<p class="mat__note">${esc(e.note)}</p>` : ''}
        ${isUni ? '' : timetable(e)}
      </div>
    </li>`;
  };

  const uniPlate = uni ? `
    <article class="uni" data-reveal aria-labelledby="edu-uni">
      <div class="uni__plate">
        <svg class="uni__corner uni__corner--tl" aria-hidden="true" focusable="false"><use href="#f-corner"/></svg>
        <svg class="uni__corner uni__corner--tr" aria-hidden="true" focusable="false"><use href="#f-corner"/></svg>
        <svg class="uni__corner uni__corner--bl" aria-hidden="true" focusable="false"><use href="#f-corner"/></svg>
        <svg class="uni__corner uni__corner--br" aria-hidden="true" focusable="false"><use href="#f-corner"/></svg>
        <p class="uni__kicker">${esc(ui.eduUniLabel)}</p>
        <p class="uni__inst">${esc(uni.institution)}</p>
        <svg class="filete uni__rule" aria-hidden="true" focusable="false"><use href="#f-rule"/></svg>
        <h3 class="uni__program" id="edu-uni">${esc(uni.program)}</h3>
        <p class="uni__years">${span(uni.start, uni.end)}</p>
        ${uni.note ? `<p class="uni__note">${esc(uni.note)}</p>` : ''}
        ${award ? `
        <div class="uni__award">
          ${medal(ui.eduMedal || '1')}
          <p class="uni__award-text">
            <span class="uni__award-tag">${esc(ui.eduAward)}</span>
            <strong>${esc(award.title)}</strong>
            <span class="uni__award-issuer">${esc(award.issuer)}</span>
            ${award.context ? `<span class="uni__award-context">${esc(award.context)}</span>` : ''}
          </p>
        </div>` : ''}
      </div>
    </article>` : '';

  el.innerHTML = `
    <div class="container">
      <header class="section-head">
        <p class="eyebrow" data-reveal>${esc(ui.eduEyebrow)}</p>
        <h2 class="display" id="education-title" data-reveal style="--reveal-delay:60ms">${rich(ui.eduTitle)}</h2>
        <p data-reveal style="--reveal-delay:120ms">${esc(ui.eduIntro)}</p>
      </header>

      <div class="edu-grid">
        ${uniPlate}
        <div class="libreta">
          <h3 class="libreta__title" id="edu-log" data-reveal>
            <span>${esc(ui.eduLog)}</span>
            <span class="libreta__span" aria-hidden="true">${esc(first)} → ${esc(last)}</span>
          </h3>
          <ol class="tl" role="list" aria-label="${esc(ui.eduLogAria)}">
            ${sorted.map(card).join('')}
          </ol>
        </div>
      </div>
    </div>`;

  ctx.reveal(el);
  return () => {};
}
