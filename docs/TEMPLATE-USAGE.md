# Using the content template

`data/content.template.json` is a full, valid example of `data/content.json` for a fictional person ("Your Name", "Company A", "Example University"). It has exactly the same structure as the real file: `meta` plus `en`, `es` and `de`, with every section and every field the site can display. Use it as a starting point so you do not have to build the structure by hand.

It contains no real personal data.

## How to use it

1. **Back up** the current file if you want to keep it (it is Juan's CV; you will not need it for your own site):

```bash
cp data/content.json data/content.original.json
```

```powershell
Copy-Item data\content.json data\content.original.json
```

(Do not commit the backup to your public repository. Delete it, or add it to `.gitignore`.)

2. **Copy the template over `content.json`:**

```bash
cp data/content.template.json data/content.json
```

```powershell
Copy-Item data\content.template.json data\content.json -Force
```

3. **Run the site** ([QUICKSTART.md](QUICKSTART.md)). You should see a CV for "Your Name" in all three languages.

4. **Replace the placeholders**, language by language, section by section. Field details: [CONTENT-SCHEMA.md](CONTENT-SCHEMA.md).

5. **Then run the checklist below.**

## What to replace, top to bottom

- `meta`: your name, email and LinkedIn. Optionally add `cv` with PDF paths.
- `hero`: title (role), a one-or-two sentence lede, `subtitle` as `Skill, Skill, Skill · Your City`.
- `about`: headline, three paragraphs, a short quote, and the facts for the nameplate (keep each value under 27 characters).
- `funnel.stages`: keep **four** stages. Rename them if your field has a different journey. Replace tools, abbreviations, levels (`expert`, `advanced`, `intermediate`, `basic`) and notes. `featured: true` marks one core tool.
- `funnel.across`: tools you use at every stage; delete the object if you do not need it.
- `work`: newest first. The current job should say "Present" (`Actualidad` in Spanish, `Heute` in German) in `period`.
- `certifications`: real names, issuers, dates and links. Use `""` or remove `url` if there is no public link.
- `education`: one featured entry plus courses. `award` must match the title or issuer of an item in `achievements.awards`, or delete the `award` key and the awards you do not have.
- `achievements`: counters (years of experience and so on) and awards. Remove the `markets` counter if you do not want the regions card.
- `range`: industries, ways of working, collaboration, and an optional `recommendation`.
- `languages`: your languages and levels (`steps` 1 to 4).
- `contact`: public email, LinkedIn, city.

## Placeholders to hunt for before publishing

Search the whole project for these strings; none should remain unless you want them:

```
Your Name   you@example.com   your-profile   Your City   Your Role
Company A   Company B   Company C   Company D   Example
Empresa A   Firma A   Tu Ciudad   Deine Stadt   example.com
```

## Checklist after copying

- [ ] `content.json` is valid JSON (open it in an editor with JSON validation, or load the page and check the console).
- [ ] The three language blocks have the same keys. A quick check in PowerShell:

```powershell
$j = Get-Content data\content.json -Raw -Encoding UTF8 | ConvertFrom-Json
foreach ($l in 'en','es','de') { "{0}: {1} work, {2} certs, {3} stages" -f $l, $j.$l.work.Count, $j.$l.certifications.Count, $j.$l.funnel.stages.Count }
```

  The counts should match across languages.
- [ ] You edited `js/ui-strings.js` (ID number, footer, education intro...). See [CUSTOMIZE.md](CUSTOMIZE.md#3-interface-wording-jsui-stringsjs).
- [ ] You replaced the photo and the hard-coded bits ([CUSTOMIZE.md](CUSTOMIZE.md#4-hard-coded-bits-to-change)).
- [ ] You removed languages you do not want (and their blocks) or translated all of them.
- [ ] You went through the [privacy and honesty checklist](CUSTOMIZE.md#privacy-and-honesty-checklist).

## Notes on the template

- The `recommendation` is clearly fake. If you have a real one with permission, replace it; otherwise delete the whole `recommendation` object in each language and the Range section simply omits it.
- The `es` and `de` blocks contain the same fictional person translated, so the placeholders look natural in each language. The `translation` field exists only in `es` and `de` (it translates the English recommendation); the `en` block has none, as in the real file.
- The example `award` text (`example competition`, `concurso de ejemplo`, `beispiel-wettbewerb`) is a pattern that matches the example award title in the same language. If you change one, change the other.
- The template does not include `meta.cv`: no PDF is shipped, so the hero download button is hidden. Add it when you have PDFs ([CUSTOMIZE.md](CUSTOMIZE.md#1-your-content)).
- Keep the template file in your repository; it helps you remember the structure. It is safe to publish.
