/* About: the Marketing ID as an enamelled door nameplate (the kind screwed
   beside a porteño building door), with a hanging shop sign below it that
   flips between "Trabajando" and "Vuelvo enseguida" on tap / click / Enter /
   Space. Bio copy on the other side. */
import { marketChips, esc, rich, photoHTML, wirePhotoFallbacks } from '../utils.js';

const SIGN = {
  en: {
    open: 'Currently at VU Inc.', away: 'Back in five minutes',
    hint: 'Tap the sign to flip it',
    sr: (word, sub) => `Shop sign reads: ${word}, ${sub}. Activate to flip it.`
  },
  es: {
    open: 'Hoy en VU Inc.', away: 'En cinco minutos',
    hint: 'Tocá el cartel para darlo vuelta',
    sr: (word, sub) => `El cartel dice: ${word}, ${sub}. Activalo para darlo vuelta.`
  },
  de: {
    open: 'Aktuell bei VU Inc.', away: 'Bin in fünf Minuten zurück',
    hint: 'Schild antippen zum Umdrehen',
    sr: (word, sub) => `Auf dem Schild steht: ${word}, ${sub}. Aktivieren zum Umdrehen.`
  }
};
const WORD = { open: 'Trabajando', away: 'Vuelvo enseguida' };

/* Simple original flags (decorative; the language name carries the meaning).
   es: Argentina (celeste-white-celeste + sun disc), en: United Kingdom
   (simplified Union Jack), de: Germany (black-red-gold). */
const flag = (inner) => `<svg class="lang-card__flag" viewBox="0 0 60 40" aria-hidden="true" focusable="false">${inner}</svg>`;
const FLAGS = {
  es: flag('<rect width="60" height="40" fill="#74ACDF"/><rect y="13.33" width="60" height="13.34" fill="#FFFFFF"/><circle cx="30" cy="20" r="4.2" fill="#F6B40E" stroke="#85340A" stroke-width=".6"/>'),
  en: flag('<rect width="60" height="40" fill="#012169"/><path d="M0 0L60 40M60 0L0 40" stroke="#FFFFFF" stroke-width="8"/><path d="M0 0L60 40M60 0L0 40" stroke="#C8102E" stroke-width="2.6"/><path d="M30 0V40M0 20H60" stroke="#FFFFFF" stroke-width="12"/><path d="M30 0V40M0 20H60" stroke="#C8102E" stroke-width="7"/>'),
  de: flag('<rect width="60" height="13.34" fill="#000000"/><rect y="13.33" width="60" height="13.34" fill="#DD0000"/><rect y="26.66" width="60" height="13.34" fill="#FFCE00"/>')
};

