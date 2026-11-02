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
| Moléculas | `src/components/molecules/` | NavBar, FormField, SocialLinks, SkillGroup · MobileNavBar (barra móvil), ProjectTile (card de proyecto con logo y pie) |
| Organismos | `src/components/organisms/` | Hero, SectionHeadline, ProjectCard, StoryTimeline, DiscoveryHint, ContactForm, Footer · HeroStage, MobileMenu, ProjectShowcase y las secciones de la página |
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
| Máximo tres familias | Nombre del hero en **Archivo** (de Google Fonts, alojada en `public/fonts` y precargada), `wdth` 125, peso 800, mayúsculas | `.ap-hero__name.wordmark` |
| Movimiento < 300 ms y solo por acción | Paso guiado hero → página de 1,6 s ligado al scroll (Lenis + GSAP), con `prefers-reduced-motion` completo | `src/hooks/useImmersiveScroll.js` |
| Material flotante sólido en la nav | Píldoras de vidrio translúcido sobre el hero (`.ap-nav--dark`) | `hero-inmersivo.css` |
| NavBar v8: botón de menú de solo icono | Botón de menú como píldora con icono y texto ("Menú" / "Cerrar"), como en el landing aprobado; se abre hacia arriba sobre el hero. Bajo 600px de ventana la NavBar se oculta y manda la vista móvil (abajo) | `NavBar.jsx`, `layout.css` |
| — | Escalas de los Tweaks: `--wm-scale .65`, `--nav-scale 1.3`, `--top-scale 2.5`, `--meta-scale 1.35` | `.ap-page` |

## Excepciones aprobadas (sección Sobre mí)

La sección `#sobre-mi` se aprobó en el mismo lienzo (30 oct 2026) y se clonó tal cual. Lo que no tiene token vive en variables locales `--about-*` de `.ap-about` (`src/styles/layout.css`):

| Regla del sistema | Excepción de Sobre mí | Variable |
| --- | --- | --- |
| Escala tipográfica fija (`.display` 3,5rem, peso 700, Helvetica) | Frase de impacto en Oswald 400, `clamp(32px, 4.4vw, 64px)` (móvil: `clamp(28px, 7.6vw, 48px)`), interlineado 1,08 (ajuste del 2 nov 2026: antes Geist en escritorio) | `--about-statement-font`, `--about-statement-size`, `--about-statement-leading` |
| Monocromo con tintas del sistema | Tramo destacado de la frase en gris `#a3a3a8` | `--about-muted` |
| Máximo tres familias | Párrafos en **Oswald** 400 (de Google Fonts, alojada en `public/fonts` y precargada), 22px | `--about-text-font`, `--about-text-size` |

## Excepciones aprobadas (sección Superpoderes)

`#superpoderes` sigue la sección **"Con qué construyo"** del artefacto "Hero" (2 nov 2026) y va entre Sobre mí y Proyectos. Es un encabezado igual al de Sobre mí y Proyectos (título con el último tramo en gris y bajada, alineado con el contenido de `.ap-section`; sin la etiqueta "Habilidades" del artefacto, ajuste del 2 nov 2026) y una cinta de 17 logos 3D en dos filas (`SkillsSection` + `TechMarqueeRow`). Cada fila lleva sus logos dos veces y avanza en bucle sin salto; la segunda va más lenta y desfasada. Pasar el cursor detiene la fila. Con `prefers-reduced-motion` la cinta se queda quieta como grilla centrada, sin la copia. La copia de cada fila tiene `aria-hidden`, y los logos usan `alt=""` porque el nombre va escrito debajo. Lo que no tiene token está en variables `--hab-*` de `.hab-mq` (`src/styles/layout.css`; móvil en `movil.css`):

| Regla del sistema | Excepción de Superpoderes | Variable |
| --- | --- | --- |
| Escala tipográfica fija | Tipografía de Sobre mí: título en Oswald 400 `clamp(32px, 4.4vw, 64px)`, interlineado 1,08, espaciado −0,02em común a Sobre mí, Superpoderes y Proyectos (`--section-title-tracking`) (bajo 600px `clamp(28px, 7.6vw, 48px)`, 1,1), tramo final en `#a3a3a8`; bajada en Oswald 400 22px, ancho máximo 46rem | `--hab-title-*`, `--hab-muted`, `--hab-text-*`, `--hab-intro-max` |
| Proporciones del sistema | Cada tecnología mide 208px de ancho, con el logo a 128px; la sección ocupa al menos el alto de la pantalla desde 900px | `--hab-item-width`, `--hab-logo-size` |
| Duraciones del sistema (≤ 280ms) | Bucle lineal infinito de 46s (fila 1) y 54s con −17s de desfase (fila 2) | `--hab-speed-a`, `--hab-speed-b`, `--hab-offset-b` |
| Sin degradados | Máscara `linear-gradient` que desvanece el 10% de cada borde de la fila (solo transparencia, no pinta color) | `--hab-fade` |
| Monocromo | Sin excepción: los logos son 3D en negro (Vitrum, vista Angle, material Black) | — |

