# Architecture

How the site is put together. Read this if you want to change behavior, add a section or understand a bug. No build step is involved: what you see in the repository is what the browser loads.

## File tree

```
.
├── index.html                 Page shell: head/meta, SVG ornament sprite, nav, empty <section>s, footer
├── .nojekyll                  Tells GitHub Pages to serve files as they are
├── .gitignore                 Ignores design-archive/ and .claude/
├── LICENSE  NOTICE.md  README.md  README.es.md
├── assets/
│   └── img/juan.jpg           Portrait (replace with yours)
├── css/
│   ├── tokens.css             Design tokens: colors (light + dark), fonts, spacing, motion, textures
│   ├── base.css               Reset, layout, typography, shared components, nav pill, language menu, reveal, footer
│   └── sections/              One stylesheet per section (hero, about, skills, work, range,
│                              education, certifications, achievements, contact)
├── js/
│   ├── main.js                Boot, content loading, i18n, theme, nav + scroll-spy, reveal, section registry
│   ├── utils.js               Shared helpers (esc, rich, accentTitle, countUp, photoHTML, marketChips...)
│   ├── ui-strings.js          UI microcopy per language (not CV content)
│   └── sections/              One module per section: hero, about, skills, work, range,
│                              education, certifications, achievements, contact
├── data/
│   ├── content.json           All CV content: meta + en + es + de
│   └── content.template.json  Fictional template with the same structure
└── docs/                      This documentation, plus design-explorations/ (HTML style boards)
```

## Boot sequence

1. The browser loads `index.html`. An **inline script in `<head>`** runs before first paint: it adds the class `js` to `<html>` (so CSS can hide `[data-reveal]` elements only when scripting works), and reads `localStorage` (`jl-theme`, `jl-lang`) to set `data-theme` and `lang` immediately. This avoids a flash of the wrong theme. Storage access is wrapped in `try/catch` because it can be blocked.
2. Stylesheets: `tokens.css`, `base.css`, and the three above-the-fold sections `hero`, `about`, `skills` are linked in the HTML. The rest are injected by JavaScript (see below).
3. `<script type="module" src="js/main.js">` runs `boot()`:
   1. `initTheme()` wires the theme button.
   2. `Promise.all([loadContent(), loadModules()])`: fetches `data/content.json` (`cache: 'no-cache'`) and dynamically `import()`s every module in `SECTION_MODULES` in parallel.
   3. If anything fails, a `role="alert"` message (`ui.loadError`) is shown.
   4. `initLangMenu()`, then `setLang(initialLang(), { persist: false })` renders everything.
   5. If the URL has a `#hash`, the page scrolls to it once content exists.

## `main.js` map

| Piece | Purpose |
| --- | --- |
| `SECTION_MODULES` | `id -> './sections/<id>.js'`. The registry of sections. |
| `NAV_KEYS` | `section id -> key in content.json[lang].nav` (skills uses `funnel`). |
| `SECTION_ORDER` | Render order, nav order, scroll-spy order. |
| `LANGS`, `LANG_NAMES`, `LOCALES` | Supported languages, their menu names and `og:locale` codes. |
| `STORE` | `localStorage` keys. |
| `state` | `{ content, lang, modules, cleanups }` |
| `reveal(scope)` | Reveal-on-scroll observer helper (passed to sections as `ctx.reveal`). |
| `initialLang()` | `?lang=` > saved choice > browser languages (`de`, `es`, `en`) > `en`. |
| `setLang()` | Applies a language and re-renders (see i18n flow). |
| `updateMeta()` | Rewrites `<title>`, description and Open Graph tags for the active language. |
| `initTheme()`, `syncThemeColor()` | Theme toggle and `theme-color` meta. |
| `loadModules()`, `renderAll()` | Import section modules (and inject their CSS), render them. |
| `buildNav()`, `startScrollSpy()`, `setActive()` | Floating nav and scroll-spy. |

## The section-module contract

Every `<section id="x">` in `index.html` is an empty container. The module `js/sections/x.js` fills it.

