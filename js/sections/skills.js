/* Skills: the marketing funnel as a scroll story (board v2a).
   Desktop (>= 960px): a large funnel of four enamel plates stays pinned on the
   left while the stage cards scroll by on the right. Each card fills its plate
   top-to-bottom as it is read; a colectivo roller sign (line number + rolling
   destination blind + four pips) always says which stage is current. Plates
   are links: Tab to one, Enter jumps to (and focuses) its card. Retention &
   Loyalty closes the loop back to awareness with one dashed arrow.
   Mobile: the drawing is replaced by the sticky roller sign with a mini
   four-plate funnel; each card carries a narrowing enamel band that fills.
   Below: the "Across the funnel" strip (AI copilots, automation, the CRM line
   and work environments without levels).
   prefers-reduced-motion: everything drawn lit, no rolling; the sign still
   tracks the stage. Levels are pads + words, never percentages. */
import { esc, rich, prefersReducedMotion } from '../utils.js';

export const styles = 'css/sections/skills.css';

const LEVEL_RANK = { basic: 1, intermediate: 2, advanced: 3, expert: 4 };
const pad = (n) => String(n).padStart(2, '0');
const abbrOf = (t) => t.abbr || String(t.name || '').slice(0, 3);

/* ---------- Funnel geometry (SVG user units) ---------- */
const W = 500;
const H = 500;
const CX = 262;
const L = [
  { y0: 22, y1: 118, w0: 214, w1: 184 },
  { y0: 130, y1: 216, w0: 176, w1: 146 },
  { y0: 228, y1: 310, w0: 138, w1: 110 },
  { y0: 322, y1: 402, w0: 102, w1: 76 }
];
const NAME_FS = [25, 23, 20, 17];
const wAt = (l, y) => l.w0 + (l.w1 - l.w0) * ((y - l.y0) / (l.y1 - l.y0));
const trap = (y0, y1, w0, w1) => `${CX - w0},${y0} ${CX + w0},${y0} ${CX + w1},${y1} ${CX - w1},${y1}`;
const plate = (l) => trap(l.y0, l.y1, l.w0, l.w1);
const inner = (l) => { const a = l.y0 + 6; const b = l.y1 - 6; return trap(a, b, wAt(l, a) - 9, wAt(l, b) - 9); };

/* ---------- Markup helpers ---------- */
function levelHTML(level, ui) {
  if (!level) return ''; // no level in the source: never invent one
  const r = LEVEL_RANK[level] || 0;
  const word = (ui.levels && ui.levels[level]) || level;
  const dots = [1, 2, 3, 4].map((i) => `<i class="${i <= r ? 'on' : ''}"></i>`).join('');
  return `<span class="level"><span class="level__dots" aria-hidden="true">${dots}</span>${esc(word)}</span>`;
}

/* Plate label: number, name (1 or 2 lines), tool abbreviations */
function labelSVG(i, name, abbrs, lines, fs, lit) {
  const l = L[i];
  const cy = (l.y0 + l.y1) / 2;
  const two = lines.length > 1;
  const yNum = two ? cy - 23 : cy - 16;
  const yName = two ? cy - 3 : cy + 6;
  const yTools = two ? cy + 31 : cy + 26;
  const s = lit ? 'on' : 'off';
  const nameTxt = lines.map((ln, k) => `<tspan x="${CX}" y="${yName + k * (fs * 0.95)}">${esc(ln)}</tspan>`).join('');
  return `<text class="fn-pl__num fn-pl__num--${s}" x="${CX}" y="${yNum}" text-anchor="middle">${pad(i + 1)}</text>
    <text class="fn-pl__name fn-pl__name--${s}" x="${CX}" y="${yName}" text-anchor="middle" style="font-size:${fs}px">${nameTxt}</text>
    <text class="fn-pl__tools fn-pl__tools--${s}" x="${CX}" y="${yTools}" text-anchor="middle">${esc(abbrs)}</text>`;
}