Archivos de logo en `public/habilidades/<tecnología>.webp` (240×240, extraídos del artefacto). El contenido (tecnologías y orden de las filas) vive en `skills` de `src/content/home.js`.

## Excepciones aprobadas (sección Proyectos)

`#proyectos` sigue el frame **Proyectos-logo** del artefacto "Hero" (2 nov 2026), sin fondos de color: reemplaza a la versión con capturas (`ProjectShowcase` + `MediaCard`). Es una galería de dos columnas (una bajo 720px de contenedor) con un encabezado "Lo que he construido" (el último tramo en gris) y el conteo. Cada proyecto (`ProjectTile`) es una card 5:4 en `--surface-raised` con `border-hairline`, `radius-lg`, número y el logo al centro, que crece al pasar el mouse. Debajo: nombre, descripción y rol, alineados entre cards con subgrid. La tipografía es la de Sobre mí (ajuste del 2 nov 2026). Las cards no son links mientras no exista una página de detalle. Lo que no tiene token está en variables `--gal-*` de `.ap-gal-wrap` (`src/styles/layout.css`):

| Regla del sistema | Excepción de Proyectos | Variable |
| --- | --- | --- |
| Escala tipográfica fija | Tipografía de Sobre mí: título como su frase (Oswald 400, `clamp(32px, 4.4vw, 64px)`, interlineado 1,08; bajo 600px `clamp(28px, 7.6vw, 48px)`), tramo final en `#a3a3a8`; nombre de cada proyecto con la tipografía del título (Oswald 400, espaciado −0,02em; ajuste del 2 nov 2026, antes peso 500) a `clamp(28px, 3vw, 40px)`, interlineado 1,1; descripción en Oswald 400 22px (igual que la bajada de Superpoderes: ancho máximo 46rem y 16px bajo el nombre, `--section-lead-max`); número, conteo y rol en Oswald 15px (el rol en `#a3a3a8`) | `--gal-title-*`, `--gal-muted`, `--gal-text-font`, `--gal-text-size`, `--gal-name-size`, `--gal-name-leading`, `--gal-meta-size` |
| Proporciones del sistema | Card 5:4; logo al 64% (imagen) o 76% (símbolo + nombre) del ancho; hover a escala 1,05 | `--gal-ratio`, `--gal-logo-width-ink`, `--gal-logo-width`, `--gal-hover-scale` |
| Monocromo y fuentes del sistema | Los logos conservan su color y su fuente de marca: Rumbo a Casa en Bricolage Grotesque 700 (`#14181f`), Zam en Plus Jakarta Sans 500 (negro). Ambas están alojadas en `public/fonts` con solo las letras de sus nombres | `--gal-font-rumbo`, `--gal-ink-rumbo`, `--gal-font-zam`, `--gal-ink-zam` |

Archivos de logo en `public/proyectos/`: `rumbo-simbolo.svg` (del repositorio augus01/rumbo-a-casa), `inkvibe-logo.png` (de inkvibe.app, nombre recoloreado a negro para fondo claro) y `zam-isotipo.svg` (**provisorio**: redibujado desde la galería aprobada; reemplazar por el archivo original).

## Excepciones aprobadas (vista móvil)

La vista móvil se aprobó en el lienzo "Movil" del mismo artefacto (30 oct 2026, vista previa 390 × 844) y se aplica **bajo 600px de ventana**, el mismo corte que usan NavBar y Hero. Vive en `src/styles/movil.css`; lo que no tiene token está en variables `--m-*` de `.ap-page`.

