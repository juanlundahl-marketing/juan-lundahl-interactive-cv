# How it was built

This site was designed and built in conversation with **Claude Code (desktop app)**, by someone who is not a professional front-end developer. This page describes the process so you can repeat it with your own CV, plus a library of prompts to copy. You do not need to know HTML or CSS. You need to know your own story, to look at the result critically, and to say what you want in plain words.

It was inspired by a social-media reel about interactive resumes: a portfolio that you scroll and play with, instead of a PDF.

Contents: [The process](#the-process-step-by-step) | [Orchestrating agents and models](#orchestrating-agents-and-models) | [The style-board technique](#the-style-board-technique) | [Funnel alternatives](#funnel-alternatives) | [QA](#qa-pass) | [Publishing](#publishing) | [Prompt library](#prompt-library) | [Lessons learned](#lessons-learned)

## The process, step by step

### 1. Start from an inspiration

Collect two or three examples you like (the reel, a site, a screenshot). Tell Claude what you like in each: the interaction, the layout, the feeling. Do not ask it to copy; ask it to analyze.

### 2. Analyze it

Ask Claude to break the inspiration down: which sections, which interactions, what is decorative and what carries meaning, what would be hard to build, what would be accessible or not. The output is a short list of "ingredients" and "risks".

### 3. Interview

Before any code, ask Claude to **interview you**: who is the audience (recruiters? clients?), what you want to be known for, languages, tone, what you will not publish, what your real strengths are, which sections matter. Answer in your own words. This avoids a generic result and settles the honesty rules early (no invented titles, no "open to work" unless true).

### 4. Plan

Ask for a plan before building: sections, data model (what goes in a JSON file), file layout, how languages work, how it will be published, and a test checklist. Read it and correct it. A good plan decides: "all content in one JSON file; every section is a separate module; one set of design tokens". That architecture is what makes the site easy to reuse.

### 5. Gather the content

Give Claude your CV (PDF or text) and your LinkedIn export or profile text. Ask it to extract facts into the JSON structure, and to **list anything it was unsure about** instead of guessing. Then you review every line: dates, titles, numbers, spelling of company names. Fill gaps yourself.

### 6. Explore the look with style boards

Do not let the first design be the final one. See [the style-board technique](#the-style-board-technique).

### 7. Design the signature interaction

Pick the one interaction people will remember (here, the marketing funnel that fills as you scroll). Ask for alternatives and compare ([funnel alternatives](#funnel-alternatives)).

### 8. Build the sections

Build one section at a time as an independent module, in parallel when they do not touch the same files ([orchestration](#orchestrating-agents-and-models)).

### 9. Languages

Write the main language first. Then ask for translations, and ask for a separate "i18n pass" to check that every string is translated and nothing is hard-coded in English. Ask a native speaker to review machine-assisted translations.

### 10. QA

Test across languages, themes, devices and keyboard-only ([QA pass](#qa-pass)). Run an honesty and privacy review.

### 11. Publish

With the GitHub CLI and GitHub Pages ([DEPLOY-GITHUB-PAGES.md](DEPLOY-GITHUB-PAGES.md)). Then fix the absolute `og:image` URL and verify the live site.

## Orchestrating agents and models

Claude Code can run several **background agents** at once. Each agent is a separate Claude with its own task and its own context. You describe the task and the files it owns; it works and reports back. The main conversation acts as coordinator: it plans, hands out work, checks results and commits.

A rule of thumb that worked: **match the model to the difficulty.**

| Kind of work | Model tier | Examples |
| --- | --- | --- |
| Design, architecture, complex interaction | The strongest model | Choosing the design system, tokens and component vocabulary; the scroll-driven funnel; the 3D flip sign; the section-module contract; the accessibility strategy |
| Building well-specified sections | A mid-size model | Work timeline, certifications list, achievements strip, contact; translating a design into a section module and its CSS |
| Mechanical extraction and validation | The lightest model | Pulling facts from a CV into JSON; checking that three language blocks have the same keys; link checks; renaming; formatting; comparing files |

Why it works: the expensive thinking is spent where choices are hard, and the repetitive work is cheap and fast.

How to run it well:

- **Give each agent file ownership.** "You own `js/sections/work.js` and `css/sections/work.css`. Do not edit anything else." Two agents editing the same file produces conflicts and silent overwrites.
- **Write a clear contract first** (the section-module convention in `main.js`, the token names). Agents work independently because they share the contract.
- **Be explicit about what not to touch** ("do not run git commands, the coordinator commits").
- **Ask for a short report**: files changed, decisions, gaps. Read it before trusting it.
- **Verify**: open the page and look. An agent saying "done" is not a test.
- Keep a single coordinator who commits, so the history is clean.

## The style-board technique

A style board is **one standalone HTML file** that shows a candidate identity: palette, fonts, hero, buttons, cards, a sample section, light and dark. It does not touch the site.

How:

1. Describe the feelings you want, in words and references, not in hex codes ("warm, local, handmade, not corporate").
2. Ask for **2 to 4 alternatives**, each as a separate HTML board, in clearly different directions. (This project: A sober celeste-and-white; B street signage; then B2a and B2b as refinements.)
3. Open them side by side. Say what you like and dislike in each ("A is too generic; B has the right soul but is heavy").
4. Ask for a refinement round that combines the best parts. Repeat once or twice.
5. Only when you choose, ask Claude to port the winner into `tokens.css` and `base.css`. Keep token names stable.

The boards of this project are in [design-explorations/](design-explorations/README.md).

Why it is worth it: comparing finished-looking pages is easy even for a non-designer; changing a decision in a board costs minutes, changing it in the real site costs hours.

## Funnel alternatives

The same technique worked for a single interaction. Four versions of the "skills as a marketing funnel" section were built as boards that read the real data: a simple static funnel, a scroll story (chosen), a drawer-style explorer and a one-stage-at-a-time hybrid. Look at them with a real scroll wheel and on a phone before choosing, because a design that looks good in a screenshot can be annoying in use. See [design-explorations/](design-explorations/README.md#funnel-boards-funnel-boards).

## QA pass

Ask for a structured pass and then do part of it yourself.

- **Languages:** every section in EN, ES, DE. Long German words not overflowing; no English left in the other languages; the `lang` attribute right.
- **Themes:** light and dark, including the manual toggle and the OS setting. Contrast on every plate.
- **Devices:** a narrow phone (360px), a tablet, a desktop, a wide monitor. The floating nav fits. No horizontal scroll.
- **Keyboard:** Tab through everything; focus is always visible; the language menu, the flip sign, the work cards, the funnel plates and the achievements strip all work with Enter, Space and arrows.
- **Reduced motion:** turn on the OS setting and reload.
- **Screen reader:** at least a quick pass with one.
- **Content honesty and privacy:** [CUSTOMIZE.md checklist](CUSTOMIZE.md#privacy-and-honesty-checklist).
- **Links:** every external link works; the PDF paths exist.
- **Fresh load vs. cached.**

When a tool takes screenshots for you: remember a screenshot taken right after load can be taken before the reveal animations run, so a section can look empty. Scroll first, wait a moment, then capture.

## Publishing

Ask Claude to prepare the repository (README, license, `.nojekyll`, `.gitignore`), create it with `gh`, enable Pages and report the URL. Then fix the absolute `og:image`, push again, and verify the live site in each language. Details in [DEPLOY-GITHUB-PAGES.md](DEPLOY-GITHUB-PAGES.md).

## Prompt library

Copy, paste, adapt the bracketed parts. Each prompt is given in English and Spanish. They are written for Claude Code in your project folder.

### 1. Analyze an inspiration

EN: `Here are [links or screenshots] of interactive portfolios I like. Analyze them: sections, interactions, what is decorative vs meaningful, what would be hard to build with plain HTML/CSS/JS and no build step, and accessibility risks. Give me a short list of ingredients to keep and risks to avoid. Do not write code yet.`

ES: `Acá tenés [links o capturas] de portfolios interactivos que me gustan. Analizalos: secciones, interacciones, qué es decorativo y qué tiene sentido, qué sería difícil con HTML/CSS/JS puro sin build, y riesgos de accesibilidad. Dame una lista corta de ingredientes para conservar y riesgos para evitar. Todavía no escribas código.`

### 2. Interview me

EN: `Before building anything, interview me, one or two questions at a time, to understand my goals: audience, what I want to be known for, tone, languages, sections, what I do not want to publish (phone, address, ID), and what I can prove. Summarize my answers at the end as a brief I can approve.`

ES: `Antes de construir nada, entrevistame, de a una o dos preguntas por vez, para entender mis objetivos: audiencia, por qué quiero que me conozcan, tono, idiomas, secciones, qué no quiero publicar (teléfono, domicilio, DNI) y qué puedo demostrar. Al final resumí mis respuestas como un brief que pueda aprobar.`

### 3. Plan

EN: `Write a plan for an interactive CV as a static site with no build step: sections, data model in one JSON file, file layout, how languages and dark mode work, how it will be published on GitHub Pages, and a test checklist. List open questions and tradeoffs. Wait for my approval.`

ES: `Escribí un plan para un CV interactivo como sitio estático sin build: secciones, modelo de datos en un único JSON, estructura de archivos, cómo funcionan los idiomas y el modo oscuro, cómo se publica en GitHub Pages y una lista de pruebas. Listá las preguntas abiertas y los compromisos. Esperá mi aprobación.`

### 4. Content extraction from CV and LinkedIn

EN: `Read my CV [file] and my LinkedIn text [paste]. Extract the facts into data/content.json following the structure in docs/CONTENT-SCHEMA.md, English first. Do not invent anything. If a date, title, number or name is unclear or missing, leave it empty and list it under "Needs confirmation". Quote the source for any number.`

ES: `Leé mi CV [archivo] y el texto de mi LinkedIn [pegar]. Extraé los datos a data/content.json siguiendo la estructura de docs/CONTENT-SCHEMA.md, primero en inglés. No inventes nada. Si una fecha, cargo, número o nombre no está claro o falta, dejalo vacío y listalo en "Para confirmar". Citá la fuente de cada número.`

### 5. Style boards

EN: `Create 3 standalone HTML style boards (separate files in docs/design-explorations/style-boards/) for my CV, in clearly different directions: [A: describe], [B: describe], [C: describe]. Each board shows palette, fonts, hero, buttons, a card, a timeline item, light and dark. Do not touch the real site. Use my real name and role as sample text.`

ES: `Creá 3 style boards en HTML independientes (archivos separados en docs/design-explorations/style-boards/) para mi CV, en direcciones claramente distintas: [A: describir], [B: describir], [C: describir]. Cada board muestra paleta, tipografías, hero, botones, una tarjeta, un ítem de línea de tiempo, claro y oscuro. No toques el sitio real. Usá mi nombre y rol reales como texto de ejemplo.`

### 6. Refine a style board

EN: `I like board [B] but find it too heavy, and I like the [wall background] from board [C]. Make a refined board that combines them. Keep token names [list or "same as board B"].`

ES: `Me gusta el board [B] pero lo siento muy pesado, y me gusta el [fondo de pared] del board [C]. Hacé un board refinado que los combine. Mantené los nombres de los tokens [lista o "los del board B"].`

### 7. Port the chosen style to the site

EN: `Port board [B2a] into the site: css/tokens.css (light and dark) and css/base.css (shared components). Keep the existing token names so section CSS keeps working; map old names to the new palette. Record contrast ratios in a comment at the top of tokens.css. Do not change JavaScript.`

ES: `Pasá el board [B2a] al sitio: css/tokens.css (claro y oscuro) y css/base.css (componentes compartidos). Mantené los nombres de tokens existentes para que el CSS de las secciones siga funcionando; mapeá los nombres viejos a la nueva paleta. Dejá las relaciones de contraste en un comentario al inicio de tokens.css. No cambies JavaScript.`

### 8. Build a section module

EN: `Build the [Work] section as a module following the contract in js/main.js: js/sections/work.js (default render(el, ctx), export styles) and css/sections/work.css. Data from ctx.data.work, wording from ctx.ui. Escape every string with esc(). Expandable cards use real buttons with aria-expanded. Respect prefers-reduced-motion. You own only those two files.`

ES: `Construí la sección [Experiencia] como módulo siguiendo el contrato de js/main.js: js/sections/work.js (render(el, ctx) por defecto, exportar styles) y css/sections/work.css. Datos desde ctx.data.work, textos desde ctx.ui. Escapá cada string con esc(). Las tarjetas expandibles usan botones reales con aria-expanded. Respetá prefers-reduced-motion. Solo sos dueño de esos dos archivos.`

### 9. Signature interaction

EN: `Design [the skills section as a funnel that fills as the user scrolls]. First give me 3 alternatives as standalone boards that read data/content.json. Include mobile behavior, keyboard behavior and what happens with reduced motion. I will pick one.`

ES: `Diseñá [la sección de habilidades como un embudo que se llena al hacer scroll]. Primero dame 3 alternativas como boards independientes que lean data/content.json. Incluí el comportamiento en móvil, con teclado y con movimiento reducido. Yo elijo una.`

### 10. i18n pass

EN: `Do an i18n pass over the whole site. Find every user-visible string that is not coming from content.json or js/ui-strings.js (hard-coded in JS or HTML). Check that en, es and de blocks have the same keys in both files. List differences; fix missing keys. Check long German words on a 360px screen.`

ES: `Hacé una pasada de i18n de todo el sitio. Encontrá cada texto visible que no venga de content.json ni de js/ui-strings.js (hardcodeado en JS o HTML). Verificá que los bloques en, es y de tengan las mismas claves en ambos archivos. Listá las diferencias y corregí las que falten. Revisá palabras largas en alemán en una pantalla de 360px.`

### 11. Add a language

EN: `Add [French] to the site. Follow docs/CUSTOMIZE.md, "Add a language". Translate content.json and ui-strings.js from English, keep every key, and mark in the footer that the translation awaits native review. Show me a diff summary.`

ES: `Agregá [francés] al sitio. Seguí docs/CUSTOMIZE.md, "Add a language". Traducí content.json y ui-strings.js desde el inglés, mantené todas las claves y marcá en el pie que la traducción espera revisión de un hablante nativo. Mostrame un resumen de cambios.`

### 12. Accessibility QA

EN: `Audit the site for accessibility: landmarks and headings, keyboard operation of every control, visible focus, ARIA names and live regions, color contrast in light and dark (list pairs below 4.5:1), reduced motion, touch target sizes, language attributes. Do not fix yet; give me a prioritized list with file and line.`

ES: `Auditá la accesibilidad del sitio: landmarks y encabezados, operación con teclado de cada control, foco visible, nombres ARIA y regiones live, contraste de color en claro y oscuro (listá los pares bajo 4.5:1), movimiento reducido, tamaño de áreas táctiles, atributos de idioma. Todavía no corrijas; dame una lista priorizada con archivo y línea.`

### 13. Honesty and privacy review

EN: `Review data/content.json and the whole site as a skeptical recruiter and as a privacy officer. Flag: any phone, ID number, home address or private email; claims I cannot back up; wording that could mislead about education or titles (degree vs course); "open to work" or availability statements; recommendations that need the author's permission; numbers without a source; company names under NDA. Give a table: item, where, risk, suggested wording.`

ES: `Revisá data/content.json y todo el sitio como un reclutador escéptico y como un responsable de privacidad. Marcá: cualquier teléfono, DNI, domicilio o email privado; afirmaciones que no pueda respaldar; textos que puedan inducir a error sobre estudios o títulos (carrera vs curso); "disponible para trabajar" o similares; recomendaciones que necesiten permiso del autor; números sin fuente; nombres de empresas bajo NDA. Dame una tabla: ítem, dónde, riesgo, redacción sugerida.`

### 14. Cross-device visual QA

EN: `Open the local site at 360, 768 and 1440px wide, in light and dark, in EN, ES and DE. Scroll slowly through every section and wait 1 second before each screenshot so reveal animations have finished. Report layout problems with the section, language, theme and width.`

ES: `Abrí el sitio local a 360, 768 y 1440px de ancho, en claro y oscuro, en EN, ES y DE. Hacé scroll lento por cada sección y esperá 1 segundo antes de cada captura para que terminen las animaciones. Reportá problemas de diseño con sección, idioma, tema y ancho.`

### 15. Re-skin without breaking

EN: `Change the palette to [describe] by editing only css/tokens.css. Keep every token name. Update both dark blocks identically, the funnel plate colors in css/sections/skills.css, and theme-color metas. Then list any hard-coded color left in css/ or js/ so I can decide.`

ES: `Cambiá la paleta a [describir] editando solo css/tokens.css. Mantené cada nombre de token. Actualizá los dos bloques oscuros de forma idéntica, los colores de las chapas del embudo en css/sections/skills.css y los meta theme-color. Después listame cualquier color hardcodeado que quede en css/ o js/ para que decida.`

### 16. Make it mine (reuse the template)

EN: `I am cloning this project for myself. Follow the "Make it yours in 10 steps" checklist in README.md. Start by copying data/content.template.json over data/content.json, then fill it from my CV [file]. At the end list every place that still mentions "Juan", "JL", "VU Inc.", "Argentina", "UCA" or "ADEPA".`

ES: `Estoy clonando este proyecto para mí. Seguí el checklist "Make it yours in 10 steps" del README.md. Empezá copiando data/content.template.json sobre data/content.json y completalo con mi CV [archivo]. Al final listá todos los lugares que todavía mencionan "Juan", "JL", "VU Inc.", "Argentina", "UCA" o "ADEPA".`

### 17. Publish on GitHub Pages

EN: `Prepare and publish this site on GitHub Pages with the gh CLI, following docs/DEPLOY-GITHUB-PAGES.md. Check .nojekyll exists, use my GitHub noreply email for commits, create a public repo named [name], enable Pages from main /, wait for the build, and tell me the live URL. Then update og:image to the absolute URL and push again. Ask me before any push.`

ES: `Preparé y publicá este sitio en GitHub Pages con la CLI gh, siguiendo docs/DEPLOY-GITHUB-PAGES.md. Verificá que exista .nojekyll, usá mi email noreply de GitHub para los commits, creá un repo público llamado [nombre], activá Pages desde main /, esperá el build y decime la URL. Después actualizá og:image con la URL absoluta y volvé a hacer push. Preguntame antes de cada push.`

### 18. Final verification

EN: `Verify the live site at [URL]: loads without console errors, all three languages, dark mode, every external link, og:image resolves, no 404 for local files. Report problems; do not change files.`

ES: `Verificá el sitio publicado en [URL]: carga sin errores de consola, los tres idiomas, modo oscuro, cada link externo, que og:image resuelva y que no haya 404 en archivos locales. Reportá problemas; no cambies archivos.`

## Lessons learned

- **Screenshots can lie.** A screenshot taken right after load may precede the reveal animations, so sections look empty. Scroll, wait, then capture.
- **Keep token names stable when re-skinning.** Change values in `tokens.css`, never rename tokens; legacy names stay as aliases.
- **Give each agent file ownership.** Parallel work is only safe when two agents never edit the same file. Share contracts, not files.
- **One coordinator commits.** Agents do not run git; one person or one agent does, with clear messages.
- **Verify wording about education, titles and availability.** "Bachelor's" vs "studies at" vs "course" matter. Re-read every claim against your real CV. No "open to work" unless true.
- **Do not publish what you do not own.** Recommendations need permission; photos need rights; client names may be under NDA.
- **Use relative paths** (`css/base.css`, not `/css/base.css`) so the site works from a GitHub Pages sub-folder and anywhere else.
- **The social preview needs an absolute URL**, and you only know it after publishing.
- **Both dark-theme blocks must match.** If the OS-preference block and the manual `data-theme` block drift, the two ways of getting dark mode look different.
- **Hard-coded text hides in code.** Run an i18n pass to find strings that are not in the data files.
- **Test with long words and short screens.** German compounds and 360px phones find most layout bugs.
- **Honest levels beat impressive levels.** Interviewers test claims.
- **Boards before code.** Cheap alternatives first, expensive implementation second.
- **PowerShell and quotes.** Use `git commit -F file` for messages; write files as UTF-8.
- **Match model to task.** Strongest for design and hard interactions, mid-size for building to a spec, lightest for extraction and validation.
- **Ask for what was unsure.** "List anything you were not certain about" turns silent guesses into questions.

## Credit

Inspired by a social-media reel about interactive resumes. Designed and built with Claude Code.
