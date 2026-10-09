# Guía rápida

Corré el sitio en tu computadora en cinco minutos. English version: [../QUICKSTART.md](../QUICKSTART.md).

## 1. Conseguí los archivos

```bash
git clone https://github.com/juanlundahl-marketing/juan-lundahl-interactive-cv.git mi-cv
cd mi-cv
```

¿No tenés Git? En GitHub apretá **Code > Download ZIP**, descomprimilo y abrí una terminal en esa carpeta.

## 2. Levantá un servidor local

Los navegadores no cargan módulos ES ni `data/content.json` si hacés doble clic en `index.html` (`file://`). Usá cualquier servidor estático. Elegí uno.

**Python**

```bash
python -m http.server 8000
```

**Node.js**

```bash
npx serve .
```

**PowerShell de Windows, sin instalar nada.** Guardá este código como `serve.ps1` en algún lugar fuera del proyecto y ejecutalo desde la carpeta del proyecto:

```powershell
# serve.ps1  (ejecutar: powershell -ExecutionPolicy Bypass -File serve.ps1 -Root . -Port 8000)
param([string]$Root = '.', [int]$Port = 8000)
$Root = (Resolve-Path $Root).Path
$mime = @{ '.html'='text/html; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.js'='text/javascript; charset=utf-8';
  '.json'='application/json; charset=utf-8'; '.svg'='image/svg+xml'; '.png'='image/png'; '.jpg'='image/jpeg';
  '.webp'='image/webp'; '.pdf'='application/pdf' }
$l = [System.Net.HttpListener]::new()
$l.Prefixes.Add("http://localhost:$Port/")
$l.Start()
Write-Output "Sirviendo $Root en http://localhost:$Port/  (Ctrl+C para frenar)"
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

## 3. Abrilo

Entrá a http://localhost:8000 (o a la dirección que muestre tu herramienta). URLs útiles:

- `http://localhost:8000/?lang=es` o `?lang=de` fuerza un idioma.
- `http://localhost:8000/#work` salta a una sección.

## 4. Probá tu propio contenido enseguida

```bash
cp data/content.template.json data/content.json      # macOS / Linux / Git Bash
```

```powershell
Copy-Item data\content.template.json data\content.json   # PowerShell
```

Recargá la página: ahora ves el CV ficticio de "Your Name". Editá `data/content.json` y recargá para ver tus cambios. (Si ves contenido viejo, forzá la recarga con Ctrl+F5.)

## 5. Próximos pasos

Estos documentos están en inglés; podés pedirle a Claude que te los explique o traduzca.

- [CUSTOMIZE.md](../CUSTOMIZE.md): la personalización completa paso a paso.
- [TEMPLATE-USAGE.md](../TEMPLATE-USAGE.md): cómo funciona la plantilla.
- [DEPLOY-GITHUB-PAGES.md](../DEPLOY-GITHUB-PAGES.md): cómo publicar.
- [HOW-IT-WAS-BUILT.md](../HOW-IT-WAS-BUILT.md): el proceso con Claude y una biblioteca de prompts en inglés y español.

## Problemas comunes

| Síntoma | Solución |
| --- | --- |
| Página en blanco o "Content could not be loaded" | Abriste el archivo con `file://`. Usá un servidor local. |
| Los cambios no se ven | Forzá la recarga (Ctrl+F5). El contenido se pide con `no-cache`, pero el CSS y el JS pueden quedar en caché. |
| Las tipografías se ven distintas | Las fuentes vienen de Google Fonts, así que necesitás internet. Sin conexión se usa Georgia y fuentes del sistema. |
| Falta una sección | Sus datos están vacíos o ausentes en `content.json`, o hay un error en la consola. Abrí la consola de las herramientas de desarrollo. |

## Recordatorio de privacidad

Antes de publicar: nada de teléfono, DNI ni domicilio; revisá que todo dato sea cierto; no publiques recomendaciones sin permiso del autor; no pongas "disponible para trabajar" si no es verdad. El checklist completo está en [CUSTOMIZE.md](../CUSTOMIZE.md#privacy-and-honesty-checklist).