function plateSVG(s, i, n, ui) {
  const l = L[i];
  const abbrs = s.tools.map(abbrOf).join(' · ');
  const ry = l.y0 + 14;
  const rw = wAt(l, ry) - 22;
  const rivets = (cls) => [CX - rw, CX + rw].map((x) => `<circle class="${cls}" cx="${x.toFixed(1)}" cy="${ry}" r="3.2"/>`).join('');
  // chipped enamel at the top-right corner of the lit plate
  const x0 = CX + l.w0 - 4;
  const y0 = l.y0;
  const chip = `<path class="fn-pl__chip-edge" d="M${x0 - 26},${y0} C${x0 - 22},${y0 + 5} ${x0 - 15},${y0 + 3} ${x0 - 11},${y0 + 8} C${x0 - 7},${y0 + 12} ${x0 - 2},${y0 + 9} ${x0 + 2},${y0 + 14} L${x0 + 4},${y0} Z"/>
      <path class="fn-pl__chip" d="M${x0 - 20},${y0} C${x0 - 17},${y0 + 3} ${x0 - 12},${y0 + 2} ${x0 - 9},${y0 + 5} C${x0 - 6},${y0 + 8} ${x0 - 2},${y0 + 6} ${x0 + 2},${y0 + 9} L${x0 + 3},${y0} Z"/>`;
  const label = `${ui.stageOf(i + 1, n)}: ${s.name}. ${ui.toolsCount(s.tools.length)}. ${ui.goToStage}`;
  return `<a class="fn-pl-link" href="#fn-stage-${esc(s.id)}" data-i="${i}" aria-label="${esc(label)}">
    <g class="fn-pl" data-i="${i}">
      <polygon class="fn-pl__shadow" points="${plate(l)}"/>
      <polygon class="fn-pl__base" points="${plate(l)}"/>
      <polygon class="fn-pl__base-inner" points="${inner(l)}"/>
      ${rivets('fn-pl__rivet-off')}
      <g class="fn-pl__label" data-lit="0">${labelSVG(i, s.name, abbrs, [s.name], NAME_FS[i], false)}</g>
      <clipPath id="fn-clip-${i}"><rect class="fn-pl__clip" x="0" y="${l.y0 - 3}" width="${W}" height="0" data-h="${l.y1 - l.y0 + 6}"/></clipPath>
      <g clip-path="url(#fn-clip-${i})">
        <polygon class="fn-pl__lit" points="${plate(l)}"/>
        <polygon class="fn-pl__lit-inner" points="${inner(l)}"/>
        ${chip}
        ${rivets('fn-pl__rivet-on')}
        <g class="fn-pl__label" data-lit="1">${labelSVG(i, s.name, abbrs, [s.name], NAME_FS[i], true)}</g>
      </g>
      <polygon class="fn-pl__focus" points="${plate(l)}"/>
    </g>
  </a>`;
}

function funnelSVG(stages, ui) {
  const last = L[3];
  const yS = last.y1;
  const yE = 448;
  const spout = `M${CX - last.w1 + 6},${yS} C${CX - 40},${yS + 22} ${CX - 22},${yE - 18} ${CX - 22},${yE} M${CX + last.w1 - 6},${yS} C${CX + 40},${yS + 22} ${CX + 22},${yE - 18} ${CX + 22},${yE}`;
  const loop = `M${CX - 92},474 C 40 474, 14 420, 14 300 L 14 92 C 14 60, 22 44, ${CX - 224},40`;
  return `<svg class="fn-svg" viewBox="0 0 ${W} ${H}" role="group" aria-label="${esc(ui.funnelAria)}">
    <path class="fn-loop" d="${loop}" aria-hidden="true"/>
    <path class="fn-loop-arrow" d="M${CX - 224},40 l-9,-5 l1,10 z" aria-hidden="true"/>
    <text class="fn-loop-label" transform="translate(30 290) rotate(-90)" text-anchor="middle" aria-hidden="true">${esc(ui.loopLabel)}</text>
    <path class="fn-spout" d="${spout}" aria-hidden="true"/>
    <g class="fn-out" aria-hidden="true">
      <rect x="${CX - 90}" y="458" width="180" height="32" rx="5"/>
      <text x="${CX}" y="478" text-anchor="middle">${esc(ui.outLabel)}</text>
    </g>
    ${stages.map((s, i) => plateSVG(s, i, stages.length, ui)).join('')}
  </svg>`;
}

