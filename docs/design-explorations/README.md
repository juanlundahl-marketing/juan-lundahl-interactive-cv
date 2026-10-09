# Design explorations

Before the site was changed, the look and the funnel interaction were explored as **standalone HTML boards**: single files that show hero, buttons, cards, plates and other pieces in one candidate style, without touching the real site. Comparing finished-looking alternatives side by side is much faster (and cheaper) than iterating inside the real code. See [the technique](../HOW-IT-WAS-BUILT.md#the-style-board-technique).

These boards are kept as a record and as a starting point for your own explorations. They show the author's sample content (name, role, portrait), so treat that as demo material under the terms in [NOTICE.md](../../NOTICE.md).

## How to open them

They need a local web server (they load the real stylesheets and `data/content.json` from the project root). From the **project root**:

```bash
python -m http.server 8000
```

Then open:

- http://localhost:8000/docs/design-explorations/style-boards/board-b2a-porteno.html
- http://localhost:8000/docs/design-explorations/funnel-boards/funnel-v2a-scroll.html

(Other server options: [QUICKSTART.md](../QUICKSTART.md).) The boards use relative paths such as `../../../css/tokens.css` and `../../../assets/img/juan.jpg`, which resolve from this folder to the project root. If you move the folder, adjust those paths.

## Style boards (`style-boards/`)

Four directions for the whole identity. Each is self-contained (its own CSS inside the file).

| Board | Direction | What it explores | Outcome |
| --- | --- | --- | --- |
| [A, celeste](style-boards/board-a-celeste.html) | "Celeste y blanco, sobrio" | Sober sky-blue and white, an Argentine flag palette used with restraint; clean cards, rounded buttons, wave motif. | Not chosen. |
| [B, porteña](style-boards/board-b-portena.html) | "Cartelería porteña" | First version of the street-signage idea: cream paper, black street-sign ink, enamel plates and painted lettering. | First version of the direction that was refined into B2a. |
| [B2a, porteño](style-boards/board-b2a-porteno.html) | "Lo porteño, de todos los días" | **Chosen.** Everyday Buenos Aires: bondi-green enamel plates, oxblood, ochre, filete flourishes, sidewalk tiles, colectivo line numbers, a night version ("Noche de bar notable"). | **Became the site's identity** (`css/tokens.css`, `css/base.css`). |
| [B2b, porteño y campo](style-boards/board-b2b-porteno-campo.html) | "De la vereda al campo" | B2a plus a country-side touch: a worn celeste-white-celeste painted wall and a half Sol de Mayo on the hero. | **Its wall and half sun were reused** as the hero background. |

## Funnel boards (`funnel-boards/`)

Four ways to show the "marketing funnel" skills section. They read the real `data/content.json` so the comparison uses real content, and they share the site's tokens.

| Board | Idea | Outcome |
| --- | --- | --- |
| [v1, simple](funnel-boards/funnel-v1-simple.html) | A plain, classic funnel: four stacked enamel plates that narrow, with one line and the tools beside each. No animation. | Not chosen. |
| [v2a, scroll story](funnel-boards/funnel-v2a-scroll.html) | **Chosen.** The funnel stays pinned while stage cards scroll by; each card fills its plate as you read; a roller destination sign shows the stage; loyalty loops back to awareness. | **Became the Skills section** (`js/sections/skills.js`). |
| [v2b, explorer](funnel-boards/funnel-v2b-explorer.html) | "La cajonera": a rack of plates you pull out like drawers; a detail plate opens; a level filter lights tools. | Not chosen. |
| [v3, hybrid](funnel-boards/funnel-v3-hybrid.html) | The simple funnel, one stage at a time: each plate is a button, opening one dims the others; arrow keys move between plates; accordion on phones. | Not chosen. |

The boards have links to each other at the top (the funnel boards) so you can flip between versions.

## Using this to make your own identity

1. Ask Claude for 2 to 4 boards in directions that fit you (for example a monochrome editorial look, a retro-tech terminal look, a handmade-paper look).
2. Open them next to each other, pick one or mix two ("B2a with the wall from B2b").
3. Port the winner into `css/tokens.css` and `css/base.css`, keeping the token names ([DESIGN-SYSTEM.md](../DESIGN-SYSTEM.md#make-a-different-identity)).

## Note on the funnel boards and data

The funnel boards fetch `data/content.json` live (`../../../data/content.json` from their folder). Boards v1 and v3 were written against an earlier data shape, so they contain a small `adapt()` function that maps the current shape (`funnel.across`, stage `doing`) onto it. If you change the structure of `funnel` in `content.json`, the boards may need the same kind of adjustment; they are explorations, not part of the site.
