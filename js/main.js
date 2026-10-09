/* ==========================================================================
   main.js - boot, i18n (EN/ES/DE), theme, floating nav + scroll-spy, reveal.

   SECTION RENDER HOOK CONVENTION (js/sections/*.js)
   -------------------------------------------------
   Every <section id="..."> in index.html is an empty container. It is filled
   by a module at js/sections/<id>.js registered in SECTION_MODULES below.

   A section module looks like this:

     // js/sections/work.js
     import { esc, rich } from '../utils.js';
     export const styles = 'css/sections/work.css'; // optional; injected once
     export default function render(el, ctx) {
       el.innerHTML = `...`;          // build markup from ctx.data.work
       ctx.reveal(el);                // animate [data-reveal] children
       return () => {};               // optional cleanup, called before re-render
     }

   ctx = {
     id,       // section id, e.g. "work"
     lang,     // "en" | "es"
     data,     // content.json[lang]   (CV content for the active language)
     meta,     // content.json.meta    (name, email, linkedin, cv paths)
     ui,       // UI microcopy for the active language (js/ui-strings.js)
     reveal,   // reveal(rootEl): observe [data-reveal] elements inside root
     params    // URLSearchParams of the current page
   }

   render() runs on boot and again on every language switch (cleanup first).
   Headline pattern: <h2 class="display" id="<id>-title">Things I've <em>built.</em></h2>
   To add a section: create js/sections/<id>.js (+ css/sections/<id>.css),
   then add one line to SECTION_MODULES. The nav shows a link for each
   section that renders content and has a label in content.json nav.
   ========================================================================== */

import { UI } from './ui-strings.js';
import { esc } from './utils.js';

const SECTION_MODULES = {
  hero: './sections/hero.js',
  about: './sections/about.js',
  skills: './sections/skills.js',
  work: './sections/work.js',
  range: './sections/range.js',
  certifications: './sections/certifications.js',
  achievements: './sections/achievements.js',
  contact: './sections/contact.js'
};

/* Section id -> key inside content.json[lang].nav */
const NAV_KEYS = {
  about: 'about',
  skills: 'funnel',
  work: 'work',
  range: 'range',
  certifications: 'certifications',
  achievements: 'achievements',
  contact: 'contact'
};

const SECTION_ORDER = ['hero', 'about', 'skills', 'work', 'range', 'certifications', 'achievements', 'contact'];
const LANGS = ['en', 'es', 'de'];
const STORE ={ lang: 'jl-lang', theme: 'jl-theme' };

/* ---------- Safe storage (private mode / blocked storage) ---------- */
const storage = {
  get(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
};

const state = {
  content: null,
  lang: 'en',
  modules: {},     // id -> imported module
  cleanups: {}     // id -> cleanup fn
};

const root = document.documentElement;
const params = new URLSearchParams(window.location.search);

/* ---------- Reveal on scroll ---------- */
const revealObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 })
  : null;

function reveal(scope = document) {
  scope.querySelectorAll('[data-reveal]:not(.is-visible)').forEach((el) => {
    if (revealObserver) revealObserver.observe(el);
    else el.classList.add('is-visible');
  });
}

/* ---------- Language ---------- */
function initialLang() {
  const q = params.get('lang');
  if (LANGS.includes(q)) return q;
  const saved = storage.get(STORE.lang);
  if (LANGS.includes(saved)) return saved;
  const prefs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
  for (const p of prefs) {
    const c = String(p).toLowerCase();
    if (c.startsWith('de')) return 'de';
    if (c.startsWith('es')) return 'es';
    if (c.startsWith('en')) return 'en';
  }
  return 'en';
}

function uiFor(lang) {
  const extra = (state.content && state.content[lang] && state.content[lang].ui) || {};
  return { ...UI[lang], ...extra };
}

async function setLang(lang, { persist = true } = {}) {
  state.lang = lang;
  root.setAttribute('lang', lang);
  if (persist) storage.set(STORE.lang, lang);
  const ui = uiFor(lang);
  syncLangMenu(lang, ui);
  document.getElementById('theme-toggle').setAttribute('aria-label', ui.themeToggle);
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const v = ui[el.dataset.i18n];
    if (typeof v === 'string') el.textContent = v;
  });
  const foot = document.getElementById('footer-text');
  if (foot) foot.innerHTML = `&copy; ${new Date().getFullYear()} ${esc(state.content.meta.name)} &middot; ${esc(ui.footer)}`;
  if (foot && ui.footerNote) foot.insertAdjacentHTML('beforeend', `<small class="site-footer__note">${esc(ui.footerNote)}</small>`);
  updateMeta(state.content[lang].hero || {});
  renderAll();
  buildNav();
}

