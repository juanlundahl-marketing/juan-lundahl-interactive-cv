/* Education: "From journalism to the funnel."
   B2a "Porteño": a "libreta" (ruled study log) timeline, oldest first. Every
   study is an equal matrícula card dealt in on scroll: dates as a stamp,
   the programme as the title, the institution below. A course with dated
   modules gets a small school-timetable grid (one bar per module across its
   months). A card with an award (content.json education[].award ->
   achievements.awards, matched by name, so ADEPA keeps living in
   Achievements too) carries a small prize chip.
   Dates come from content.json as "YYYY" or "YYYY-MM"; month names are
   localized from ui.months. Reduced motion: everything static. */
import { esc, rich } from '../utils.js';

export const styles = 'css/sections/education.css';

const parse = (s) => {
  const [y, m] = String(s || '').split('-').map(Number);
  return { y, m: m || null, raw: String(s || '') };
};
const monthIndex = (d) => d.y * 12 + ((d.m || 1) - 1);

/* Small original ribbon icon (decorative) */
const RIBBON = '<svg viewBox="0 0 16 22" aria-hidden="true" focusable="false"><path d="M4 10 L1.5 21 L5 18.6 L7 21.5 L8 12 Z" fill="#7A2430"/><path d="M12 10 L14.5 21 L11 18.6 L9 21.5 L8 12 Z" fill="#2D5F8A"/><circle cx="8" cy="7" r="6.2" fill="#C08A2E"/><circle cx="8" cy="7" r="4.2" fill="#EBC66E" stroke="#8A6424" stroke-width=".8"/></svg>';

export default function render(el, ctx) {
  const { data, ui } = ctx;
  const list = Array.isArray(data.education) ? data.education : [];
  if (!list.length) { el.innerHTML = ''; return () => {}; }

  const months = ui.months || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fmt = (d) => (d.m ? `${months[d.m - 1]} ${d.y}` : `${d.y}`);
  const time = (s) => { const d = parse(s); return `<time datetime="${esc(d.raw)}">${esc(fmt(d))}</time>`; };
  const span = (a, b) => `${time(a)} – ${time(b)}`;

  const awards = (data.achievements && data.achievements.awards) || [];
  const awardFor = (e) => (e.award
    ? awards.find((a) => new RegExp(e.award, 'i').test(`${a.title} ${a.issuer}`)) || null
    : null);
  const lowerFirst = (s) => String(s || '').replace(/^\p{Lu}/u, (c) => c.toLowerCase());

  const sorted = [...list].sort((a, b) => monthIndex(parse(a.start)) - monthIndex(parse(b.start)));
  const first = parse(sorted[0].start).y;
  const last = Math.max(...sorted.map((e) => parse(e.end || e.start).y));

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

  /* Small prize chip: "1st Prize, University Journalism (ADEPA) · awarded during my time at UCA" */
  const prize = (a) => {
    if (!a) return '';
    const abbr = (String(a.issuer || '').match(/\(([^)]+)\)\s*$/) || [])[1];
    return `
        <p class="mat__award">${RIBBON}<span><span class="visually-hidden">${esc(ui.eduAward)}: </span>${esc(a.title)}${abbr ? ` (<abbr title="${esc(a.issuer)}">${esc(abbr)}</abbr>)` : ''}${a.context ? ` <span class="mat__award-ctx">· ${esc(lowerFirst(a.context))}</span>` : ''}</span></p>`;
  };

  const card = (e, i) => `
    <li class="tl__item" data-reveal style="--reveal-delay:${Math.min(i, 3) * 90}ms">
      <span class="tl__year" aria-hidden="true">${esc(parse(e.start).y)}</span>
      <div class="mat">
        <p class="mat__when">${span(e.start, e.end || e.start)}</p>
        <h3 class="mat__title">${esc(e.program)}</h3>
        <p class="mat__inst">${esc(e.institution)}</p>
        ${prize(awardFor(e))}
        ${timetable(e)}
      </div>
    </li>`;

  el.innerHTML = `
    <div class="container">
      <header class="section-head">
        <p class="eyebrow" data-reveal>${esc(ui.eduEyebrow)}</p>
        <h2 class="display" id="education-title" data-reveal style="--reveal-delay:60ms">${rich(ui.eduTitle)}</h2>
        <p data-reveal style="--reveal-delay:120ms">${esc(ui.eduIntro)}</p>
      </header>

      <div class="libreta">
        <p class="libreta__title" data-reveal>
          <span>${esc(ui.eduLog)}</span>
          <span class="libreta__span" aria-hidden="true">${esc(first)} → ${esc(last)}</span>
        </p>
        <ol class="tl" role="list" aria-label="${esc(ui.eduLogAria)}">
          ${sorted.map(card).join('')}
        </ol>
      </div>
    </div>`;

  ctx.reveal(el);
  return () => {};
}
