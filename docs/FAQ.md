# FAQ

Short answers. Links go to the full explanation.

**Can I use this for my own CV?**
Yes. The code and structure are MIT licensed. Juan's personal content (texts, photo, name, certifications, the third-party recommendation) is not: replace all of it. See [NOTICE.md](../NOTICE.md) and the [10-step checklist](../README.md#make-it-yours-in-10-steps).

**How do I add a language?**
Add a block to `data/content.json` and to `js/ui-strings.js`, then register the code in `js/main.js` (`LANGS`, `LANG_NAMES`, `LOCALES`, `initialLang`) and add a button to the menu in `index.html`. Full list: [CUSTOMIZE.md, add a language](CUSTOMIZE.md#6-add-or-remove-a-language).

**How do I remove a language?**
Delete its block in both data files, remove it from `LANGS` in `main.js` and from the menu in `index.html`. If only one language remains, hide the menu with CSS. [Details](CUSTOMIZE.md#remove-a-language-for-example-german).

**How do I remove the wall background in the hero?**
Set `--arg-opacity: 0;` in `css/tokens.css`. To also remove the giant outlined surname add `.hero__ghost { display: none; }`. [Details](CUSTOMIZE.md#8-hero-background-wall-and-sun).

**How do I change the colors?**
Edit `css/tokens.css`. Change the light values in `:root` and the dark values in **both** dark blocks. Keep the token names. Check contrast afterwards. [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md#make-a-different-identity).

**How do I change the fonts?**
Change `--font-display`, `--font-accent`, `--font-sign`, `--font-sans` in `css/tokens.css` and the Google Fonts `<link>` in `index.html`.

**Does it work without JavaScript?**
No. The content is rendered by JavaScript from `data/content.json`, so with scripting disabled the page shows the shell (navigation placeholder and footer) but no sections. Modern browsers all run it. If you need a no-JS version, offer a PDF CV as well (see `meta.cv` in [CUSTOMIZE.md](CUSTOMIZE.md#1-your-content)).

**Is it good for SEO?**
Moderately. Google runs JavaScript and can index it, but content built at run time is indexed less reliably than static HTML, and the `<head>` text in `index.html` is what non-JS crawlers see. Write a good `<title>` and `description` in `index.html`, keep a public LinkedIn profile, and link to the site from it. Do not expect it to replace LinkedIn for being found.

**Why does the link preview (WhatsApp, LinkedIn, Slack) show no image or the wrong one?**
`og:image` must be an absolute `https://` URL and the platform caches it. Set it to your published address and re-scrape with the platform's debugger. [Details](CUSTOMIZE.md#5-page-head-title-description-social-preview-favicon) and [troubleshooting](DEPLOY-GITHUB-PAGES.md#troubleshooting). Previews are generated from the HTML in `index.html`, not from the text changed by JavaScript for other languages.

**Is it accessible?**
It was built for it: skip link, landmarks, keyboard operation, visible focus, ARIA live regions for the sticky sign and flip sign, AA contrast in both themes, reduced-motion support, and level meters that use words as well as pads. It has not been audited by a third party. Test with your own content: keyboard only, a screen reader, 200% zoom. [Decisions](ARCHITECTURE.md#accessibility-decisions).

**What about reduced motion?**
With the OS setting "reduce motion" all animations are off, the funnel is fully lit and counters show their final value.

**How do I update the content later?**
Edit `data/content.json` (and `js/ui-strings.js` if wording changes), commit and push. GitHub Pages republishes in a minute or two. Hard-refresh to see it. [Updating](DEPLOY-GITHUB-PAGES.md#updating-the-site).

**Can I edit it without coding?**
Yes: `data/content.json` is just text. Edit it on GitHub's web editor (pencil icon), or ask Claude to edit it for you ([prompt library](HOW-IT-WAS-BUILT.md#prompt-library)). Keep the commas and quotes valid.

**I broke `content.json` and the page says "Content could not be loaded".**
Invalid JSON: usually a missing or extra comma, or an unescaped quote inside a text. Paste the file into any JSON validator, or restore the template ([TEMPLATE-USAGE.md](TEMPLATE-USAGE.md)).

**Can I host it somewhere other than GitHub Pages?**
Yes: Netlify, Cloudflare Pages, Vercel or any web server. Upload the folder. There is nothing to build. All paths are relative, so sub-folders work.

**Can I remove a section, such as Achievements or Range?**
Yes. Remove it from `index.html`, `SECTION_MODULES`, `SECTION_ORDER`, `NAV_KEYS` and renumber `--sec-n` in `css/base.css`. [Steps](CUSTOMIZE.md#7-remove-reorder-or-add-sections).

**The funnel needs four stages and mine has three or five.**
The drawing has four plates. Reuse four stages with your own names, or remove the section. A different shape means editing the geometry in `js/sections/skills.js`.

**Can I add a contact form?**
Not built in (there is no server). Use a service such as Formspree or Netlify Forms and link to it from the Contact section; avoid collecting data without a privacy notice.

**Do I need to credit the author?**
Not required by the MIT license beyond keeping the copyright notice in `LICENSE`. A link back is appreciated.

**Where do I report a bug or ask a question?**
Open an issue on the GitHub repository.