function miniSVG(n) {
  return Array.from({ length: n }, (_, i) => {
    const a = 2 + i * 3;
    const b = 32 - i * 3;
    const y = i * 7.5;
    return `<polygon class="fn-mini__p" data-mi="${i}" points="${a},${y} ${b},${y} ${b - 3},${y + 6} ${a + 3},${y + 6}"/>`;
  }).join('');
}

function toolHTML(t, ui) {
  return `<li class="fn-tool">
    <span class="fn-tool__abbr" aria-hidden="true">${esc(abbrOf(t))}</span>
    <span class="fn-tool__name">${esc(t.name)}${t.featured ? `<small>${esc(ui.coreLabel)}</small>` : ''}</span>
    ${levelHTML(t.level, ui)}
    ${t.note ? `<span class="fn-tool__note">${esc(t.note)}</span>` : ''}
  </li>`;
}

function stepHTML(s, i, n, ui) {
  return `<li class="fn-step" data-i="${i}" style="--band-w:${100 - i * 8}%">
    <article class="fn-card" id="fn-stage-${esc(s.id)}" tabindex="0" aria-labelledby="fn-t-${i}">
      <div class="fn-band" aria-hidden="true"><span>${pad(i + 1)}</span><span>${esc(s.name)}</span></div>
      <p class="eyebrow fn-card__eyebrow">${esc(ui.stageOf(i + 1, n))} · ${esc(ui.toolsCount(s.tools.length))}</p>
      <h3 class="fn-card__title" id="fn-t-${i}">${esc(s.name)}</h3>
      ${s.tagline ? `<p class="fn-card__tag">${esc(s.tagline)}</p>` : ''}
      ${s.doing ? `<div class="fn-doing"><p class="fn-doing__label">${esc(ui.whatIDo)}</p><p>${esc(s.doing)}</p></div>` : ''}
      <p class="fn-label" id="fn-tl-${i}">${esc(ui.toolkit)}</p>
      <ul class="fn-tools" role="list" aria-labelledby="fn-tl-${i}">${s.tools.map((t) => toolHTML(t, ui)).join('')}</ul>
    </article>
  </li>`;
}

function acrossHTML(a, ui) {
  if (!a) return '';
  const ai = (a.ai || []).map((t) => `<li>
      <span class="chip">${esc(t.name)}</span>${levelHTML(t.level, ui)}${t.note ? `<span class="fn-ai__note">${esc(t.note)}</span>` : ''}
    </li>`).join('');
  const tools = (a.tools || []).map((t) => toolHTML(t, ui)).join('');
  const env = (a.env || []).map((g) => `<div class="fn-env__row"><dt>${esc(g.label)}</dt><dd>${(g.items || []).map(esc).join(' · ')}</dd></div>`).join('');
  return `<div class="fn-divider baldosas" aria-hidden="true"></div>
  <div class="fn-across" data-reveal>
    <div class="fn-across__main">
      ${a.eyebrow ? `<p class="eyebrow">${esc(a.eyebrow)}</p>` : ''}
      <h3 class="fn-across__title" id="fn-across-title">${rich(a.title || '')}</h3>
      ${a.intro ? `<p class="fn-across__intro">${esc(a.intro)}</p>` : ''}
      ${ai ? `<p class="fn-label" id="fn-ai-label">${esc(a.aiLabel || '')}</p>
      <ul class="fn-ai" role="list" aria-labelledby="fn-ai-label">${ai}</ul>` : ''}
      ${tools ? `<p class="fn-label" id="fn-auto-label">${esc(a.toolsLabel || '')}</p>
      <ul class="fn-tools fn-tools--across" role="list" aria-labelledby="fn-auto-label">${tools}</ul>` : ''}
    </div>
    <div class="fn-across__side">
      ${a.crm ? `<div class="fn-crm">
        <span class="chapa chapa--red">${esc(a.crmLabel || 'CRM')}</span>
        <p>${esc(a.crm)}</p>
      </div>` : ''}
      ${env ? `<div class="fn-env">
        <p class="fn-label">${esc(a.envLabel || '')}</p>
        <dl class="fn-env__list">${env}</dl>
        ${a.envLine ? `<p class="fn-env__line">${esc(a.envLine)}</p>` : ''}
      </div>` : ''}
    </div>
  </div>`;
}