| Regla del sistema | Excepción móvil | Dónde |
| --- | --- | --- |
| NavBar de píldoras con menú desplegable sólido | Barra propia (`MobileNavBar`): logo a la izquierda y botón de solo icono (52px, icono 30px, trazo 2,25) a la derecha; transparente sobre el hero, vidrio claro `rgba(255,255,255,.88)` con `blur(14px)` y línea inferior sobre la página | `molecules/MobileNavBar`, `--m-bar-*`, `--m-toggle-*` |
| Menú en panel flotante | Menú a pantalla completa en `surface-raised` (`MobileMenu`): enlaces en Oswald mayúsculas `clamp(28px, 8.4vw, 34px)`, llamada "Hablemos" en píldora de 50px, enlace secundario y pie mono de 11px. Detiene el scroll, Esc cierra y devuelve el foco | `organisms/MobileMenu`, `hooks/useMobileMenu.js`, `--m-link-*`, `--m-cta-*` |
| Hero: logo y rol arriba | El logo pasa a la barra; rol · lugar bajan al pie, centrados (máx. 30ch, 20px sobre el borde). Tweaks móviles: nombre 100%, rol y lugar 110% | `--wm-scale`, `--meta-scale`, `--m-hero-foot` |
| Sobre mí | Frase en Oswald `clamp(30px, 8.6vw, 92px)`, interlineado 1,1; párrafos a todo el ancho; relleno 56 / 16 / 48px | `.ap-about` en `movil.css` |
| Movimiento | Con animación, la barra solo se desvanece al entrar al túnel y reaparece arriba; no baja al pie del hero | `useImmersiveScroll.js` |

Los iconos del menú usan Lucide (`menu`, `x`) del átomo `Icon` con el trazo engrosado por CSS, en vez de los trazados propios del lienzo.

## Excepciones aprobadas (Visita mi oficina)

La función creativa `#oficina` se aprobó en el artefacto "Landing · oficina", versión **"Original con más vida"** (31 oct 2026), y va después de Proyectos como en el lienzo "Hero". Es una maqueta 3D (Three.js r128, `three@0.128.0`) de la oficina con tres agentes: recepción (Sobre mí), arquitecto (Proyectos) y stack (Superpoderes técnicos). Arrastrar gira la vista, un clic en un agente o en su botón acerca la cámara y abre su panel, Esc lo cierra; el cajón del rack y el closet esconden dos agentes más. Three.js se descarga aparte, solo cuando el escenario se acerca a la pantalla.

| Regla del sistema | Excepción de la oficina | Dónde |
| --- | --- | --- |
| Monocromo, sin acentos | La maqueta 3D usa la paleta viva del artefacto (muebles, alfombra, sofá, personajes). La UI encima (botones, etiquetas, panel) sigue en tokens monocromos | `src/lib/officeScene.js` |
| Escala tipográfica fija | Título y pista en Oswald 28px (500 y 400); botones, etiquetas y pista del escenario en mono 11px; nombre del agente en Oswald 500 28px en minúsculas; preguntas en Geist 15px | `--off-*` de `.ap-office` |
| Tintas del sistema | Pista bajo el título en gris `#6b6e78` (~5:1 sobre el lienzo) | `--off-subtitle` |
| Trazo de 1px | Bordes de 2px en escenario, botones, panel y preguntas; foco de 3px | `--off-stroke`, `--off-focus-width` |
| Radios del sistema | Panel 22px, preguntas 14px, escenario 18px bajo 720px | `--off-panel-radius`, `--off-q-radius`, `--off-radius` |
| Breakpoint de 600px | Bajo **720px** el escenario baja a `min(78svh, 640px)` (mín. 520px) y se ocultan las etiquetas decorativas | `src/styles/oficina.css` |

El botón de cerrar usa el icono `x` de Lucide (átomo `Icon`) en vez del carácter ✕ del artefacto. Componentes: átomo `OfficeButton`, molécula `OfficeAgentPanel`, organismos `Office` y `OfficeSection`; lógica en `hooks/useOffice.js` y `lib/officeEngine.js`.

## Pendientes contra el sistema

- **Contraste del gris destacado (Sobre mí y Proyectos):** `#a3a3a8` sobre `--surface-canvas` da ~2,4:1, bajo el 3:1 de WCAG para texto grande. Proponer un gris de al menos 3:1 antes de publicar.

- **Contenido:** el artefacto del hero trae lorem ipsum. El sistema lo prohíbe: hay que reemplazarlo por textos reales (en `src/content/`) antes de publicar.
- **Logos SVG y Big Shoulders Display:** los archivos binarios del artefacto no se pudieron exportar. El logo se dibuja desde el átomo `Logo`; Big Shoulders está "guardada" y no se usa.
- **Oficina:** el panel de cada agente es un boceto ("aquí se abre el chat del agente"): falta definir si las preguntas abren un chat real.
- **Nav fuera del hero:** la nav (píldoras en escritorio, barra en móvil) no se muestra sobre el hero; aparece arriba al llegar a la página, con y sin `prefers-reduced-motion`. El hero muestra solo el rol, sin ubicación.
- **Nav sobre la oficina:** en escritorio la nav fija de píldoras queda encima de la barra de la oficina cuando el escenario llega al tope (igual que en el lienzo).
- Decisiones abiertas del sistema: ver `inventario.md` (idioma, foto en el hero…).
