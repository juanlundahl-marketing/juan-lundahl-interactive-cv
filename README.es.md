# CV Interactivo

Un CV y portfolio interactivo que reemplaza al CV estático en PDF. Una sola página, tres idiomas (inglés, español y alemán), tema claro y oscuro, y una identidad visual tomada de la vida cotidiana de Buenos Aires: chapas esmaltadas, carteles pintados, baldosas y números de línea de colectivo.

**Demo en vivo:** https://juanlundahl-marketing.github.io/juan-lundahl-interactive-cv/

English: [README.md](README.md)

Es HTML, CSS y JavaScript puros. Sin paso de build, sin dependencias, sin framework. Podés hacerle un fork, reemplazar el contenido por el tuyo y publicarlo gratis en GitHub Pages. Todo lo que necesitás para hacerlo está en este repositorio.

> Nota: la documentación detallada de la carpeta `docs/` está en inglés, salvo la [Guía rápida](docs/es/GUIA-RAPIDA.md). Si lo necesitás, podés pedirle a Claude que te traduzca o te explique cualquier documento.

## Qué hay en la página

- **Hero** con fondo de pared pintada desgastada (celeste, blanco, celeste) y medio Sol de Mayo, un titular grande, etiquetas, botones y un retrato enmarcado.
- **Sobre mí** con una "credencial" esmaltada tipo chapa de puerta (foto, nombre, rol, datos clave) y un cartelito colgante que se da vuelta entre dos mensajes.
- **Idiomas** con banderitas y niveles de cuatro pasos, dentro de Sobre mí.
- **Habilidades como historia de scroll de un embudo de marketing**: un embudo de cuatro chapas se va llenando mientras bajás, un cartel de destino de colectivo muestra la etapa actual y cada etapa lista herramientas con su nivel.
- **Experiencia**: línea de tiempo de tarjetas expandibles.
- **Rango**: industrias, formas de trabajar (presencial, remoto, híbrido), colaboración con otros equipos y una recomendación citada.
- **Educación** con una chapa enmarcada de la universidad, una medalla de premio y una "libreta" con los cursos.
- **Certificaciones** con links a las credenciales.
- **Logros**: contadores animados en pizarras de café, un panel de recorrido de mercados (NA, EMEA, LATAM) y una tira deslizable.
- **Contacto** con una chapa grande de mailto y un botón de LinkedIn.
- **Selector ES / EN / DE** en la navegación, recordado entre visitas y también con `?lang=de` en la URL.
- **Tema claro / oscuro** con botón ("Noche de bar notable" es el oscuro) y también según la preferencia del sistema.
- **Accesibilidad**: link para saltar al contenido, landmarks, todo operable con teclado, foco visible, etiquetas ARIA, contraste AA y nada que dependa solo del color.
- **Movimiento reducido**: con `prefers-reduced-motion` todo queda estático y totalmente encendido.
- **Responsive**: navegación flotante en píldora (abajo en celulares, arriba en escritorio) con scroll-spy.

## Notas técnicas

- Sin build, sin bundler, sin gestor de paquetes. Módulos ES nativos y `fetch`.
- Todo el contenido está en `data/content.json`. El código nunca contiene el texto de tu CV.
- Único recurso externo: Google Fonts (Sansita, Sansita Swashed, Archivo, Encode Sans Condensed).
- Todas las rutas son relativas, así que funciona en una subcarpeta de GitHub Pages (`https://usuario.github.io/repo/`) y en cualquier otro hosting estático.
- Un archivo `.nojekyll` en la raíz le dice a GitHub Pages que sirva los archivos tal cual.

## Inicio rápido

Necesitás un servidor web local, porque los navegadores bloquean los módulos ES y `fetch` con `file://`.

```bash
# Opción 1: Python
python -m http.server 8000

# Opción 2: Node
npx serve .
```

Opción 3, PowerShell de Windows sin instalar nada: mirá la [Guía rápida](docs/es/GUIA-RAPIDA.md).

Después abrí http://localhost:8000. (`npx serve` muestra su propia dirección.)

## Hacelo tuyo en 10 pasos

