# Customize it

Step-by-step guide to turn this site into your own CV. Do the steps in order the first time, then come back to individual sections when you need them.

Before you start: run the site locally ([QUICKSTART.md](QUICKSTART.md)) and keep it open while you edit. Search for the file names mentioned here with your editor.

Contents: [1 Content](#1-your-content) | [2 Photo](#2-photo) | [3 UI wording](#3-interface-wording-jsui-stringsjs) | [4 Hard-coded bits](#4-hard-coded-bits-to-change) | [5 Head and previews](#5-page-head-title-description-social-preview-favicon) | [6 Languages](#6-add-or-remove-a-language) | [7 Sections](#7-remove-reorder-or-add-sections) | [8 Hero background](#8-hero-background-wall-and-sun) | [9 Colors and fonts](#9-palette-and-fonts) | [10 Details](#10-specific-features) | [Privacy](#privacy-and-honesty-checklist)

## 1. Your content

All CV text lives in `data/content.json`, with one block per language: `meta`, `en`, `es`, `de`.

1. Start from the template: `data/content.template.json` copied over `data/content.json` ([TEMPLATE-USAGE.md](TEMPLATE-USAGE.md)).
2. Edit each language block. The field reference is [CONTENT-SCHEMA.md](CONTENT-SCHEMA.md). In short:

| Section on the page | Key in `content.json[lang]` | Notes |
| --- | --- | --- |
| Navigation labels | `nav` | A section's nav link only appears if the label exists |
| Hero | `hero` | `subtitle` is `Tag, Tag, Tag · Your City` |
| About and ID nameplate | `about` | `facts` with `id: "markets"` renders region chips |
| Skills / funnel | `funnel.stages`, `funnel.across` | Exactly four stages |
| Work | `work` | The role whose `period` says "Present" is open by default |
| Range | `range`, `recommendation` | Recommendation is optional |
| Education | `education` | One entry may be `featured` |
| Certifications | `certifications` | `url` is optional |
| Achievements | `achievements` | Counters and awards |
| Languages block (inside About) | `languages` | Needs flags for the codes used |
| Contact | `contact` | Falls back to `meta.email` and `meta.linkedin` |

3. Edit `meta` (shared by all languages): `name`, `email`, `linkedin`. Optionally add `cv` to get a download button in the hero:

```json
"meta": {
  "name": "Your Name",
  "email": "you@example.com",
  "linkedin": "https://www.linkedin.com/in/your-profile",
  "cv": { "en": "assets/cv/your-cv-en.pdf", "es": "assets/cv/your-cv-es.pdf", "de": "assets/cv/your-cv-de.pdf" }
}
```

Only languages listed under `cv` get a button. Put the PDFs in `assets/cv/` (create the folder).

4. Use a real JSON validator or your editor's JSON mode: one missing comma shows "Content could not be loaded".

Tip: write the English block first, then ask an assistant (or a native speaker) to translate and review the others. The German UI shows a note saying the translation awaits native-speaker review (`footerNote` in `js/ui-strings.js`); delete that note once a native speaker has checked it.

## 2. Photo

- File: `assets/img/juan.jpg`. It is referenced in `js/sections/hero.js` and `js/sections/about.js` (search for `assets/img/juan.jpg`). Simplest: overwrite that file with yours. Or rename it and change both references.
- Format and size: **square, 800 to 1000 px per side, JPEG (or WebP), under 250 KB**. Face in the upper half: the crop is `object-position: center top`.
- Keep a neutral background; it sits inside a framed "cartel".
- If the file is missing, the page shows your initials on a green plate (from `meta.name`) instead of a broken image.
- Update the alt text in `js/ui-strings.js` (`heroPhotoAlt`) for each language.
- Do not publish a photo of someone else, and check the image metadata (EXIF location) before publishing.

## 3. Interface wording (`js/ui-strings.js`)

This file holds the wording that is not CV content: section titles, labels, ARIA text. There is one block per language (`en`, `es`, `de`). Use `*asterisks*` to mark the italic accent word in a headline.

Things to change for sure:

| Key | Why |
| --- | --- |
| `idNumber` | The ID on the nameplate (`MKT-2016-JL`). Make up your own, for example `DES-2019-AB`. Not a real ID number. |
| `heroPhotoAlt` | Alt text of the portrait |
| `footer` | "Built with care in Buenos Aires." |
| `eduTitle`, `eduIntro`, `eduLogAria` | They tell Juan's story (journalism at UCA, 2016 to 2020). Rewrite them for yours. |
| `skillsIntro`, `rangeIntro`, `contactIntro`, `skillsTitle`, `rangeTitle`, `workTitle`, `aboutTitle` | Check the tone and the topics (AI, CRM, martech...) |
| `idHeader` | "Marketing ID": rename to your field |
| `homeCountry`, `achMarketsHome`, `achMarketsLATAM`, `achMarkets*` | Mention Argentina; see [markets](#markets-chips) |
| `eduMedal` | Text inside the prize medal ("1st") |
| `loopLabel`, `outLabel` | Funnel labels (marketing-specific) |

Any key can also be overridden per language from `content.json`: if `content.json[lang].ui` exists, its keys win over `js/ui-strings.js` (see `uiFor` in `js/main.js`). This lets a non-programmer keep all text in one file.

## 4. Hard-coded bits to change

A few strings are inside JavaScript or HTML. Search for them and replace.

| Where | What | Notes |
| --- | --- | --- |
| `js/sections/about.js`, `SIGN` and `WORD` | Flip sign: "Currently at VU Inc." / "Back in five minutes" and the Spanish words "Trabajando" / "Vuelvo enseguida" | Set your own company and phrases in the three languages. If you do not like the sign, see [removing it](#remove-the-flip-sign). |
| `js/sections/hero.js`, `TXT` | Ribbon text "Marketing · Automation · AI" and "Daily show" on the portrait card, and the "¡Hola!" ribbon | `TXT.<lang>.bill` and `billB` |
| `js/sections/hero.js`, line with `NA · EMEA · LATAM` | Band under the portrait | Change or remove |
| `js/main.js`, in `buildNav()` | The navigation home button shows `JL` | Replace with your initials |
| `index.html` favicon | A data-URI SVG with "JL" | Replace `JL` (appears twice in the SVG text) or provide your own icon file with `<link rel="icon" href="assets/img/favicon.png">` |
| `index.html` footer | `© <year> Juan Lundahl` is a placeholder replaced by JavaScript with `meta.name`; change the fallback text anyway |
| `js/main.js`, `STORE` | Storage keys `jl-lang`, `jl-theme` | Optional. If you rename them, also change them in the inline script in `index.html` |
| `js/sections/range.js` | The label "Marketing +" in the collaboration pairs | Replace the word `Marketing` with your field |
| `js/utils.js`, `marketChips` | The NA / EMEA / LATAM chips | See [markets](#markets-chips) |
| `css/tokens.css` and others | Comments mention Juan and Buenos Aires | Harmless; update if you like |

## 5. Page head: title, description, social preview, favicon

Edit `index.html`:

```html
<title>Your Name | Your Role</title>
<meta name="description" content="Your Name - Your Role. One sentence...">
<meta property="og:site_name" content="Your Name">
<meta property="og:title" content="Your Name | Your Role">
<meta property="og:description" content="One sentence for link previews.">
<meta property="og:image" content="https://YOUR-USER.github.io/YOUR-REPO/assets/img/juan.jpg">
<meta property="og:image:alt" content="Your Name, Your Role">
```

- **`og:image` must be an absolute URL.** Most link previews (WhatsApp, LinkedIn, Slack, X) ignore relative paths. You only know the final address after publishing (`https://<user>.github.io/<repo>/...`), so publish first, then edit this line, then push again. A 1200 x 630 px image gives the best preview; the portrait works too.
- At runtime `js/main.js` (`updateMeta`) rewrites `<title>`, description, `og:title`, `og:description`, `og:image:alt` and `og:locale` from `meta.name` and `hero` for the active language, in the browser. Crawlers that do not run JavaScript read what is in `index.html`, so keep the HTML values correct.
- `theme-color` meta tags (browser chrome color) are `#f3ebda` (light) and `#1a1714` (dark). Change them together with the palette, and also `THEME_COLORS` in `js/main.js`.
- `<html lang="en">` is the default; the script in the head and `setLang` update it.

## 6. Add or remove a language

The site ships with `en`, `es`, `de`. The list is hard-coded in a few places.

### Remove a language (for example German)

1. `data/content.json`: delete the `"de"` block.
2. `js/ui-strings.js`: delete the `de` block.
3. `js/main.js`: `LANGS = ['en', 'es']`; remove `de` from `LANG_NAMES` and `LOCALES`; remove the `if (c.startsWith('de')) return 'de';` line in `initialLang()`.
4. `index.html`: delete the `<li>` with `data-lang="de"` in the language menu, and change `l === 'de'` in the inline script in the head.
5. `js/sections/hero.js` (`TXT`) and `js/sections/about.js` (`SIGN`): delete the `de` entries (optional, they would just be unused).
6. `index.html`: delete the `<meta property="og:locale:alternate" content="de_DE">` line (it is regenerated by JavaScript anyway).

Only one language left? The menu still needs to exist in the DOM for the script, so hide it with CSS instead of deleting it: `#lang-menu { display: none; }` in `css/base.css`.

### Add a language (for example French, code `fr`)

1. `data/content.json`: copy the `"en"` block to a `"fr"` block and translate it. Keep the same keys.
2. `js/ui-strings.js`: copy the `en` block to `fr` and translate. Remember the functions (`stageOf`, `toolsCount`, `certCount`).
3. `js/main.js`:
   - `LANGS = ['en', 'es', 'de', 'fr']`
   - `LANG_NAMES.fr = 'Français'`, `LOCALES.fr = 'fr_FR'`
   - in `initialLang()` add `if (c.startsWith('fr')) return 'fr';`
4. `index.html`: add `<li><button class="lang__opt" type="button" data-lang="fr" lang="fr" aria-pressed="false"><b>FR</b>Français</button></li>` in the menu and add `'fr'` to the accepted values in the inline script in the head.
5. `js/sections/hero.js` (`TXT.fr`) and `js/sections/about.js` (`SIGN.fr`): add entries. Without them the English text is used.
6. Optional: in `css/base.css` the rule `:lang(de)` enables hyphenation for long German words; add `:lang(fr)` only if your language needs it.
7. `ui.months` (short month names used in Education) and `ui.levels` must be translated in the new `ui-strings` block.
8. Flags: see [flags](#flags-in-the-languages-block).

## 7. Remove, reorder or add sections

Sections are independent modules. The order and the list live in several places.

### Remove a section (example: Achievements)

1. `index.html`: delete `<section id="achievements" ...></section>`.
2. `js/main.js`: delete `achievements` from `SECTION_MODULES`, from `NAV_KEYS` and from `SECTION_ORDER`.
3. `css/base.css`: renumber the `--sec-n` values (see below) so the numbers stay consecutive.
4. Optionally delete `js/sections/achievements.js`, `css/sections/achievements.css` and the data in `content.json`.
5. If the section styles are linked in `index.html` (only `hero`, `about`, `skills` are), remove that `<link>` too.

Note: the Education section's medal is matched to an entry in `achievements.awards`. If you remove Achievements but keep Education, the featured entry simply shows no medal. Also the Achievements section shows the certifications count and panel; Certifications can be removed on its own.

### Section numbers (the colectivo "line number")

The number shown in each heading comes from CSS, not from the order in the page. In `css/base.css`:

```css
#about { --sec-n: "01"; }
#skills { --sec-n: "02"; }
#work { --sec-n: "03"; }
...
#contact { --sec-n: "08"; }
```

After removing or reordering sections, edit these lines so the numbers match what visitors see.

### Reorder sections

1. Move the `<section>` elements in `index.html` (the page order).
2. Reorder `SECTION_ORDER` in `js/main.js` (navigation order and scroll-spy).
3. Update the `--sec-n` numbers in `css/base.css`.
4. `hero` should stay first (it is the "Home" target of the nav).

### Add a section

1. Create `js/sections/<id>.js` exporting `default function render(el, ctx)` and optionally `export const styles = 'css/sections/<id>.css'`. See [ARCHITECTURE.md](ARCHITECTURE.md#the-section-module-contract).
2. Add `<section id="<id>" class="section" aria-labelledby="<id>-title"></section>` to `index.html`.
3. Register it in `SECTION_MODULES`, `SECTION_ORDER` and, if it should appear in the nav, `NAV_KEYS` (and add the label to `content.json[lang].nav`).
4. Add `#<id> { --sec-n: "09"; }` to `css/base.css`.
5. Add its data to `content.json` and its wording to `js/ui-strings.js`.

### Remove the flip sign

In `js/sections/about.js` delete the `<button class="cartelito" ...>` block, the `<p class="cartelito__hint">` line, the live-region `<p>` and the script block that starts with `const sign = el.querySelector('[data-sign]')` (and its `return` cleanup).

## 8. Hero background: wall and sun

The hero background is an Argentine motif: a worn celeste-white-celeste painted wall plus half a Sol de Mayo on the right. It is drawn in SVG in `js/sections/hero.js` (`WALL` and `solSVG()`), styled in `css/sections/hero.css`, with colors from `css/tokens.css`.

**One dial controls it all:** `--arg-opacity` in `css/tokens.css` (default `0.5`).

| Goal | How |
| --- | --- |
| Softer or stronger | Change `--arg-opacity` (0.2 is subtle, 0.8 is bold). Light: bands = dial, sun = dial x 1.6. Dark: bands = dial x 0.66, sun = dial x 1.2. |
| Plain color, no wall and no sun | `--arg-opacity: 0;` The hero then shows your page color. |
| Remove the huge outlined surname | In `css/sections/hero.css` add `.hero__ghost { display: none; }` |
| Remove the drawings from the code | In `hero.js`, delete `${WALL}` and `${solSVG()}` from the template (keep `<div class="hero__bg">`). |
| Different country colors | Change `--band-cel` (top and bottom bands) and `--wall-white` (middle band) in `css/tokens.css`, plus the dark values in the two dark blocks. For three horizontal bands that is enough (Argentina, Uruguay, Greece, Israel...). |
| Different pattern (stripes, tricolor) | Edit the three `<rect>` elements inside `WALL` in `hero.js`: they use the classes `cel` and `bla`. Add more rects or new classes and define their fill in `hero.css` next to `.hero__wall .cel`. |
| Different motif instead of the sun | Replace `solSVG()` with your own SVG that uses the class `hero__sol` (it is positioned by `.hero__sol`: centre on the right edge at 46% height). Reuse the classes `rs`, `rw`, `disc`, `ring` or write new styles. Tokens `--sol-a`, `--sol-b`, `--sol-disc` colour it. |
| Motif from your country | Same as above. Keep it original or properly licensed, and keep it `aria-hidden` (it is purely decorative). |

Keep text readable: the hero text sits on a soft paper scrim, so it passes contrast at any dial value, but test with your own colors.

## 9. Palette and fonts

Everything is driven by `css/tokens.css`. Change values there, not in components. Full explanation and token list: [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md).

- Light theme is in `:root`. Dark theme is repeated twice: in `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {...} }` and in `:root[data-theme="dark"] {...}`. **Keep both blocks identical** when you edit.
- The big brand colors: `--green` / `--enamel` (plates and buttons), `--oxblood` (accent word), `--ochre` / `--gold` (rules and shadows), `--celeste` / `--link`, `--paper` (background).
- Funnel stage colors: `--stage-1` to `--stage-4`, and the lit-plate colors at the top of `css/sections/skills.css` (`--fn-p1` to `--fn-p4`).
- Some section files define a local palette `--pt-*` (work, range, achievements, certifications, contact). To recolor those, change the `--pt-*` values at the top of each file.
- Fonts: change `--font-display`, `--font-accent`, `--font-sign`, `--font-sans` in `tokens.css` and the Google Fonts `<link>` in `index.html`. Keep a generic fallback in each stack.
- Always re-check contrast (aim for 4.5:1 for text) in both themes after recoloring.

## 10. Specific features

### Flags in the languages block

In `js/sections/about.js`, the `FLAGS` object maps a language `code` (from `content.json[lang].languages[].code`) to a small SVG flag. Provided: `es` (Argentina), `en` (UK), `de` (Germany). For another language add an entry, for example:

```js
fr: flag('<rect width="20" height="40" fill="#0055A4"/><rect x="20" width="20" height="40" fill="#FFFFFF"/><rect x="40" width="20" height="40" fill="#EF4135"/>')
```

The flag is decorative (`aria-hidden`); the language name and level carry the meaning. A `code` with no flag simply shows no flag. `steps` (1 to 4) fills the level pads.

### Tool levels

Each funnel tool can have `"level": "expert" | "advanced" | "intermediate" | "basic"`, shown as 4, 3, 2 or 1 filled pads plus the word (translated in `ui.levels`). If you leave `level` out, no meter is shown (nothing is invented). The legend in the section header lists expert, advanced and intermediate. Be honest: a level is a promise an interviewer may test.

### Markets chips

The three region chips (NA, EMEA, LATAM) come from `marketChips()` in `js/utils.js`, with LATAM highlighted as the "home" chip using `ui.homeCountry`. They appear in the About nameplate (fact with `id: "markets"`) and in the Achievements route panel (counter with `type: "markets"`). To change them:

1. Edit `marketChips` in `js/utils.js` (labels and which one is `--home`).
2. Edit `achMarketsHome`, `achMarketsNA`, `achMarketsEMEA`, `achMarketsLATAM` and `homeCountry` in `js/ui-strings.js` for all languages.
3. Edit the `markets` fact value in `content.json`, the `markets` counter, and the band text `NA · EMEA · LATAM` in `js/sections/hero.js`.
4. Or remove it: delete the `markets` fact and counter from `content.json` (the strip simply has one card fewer; the About nameplate then shows the next fact).

### Funnel stages

The skills section supports **exactly four stages**: the funnel drawing has four fixed plates. You can rename them freely (`name`, `tagline`, `doing`, `id`). If your field has no funnel, keep the four-stage shape with another metaphor (for example Discover, Build, Ship, Maintain), or remove the section ([see above](#remove-a-section-example-achievements)). Notes:

- `id` becomes an anchor (`#fn-stage-<id>`): lowercase, no spaces.
- `abbr` is a 1 to 3 letter code printed on the plate (defaults to the first three letters of the name).
- `featured: true` on a tool adds the "Core platform" tag (`ui.coreLabel`).
- The text `loopLabel` ("Loyalty feeds awareness") and `outLabel` ("Loyal customers") in `ui-strings.js` label the closing arrow and the funnel exit.
- The "Across the funnel" strip (`funnel.across`) is optional: remove the key and it disappears.

### The ADEPA-style award link

Awards connect in two places, matched by text, not by id:

- In **Education**, the featured entry's `award` is a case-insensitive regex tested against `"<award title> <award issuer>"` from `achievements.awards`. Match it to your award (for example `"best thesis"`), and the prize medal appears on the university plate.
- In **Achievements**, any award not shown with a counter becomes its own card. The code also has a special case: a counter whose `label` contains the text `ADEPA` takes its award text from the award that mentions ADEPA (`js/sections/achievements.js`). Edit or remove that regex if you want your own featured counter.

### Recommendation

`recommendation` is optional. Quote the text exactly, name the author with their role, and link to the original. `translation` (used in `es`/`de`) shows the text translated underneath. Only publish it with the author's permission.

## Privacy and honesty checklist

Your CV will be public and indexed. Go through this before every publish.

**Privacy**
- [ ] No phone number, national ID number, passport number, date of birth or home address. City and country are enough.
- [ ] A public email you are happy to receive spam on (or a contact form). Consider a dedicated address.
- [ ] Photo has no EXIF location data and shows nothing private in the background.
- [ ] Links point only to profiles you want employers to see (LinkedIn, portfolio).
- [ ] No private client names, internal numbers or confidential projects. Ask before naming clients under NDA.
- [ ] Your git commits use your GitHub **noreply** email, not your personal one ([DEPLOY-GITHUB-PAGES.md](DEPLOY-GITHUB-PAGES.md#commit-author-email-privacy)).
- [ ] Remember that old versions stay in the repository history: if you ever committed something private, it is not enough to delete it in a later commit.

**Honesty**
- [ ] Every date, title, company and number is true. Check against your real CV and LinkedIn.
- [ ] Education wording is exact: do not call a program a degree if it is not; say what you actually completed (a course, a diploma, a bachelor's).
- [ ] Tool levels match your real skill. Do not mark "expert" what you used once.
- [ ] Achievements and counters can be verified (awards, certifications with a working credential link).
- [ ] No "Open to work" or "available for hire" unless it is true today. Remove it when it stops being true.
- [ ] The flip sign (current company / "back in five minutes") says where you really are now.
- [ ] A **recommendation is published only with the author's written permission**, quoted exactly, with the correct name and role.
- [ ] Language levels are honest, and the German or other machine-assisted translations were reviewed by a native speaker (or keep the "pending review" note).
- [ ] You do not present someone else's work or the original author's content (Juan's texts, photo, recommendation) as yours. See [NOTICE.md](../NOTICE.md).

Finally, read the whole site once in each language and in both themes, on a phone and a desktop, before sharing the link.
