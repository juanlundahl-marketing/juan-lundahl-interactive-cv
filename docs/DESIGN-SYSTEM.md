# Design system: "Porteño"

The visual identity of the site. "Porteño" means "from Buenos Aires port city". The idea: everyday Buenos Aires vernacular, not postcard tourism. Enamelled street and door plates, painted shop-front lettering, a restrained original *filete* (the traditional ornamental painting), sidewalk tiles (*baldosas*), colectivo (city bus) line numbers, café warmth on newsprint cream.

Everything lives in `css/tokens.css` (values) and `css/base.css` (shared components). All drawings are original; nothing is copied from existing artwork.

How the identity was chosen (four boards, one winner) is in [design-explorations/README.md](design-explorations/README.md).

## Principles

1. **Tokens first.** Components take colors, fonts, spacing and motion from CSS custom properties. To re-skin the site you change `css/tokens.css`, not components.
2. **Enamel is constant.** Plates, buttons and signs keep their colors in light and dark themes, like real plates under a street lamp. Paper, ink and rules change with the theme.
3. **Text-safe vs fill-only colors.** Some colors are for text (they pass 4.5:1), some only for fills and shadows (ochre, celeste).
4. **Never color alone.** Levels use pads plus words. Links have underlines or labels.
5. **Calm motion** with a full reduced-motion fallback.

## Palette tokens

### Light theme (default, `:root`)

| Token | Value | Role |
| --- | --- | --- |
| `--paper` / `--bg` | `#f3ebda` | Page: newsprint cream |
| `--paper-2` / `--bg-alt` | `#e9dec6` | Aged band for alternate sections |
| `--surface`, `--surface-2` | `#fbf6ea`, `#f6efe0` | Cards |
| `--rule`, `--rule-strong`, `--border`, `--border-strong` | `#d9ccb1`, `#bdaa87`, `#a39070` | Hairlines |
| `--ink`, `--ink-2`, `--muted` | `#1c1b19`, `#3b3833`, `#5f584d` | Text |
| `--green` / `--enamel` | `#1f5c4a` | Colectivo green: plates, primary buttons |
| `--oxblood` / `--enamel-red` | `#7a2430` | Bar-notable oxblood: accent word, red plates |
| `--ochre` | `#c08a2e` | Painted gold: fills and "sombra" shadows (not text) |
| `--gold` | `#8a6424` | Filete hairlines |
| `--gold-bright` | `#ebc66e` | Sign gold on dark plates |
| `--celeste`, `--celeste-ink`, `--link` | `#7fa8c9`, `#2d5f8a`, `#2d5f8a` | Weathered celeste (fill) and readable celeste (links, focus) |
| `--slate` | `#22302a` | Café chalkboard |
| `--sign-bg`, `--sign-ink` | `#1c1b19`, `#ebc66e` | Destination-sign black and gold |
| `--stage-1` to `--stage-4` | `#e9dec6`, `#ebc66e`, `#1f5c4a`, `#7a2430` | Funnel stages |

### Dark theme: "Noche de bar notable"

Warm near-black, not blue-black. Defined twice (OS preference and manual toggle). Main values:

| Token | Value |
| --- | --- |
| `--paper` / `--bg` | `#1a1714` |
| `--paper-2` | `#201c18` |
| `--surface`, `--surface-2` | `#24201b`, `#2a251f` |
| `--ink`, `--ink-2`, `--muted` | `#f2e8d5`, `#dcd0ba`, `#b0a592` |
| `--green`, `--oxblood` (as text) | `#6fb59a`, `#e0828a` |
| `--ochre` / `--gold` | `#d7a64b` |
| `--celeste`, `--link` | `#8fb9da` |
| `--stage-1..4` | `#2a3d4f`, `#d7a64b`, `#6fb59a`, `#e0828a` |
| `--nav-bg`, `--nav-ink` | cream pill with dark text (inverted) |

Plate tokens (`--enamel`, `--enamel-ink`, `--enamel-red`, `--sign-bg`, `--sign-ink`) are **not** redefined in dark mode on purpose.

### Other token groups

