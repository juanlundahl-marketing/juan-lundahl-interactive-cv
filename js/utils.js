/* Shared helpers for section modules. Import what you need:
   import { esc, rich, countUp, prefersReducedMotion } from '../utils.js'; */

/** Escape a value for safe interpolation into HTML template strings. */
export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Escape, then turn *text* into <em>text</em> (serif-italic accent). */
export function rich(value) {
  return esc(value).replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

/** Accent one word of a plain title when it carries no *markup*:
    the word right after "&" / " y " / " and ", else the last word. */
export function accentTitle(title) {
  const s = String(title ?? '');
  if (s.includes('*')) return rich(s);
  const m = s.match(/^(.*?(?:&|\by\b|\band\b)\s+)(\S+)(.*)$/i);
  if (m) return `${esc(m[1])}<em>${esc(m[2])}</em>${esc(m[3])}`;
  const i = s.lastIndexOf(' ');
  return i < 0 ? `<em>${esc(s)}</em>` : `${esc(s.slice(0, i + 1))}<em>${esc(s.slice(i + 1))}</em>`;
}

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Animate a number inside `el` from 0 to `to` when called.
    Usage (achievements): countUp(el, 6, { suffix: '+' }). */
export function countUp(el, to, { duration = 1400, suffix = '', prefix = '', decimals = 0 } = {}) {
  const fmt = (v) => `${prefix}${v.toFixed(decimals)}${suffix}`;
  if (prefersReducedMotion()) { el.textContent = fmt(to); return; }
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(to * eased);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/** Run `fn(el)` once when `el` scrolls into view (e.g. to start counters). */
export function onceVisible(el, fn, threshold = 0.4) {
  if (!('IntersectionObserver' in window)) { fn(el); return () => {}; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { io.disconnect(); fn(el); }
    });
  }, { threshold });
  io.observe(el);
  return () => io.disconnect();
}

/** Small inline icon for a working mode: "onsite" | "remote" | "hybrid". */
export function modeIcon(mode) {
  const open = '<svg class="mode-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">';
  const paths = {
    onsite: '<path d="M4 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16M14 11h5a1 1 0 0 1 1 1v9M2 21h20M8 8h2M8 12h2M8 16h2"/>',
    remote: '<path d="M3 11l9-8 9 8M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
    hybrid: '<path d="M4 8h13M13 4l4 4-4 4M20 16H7M11 12l-4 4 4 4"/>'
  };
  return paths[mode] ? `${open}${paths[mode]}</svg>` : '';
}

/** Initials from a full name: "Juan Lundahl" -> "JL". */
export function initials(name) {
  return String(name ?? '')
    .split(/\s+/).filter(Boolean).slice(0, 2)
    .map((w) => w[0].toUpperCase()).join('');
}

/** Image with initials fallback. Returns HTML; call wirePhotoFallbacks(root)
    after inserting it so a missing file swaps to the initials block. */
export function photoHTML({ src, alt, name, className = '' }) {
  return `<span class="photo ${esc(className)}" data-photo>
    <img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async">
    <span class="photo__fallback" aria-hidden="true">${esc(initials(name))}</span>
  </span>`;
}

export function wirePhotoFallbacks(root) {
  root.querySelectorAll('[data-photo] img').forEach((img) => {
    const fail = () => img.closest('[data-photo]').classList.add('photo--missing');
    if (img.complete && img.naturalWidth === 0) fail();
    else img.addEventListener('error', fail, { once: true });
  });
}

/* Markets as compact regional chips: NA · EMEA · LATAM (Argentina highlighted as home base). */
export function marketChips(ui, { className = 'mkt' } = {}) {
  const chip = (t, extra = '') => `<li class="${className}__chip${extra}">${t}</li>`;
  return `<ul class="${className}" role="list">${chip('NA')}${chip('EMEA')}${chip(`LATAM <small>(${esc(ui.homeCountry || 'Argentina')})</small>`,` ${className}__chip--home`)}</ul>`;
}
