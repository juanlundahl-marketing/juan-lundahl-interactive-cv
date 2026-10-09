# Interactive CV

An interactive CV and portfolio that replaces the static PDF resume. One page, three languages (English, Spanish, German), light and dark themes, and a visual identity borrowed from everyday Buenos Aires: enamel street plates, painted shop signs, sidewalk tiles and colectivo line numbers.

**Live demo:** https://juanlundahl-marketing.github.io/juan-lundahl-interactive-cv/

Español: [README.es.md](README.es.md)

It is plain HTML, CSS and JavaScript. No build step, no dependencies, no framework. You can fork it, replace the content with your own and publish it for free on GitHub Pages. Everything you need to do that is in this repository.

## What is on the page

- **Hero** with a worn painted-wall background (celeste, white, celeste) and half a Sol de Mayo, a big headline, tags, call-to-action buttons and a framed portrait.
- **About** with an enamel door "ID nameplate" (photo, name, role, key facts) and a hanging shop sign that flips between two messages.
- **Languages** block with small flags and four-step level pads, inside About.
- **Skills as a marketing-funnel scroll story**: a funnel of four enamel plates fills up as you scroll, a roller destination sign shows the current stage, and each stage lists tools with levels.
- **Work** timeline of expandable role cards.
- **Range**: industries, ways of working (on-site, remote, hybrid), cross-team collaboration, and a quoted recommendation.
- **Education** with a framed university plate, a prize medal and a "study log" timeline of courses.
- **Certifications** list with links to the credentials.
- **Achievements**: animated counters on chalkboards, a markets route panel (NA, EMEA, LATAM) and a swipeable strip.
- **Contact** with a big mailto plate and a LinkedIn button.
- **ES / EN / DE switch** in the navigation, remembered between visits and also set by `?lang=de` in the URL.
- **Light / dark theme** with a toggle ("Noche de bar notable" is the dark one), also following the system preference.
- **Accessibility**: skip link, semantic landmarks, keyboard-operable everything, visible focus rings, ARIA labels and live regions, AA contrast, no information carried by colour alone.
- **Reduced motion**: with `prefers-reduced-motion` everything is static and fully lit.
- **Responsive**: floating pill navigation (bottom on phones, top on desktop) with scroll-spy.

## Tech notes

- No build, no bundler, no package manager. Native ES modules and `fetch`.
- All content lives in `data/content.json`. The page code never contains your CV text.
- Only external resource: Google Fonts (Sansita, Sansita Swashed, Archivo, Encode Sans Condensed).
- All paths are relative, so it works from a GitHub Pages sub-folder (`https://user.github.io/repo/`) and from any other static host.
- A `.nojekyll` file at the root tells GitHub Pages to serve the files as they are.

## Quick start

You need a local web server, because browsers block ES modules and `fetch` on `file://`.

```bash
# Option 1: Python (already installed on macOS and most Linux)
python -m http.server 8000

# Option 2: Node
npx serve .
```

Option 3, Windows PowerShell with nothing to install: see [docs/QUICKSTART.md](docs/QUICKSTART.md).

Then open http://localhost:8000. (`npx serve` prints its own address.)

## Make it yours in 10 steps

1. [ ] **Fork or download** this repository and run it locally (Quick start above).
2. [ ] **Copy the template over the data**: `data/content.template.json` over `data/content.json`. See [docs/TEMPLATE-USAGE.md](docs/TEMPLATE-USAGE.md).
3. [ ] **Fill in your content** in all three languages (or remove the ones you do not need). Field reference: [docs/CONTENT-SCHEMA.md](docs/CONTENT-SCHEMA.md).
4. [ ] **Replace the photo**: `assets/img/juan.jpg` (square, 800 to 1000 px, JPEG, under 250 KB). Keep the file name or change it in `js/sections/hero.js` and `js/sections/about.js`.
5. [ ] **Edit the interface wording** in `js/ui-strings.js` (ID number, footer, education intro, and so on).
6. [ ] **Edit the hard-coded bits**: the flip-sign text in `js/sections/about.js`, the "JL" monogram in `js/main.js` and the favicon in `index.html`.
7. [ ] **Update the page head** in `index.html`: title, description, Open Graph tags, and the absolute `og:image` URL once you know your Pages address.
8. [ ] **Choose your look**: keep the Porteño style, or swap the palette and fonts in `css/tokens.css` and the hero background. See [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md).
9. [ ] **Review privacy and honesty**: no phone, ID number or home address; every fact is true; recommendations have permission. The checklist is in [docs/CUSTOMIZE.md](docs/CUSTOMIZE.md#privacy-and-honesty-checklist).
10. [ ] **Publish** on GitHub Pages: [docs/DEPLOY-GITHUB-PAGES.md](docs/DEPLOY-GITHUB-PAGES.md).

The full walk-through is [docs/CUSTOMIZE.md](docs/CUSTOMIZE.md).

## Documentation

| Document | What it covers |
| --- | --- |
| [docs/QUICKSTART.md](docs/QUICKSTART.md) | Run it locally in five minutes ([Español](docs/es/GUIA-RAPIDA.md)) |
| [docs/CUSTOMIZE.md](docs/CUSTOMIZE.md) | Step-by-step customization and the privacy checklist |
| [docs/CONTENT-SCHEMA.md](docs/CONTENT-SCHEMA.md) | Every field of `data/content.json` and `js/ui-strings.js` |
| [docs/TEMPLATE-USAGE.md](docs/TEMPLATE-USAGE.md) | How to use `data/content.template.json` |
| [docs/DEPLOY-GITHUB-PAGES.md](docs/DEPLOY-GITHUB-PAGES.md) | Publishing with the GitHub CLI or the web UI, and troubleshooting |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | File tree, section modules, i18n, theme, scroll-spy, reveal |
| [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) | The Porteño style: tokens, fonts, components, motion |
| [docs/HOW-IT-WAS-BUILT.md](docs/HOW-IT-WAS-BUILT.md) | The process with Claude Code, prompt library, lessons learned |
| [docs/design-explorations/](docs/design-explorations/README.md) | The style boards and funnel alternatives that were compared |
| [docs/FAQ.md](docs/FAQ.md) | Short answers to common questions |

## License and credits

- Code and structure: **MIT License**, copyright Juan Lundahl. See [LICENSE](LICENSE).
- **Juan's personal content is not licensed for reuse**: the texts, photo, name, certifications, the third-party recommendation and the personal data in `data/content.json` and `assets/img/juan.jpg`. If you build your own CV from this, replace all of it with yours. Details in [NOTICE.md](NOTICE.md).
- Fonts by Omnibus-Type (Sansita, Sansita Swashed, Archivo) and Impallari Type (Encode Sans Condensed), served by Google Fonts.
- Inspired by a social-media reel about interactive resumes. Designed and built with Claude Code.