```js
// js/sections/example.js
import { esc, rich } from '../utils.js';

export const styles = 'css/sections/example.css';   // optional: injected once as a <link>

export default function render(el, ctx) {
  el.innerHTML = `
    <div class="container">
      <header class="section-head">
        <p class="eyebrow" data-reveal>${esc(ctx.ui.exampleEyebrow)}</p>
        <h2 class="display" id="example-title" data-reveal>${rich(ctx.ui.exampleTitle)}</h2>
      </header>
      ...
    </div>`;
  ctx.reveal(el);                    // observe the [data-reveal] elements
  return () => { /* cleanup */ };    // optional: runs before the next render
}
```

`ctx` contains:

| Field | Value |
| --- | --- |
| `id` | Section id (`"work"`) |
| `lang` | Active language code |
| `data` | `content.json[lang]` |
| `meta` | `content.json.meta` |
| `ui` | `{ ...UI[lang], ...content[lang].ui }` |
| `reveal` | `reveal(rootEl)` |
| `params` | `URLSearchParams` of the page |

Rules:

- **Always escape** text with `esc()` (or `rich()` for `*accent*` titles) before putting it into a template string. Content is data, never HTML.
- A module that has nothing to show can set `el.innerHTML = ''`. The CSS rule `.section:empty { padding: 0 }` collapses it and the nav skips it (a nav link needs a label **and** child elements).
- Listeners attached to `window`/`document` must be removed in the returned cleanup, because `render` runs again on every language switch (the skills module uses an `AbortController`).
- A heading id of the form `<id>-title` matches `aria-labelledby` on the `<section>` in `index.html`.
- Styles: a section CSS file should use global tokens from `tokens.css`. Some files define a scoped local palette `--pt-*`.

`loadModules()` imports each module, and if it exports `styles` and no `<link>` with that `href` exists, it adds one. A module that fails to import only logs a warning, so one broken section does not take down the page. Likewise `renderAll()` wraps each `render` in `try/catch`.

## Shared helpers (`js/utils.js`)

`esc`, `rich` (escape + `*em*`), `accentTitle` (accent word of a plain title), `prefersReducedMotion`, `countUp`, `onceVisible`, `modeIcon`, `initials`, `photoHTML` + `wirePhotoFallbacks` (image with initials fallback), `marketChips`.

## i18n flow

1. `initialLang()` picks the language: `?lang=xx`, then `localStorage('jl-lang')`, then the first matching entry of `navigator.languages`, then `en`.
2. `setLang(lang)`:
   - sets `state.lang` and `<html lang>`; saves the choice (unless `persist: false`); keeps a `?lang=` in the URL in step;
   - computes `ui = { ...UI[lang], ...content[lang].ui }`;
   - updates the language button, the `aria-pressed` state in the menu, the theme button's label;
   - fills every element with `data-i18n="key"` (only the skip link) from `ui`;
   - rebuilds the footer;
   - calls `updateMeta()`;
   - `renderAll()`: runs each section's cleanup, then `render(el, ctx)` with the new data;
   - `buildNav()`: regenerates the nav links from `content[lang].nav`.