/* Keep <title> and social/description meta in step with the active language */
function updateMeta(hero) {
  if (!hero.title) return;
  const name = state.content.meta.name;
  const title = `${name} | ${hero.title}`;
  const desc = [hero.title, hero.lede].filter(Boolean).join('. ');
  document.title = title;
  const set = (sel, v) => { const m = document.querySelector(sel); if (m && v) m.setAttribute('content', v); };
  set('meta[name="description"]', `${name} - ${desc}`);
  set('meta[property="og:title"]', title);
  set('meta[property="og:description"]', hero.lede);
  set('meta[property="og:image:alt"]', `${name}, ${hero.title}`);
  set('meta[property="og:locale"]', lang2locale(state.lang));
}
const LOCALES = { en: 'en_US', es: 'es_AR', de: 'de_DE' };
const lang2locale = (l) => LOCALES[l] || 'en_US';

/* ---------- Language menu (EN / ES / DE) ---------- */
const LANG_NAMES = { en: 'English', es: 'Español', de: 'Deutsch' };

function syncLangMenu(lang, ui) {
  const btn = document.getElementById('lang-toggle');
  document.getElementById('lang-current').textContent = lang.toUpperCase();
  btn.setAttribute('aria-label', `${ui.langSwitch}: ${LANG_NAMES[lang]}`);
  document.querySelectorAll('#lang-list [data-lang]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
  });
  /* og:locale:alternate = the other two languages */
  document.querySelectorAll('meta[property="og:locale:alternate"]').forEach((m) => m.remove());
  LANGS.filter((l) => l !== lang).forEach((l) => {
    const m = document.createElement('meta');
    m.setAttribute('property', 'og:locale:alternate');
    m.setAttribute('content', lang2locale(l));
    document.head.appendChild(m);
  });
}

function initLangMenu() {
  const btn = document.getElementById('lang-toggle');
  const list = document.getElementById('lang-list');
  const menu = document.getElementById('lang-menu');
  const close = (focusBtn) => {
    list.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    if (focusBtn) btn.focus();
  };
  btn.addEventListener('click', () => {
    const open = list.hidden;
    list.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    if (open) (list.querySelector('[aria-pressed="true"]') || list.querySelector('button')).focus();
  });
  list.addEventListener('click', (e) => {
    const b = e.target.closest('[data-lang]');
    if (!b) return;
    close(true);
    if (b.dataset.lang !== state.lang) setLang(b.dataset.lang);
  });
  document.addEventListener('click', (e) => { if (!list.hidden && !menu.contains(e.target)) close(false); });
  menu.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !list.hidden) { e.stopPropagation(); close(true); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const opts = [...list.querySelectorAll('button')];
      const i = opts.indexOf(document.activeElement);
      if (list.hidden && e.target === btn) { e.preventDefault(); btn.click(); return; }
      if (i >= 0) {
        e.preventDefault();
        opts[(i + (e.key === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length].focus();
      }
    }
  });
  list.addEventListener('focusout', (e) => {
    if (!list.hidden && e.relatedTarget && !menu.contains(e.relatedTarget)) close(false);
  });
}

/* ---------- Theme ---------- */
function effectiveTheme() {
  const forced = root.getAttribute('data-theme');
  if (forced === 'light' || forced === 'dark') return forced;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/* Browser chrome colour follows the page: paper cream / "bar notable" night */
const THEME_COLORS = { light: '#f3ebda', dark: '#1a1714' };
function syncThemeColor() {
  const forced = root.getAttribute('data-theme');
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
    const scheme = (m.getAttribute('media') || '').includes('dark') ? 'dark' : 'light';
    m.setAttribute('content', THEME_COLORS[forced === 'light' || forced === 'dark' ? forced : scheme]);
  });
}

