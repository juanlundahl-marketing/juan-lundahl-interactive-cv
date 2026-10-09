# Deploy on GitHub Pages

GitHub Pages hosts static sites for free. This project needs no build, so Pages just serves the files in the repository. Two ways to publish: the GitHub CLI (fast, scriptable) or the web UI.

Final address pattern:

```
https://<your-username>.github.io/<repository-name>/
```

Example: `https://juanlundahl-marketing.github.io/juan-lundahl-interactive-cv/`

Before publishing: finish the [privacy checklist](CUSTOMIZE.md#privacy-and-honesty-checklist) and set your git identity safely (see [commit author email](#commit-author-email-privacy)).

## What `.nojekyll` does

The repository root contains an empty file called `.nojekyll`. It tells GitHub Pages **not to run Jekyll**, the default site generator. Without it Pages may try to process the folder, ignore files and folders whose names start with `_`, or fail the build with "Page build failed" on files it cannot parse. With it, your files are served exactly as they are. Do not delete it, and make sure it is committed (an empty file is fine).

## Path A: GitHub CLI

### 1. Install

```powershell
# Windows
winget install --id GitHub.cli
```

```bash
# macOS
brew install gh
```

Linux: see https://cli.github.com. Close and reopen your terminal afterwards so `gh` is found.

### 2. Log in

```bash
gh auth login
```

Choose GitHub.com, HTTPS, and log in with the browser. Check with `gh auth status`.

### 3. Create the repository and push

From the project folder (make sure it is a git repository with at least one commit; run `git init`, `git add .`, `git commit` first if not):

```bash
gh repo create my-interactive-cv --public --source . --push
```

`--public` is required for free GitHub Pages on a personal account. `--source .` uses the current folder and `--push` uploads it.

### 4. Enable Pages

```bash
gh api -X POST repos/<your-username>/my-interactive-cv/pages -f "source[branch]=main" -f "source[path]=/"
```

In PowerShell the quotes shown above are fine. In Git Bash on Windows, the trailing `/` can be rewritten into a Windows path; if you see an odd path error, run the command with the variable `MSYS_NO_PATHCONV=1` in front, or use PowerShell.

If your default branch is not called `main`, use its real name. If Pages is already enabled you will get an error; that is fine.

### 5. Check the build

```bash
gh api repos/<your-username>/my-interactive-cv/pages --jq '.status, .html_url'
gh api repos/<your-username>/my-interactive-cv/pages/builds/latest --jq '.status, .error.message'
```

`status` goes `building` then `built` (usually in one or two minutes). `html_url` is your live address.

### 6. Fix the social preview image and update

Once you know the live address, open `index.html`, set `og:image` to `https://<your-username>.github.io/my-interactive-cv/assets/img/<your-photo>.jpg`, then push the change (see [updating the site](#updating-the-site)).

## Path B: the web UI

1. On https://github.com create a **New repository** (public). Do not add a README, .gitignore or license if you are uploading an existing folder.
2. Push your folder:

```bash
git remote add origin https://github.com/<your-username>/<repo>.git
git branch -M main
git push -u origin main
```

   (Or use "uploading an existing file" in the web page and drag the files in. Make sure `.nojekyll` and the `css`, `js`, `data`, `assets` folders are included.)
3. Open the repository, **Settings > Pages**.
4. Under **Build and deployment**, Source: **Deploy from a branch**. Branch: `main`, folder: `/ (root)`. Save.
5. Wait a minute or two and refresh the Pages settings page: it shows "Your site is live at ...".

## Updating the site

```bash
git add .
git commit -m "Update content"
git push
```

Pages rebuilds automatically on every push. It can take one or two minutes to show.

## Commit author email privacy

Every git commit carries an author email, and in a public repository it is public. Use GitHub's private "noreply" address instead of your real one.

1. On GitHub: **Settings > Emails**. Tick **Keep my email addresses private**, and **Block command line pushes that expose my email**.
2. Copy your noreply address from that page. It looks like `12345678+your-username@users.noreply.github.com`.
3. Configure git (for this repository only, or add `--global`):

```bash
git config user.name "Your Name"
git config user.email "12345678+your-username@users.noreply.github.com"
```

If you already committed with your personal email, those commits keep it. Rewriting history is possible but delicate; the easiest fix for a brand-new repository is to fix the setting and start from a clean history before you publish.

## Troubleshooting

| Problem | What to do |
| --- | --- |
| "Page build failed" or a Jekyll error in the Actions tab | Make sure `.nojekyll` exists at the repository root and is committed (`git ls-files .nojekyll`). Push again. |
| 404 on the site address | Pages is not enabled or still building. Check **Settings > Pages**, or run the status command above. The address ends with the repository name and a slash. |
| Site loads but looks unstyled or blank, console shows 404 for `css/...` or `js/...` | A path starts with `/`. All paths in this project are relative; do not add a leading slash. Check upper/lower case: GitHub Pages is case-sensitive (`Juan.jpg` is not `juan.jpg`). |
| Old version still showing | Browser cache. Hard refresh (Ctrl+F5) or open in a private window. Pages itself can take a couple of minutes. |
| Photo missing on the page | The file name in `hero.js` and `about.js` must match the file in `assets/img/` exactly, including case. |
| Link preview (WhatsApp, LinkedIn, Slack) shows no image or an old one | `og:image` must be an absolute `https://...` URL that opens in a browser. Fix it, push, then ask the platform to re-scrape: LinkedIn Post Inspector, or Facebook Sharing Debugger (also refreshes WhatsApp). Most platforms cache for days. |
| `content.json` fails to load | Invalid JSON (a trailing comma, a missing quote). Validate it. |
| Commit message with quotes or accents breaks in PowerShell | Write the message to a file and use `-F` (below). |
| `git push` rejected: "GH007 ... would publish a private email" | You enabled "Block command line pushes that expose my email" while a commit has your personal address. Set the noreply address, then amend: `git commit --amend --reset-author --no-edit` (last commit only). |
| Pages is greyed out in Settings | Private repositories need a paid plan for Pages. Make the repository public, or upgrade. |

### Windows PowerShell and commit messages

PowerShell treats quotes, backticks and some accents differently from Bash, so a multi-line message in `git commit -m "..."` often breaks. Put the message in a file and let git read it:

```powershell
@'
Add my CV content

Replaces the template with my real data in EN, ES and DE.
'@ | Set-Content -Encoding utf8 commit-msg.txt
git commit -F commit-msg.txt
Remove-Item commit-msg.txt
```

Note that `Set-Content -Encoding utf8` in Windows PowerShell 5.1 adds a byte-order mark that can show up as an odd character at the start of the commit subject. If that bothers you, write the file with your editor (UTF-8 without BOM) instead.

## Custom domain (optional)

In **Settings > Pages > Custom domain** enter your domain and add a DNS record as GitHub instructs. If you do this, remember to update `og:image` and any absolute URLs to the new domain. Not needed for the default address.
