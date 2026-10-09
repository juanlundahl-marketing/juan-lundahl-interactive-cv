/* Hero (Porteño): "¡Hola!" painted ribbon, Sansita headline with a Swashed
   accent word, enamel CTA, condensed tags, and the portrait composed like a
   theatre bill. Background (from board B2b): a worn celeste-white-celeste
   painted wall with half a Sol de Mayo cut by the right edge. All drawings are
   original; one CSS variable (--arg-opacity) dials the whole background. */
import { esc, accentTitle, photoHTML, wirePhotoFallbacks } from '../utils.js';

const TXT = {
  en: { iam: "I'm", bill: 'Marketing · Automation · AI', billB: 'Daily show', from: 'from' },
  es: { iam: 'Soy', bill: 'Marketing · Automatización · IA', billB: 'Función diaria', from: 'desde' },
  de: { iam: 'Ich bin', bill: 'Marketing · Automatisierung · KI', billB: 'Täglich im Programm', from: 'aus' }
};

/* Sol de Mayo, original line drawing: 32 rays alternating straight (slim
   flames) and wavy, a filled disc and two rings. Centre at 0,0. */
function solSVG() {
  const N = 32, P = Math.PI;
  const pt = (r, a) => `${(r * Math.cos(a)).toFixed(1)} ${(r * Math.sin(a)).toFixed(1)}`;
  let rays = '';
  for (let i = 0; i < N; i++) {
    const a = (i * 2 * P) / N - P / 2;
    if (i % 2 === 0) {
      rays += `<path class="rs" d="M${pt(78, a - 0.05)} L${pt(222, a)} L${pt(78, a + 0.05)}Z"/>`;
    } else {
      let d = '';
      const r0 = 80, r1 = 186;
      for (let k = 0; k <= 24; k++) {
        const t = k / 24, r = r0 + (r1 - r0) * t, off = Math.sin(t * P * 3) * 7 * (1 - t * 0.35);
        const x = r * Math.cos(a) + off * Math.cos(a + P / 2);
        const y = r * Math.sin(a) + off * Math.sin(a + P / 2);
        d += `${k ? ' L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
      }
      rays += `<path class="rw" d="${d}"/>`;
    }
  }
  return `<svg class="hero__sol" viewBox="-230 -230 460 460" aria-hidden="true" focusable="false">
    ${rays}
    <circle class="disc" r="64"/>
    <circle class="ring" r="52"/>
    <circle class="ring" r="72" stroke-dasharray="2 4"/>
  </svg>`;
}

/* Worn painted wall: three bands through a paint-wear filter */
const WALL = `<svg class="hero__wall" viewBox="0 0 1200 700" preserveAspectRatio="none" aria-hidden="true" focusable="false">
  <defs>
    <filter id="hero-worn" x="-2%" y="-2%" width="104%" height="104%">
      <feTurbulence type="fractalNoise" baseFrequency="0.008 0.06" numOctaves="3" seed="7" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="22" xChannelSelector="R" yChannelSelector="G" result="d"/>
      <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="3" result="g"/>
      <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 1.75" result="m"/>
      <feComposite in="d" in2="m" operator="in"/>
    </filter>
  </defs>
  <g filter="url(#hero-worn)">
    <rect class="cel" x="-30" y="-30" width="1260" height="263"/>
    <rect class="bla" x="-30" y="233" width="1260" height="234"/>
    <rect class="cel" x="-30" y="467" width="1260" height="263"/>
  </g>
</svg>`;

export default function render(el, ctx) {
  const { data, meta, ui, lang } = ctx;
  const t = TXT[lang] || TXT.en;
  const hero = data.hero || {};
  const cta = hero.cta || {};
  const name = meta.name || 'Juan Lundahl';
  const [first, ...rest] = name.split(' ');
  const surname = rest.join(' ') || first;

  // "AI, Automation, CRM Optimization, Martech Stack, Sales & Marketing Ops · Buenos Aires"
  const [tagPart = '', place = ''] = String(hero.subtitle || '').split('·').map((s) => s.trim());
  const tags = tagPart.split(',').map((s) => s.trim()).filter(Boolean);
  const cv = meta.cv && meta.cv[lang];

  el.innerHTML = `
    <div class="hero__bg" aria-hidden="true">
      ${WALL}
      ${solSVG()}
      <div class="hero__ghost"><span>${esc(surname)}</span></div>
    </div>
    <div class="container hero__grid">
      <div class="hero__copy">
        <p class="hero__hello" data-reveal><span class="cinta" lang="es">¡Hola!</span><span class="hero__who">${esc(t.iam)} ${esc(name)}</span></p>
        <h1 class="display hero__title" data-reveal style="--reveal-delay:80ms">${accentTitle(hero.title)}</h1>
        ${hero.lede ? `<p class="hero__lede" data-reveal style="--reveal-delay:120ms">${esc(hero.lede)}</p>` : ''}
        ${tags.length ? `<ul class="hero__tags" role="list" data-reveal style="--reveal-delay:170ms">
          ${tags.map((tag) => `<li class="chip">${esc(tag)}</li>`).join('')}
        </ul>` : ''}
        <div class="hero__ctas" data-reveal style="--reveal-delay:220ms">
          <a class="btn" href="#work">${esc(cta.work || 'Explore work')}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
          ${cv ? `<a class="btn btn--ghost" href="${esc(cv)}" download>${esc(cta.resume || 'Resume')}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg></a>` : ''}
        </div>
      </div>

      <figure class="hero__cartel" data-reveal style="--reveal-delay:140ms">
        <svg class="hero__corner hero__corner--l" aria-hidden="true" focusable="false"><use href="#f-corner"/></svg>
        <svg class="hero__corner hero__corner--r" aria-hidden="true" focusable="false"><use href="#f-corner"/></svg>
        <p class="hero__bill">${esc(t.bill)}<b>${esc(t.billB)}</b></p>
        <div class="hero__ph">
          ${photoHTML({ src: 'assets/img/juan.jpg', alt: ui.heroPhotoAlt, name, className: 'hero__photo' })}
        </div>
        <figcaption class="hero__name">${esc(name)}</figcaption>
        <svg class="filete hero__rule" aria-hidden="true" focusable="false"><use href="#f-rule"/></svg>
        <p class="hero__band">NA · EMEA · LATAM${place ? ` — ${esc(t.from)} ${esc(place)}` : ''}</p>
      </figure>
    </div>
    <a class="hero__scroll" href="#about" aria-hidden="true" tabindex="-1"><span>${esc(ui.heroScroll)}</span></a>
  `;

  wirePhotoFallbacks(el);
  ctx.reveal(el);
}
