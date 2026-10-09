# Content schema

Field-by-field reference for `data/content.json` and `js/ui-strings.js`. A ready-to-fill example with every field is [data/content.template.json](../data/content.template.json).

Conventions in the tables:

- **Req** = the page needs it (or looks broken without it). "Opt" = optional, the part of the page disappears when it is missing. "Unused" = present in the file format but not displayed by the current code.
- Text fields are plain text. HTML is escaped, so `<b>` shows literally.
- `*word*` (asterisks) in a title makes that word the italic accent, where noted.

## Top level

```json
{ "meta": { }, "en": { }, "es": { }, "de": { } }
```

| Key | Type | Req | Notes |
| --- | --- | --- | --- |
| `meta` | object | Req | Data shared by every language |
| `en`, `es`, `de` | object | Req each | One block per language listed in `LANGS` in `js/main.js`. All blocks have the same keys. |
| `<lang>.ui` | object | Opt | Per-language overrides of `js/ui-strings.js` keys (see [UI strings](#ui-strings-jsui-stringsjs)). Not present in the shipped file. |

## `meta`

| Key | Type | Req | Where it shows |
| --- | --- | --- | --- |
| `name` | string | Req | Hero ("I'm Your Name"), nameplate, portrait caption, footer, tab title, social tags, initials fallback. The last word(s) after the first space are drawn huge and outlined in the hero background (surname). |
| `email` | string | Req | Fallback for `contact.email` |
| `linkedin` | string (URL) | Req | Fallback for `contact.linkedin` |
| `cv` | object `{ "en": "path.pdf", ... }` | Opt | Adds a "Resume" download button in the hero for each language that has a path |

## `nav`

Labels of the floating navigation. A link shows only if its label exists **and** the section rendered content.

| Key | Section | Type | Req |
| --- | --- | --- | --- |
| `about` | About | string | Opt |
| `funnel` | Skills (funnel) | string | Opt |
| `work` | Work | string | Opt |
| `range` | Range | string | Opt |
| `education` | Education | string | Opt |
| `certifications` | Certifications | string | Opt |
| `achievements` | Achievements | string | Opt |
| `contact` | Contact | string | Opt |
| `resume` | (reserved) | string | Unused |

Keep labels short (one word) or the pill gets crowded on phones. The home button (monogram) is always added.

## `hero`

| Key | Type | Req | Where it shows |
| --- | --- | --- | --- |
| `title` | string | Req | Big H1 headline. One word is drawn as the accent: the word after `&`, `y` or `and`; otherwise the last word; or wrap your own word in `*asterisks*`. Also the role on the nameplate and the tab title (`Name \| title`). |
| `lede` | string | Opt | Paragraph under the headline; also `og:description` |
| `subtitle` | string `"Tag, Tag, Tag · City"` | Opt | Text before `·` becomes the chips (split on commas). Text after `·` is the place, used on the portrait band ("from City") and the nameplate. |
| `cta.work` | string | Opt | Label of the primary button (links to `#work`) |
| `cta.resume` | string | Opt | Label of the download button (appears only if `meta.cv[lang]` exists) |

## `about`

| Key | Type | Req | Where it shows |
| --- | --- | --- | --- |
| `headline` | string | Opt | Lead sentence under the section title |
| `quote` | string | Opt | Pull quote. If a paragraph in `text` starts with exactly this sentence, the sentence is removed from the paragraph so it is not repeated. |
| `text` | string[] | Req | Bio paragraphs |
| `facts` | object[] | Req | Rows of the ID nameplate (see below) |
| `facts[].label` | string | Req | Row label |
| `facts[].value` | string | Req | Row value. **Only facts with 26 characters or fewer are shown on the plate, maximum four.** Longer ones (for example a languages sentence) are skipped. |
| `facts[].id` | string | Opt | `"markets"` renders the NA / EMEA / LATAM chips instead of the text. The last fact on the plate gets a "home" highlight if its value matches `/argentin/i` (edit in `about.js`). |

## `funnel` (Skills section)

```
funnel
  stages[4]
    id, name, tagline, doing
    tools[]  { name, abbr, level, note, featured }
  across (optional)
    eyebrow, title, intro
    aiLabel, ai[] { name, abbr, level, note }
    toolsLabel, tools[] { name, abbr, level, note }
    crmLabel, crm
    envLabel, env[] { label, items[] }, envLine
```

| Key | Type | Req | Notes |
| --- | --- | --- | --- |
| `stages` | array | Req | **Exactly four** (the drawing has four plates) |
| `stages[].id` | string | Req | Used as the anchor `#fn-stage-<id>`: lowercase, no spaces |
| `stages[].name` | string | Req | Plate label, card title and roller sign. Long names wrap on two lines and shrink. |
| `stages[].tagline` | string | Opt | One line under the card title |
| `stages[].doing` | string | Opt | Text in the "What I do here" box |
| `stages[].tools` | array | Req | Objects, or plain strings (a string becomes `{ name }`) |
| `tools[].name` | string | Req | |
| `tools[].abbr` | string | Opt | 1 to 3 letters printed on the plate and on a tag. Defaults to the first 3 letters of `name`. |
| `tools[].level` | `"expert" \| "advanced" \| "intermediate" \| "basic"` | Opt | Shown as 4, 3, 2 or 1 pads plus the translated word. No level = no meter. |
| `tools[].note` | string | Opt | Small text under the tool (where you used it) |
| `tools[].featured` | boolean | Opt | Adds the "Core platform" tag |
| `across` | object | Opt | The strip under the funnel. Remove it to hide the strip. |
| `across.title` | string | Opt | Supports `*accent*` |
| `across.ai[]` | `{ name, level, note, abbr }` | Opt | Shown as chips with level and note (`abbr` is not displayed) |
| `across.tools[]` | same as stage tools | Opt | |
| `across.crm`, `crmLabel` | string | Opt | Red enamel plate with the label, then the sentence |
| `across.env[]` | `{ label, items: string[] }` | Opt | Rows of a list; items are joined with " · " |
| `across.envLine` | string | Opt | Sentence under the list |

## `work` (array, newest first)

| Key | Type | Req | Notes |
| --- | --- | --- | --- |
| `company` | string | Req | Shop-sign style header |
| `role` | string | Req | |
| `period` | string | Req | Free text. A period containing "Present", "Actualidad", "Actual" or "Heute" marks the **current role**: badge, open by default. Write the equivalent in each language. |
| `mode` | `"onsite" \| "remote" \| "hybrid"` | Opt | Badge with icon; the word comes from `ui.modes` |
| `location` | string | Unused | Present in the file format, not displayed. Leave empty or fill it for your own use. |
| `summary` | string | Req | |
| `bullets` | string[] | Opt | Listed inside the expandable panel |
| `projects` | string[] | Opt | Shown as numbered sub-cards under "Key deliverables" |

A card with neither `bullets` nor `projects` has no expand button.

## `range`

| Key | Type | Req | Notes |
| --- | --- | --- | --- |
| `industries[]` | array | Opt | Cards, numbered automatically |
| `industries[].id` | string | Req | Free identifier, not displayed |
| `industries[].name`, `text` | string | Req | |
| `industries[].where` | string[] | Opt | Chips with companies in that industry |
| `modes[]` | array | Opt | Three columns |
| `modes[].id` | `"onsite" \| "remote" \| "hybrid"` | Req | Column title comes from `ui.modes[id]` |
| `modes[].companies[]` | `{ name, note }` | Req | `note` optional (for example a city) |
| `modesNote` | string | Opt | Sentence under the columns |
| `collab.intro` | string | Opt | |
| `collab.items[]` | `{ team, text }` | Opt | Shown as "Marketing + <team>" pairs (the word Marketing is in `js/sections/range.js`) |

## `recommendation` (optional object)

| Key | Type | Req | Notes |
| --- | --- | --- | --- |
| `quote` | string | Req | Shown verbatim, marked `lang="en"`. If your source language differs, change that attribute in `range.js`. |
| `translation` | string | Opt | Shown underneath in the page language (used in `es` and `de` of the shipped file; absent in `en`) |
| `author`, `role`, `context` | string | Req | Name, job title, and a line such as "Managed me directly · LinkedIn recommendation · June 2023" |
| `url` | string (URL) | Opt | Adds the "See it on LinkedIn" button |

Only publish with the author's permission.

## `education` (array)

| Key | Type | Req | Notes |
| --- | --- | --- | --- |
| `id` | string | Opt | Not displayed |
| `institution`, `program` | string | Req | Be exact about what the program is |
| `start`, `end` | string `"YYYY"` or `"YYYY-MM"` | Req | Month names come from `ui.months`. The log is sorted by `start`. |
| `featured` | boolean | Opt | The one entry shown as the large framed plate (the first one with `true`). Others go to the study log. |
| `award` | string (regex) | Opt | On the featured entry only. Case-insensitive pattern matched against `"<title> <issuer>"` of `achievements.awards`; the first match is shown as a medal on the plate. |
| `note` | string | Opt | Extra line on the plate or card (supported by code, not used in the shipped data) |
| `details[]` | `{ name, start, end }` | Opt | Modules of a course, drawn as a mini timetable (non-featured entries only). Dates as above. |

## `certifications` (array)

| Key | Type | Req | Notes |
| --- | --- | --- | --- |
| `name` | string | Req | |
| `issuer` | string | Req | |
| `date` | string | Req | Free text, such as "Nov 2025" |
| `url` | string (URL) | Opt | Adds the "View credential" link. With no URL the row is focusable but not a link. |

The count shown in the section and in the Achievements card is `certifications.length`.

## `achievements`

| Key | Type | Req | Notes |
| --- | --- | --- | --- |
| `counters[]` | array | Req | One chalkboard card each |
| `counters[].value` | number | Req | Animated from 0. For `type: "certs"` it is replaced by the real number of certifications. |
| `counters[].suffix` | string | Opt | For example `"+"` |
| `counters[].label` | string | Req | A label that contains `ADEPA` pulls in the award that mentions ADEPA (special case in `achievements.js`). |
| `counters[].type` | `"markets"` \| `"certs"` | Opt | `markets`: the card becomes the NA / EMEA / LATAM route panel. `certs`: adds a "Show certifications" toggle. |
| `awards[]` | array | Opt | `{ title, issuer, context }`. An award not attached to a counter becomes its own "Award" card. |

## `languages` (array, shown in About)

| Key | Type | Req | Notes |
| --- | --- | --- | --- |
| `code` | string | Req | Picks the flag: `es`, `en` or `de` are built in (see `FLAGS` in `about.js`). Other codes show no flag. |
| `name` | string | Req | Language name in the page language |
| `level` | string | Req | Words, for example "Native" |
| `steps` | number 1 to 4 | Opt | Level pads |

## `contact`

| Key | Type | Req | Notes |
| --- | --- | --- | --- |
| `email` | string | Opt | Falls back to `meta.email`. Creates a `mailto:` link. |
| `linkedin` | string (URL) | Opt | Falls back to `meta.linkedin` |
| `location` | string | Opt | Shown on the "Home base" destination sign |
| `cta` | string | Opt | Label on the big mail plate (defaults to `ui.contactEmail`) |
| `downloadCv` | string | Unused | Reserved |

## UI strings (`js/ui-strings.js`)

`export const UI = { en: {...}, es: {...}, de: {...} }`. For each language the object has the keys below. They can also be overridden from `content.json[lang].ui`. Values that are functions are shown as `(args) => string`.

| Group | Keys | Notes |
| --- | --- | --- |
| Global | `skip`, `home`, `langSwitch`, `themeToggle`, `loadError`, `footer`, `footerNote` | `footerNote` is optional (German ships a "translation pending review" note) |
| Hero | `heroHello`, `heroScroll`, `heroPhotoAlt` | `heroHello` is currently unused; hero ribbon text is in `hero.js` |
| About | `aboutEyebrow`, `aboutTitle`, `idHeader`, `idStatus`, `idNumberLabel`, `idNumber`, `idHint`, `languagesLabel` | `idNumber` is the text on the nameplate. `idStatus` and `idHint` are not displayed by the current code. |
| Skills | `skillsEyebrow`, `skillsTitle`, `skillsIntro`, `stageOf(i, n)`, `toolsCount(n)`, `levelLegend`, `levels{expert,advanced,intermediate,basic}`, `whatIDo`, `toolkit`, `coreLabel`, `funnelAria`, `stagesAria`, `signAria`, `goToStage`, `loopLabel`, `outLabel` | Functions return strings. `stageOf` and `toolsCount` are also read by screen readers. |
| Work | `workEyebrow`, `workTitle`, `workIntro`, `workCurrent`, `workDetails`, `workHide`, `workDeliverables`, `modes{onsite,remote,hybrid}` | `modes` is shared with Range |
| Range | `rangeEyebrow`, `rangeTitle`, `rangeIntro`, `rangeIndustries`, `rangeWhere`, `rangeModes`, `rangeCollab`, `recLabel`, `recTranslation`, `recTranslationAria`, `recSeeIt`, `newTab` | `newTab` is the screen-reader note on external links |
| Education | `eduEyebrow`, `eduTitle`, `eduIntro`, `eduUniLabel`, `eduAward`, `eduLog`, `eduLogAria`, `eduModules`, `eduMedal`, `months[12]` | `months` has 12 short names |
| Certifications | `certEyebrow`, `certTitle`, `certCount(n)`, `certList`, `certView` | `certCount` is not used by the current code |
| Achievements | `achEyebrow`, `achTitle`, `achHint`, `achPrev`, `achNext`, `achAward`, `achMarketsHome`, `homeCountry`, `achMarketsNA`, `achMarketsEMEA`, `achMarketsLATAM`, `achShowCerts`, `achHideCerts` | Markets texts mention a home country; rewrite them |
| Contact | `contactEyebrow`, `contactTitle`, `contactIntro`, `contactEmail`, `contactLinkedin`, `contactBase`, `resumeLabel`, `resumeEs`, `resumeEn`, `resumeEsFile`, `resumeEnFile` | The `resume*` keys are reserved for a CV block that is not currently shown |

Titles (`*Title`) accept `*accent*` markup, for example `'Things I\'ve *built.*'`.

Section text that lives in the section JS files rather than here: the hero ribbons (`TXT` in `hero.js`), the flip sign (`SIGN`, `WORD` in `about.js`) and the "Marketing +" pair label in `range.js`. See [CUSTOMIZE.md](CUSTOMIZE.md#4-hard-coded-bits-to-change).
