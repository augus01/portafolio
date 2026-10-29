# Integración del design system en este repo

Cómo se aplica el sistema "Augusto Pinto" v8 en el portafolio (React + Vite).

## Qué se importa

`src/styles/index.css` carga, en este orden:

1. `design-system/tokens.css` — tokens v8, `@font-face` de Geist / Geist Mono y clases tipográficas.
2. `design-system/components/bundle.css` — estilos `.ap-*` de los componentes.
3. Estilos de la página (`src/styles/*.css`), que solo usan tokens.

`tokens.json`, `components/index.d.ts` y los `README.md` son la documentación fuente: props, accesibilidad y uso de cada componente.

## Componentes: React + Atomic Design

El sistema original se publica sobre MUI 7 (`window.AugustoPinto`). Aquí **no se usa MUI ni el bundle JS**: cada componente se reimplementa en `src/components/` con el mismo marcado, las mismas clases `.ap-*` y las mismas props de `index.d.ts`.

| Capa del sistema | Carpeta | Componentes |
| --- | --- | --- |
| Átomos | `src/components/atoms/` | Icon, Logo, Tag, Link, Button, Divider · Pill (píldora de NavBar) · Wordmark (nombre ajustado del Hero) · HeroCanvas, GrainOverlay (propios del hero inmersivo) |
| Moléculas | `src/components/molecules/` | NavBar, FormField, SocialLinks, SkillGroup · InfoCard |
| Organismos | `src/components/organisms/` | Hero, SectionHeadline, ProjectCard, StoryTimeline, DiscoveryHint, ContactForm, Footer · HeroStage y las secciones de la página |
| Plantillas | `src/components/templates/` | ImmersiveLandingTemplate (PortfolioPage del inventario) |
| Páginas | `src/components/pages/` | HomePage |

Se implementa cada componente cuando la página lo usa; no se crean componentes vacíos.

### Compatibilidad con selectores de MUI

Algunas reglas de `bundle.css` apuntan a clases de MUI (`.MuiButtonBase-root`, `.MuiInputBase-root`). Para reutilizarlas sin MUI, el componente React agrega esa clase a su elemento nativo cuando la necesita. No se edita `bundle.css`.

## Excepciones aprobadas (hero inmersivo)

El hero se aprobó aparte, en el artefacto "Hero inmersivo" (`hero-inmersivo.zip`, 28 oct 2026). Estas diferencias con el sistema base están aprobadas y **no se cambian sin preguntar**:

| Regla del sistema | Excepción del hero | Dónde |
| --- | --- | --- |
| Monocromo, sin color ni degradados | Fondo WebGL de rayos con la paleta local `--hero-*` (shadow, teal, cyan, cyan-light, lime, ocre, rose) y fallback con conic gradients | `src/styles/hero-inmersivo.css`, `src/lib/heroGL.js` |
| Máximo tres familias | Nombre del hero en **Archivo** (Google Fonts), `wdth` 125, peso 800, mayúsculas | `.ap-hero__name.wordmark` |
| Movimiento < 300 ms y solo por acción | Paso guiado hero → página de 1,6 s ligado al scroll (Lenis + GSAP), con `prefers-reduced-motion` completo | `src/hooks/useImmersiveScroll.js` |
| Material flotante sólido en la nav | Píldoras de vidrio translúcido sobre el hero (`.ap-nav--dark`) | `hero-inmersivo.css` |
| NavBar v8: botón de menú de solo icono | Botón de menú como píldora con icono y texto ("Menú" / "Cerrar"), como en el landing aprobado; se abre hacia arriba sobre el hero | `NavBar.jsx`, `layout.css` |
| — | Escalas de los Tweaks: `--wm-scale .65`, `--nav-scale 1.3`, `--top-scale 2.5`, `--meta-scale 1.35` | `.ap-page` |

## Pendientes contra el sistema

- **Contenido:** el artefacto del hero trae lorem ipsum. El sistema lo prohíbe: hay que reemplazarlo por textos reales (en `src/content/`) antes de publicar.
- **Logos SVG y Big Shoulders Display:** los archivos binarios del artefacto no se pudieron exportar. El logo se dibuja desde el átomo `Logo`; Big Shoulders está "guardada" y no se usa.
- Decisiones abiertas del sistema: ver `inventario.md` (función creativa, idioma, foto en el hero…).