3. Section text comes from two places: CV data from `content.json[lang]`, and wording from `ui-strings.js`. A few strings are inside section modules (see [CUSTOMIZE.md](CUSTOMIZE.md#4-hard-coded-bits-to-change)).
4. The language menu (`#lang-menu`) is an accessible disclosure: button with `aria-expanded`, a list of `aria-pressed` buttons, arrow-key navigation, Escape closes and returns focus, clicking outside closes.
5. German gets CSS hyphenation (`:lang(de)`) so long compounds do not overflow.

## Theme flow

- Default: follows `prefers-color-scheme`. Tokens for dark live in `css/tokens.css` twice: a media query block scoped to `:root:not([data-theme="light"])`, and `:root[data-theme="dark"]` for the manual choice. Keep them identical.
- The toggle (`#theme-toggle`) computes the effective theme, writes `data-theme="light|dark"` on `<html>`, saves `jl-theme` and updates `aria-pressed` and the `theme-color` meta tags (`syncThemeColor`).
- Icons swap by CSS depending on the effective theme.
- Plates and enamel are theme-independent tokens (`--enamel`, `--enamel-red`...) so they look the same day and night, like real plates.

## Navigation and scroll-spy

- `buildNav()` writes a link for the home button plus one per section in `SECTION_ORDER` that has a `NAV_KEYS` entry, a label in `nav`, and rendered children.
- `startScrollSpy()` uses one `IntersectionObserver` with `rootMargin: '-45% 0px -50% 0px'`, which turns each section into "active" while it crosses a thin band in the middle of the viewport. The first visible section in `SECTION_ORDER` gets `aria-current="true"`. On narrow screens the active pill is scrolled into view inside the nav.
- The nav is a floating pill: bottom on phones (respecting the safe area), top on desktop (`min-width: 900px`).
- Smooth scrolling and a `scroll-padding-top` of 96px are set in `base.css`.

## Reveal system

Any element with `data-reveal` starts hidden (`opacity: 0; translateY(26px)`) only when `html.js` is present, so no-JS visitors still see everything. `reveal(scope)` observes elements that are not yet `.is-visible`; one shared `IntersectionObserver` (`rootMargin: 0 0 -8% 0`, `threshold: 0.12`) adds `.is-visible` and stops observing. Stagger with `style="--reveal-delay: 120ms"`. Without `IntersectionObserver`, elements are shown immediately.

## Motion and reduced motion

- `base.css` ends with a global `prefers-reduced-motion: reduce` rule that shortens all transitions and animations to ~0 and disables smooth scrolling.
- `[data-reveal]` is shown directly, no transform.
- The funnel (`skills.js`) checks `prefersReducedMotion()`: plates are drawn fully lit, no rolling sign, no bump; the sign still tracks the stage.
- `countUp` writes the final number immediately.
- The achievements strip scrolls with `behavior: 'auto'`.

## Accessibility decisions

- Skip link first in the DOM; landmarks (`nav`, `main`, `footer`); one `h1`, section `h2`s linked with `aria-labelledby`.
- Everything interactive is a real `<button>` or `<a>`: the flip sign, the expandable work cards (`aria-expanded` + `aria-controls`), the funnel plates (links to stage cards, which are focusable with `tabindex="0"`), the achievements strip (arrow keys), certifications.
- Decorative drawings are `aria-hidden`. Meaningful ones have text alternatives (for example the funnel SVG has `role="group"` and each plate a full `aria-label`).
- The roller sign has a visually hidden `role="status"` live region announcing the current stage; the flip sign has an `aria-live` region and an updated accessible name.
- External links open in a new tab with `rel="noopener noreferrer"` and a visually hidden "(opens in a new tab)".
- Levels are pads **and** words, never colour only, never percentages. The hover-only certification highlight also works on focus.
- Focus ring: 2px celeste outline with offset; separate colors inside the dark nav.
- Contrast: tokens documented with ratios in `css/tokens.css`; text colors AA on their backgrounds in both themes. Ochre and celeste are fills only.
- The collapsible certifications panel is `inert` while closed.
- `lang` attributes on mixed-language phrases (for example the Spanish words on the flip sign, the English recommendation).
- Touch targets are at least 38 to 48px; no horizontal page scroll (`overflow-x: clip` on `body`).

## Performance notes

- No build, no framework: a handful of small files. Module imports run in parallel.
- Above-the-fold section CSS is linked in the HTML; the others are added by JS right after load.
- Fonts: `preconnect` to Google Fonts and `display=swap` (text shows immediately in fallback fonts). Only the weights used are requested.
- Images: the portrait uses `loading="lazy"` and `decoding="async"`; keep it under about 250 KB.
- The funnel scroll handler is passive and throttled with `requestAnimationFrame`; it only updates when a frame is requested. Plate labels are re-fitted after fonts are ready and on width changes only.
- Textures (noise, sidewalk tiles) are inline SVG data URIs, so no extra requests. The hero wall uses an SVG filter (`feTurbulence`) once.
- `content.json` is fetched once per page load; language switching re-renders from memory, no network.

## Dependencies on global names

| Name | Defined in | Used by |
| --- | --- | --- |
| `#f-corner`, `#f-rule`, `#f-flick` | SVG sprite in `index.html` | hero, education and others (`<use href="#f-rule">`) |
| `.container`, `.section`, `.section-head`, `.display`, `.eyebrow`, `.btn`, `.chip`, `.chapa`, `.level`, `.baldosas`, `.destino`, `.linea`, `.photo` | `css/base.css` | all sections |
| `--sec-n` per section id | `css/base.css` | the numbered `.eyebrow` label |