- **Wall and sun** (hero): `--arg-opacity`, `--band-cel`, `--wall-white`, `--sol-a`, `--sol-b`, `--sol-disc`.
- **Textures** (inline SVG): `--noise` (paper grain), `--baldosa` / `--baldosa-dark` (sidewalk tile), `--vainilla` (faint sidewalk pattern on the dark page), `--chip-tr` (chipped enamel corner). `--page-texture` and `--tile` point to the right ones per theme.
- **Type scale**: `--fs-xs` to `--fs-lg`, fluid `--fs-h1`, `--fs-h2`, `--fs-ghost` (the giant outlined surname).
- **Space**: `--space-1` to `--space-9`, `--gutter` (16, 32, 48px by breakpoint), `--maxw` 1180px.
- **Radius**: `--radius-sm` 4px, `--radius` 6px, `--radius-lg` 12px, `--radius-pill`.
- **Effects**: `--shadow-sm|md|lg`, `--focus-ring`.
- Legacy names (`--navy`, `--accent`, `--red`...) remain as aliases of the palette so old component CSS keeps working.

## Fonts

All four are by Argentine type designers and are free on Google Fonts. The site loads them from Google Fonts with one `<link>` in `index.html` (no files are stored in the repository).

| Token | Family | Used for | Designer |
| --- | --- | --- | --- |
| `--font-display` | Sansita (700, 800, 900, italic 800) | Headlines | Omnibus-Type |
| `--font-accent` | Sansita Swashed (600, 800) | The accent word in a headline, in oxblood with an ochre shadow | Omnibus-Type |
| `--font-sign` | Encode Sans Condensed (500 to 800) | Plates, signs, labels, buttons, nav (uppercase, wide tracking) | Impallari Type |
| `--font-sans` | Archivo (400 to 700, italic 400) | Body text | Omnibus-Type |

Where to get them: https://fonts.google.com (search the family names). To use others, change the four tokens and the `<link>` in `index.html`. Keep one condensed face for signage and one display face with a swash or italic for the accent word, and keep a safe fallback in every stack. For fully offline use, download the font files, add `@font-face` rules and remove the Google links.

## Components

| Component | Class(es) | Description | Defined in |
| --- | --- | --- | --- |
| **Chapa** (enamel plate) | `.chapa`, `.chapa--red`, `.chapa--cel` | Small plate: two rivets, a cream inner line, a chipped corner showing iron. | `base.css` |
| **Destino** (destination sign) | `.destino` | Black strip with gold condensed caps, like the front of a bus. | `base.css` |
| **Línea** (line number) | `.linea` | Boxed number with an ochre underline and offset shadow. Each section label pairs a line number with a destino. | `base.css` |
| **Section label** | `.section-head > .eyebrow:first-child` | Line number (`--sec-n`) + black destination sign + gold lamp dot. | `base.css` |
| **Headline** | `.display`, `.display em` | Sansita 900, with the accent word in Sansita Swashed, oxblood, with an ochre "sombra". | `base.css` |
| **Baldosas** (tile divider) | `.baldosas`, `.section-head::after` | Strip of calcáreo tiles closing every heading, and the footer edge. | `base.css`, `tokens.css` |
| **Filete** | `.filete`, sprite `#f-corner`, `#f-rule`, `#f-flick` | Thin ornamental flourishes in gold, celeste, ochre and oxblood. | `index.html` sprite |
| **Enamel button** | `.btn`, `.btn--ghost` | Green plate with a cream inner line and an ochre offset shadow; ghost is an ink outline. | `base.css` |
| **Chip and level pads** | `.chip`, `.level`, `.level__dots i.on` | Condensed caps tags; four rounded "vereda" pads for tool levels. | `base.css` |
| **Nav pill** | `.site-nav` | Floating black (cream in dark) pill with a green "JL" roundel. | `base.css` |
| **Nameplate** (ID card) | `.nameplate` | Enamelled door plate with rivets, sheen and chipped corners; photo, name, role, facts, ID number. | `sections/about.css` |
| **Cartelito** (flip sign) | `.cartelito` | Hanging shop sign on a rope; flips on a 3D Y-rotation between two faces (green and oxblood). A real button. | `sections/about.css` |
| **Language cards** | `.lang-card` | Flag, name, level pads. | `sections/about.css` |
| **Funnel plates** | `.fn-pl`, `.fn-svg` | Four trapezoid enamel plates (celeste, gold, green, oxblood) that fill top to bottom while scrolling; roller sign `.fn-sign`; loop arrow back to awareness. | `sections/skills.css` + `skills.js` |
| **Fascia** (shop front) | `.job__head` | Green enamel header with a cream/gold inner line, company name in cream with a gold drop shadow, painted seal for the current role. | `sections/work.css` |
| **Libreta** (study log) | `.libreta`, `.mat`, `.tt` | Ruled-paper log with a red margin line, matrícula cards and a school-timetable grid. | `sections/education.css` |
| **Framed plate** | `.uni`, `.rec`, `.uni__plate` | Filete corners from the sprite, gold double rule; prize ribbon medal. | `sections/education.css`, `range.css` |
| **Chalkboard card** | `.ach` | Café pizarra (slate) counters with chalk text. | `sections/achievements.css` |
| **Route panel** | `.ach--markets`, `.route__hd` | Bus route panel with region chips ending at the home base. | `sections/achievements.css` |
| **Enamel row** | `.cert` | Certification row that becomes a green plate on hover or focus. | `sections/certifications.css` |
| **Mail plate** | `.contact__mail` | Big painted fascia with rivets for the email. | `sections/contact.css` |