1. [ ] **Hacé un fork o descargá** este repositorio y corrélo en local (Inicio rápido).
2. [ ] **Copiá la plantilla sobre los datos**: `data/content.template.json` sobre `data/content.json`. Mirá [docs/TEMPLATE-USAGE.md](docs/TEMPLATE-USAGE.md).
3. [ ] **Completá tu contenido** en los tres idiomas (o quitá los que no necesites). Referencia de campos: [docs/CONTENT-SCHEMA.md](docs/CONTENT-SCHEMA.md).
4. [ ] **Reemplazá la foto**: `assets/img/juan.jpg` (cuadrada, de 800 a 1000 px, JPEG, menos de 250 KB). Mantené el nombre del archivo o cambialo en `js/sections/hero.js` y `js/sections/about.js`.
5. [ ] **Editá los textos de la interfaz** en `js/ui-strings.js` (número de ID, pie de página, intro de educación, etc.).
6. [ ] **Editá lo que está escrito en el código**: el texto del cartelito en `js/sections/about.js`, el monograma "JL" en `js/main.js` y el favicon en `index.html`.
7. [ ] **Actualizá el `<head>`** de `index.html`: título, descripción, etiquetas Open Graph y la URL absoluta de `og:image` cuando sepas tu dirección de Pages.
8. [ ] **Elegí tu estilo**: dejá el estilo Porteño o cambiá la paleta y las fuentes en `css/tokens.css` y el fondo del hero. Mirá [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md).
9. [ ] **Revisá privacidad y honestidad**: sin teléfono, DNI ni domicilio; todo dato es cierto; las recomendaciones con permiso. El checklist está en [docs/CUSTOMIZE.md](docs/CUSTOMIZE.md#privacy-and-honesty-checklist).
10. [ ] **Publicá** en GitHub Pages: [docs/DEPLOY-GITHUB-PAGES.md](docs/DEPLOY-GITHUB-PAGES.md).

El recorrido completo es [docs/CUSTOMIZE.md](docs/CUSTOMIZE.md).

## Documentación

| Documento | Qué cubre |
| --- | --- |
| [docs/es/GUIA-RAPIDA.md](docs/es/GUIA-RAPIDA.md) | Corrélo en local en cinco minutos (en español) |
| [docs/CUSTOMIZE.md](docs/CUSTOMIZE.md) | Personalización paso a paso y checklist de privacidad (en inglés) |
| [docs/CONTENT-SCHEMA.md](docs/CONTENT-SCHEMA.md) | Cada campo de `data/content.json` y `js/ui-strings.js` |
| [docs/TEMPLATE-USAGE.md](docs/TEMPLATE-USAGE.md) | Cómo usar `data/content.template.json` |
| [docs/DEPLOY-GITHUB-PAGES.md](docs/DEPLOY-GITHUB-PAGES.md) | Publicar con GitHub CLI o la web, y solución de problemas |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Archivos, módulos de sección, i18n, tema, scroll-spy, reveal |
| [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) | El estilo Porteño: tokens, fuentes, componentes, movimiento |
| [docs/HOW-IT-WAS-BUILT.md](docs/HOW-IT-WAS-BUILT.md) | El proceso con Claude Code, biblioteca de prompts (EN y ES), lecciones aprendidas |
| [docs/design-explorations/](docs/design-explorations/README.md) | Los boards de estilo y alternativas de embudo que se compararon |
| [docs/FAQ.md](docs/FAQ.md) | Respuestas cortas a preguntas comunes |

## Licencia y créditos

- Código y estructura: **Licencia MIT**, copyright Juan Lundahl. Mirá [LICENSE](LICENSE).
- **El contenido personal de Juan no tiene licencia de reutilización**: los textos, la foto, el nombre, las certificaciones, la recomendación de un tercero y los datos personales de `data/content.json` y `assets/img/juan.jpg`. Si armás tu propio CV con esto, reemplazá todo por lo tuyo. Detalles en [NOTICE.md](NOTICE.md) (en inglés).
- Fuentes de Omnibus-Type (Sansita, Sansita Swashed, Archivo) e Impallari Type (Encode Sans Condensed), servidas por Google Fonts.
- Inspirado en un reel de redes sociales sobre CVs interactivos. Diseñado y construido con Claude Code.