/* Split a name into two balanced lines at a space */
function splitName(name) {
  const mid = name.length / 2;
  let best = -1;
  for (let k = 0; k < name.length; k++) {
    if (name[k] === ' ' && (best < 0 || Math.abs(k - mid) < Math.abs(best - mid))) best = k;
  }
  return best < 0 ? [name] : [name.slice(0, best), name.slice(best + 1)];
}

/* ---------- Render ---------- */
export default function render(el, ctx) {
  const { data, ui } = ctx;
  const f = data.funnel || {};
  const stages = (f.stages || []).map((s) => ({
    ...s,
    tools: (s.tools || []).map((t) => (typeof t === 'string' ? { name: t } : t))
  }));
  const n = stages.length;
  const reduced = prefersReducedMotion();

  el.innerHTML = `
    <div class="container">
      <header class="section-head skills__head">
        <p class="eyebrow" data-reveal>${esc(ui.skillsEyebrow)}</p>
        <h2 class="display" id="skills-title" data-reveal style="--reveal-delay:60ms">${rich(ui.skillsTitle)}</h2>
        <p data-reveal style="--reveal-delay:120ms">${esc(ui.skillsIntro)}</p>
        <div class="fn-legend" data-reveal style="--reveal-delay:160ms" aria-hidden="true">
          <span class="fn-legend__title">${esc(ui.levelLegend)}</span>
          ${['expert', 'advanced', 'intermediate'].map((l) => levelHTML(l, ui)).join('')}
        </div>
      </header>
      <div class="fn${reduced ? ' fn--static' : ''}">
        <div class="fn-visual">
          <div class="fn-signwrap" role="group" aria-label="${esc(ui.signAria)}">
            <div class="fn-sign">
              <span class="linea fn-sign__num" aria-hidden="true">01</span>
              <div class="destino fn-sign__blind">
                <span class="fn-sign__lamp" aria-hidden="true"></span>
                <span class="visually-hidden" role="status" aria-live="polite" aria-atomic="true" data-fn-sr></span>
                <div class="fn-roll" aria-hidden="true"><ul>${stages.map((s) => `<li>${esc(s.name)}</li>`).join('')}</ul></div>
                <svg class="fn-mini" viewBox="0 0 34 30" aria-hidden="true" focusable="false">${miniSVG(n)}</svg>
                <span class="fn-sign__count" aria-hidden="true">1 / ${n}</span>
              </div>
            </div>
            <div class="fn-pips" aria-hidden="true">${stages.map((s, i) => `<span data-i="${i}"></span>`).join('')}</div>
          </div>
          <div class="fn-svgwrap">${funnelSVG(stages, ui)}</div>
        </div>
        <ol class="fn-steps" role="list" aria-label="${esc(ui.stagesAria)}">
          ${stages.map((s, i) => stepHTML(s, i, n, ui)).join('')}
        </ol>
      </div>
      ${acrossHTML(f.across, ui)}
    </div>`;

  const controller = new AbortController();
  const { signal } = controller;
  const svg = el.querySelector('.fn-svg');
  const steps = [...el.querySelectorAll('.fn-step')];
  const cards = steps.map((s) => s.querySelector('.fn-card'));
  const links = [...el.querySelectorAll('.fn-pl-link')];
  const plates = [...el.querySelectorAll('.fn-pl')];
  const clips = [...el.querySelectorAll('.fn-pl__clip')];
  const pips = [...el.querySelectorAll('.fn-pips span')];
  const mini = [...el.querySelectorAll('[data-mi]')];
  const roll = el.querySelector('.fn-roll ul');
  const signNum = el.querySelector('.fn-sign__num');
  const signSr = el.querySelector('[data-fn-sr]');
  const signCount = el.querySelector('.fn-sign__count');
  const lit = [...el.querySelectorAll('.fn-spout, .fn-out, .fn-loop, .fn-loop-arrow')];
  let active = -1;
  let raf = 0;
  let bumpT = 0;

  /* Fit plate names (long ES/DE names wrap to two lines, then shrink) */
  const fitPlates = () => {
    if (!svg || !svg.getBoundingClientRect().width) return;
    plates.forEach((g, i) => {
      const s = stages[i];
      const l = L[i];
      const abbrs = s.tools.map(abbrOf).join(' · ');
      const labels = [...g.querySelectorAll('.fn-pl__label')];
      const draw = (lines, fs) => labels.forEach((lab) => {
        lab.innerHTML = labelSVG(i, s.name, abbrs, lines, fs, lab.dataset.lit === '1');
      });
      let fs = NAME_FS[i];
      draw([s.name], fs);
      const cy = (l.y0 + l.y1) / 2;
      const avail = 2 * wAt(l, cy + 10) - 46;
      const width = () => Math.max(...[...labels[0].querySelectorAll('tspan')].map((t) => t.getComputedTextLength()));
      if (width() <= avail) return;
      const lines = splitName(s.name);
      if (lines.length > 1) { fs = Math.min(fs, 17); draw(lines, fs); }
      const w = width();
      if (w > avail) draw(lines, Math.max(11, Math.floor(fs * (avail / w))));
    });
    const loopLabel = svg.querySelector('.fn-loop-label');
    loopLabel.removeAttribute('textLength');
    if (loopLabel.getComputedTextLength() > 330) {
      loopLabel.setAttribute('textLength', '330');
      loopLabel.setAttribute('lengthAdjust', 'spacingAndGlyphs');
    }
  };

  const setProgress = (i, p) => {
    const r = clips[i];
    if (r) r.setAttribute('height', (Number(r.dataset.h) * p).toFixed(1));
    if (pips[i]) pips[i].style.setProperty('--p', p.toFixed(3));
    steps[i].style.setProperty('--p', p.toFixed(3));
    if (mini[i]) mini[i].classList.toggle('is-lit', p > 0.02);
  };

  const setActive = (i) => {
    if (i === active) return;
    active = i;
    plates.forEach((pl, k) => pl.classList.toggle('is-active', k === i));
    links.forEach((a, k) => (k === i ? a.setAttribute('aria-current', 'step') : a.removeAttribute('aria-current')));
    steps.forEach((s, k) => {
      s.classList.toggle('is-active', k === i);
      if (k === i) s.setAttribute('aria-current', 'step'); else s.removeAttribute('aria-current');
    });
    roll.style.transform = `translateY(${-1.4 * i}em)`;
    signNum.textContent = pad(i + 1);
    if (!reduced) {
      signNum.classList.add('is-bump');
      clearTimeout(bumpT);
      bumpT = setTimeout(() => signNum.classList.remove('is-bump'), 220);
    }
    signCount.textContent = `${i + 1} / ${n}`;
    signSr.textContent = `${ui.stageOf(i + 1, n)}: ${stages[i].name}`;
  };

  const update = () => {
    raf = 0;
    if (!n) return;
    const line = window.innerHeight * 0.6;
    let act = 0;
    let lastP = 0;
    cards.forEach((card, i) => {
      const r = card.getBoundingClientRect();
      const p = reduced ? 1 : Math.max(0, Math.min(1, (line - r.top) / (r.height * 0.85)));
      setProgress(i, p);
      if (r.top < line) act = i;
      if (i === n - 1) lastP = p;
    });
    const done = reduced || lastP > 0.7;
    lit.forEach((node) => node.classList.toggle('is-lit', done));
    setActive(act);
  };
  const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };

  let lastW = window.innerWidth;
  window.addEventListener('scroll', schedule, { passive: true, signal });
  window.addEventListener('resize', () => {
    schedule();
    if (window.innerWidth !== lastW) { lastW = window.innerWidth; fitPlates(); }
  }, { signal });

  /* Plates: click / Enter jumps to the stage card and moves focus there */
  links.forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    const card = cards[Number(a.dataset.i)];
    if (!card) return;
    card.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    card.focus({ preventScroll: true });
  }, { signal }));

  fitPlates();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { if (!signal.aborted) fitPlates(); });
  }
  update();
  ctx.reveal(el);

  return () => {
    controller.abort();
    if (raf) cancelAnimationFrame(raf);
    clearTimeout(bumpT);
  };
}