## Motion rules

- Easing: `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)` for most things; `--ease-spring` for playful bounces.
- Durations: `--dur-fast` 160ms (hover, press), `--dur` 320ms (theme/background), `--dur-slow` 700ms (reveal on scroll).
- Reveal: fade + 26px rise, once, staggered by `--reveal-delay`.
- Buttons lift on hover (`translate(-1px,-2px)`, bigger offset shadow) and press down on active.
- Funnel: plate fill follows scroll position (not time); roller sign translates in `em` steps.
- Hero surname drifts +-2% over 18s (very slow).
- **Reduced motion:** a global rule removes transitions and animations; reveal shows immediately; the funnel is fully lit; counters show the final value; the flip sign still flips because it is user-triggered, but instantly.
- No auto-playing carousel, no parallax, no scroll hijacking.

## Contrast notes

Ratios are recorded in comments at the top of `css/tokens.css`.

- Light on `--paper`: ink 14.5:1, ink-2 9.8:1, muted 5.9:1, green 6.6:1, oxblood 8.3:1, link 5.7:1, gold 4.5:1.
- Dark on `--bg`: ink 14.7:1, muted 7.4:1, oxblood 6.6:1, ochre 8.0:1, celeste 8.6:1, green 7.4:1.
- Ochre and weathered celeste are **fill only**; do not use them for text on paper.
- Lit funnel plates: ink on celeste 5.7:1, on gold 5.7:1, on green 7.1:1, on oxblood 9.6:1.
- The hero text sits on a soft paper scrim so contrast holds at any `--arg-opacity`.
- If you change a token, re-test text pairs (browser dev tools show contrast ratios) in both themes.

## Make a different identity

The structure (enamel plates, signs, tiles) is a skin on a neutral layout. You have three levels of change.

**1. Re-color (10 minutes).** Edit `css/tokens.css` only.
   - Keep the **token names**. Components depend on them; renaming one breaks pieces silently.
   - Change both dark blocks identically.
   - Check the lit funnel colors in `css/sections/skills.css` (`--fn-p1..4`) and the `--pt-*` local palettes at the top of the other section files.
   - Update `theme-color` meta tags in `index.html` and `THEME_COLORS` in `js/main.js`.

**2. Re-font (10 minutes).** Change the four font tokens and the Google Fonts link.

**3. Re-theme (a day).** Replace the vocabulary (colectivo, filete, enamel) with your own: another city's signage, a design school poster look, a minimalist system. Do it the way this one was made:
   - Ask Claude for 2 to 4 alternatives as standalone HTML style boards before touching the site ([HOW-IT-WAS-BUILT.md](HOW-IT-WAS-BUILT.md#the-style-board-technique)).
   - Compare them, pick one, then port only tokens and shared components to `tokens.css` and `base.css`.
   - Redraw the ornaments (the sprite in `index.html`, the favicon, the hero background) in your motif.
   - Look at the boards that were compared in [design-explorations/](design-explorations/README.md): A is a sober celeste-and-white direction, B is the signage direction, B2a and B2b refine it. They show how far the same content can travel.

Remove the Argentine wall and sun with `--arg-opacity: 0` ([CUSTOMIZE.md](CUSTOMIZE.md#8-hero-background-wall-and-sun)).