function initTheme() {
  const btn = document.getElementById('theme-toggle');
  btn.addEventListener('click', () => {
    const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    storage.set(STORE.theme, next);
    btn.setAttribute('aria-pressed', String(next === 'dark'));
    syncThemeColor();
  });
  btn.setAttribute('aria-pressed', String(effectiveTheme() === 'dark'));
  syncThemeColor();
}

/* ---------- Sections ---------- */
async function loadModules() {
  const entries = Object.entries(SECTION_MODULES);
  await Promise.all(entries.map(async ([id, path]) => {
    try {
      const mod = await import(path);
      state.modules[id] = mod;
      if (mod.styles && !document.querySelector(`link[href="${mod.styles}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = mod.styles;
        document.head.appendChild(link);
      }
    } catch (err) {
      console.warn(`[sections] could not load "${id}"`, err);
    }
  }));
}

function renderAll() {
  const ui = uiFor(state.lang);
  SECTION_ORDER.forEach((id) => {
    const el = document.getElementById(id);
    const mod = state.modules[id];
    if (!el || !mod || typeof mod.default !== 'function') return;
    try {
      if (typeof state.cleanups[id] === 'function') state.cleanups[id]();
      const ctx = {
        id,
        lang: state.lang,
        data: state.content[state.lang],
        meta: state.content.meta,
        ui,
        reveal,
        params
      };
      state.cleanups[id] = mod.default(el, ctx);
    } catch (err) {
      console.error(`[sections] render failed for "${id}"`, err);
    }
  });
}

/* ---------- Floating nav + scroll-spy ---------- */
let spyObserver = null;

function buildNav() {
  const list = document.querySelector('.site-nav__links');
  const nav = state.content[state.lang].nav || {};
  const ui = uiFor(state.lang);
  const items = [`<li><a class="site-nav__link site-nav__link--home" href="#hero" data-spy="hero" aria-label="${esc(ui.home)}">JL</a></li>`];
  SECTION_ORDER.forEach((id) => {
    const key = NAV_KEYS[id];
    const el = document.getElementById(id);
    if (!key || !nav[key] || !el || !el.children.length) return;
    items.push(`<li><a class="site-nav__link" href="#${id}" data-spy="${id}">${esc(nav[key])}</a></li>`);
  });
  list.innerHTML = items.join('');
  startScrollSpy();
}

function setActive(id) {
  document.querySelectorAll('.site-nav__link').forEach((a) => {
    if (a.dataset.spy === id) {
      a.setAttribute('aria-current', 'true');
      // keep the active pill visible inside the scrollable nav on mobile
      const list = a.closest('.site-nav__links');
      if (list && list.scrollWidth > list.clientWidth) {
        const left = a.offsetLeft - (list.clientWidth - a.offsetWidth) / 2;
        list.scrollTo({ left, behavior: 'smooth' });
      }
    } else {
      a.removeAttribute('aria-current');
    }
  });
}

function startScrollSpy() {
  if (spyObserver) spyObserver.disconnect();
  if (!('IntersectionObserver' in window)) return;
  const visible = new Map();
  spyObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => visible.set(e.target.id, e.isIntersecting));
    const current = SECTION_ORDER.find((id) => visible.get(id));
    if (current) setActive(current);
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  SECTION_ORDER.forEach((id) => {
    const el = document.getElementById(id);
    if (el && el.children.length) spyObserver.observe(el);
  });
}

/* ---------- Boot ---------- */
async function loadContent() {
  const res = await fetch('data/content.json', { cache: 'no-cache' });
  if (!res.ok) throw new Error(`content.json HTTP ${res.status}`);
  return res.json();
}

async function boot() {
  initTheme();
  try {
    const [content] = await Promise.all([loadContent(), loadModules()]);
    state.content = content;
  } catch (err) {
    console.error(err);
    const lang = initialLang();
    document.getElementById('main').insertAdjacentHTML('afterbegin',
      `<p class="load-error" role="alert">${UI[lang].loadError}</p>`);
    return;
  }

  initLangMenu();

  await setLang(initialLang(), { persist: false });

  // Honor an initial #hash once content exists
  if (window.location.hash) {
    const target = document.getElementById(window.location.hash.slice(1));
    if (target) requestAnimationFrame(() => target.scrollIntoView());
  }
}

boot();
