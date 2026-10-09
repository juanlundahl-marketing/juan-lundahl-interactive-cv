# Quick start

Run the site on your computer in five minutes. Spanish version: [es/GUIA-RAPIDA.md](es/GUIA-RAPIDA.md).

## 1. Get the files

```bash
git clone https://github.com/juanlundahl-marketing/juan-lundahl-interactive-cv.git my-cv
cd my-cv
```

No Git? On GitHub press **Code > Download ZIP**, unzip it and open a terminal in that folder.

## 2. Start a local server

Browsers will not load ES modules or `data/content.json` when you double-click `index.html` (`file://`). Use any static server. Pick one.

**Python**

```bash
python -m http.server 8000
```

**Node.js**

```bash
npx serve .
```

**Windows PowerShell, nothing to install.** Save this as `serve.ps1` somewhere outside the project, then run it from the project folder:

```powershell
# serve.ps1  (run: powershell -ExecutionPolicy Bypass -File serve.ps1 -Root . -Port 8000)
param([string]$Root = '.', [int]$Port = 8000)
$Root = (Resolve-Path $Root).Path
$mime = @{ '.html'='text/html; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.js'='text/javascript; charset=utf-8';
  '.json'='application/json; charset=utf-8'; '.svg'='image/svg+xml'; '.png'='image/png'; '.jpg'='image/jpeg';
  '.webp'='image/webp'; '.pdf'='application/pdf' }
$l = [System.Net.HttpListener]::new()
$l.Prefixes.Add("http://localhost:$Port/")
$l.Start()
Write-Output "Serving $Root on http://localhost:$Port/  (Ctrl+C to stop)"
while ($l.IsListening) {
  $ctx = $l.GetContext()
  try {
    $path = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart('/')
    if ($path -eq '') { $path = 'index.html' }
    $full = [IO.Path]::GetFullPath((Join-Path $Root $path))
    if ($full.StartsWith($Root) -and (Test-Path $full -PathType Leaf)) {
      $bytes = [IO.File]::ReadAllBytes($full)
      $ext = [IO.Path]::GetExtension($full).ToLower()
      $ctx.Response.ContentType = $(if ($mime[$ext]) { $mime[$ext] } else { 'application/octet-stream' })
      $ctx.Response.Headers.Add('Cache-Control', 'no-store')
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else { $ctx.Response.StatusCode = 404 }
  } catch { $ctx.Response.StatusCode = 500 }
  $ctx.Response.Close()
}
```

## 3. Open it

Go to http://localhost:8000 (or the address your tool prints). Useful URLs:

- `http://localhost:8000/?lang=es` or `?lang=de` forces a language.
- `http://localhost:8000/#work` jumps to a section.

## 4. Try your own content right away

```bash
cp data/content.template.json data/content.json      # macOS / Linux / Git Bash
```

```powershell
Copy-Item data\content.template.json data\content.json   # PowerShell
```

Reload the page: you now see the fictional "Your Name" CV. Edit `data/content.json` and reload to see your changes. (If you see old content, hard-refresh with Ctrl+F5.)

## 5. Next steps

- [CUSTOMIZE.md](CUSTOMIZE.md) for the full step-by-step.
- [TEMPLATE-USAGE.md](TEMPLATE-USAGE.md) for how the template works.
- [DEPLOY-GITHUB-PAGES.md](DEPLOY-GITHUB-PAGES.md) to publish.

## Common problems

| Symptom | Fix |
| --- | --- |
| Blank page or "Content could not be loaded" | You opened the file with `file://`. Use a local server. |
| Edits do not show | Hard-refresh (Ctrl+F5). Content is fetched with `no-cache`, but CSS and JS may be cached. |
| Fonts look different | The fonts come from Google Fonts, so you need internet. Without it the page falls back to Georgia and system fonts. |
| A section is missing | Its data is empty or missing in `content.json`, or the browser console shows an error. Open the developer tools console. |