export default function render(el, ctx) {
  const { data, meta, ui, lang } = ctx;
  const s = SIGN[lang] || SIGN.en;
  const about = data.about || {};
  const facts = about.facts || [];
  const name = meta.name || 'Juan Lundahl';
  const role = (data.hero && data.hero.title) || '';
  const place = String((data.hero && data.hero.subtitle) || '').split('·')[1];
  // Plate shows the short facts; the long "Languages" fact goes to the bio side.
  const cardFacts = facts.filter((f) => String(f.value).length <= 26).slice(0, 4);
  const languages = data.languages || [];
  // Drop the pull-quote sentence from the paragraph that starts with it (no repetition).
  const text = (Array.isArray(about.text) ? about.text : [about.text].filter(Boolean))
    .map((p) => (about.quote && p.startsWith(about.quote) ? p.slice(about.quote.length).trim() : p))
    .filter(Boolean);
  const srText = (state) => s.sr(`<span lang="es">${WORD[state]}</span>`, esc(s[state]));

  const factHTML = (f, i) => {
    if (f.id === 'markets') {
      return `<div class="nameplate__markets"><dt>${esc(f.label)}</dt><dd><span class="visually-hidden">${esc(f.value)} (${esc(ui.achMarketsHome)})</span><span aria-hidden="true">${marketChips(ui)}</span></dd></div>`;
    }
    const home = i === cardFacts.length - 1 && /argentin/i.test(f.value);
    return `<div><dt>${esc(f.label)}</dt><dd${home ? ' class="is-home"' : ''}>${esc(f.value)}</dd></div>`;
  };

  el.innerHTML = `
    <div class="container about__grid">
      <div class="about__plate" data-reveal>
        <article class="nameplate" aria-label="${esc(ui.idHeader)}: ${esc(name)}, ${esc(role)}">
          <span class="nameplate__sheen" aria-hidden="true"></span>
          <i class="nameplate__rv nameplate__rv--a" aria-hidden="true"></i><i class="nameplate__rv nameplate__rv--b" aria-hidden="true"></i>
          <i class="nameplate__rv nameplate__rv--c" aria-hidden="true"></i><i class="nameplate__rv nameplate__rv--d" aria-hidden="true"></i>
          <span class="nameplate__chip nameplate__chip--tr" aria-hidden="true"></span>
          <span class="nameplate__chip nameplate__chip--bl" aria-hidden="true"></span>
          <div class="nameplate__body">
            ${photoHTML({ src: 'assets/img/juan.jpg', alt: '', name, className: 'nameplate__photo' })}
            <div class="nameplate__who">
              <p class="nameplate__kicker">${esc(ui.idHeader)}</p>
              <h3 class="nameplate__name">${esc(name)}</h3>
              <p class="nameplate__role">${esc(role)}</p>
            </div>
          </div>
          <dl class="nameplate__facts">
            ${cardFacts.map(factHTML).join('')}
          </dl>
          <p class="nameplate__num"><span>${esc(ui.idNumberLabel)} ${esc(ui.idNumber)}</span>${place ? `<span>${esc(place.trim())}</span>` : ''}</p>
        </article>

        <button class="cartelito" type="button" data-sign data-state="open">
          <svg class="cartelito__cuerda" viewBox="0 0 86 22" aria-hidden="true" focusable="false"><path d="M4 22 L43 3 L82 22" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="43" cy="3" r="2.6" fill="currentColor"/></svg>
          <span class="cartelito__faces" aria-hidden="true">
            <span class="cartelito__f cartelito__f--front"><b lang="es">${WORD.open}</b><small>${esc(s.open)}</small></span>
            <span class="cartelito__f cartelito__f--back"><b lang="es">${WORD.away}</b><small>${esc(s.away)}</small></span>
          </span>
          <span class="visually-hidden" data-sign-label>${srText('open')}</span>
        </button>
        <p class="cartelito__hint" aria-hidden="true">${esc(s.hint)}</p>
        <p class="visually-hidden" aria-live="polite" data-sign-live></p>
      </div>

      <div class="about__copy">
        <header class="section-head">
          <p class="eyebrow" data-reveal>${esc(ui.aboutEyebrow)}</p>
          <h2 class="display" id="about-title" data-reveal style="--reveal-delay:60ms">${rich(ui.aboutTitle)}</h2>
          ${about.headline ? `<p class="about__headline" data-reveal style="--reveal-delay:120ms">${esc(about.headline)}</p>` : ''}
        </header>
        ${about.quote ? `<blockquote class="about__quote" data-reveal><p>${esc(about.quote)}</p></blockquote>` : ''}
        <div class="about__text">
          ${text.map((p, i) => `<p data-reveal style="--reveal-delay:${i * 70}ms">${esc(p)}</p>`).join('')}
        </div>
        ${languages.length ? `<section class="about__langs" data-reveal aria-labelledby="about-langs-title">
          <h3 class="eyebrow" id="about-langs-title">${esc(ui.languagesLabel)}</h3>
          <ul class="lang-cards" role="list">
            ${languages.map((l, i) => `
            <li class="lang-card" style="--i:${i}">
              ${FLAGS[l.code] || ''}
              <span class="lang-card__text">
                <strong class="lang-card__name">${esc(l.name)}</strong>
                <span class="lang-card__level">${esc(l.level)}</span>
                ${l.steps ? `<span class="level__dots lang-card__dots" aria-hidden="true">${[1, 2, 3, 4].map((n) => `<i${n <= l.steps ? ' class="on"' : ''}></i>`).join('')}</span>` : ''}
              </span>
            </li>`).join('')}
          </ul>
        </section>` : ''}
      </div>
    </div>
  `;

  wirePhotoFallbacks(el);
  ctx.reveal(el);

  /* Flip sign: a plain button, so keyboard and touch work natively. The
     visually hidden label inside it is the accessible name and is updated
     on every flip, so screen readers hear the new wording. */
  const sign = el.querySelector('[data-sign]');
  const label = sign.querySelector('[data-sign-label]');
  const live = el.querySelector('[data-sign-live]');
  const onFlip = () => {
    const next = sign.dataset.state === 'open' ? 'away' : 'open';
    sign.dataset.state = next;
    label.innerHTML = srText(next);
    live.innerHTML = `<span lang="es">${WORD[next]}</span>: ${esc(s[next])}`;
  };
  sign.addEventListener('click', onFlip);
  return () => sign.removeEventListener('click', onFlip);
}
