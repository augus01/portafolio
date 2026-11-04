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
| NavBar v8: una píldora por enlace | En escritorio, todos los enlaces van en **una sola cápsula centrada** con el material flotante (`--surface-float`, `--blur-float`, `--border-hairline`, `--shadow-float`); los enlaces de adentro son texto sin borde ni fondo, la sección actual se rellena en tinta y GitHub y Contacto siguen a las secciones con el mismo espacio, sin separador. Sin la franja de vidrio a todo el ancho (ajuste del 2 nov 2026) | `layout.css` (bloque NavBar) |
| NavBar v8: botón de menú de solo icono | Botón de menú como píldora con icono y texto ("Menú" / "Cerrar"), como en el landing aprobado; se abre hacia arriba sobre el hero. Bajo 600px de ventana la NavBar se oculta y manda la vista móvil (abajo) | `NavBar.jsx`, `layout.css` |
| NavBar v8 sin marca | Logo "apinto" en negro como primer elemento de la cápsula de la nav de escritorio, enlace al inicio, con el alto y relleno de una píldora; bajo 900px de ventana pasa al monograma "ap". Para que el logo y los enlaces pesen lo mismo, los enlaces de la cápsula van en peso 400 (el sistema usa 500). En móvil el logo de la barra también es enlace al inicio (4 nov 2026) | `NavBar.jsx` (`brand`), `layout.css` |
| — | Escalas de los Tweaks: `--wm-scale .65`, `--nav-scale 1.3`, `--top-scale 2.5`, `--meta-scale 1.35` | `.ap-page` |

## Excepciones aprobadas (sección Sobre mí)

La sección `#sobre-mi` se aprobó en el mismo lienzo (30 oct 2026) y se clonó tal cual. Lo que no tiene token vive en variables locales `--about-*` de `.ap-about` (`src/styles/layout.css`):

| Regla del sistema | Excepción de Sobre mí | Variable |
| --- | --- | --- |
| Escala tipográfica fija (`.display` 3,5rem, peso 700, Helvetica) | Frase de impacto en Oswald 400, `clamp(32px, 4.4vw, 64px)` (móvil: `clamp(28px, 7.6vw, 48px)`), interlineado 1,08 (ajuste del 2 nov 2026: antes Geist en escritorio) | `--about-statement-font`, `--about-statement-size`, `--about-statement-leading` |
| Monocromo con tintas del sistema | Tramo destacado de la frase en gris `#a3a3a8` | `--about-muted` |
| Máximo tres familias | Párrafos en **Oswald** 400 (de Google Fonts, alojada en `public/fonts` y precargada), 22px | `--about-text-font`, `--about-text-size` |

## Excepciones aprobadas (sección Superpoderes)

`#superpoderes` sigue la sección **"Con qué construyo"** del artefacto "Hero" (2 nov 2026) y va entre Sobre mí y Proyectos. Es un encabezado igual al de Sobre mí y Proyectos (título con el último tramo en gris y bajada, alineado con el contenido de `.ap-section`; sin la etiqueta "Habilidades" del artefacto, ajuste del 2 nov 2026) y una cinta de 17 logos 3D en dos filas (`SkillsSection` + `TechMarqueeRow`). Cada fila lleva sus logos dos veces y avanza en bucle sin salto; la segunda va más lenta y desfasada. Desde el artefacto "Hero · Augusto Pinto" (3 nov 2026) cada logo es un botón: al pasar el cursor la fila se detiene y el logo sube y gira a su versión a color; al hacer clic se abre su ficha (molécula `SkillCard`, lógica en `hooks/useSkillPicker.js`) al centro sobre un velo con desenfoque: categoría, logo a color flotando sobre el halo del color de su marca, qué logré con esa tecnología y en qué proyectos la usé. La cinta queda detenida mientras la ficha está abierta; Esc, el velo o "Cerrar" la cierran y el foco vuelve al logo, y se cierra sola si la sección sale de pantalla. Con `prefers-reduced-motion` la cinta se queda quieta como grilla centrada, sin la copia. La copia de cada fila tiene `aria-hidden`, y los logos usan `alt=""` porque el nombre va escrito debajo. Lo que no tiene token está en variables `--hab-*` de `.hab-mq` (`src/styles/layout.css`; móvil en `movil.css`):

| Regla del sistema | Excepción de Superpoderes | Variable |
| --- | --- | --- |
| Escala tipográfica fija | Tipografía de Sobre mí: título en Oswald 400 `clamp(32px, 4.4vw, 64px)`, interlineado 1,08, espaciado −0,02em común a Sobre mí, Superpoderes y Proyectos (`--section-title-tracking`) (bajo 600px `clamp(28px, 7.6vw, 48px)`, 1,1), tramo final en `#a3a3a8`; bajada en Oswald 400 22px, ancho máximo 46rem | `--hab-title-*`, `--hab-muted`, `--hab-text-*`, `--hab-intro-max` |
| Proporciones del sistema | Cada tecnología mide 208px de ancho, con el logo a 128px; la sección ocupa al menos el alto de la pantalla desde 900px | `--hab-item-width`, `--hab-logo-size` |
| Duraciones del sistema (≤ 280ms) | Bucle lineal infinito de 46s (fila 1) y 54s con −17s de desfase (fila 2) | `--hab-speed-a`, `--hab-speed-b`, `--hab-offset-b` |
| Sin degradados | Máscara `linear-gradient` que desvanece el 10% de cada borde de la fila (solo transparencia, no pinta color) | `--hab-fade` |
| Monocromo | Los logos son 3D en negro (Vitrum, vista Angle, material Black); al pasar el cursor o en la ficha se ven a color, y la ficha pinta detrás un halo del color de la marca al 22% (`tint` en el contenido) | `--hab-tint` |
| Duraciones y movimiento | Giro del logo en dos tiempos de 200ms; la ficha entra en 450ms y el logo flota en un bucle de 5,5s. Sin animación con `prefers-reduced-motion` | `--hab-flip` |
| Radios y sombras | Ficha de 24px (20px bajo 600px) con sombra propia; escenario del logo 18px; velo `rgba(14,15,18,.42)` con desenfoque de 4px | `src/styles/layout.css` |

Archivos de logo en `public/habilidades/<tecnología>.webp` (negro) y `<tecnología>-color.webp` (color), extraídos del artefacto. El contenido (tecnologías, orden de las filas, categoría, qué logré, proyectos y color de marca) vive en `skills` de `src/content/home.js`; "Helix" del artefacto va como "Zam", el nombre actual del proyecto.

## Excepciones aprobadas (sección Proyectos)

`#proyectos` sigue la grilla de trabajos de **Josephmark** (josephmark.studio), pedida por Augusto el 2 nov 2026: reemplaza al frame Proyectos-logo (cards blancas 5:4). Es una galería de dos columnas (una bajo 720px de contenedor) con un encabezado "Lo que he construido" (el último tramo en gris) y el conteo. Cada proyecto (`ProjectTile`) es una portada 4:5 a sangre, sin card blanca, sin borde y con esquinas rectas (sin `radius`), en el color real de su app, con el logo en blanco a gran tamaño y sin número (ajuste del 2 nov 2026). Rumbo a Casa lleva en la esquina superior izquierda el sello de **AWS Builder Center**: la marca "aws" de Amazon Web Services (Wikimedia Commons, Apache 2.0, © AWS, marca registrada) en blanco y el texto "Builder Center" en Mono (Geist Mono), como en la imagen oficial de builder.aws.com. Si hay capturas reales, tres pantallas forman un collage alrededor del logo (fuera de su franja central) y se abren al pasar el mouse; el logo crece un poco. Si el último proyecto queda solo en su fila, se centra con el ancho de una columna. Debajo: nombre, descripción y rol (el premio como `Tag`), alineados entre proyectos con subgrid. La tipografía es la de Sobre mí. Desde el 4 nov 2026 el nombre de cada proyecto es el enlace a su página dedicada (ver abajo) y su área cubre todo el proyecto, portada incluida; el foco se dibuja alrededor del proyecto completo. Lo que no tiene token está en variables `--gal-*` de `.ap-gal-wrap` (`src/styles/layout.css`):

| Regla del sistema | Excepción de Proyectos | Variable |
| --- | --- | --- |
| Escala tipográfica fija | Tipografía de Sobre mí: título como su frase (Oswald 400, `clamp(32px, 4.4vw, 64px)`, interlineado 1,08; bajo 600px `clamp(28px, 7.6vw, 48px)`), tramo final en `#a3a3a8`; nombre de cada proyecto con la tipografía del título (Oswald 400, espaciado −0,02em) a `clamp(28px, 3vw, 40px)`, interlineado 1,1; descripción en Oswald 300 22px, sin negrita (ancho máximo 46rem, `--section-lead-max`); número, conteo y rol en Oswald 15px (rol y conteo en `--ink-secondary`) | `--gal-title-*`, `--gal-muted`, `--gal-text-font`, `--gal-text-size`, `--gal-text-weight`, `--gal-name-size`, `--gal-name-leading`, `--gal-meta-size` |
| Proporciones del sistema | Portada 4:5; logo imagen al 84%, Rumbo a Casa al 90%, Zam en horizontal (símbolo 30cqw y nombre a 22cqw); capturas al 25, 23 y 32% del ancho, inclinadas; hover del logo a escala 1,04 | `--gal-ratio`, `--gal-gap`, `--gal-hover-scale` |
| Monocromo, sin fondos de color en superficies grandes | Cada portada lleva el color de fondo real de su app, muestreado de sus capturas: Rumbo a Casa `#123b6b`, Inkvibe `#242424`; Zam, sin color de marca todavía, en `--surface-inverse` | `--gal-cover-rumbo`, `--gal-cover-inkvibe`, `--gal-cover-zam` |
| Sin sombras en el lienzo; radios del sistema | Las capturas del collage llevan una sombra suave con desplazamiento (`0 18px 40px`, negro al 38%), solo dentro de la portada. Portadas y capturas con esquinas rectas | `--gal-shot-shadow` |
| Monocromo y fuentes del sistema | Los logos conservan su color y su fuente de marca, en versión clara: Rumbo a Casa en Bricolage Grotesque 700 blanco, Zam con su símbolo (cuadrado redondeado con cuatro círculos superpuestos) y "zam" en minúsculas en Plus Jakarta Sans 500 blanco. Ambas están alojadas en `public/fonts` con solo las letras de sus nombres | `--gal-font-rumbo`, `--gal-font-zam` |

Archivos en `public/proyectos/`: `aws-logo-claro.svg` (marca "aws" en blanco, del sello de Builder Center), `rumbo-simbolo-claro.svg` (del repositorio augus01/rumbo-a-casa, con barras blancas y casa óxido como en el encabezado de la app), `inkvibe-logo-claro.png` (de inkvibe.app, nombre en blanco como en su encabezado), `zam-simbolo-claro.svg` (símbolo de Zam redibujado en SVG desde la referencia de Augusto del 2 nov 2026: cuatro círculos con relleno par-impar recortados por un cuadrado redondeado) y `portada-*.webp` (capturas reales de cada app a 480px de ancho para el collage). Las versiones oscuras (`rumbo-simbolo.svg`, `inkvibe-logo.png`) y las capturas originales se conservan; `zam-isotipo.svg` es el isotipo provisorio anterior y ya no se usa. `public/fonts/PlusJakartaSans-500-zam.woff2` se regeneró desde Plus Jakarta Sans (google/fonts, SIL OFL) con la "z" minúscula.

## Excepciones aprobadas (páginas de proyecto)

Cada proyecto tiene su página en **`/proyectos/<slug>/`** (`rumbo-a-casa`, `inkvibe`, `zam`), clonada de las páginas de caso del artefacto **"Hero · Augusto Pinto"** (4 nov 2026: Rumbo a Casa e Inkvibe, escritorio 1440 y móvil 390; ritmo de dennissnellenberg.com/work/twice). Es una sola estructura para todos: la misma nav del landing (logo, cápsula con Proyectos marcado, barra y menú móvil), siempre visible y clara porque no hay hero; botón redondo que sigue al scroll para volver a proyectos, nombre gigante con la fila de datos, portada en el color de la marca con tres teléfonos y el círculo del enlace principal sobre el borde, introducción (enlaces, stack, qué es y cuatro cifras), escenarios a sangre con las capturas en laptop, tablet y teléfono, "Siguiente proyecto" (en bucle) y pie. Se adapta con container queries (1000px y 720px); bajo 720px la fila de teléfonos pasa a carrusel horizontal. El logo y los teléfonos de la portada tienen un parallax suave (±48px, `hooks/useCaseParallax.js`), apagado con `prefers-reduced-motion`.

- **Zam** no tiene página en el artefacto ni capturas: usa la misma estructura sin teléfonos ni círculo (portada 21:9 con su logo) y un escenario con cómo está armado, solo con hechos ya publicados en el sitio.
- **Inkvibe:** del artefacto se omitieron los huecos para capturas pendientes (artículo del blog, blog en móvil y panel administrativo) y el panel "Estadísticas del panel", que llevaba datos de ejemplo. Se agregan cuando haya capturas y cifras reales.

| Regla del sistema | Excepción | Variable |
| --- | --- | --- |
| Escala tipográfica fija | Nombre del proyecto en Geist 400 `clamp(56px, 10.5cqw, 152px)`, espaciado −0,05em; cifras y títulos de escenario en Geist 400 grande; textos, datos y enlaces en Oswald 17–34px | `src/styles/proyecto.css` |
| Monocromo, sin fondos de color en superficies grandes | Portada y escenarios en los colores de cada marca: Rumbo a Casa `#16406f`, fondo `#e7e1d6`, círculo óxido `#b5542e`; Inkvibe `#2a2a2c`, fondo `#313131`, rojo `#c8403f` (y `#d64d4b` en su miniatura de "Siguiente"); Zam en `--surface-inverse` y `--surface-sunken`. Escenario claro `#efeee9` | `--case-brand`, `--case-tint`, `--case-accent`, `--case-cta`, `--case-next`, `--case-light` (desde `theme` en `src/content/projects.js`) |
| Sin sombras en el lienzo | Dispositivos con sombra propia y el botón de volver con sombra suave | `--case-device-shadow`, `--case-fab-shadow` |
| Espaciado del sistema | Márgenes laterales de 40px (16px bajo 720px), separación de 112px entre cabecera y portada | `--case-gutter`, `--case-head-top` |
| Movimiento solo por acción | Parallax ligado al scroll en la portada | `useCaseParallax.js` |

Componentes: átomo `Device`; moléculas `CaseTopBar`, `CaseCaption`; organismos `CaseHead`, `CaseCover`, `CaseIntro`, `CaseStage`, `CaseNext`, `CaseFooter`; plantilla `CasePageTemplate`; página `ProjectPage`. Contenido en `src/content/projects.js`; capturas en `public/proyectos/casos/` (extraídas del artefacto: teléfono 387 × 784, laptop 1508 × 784, tablet 813 × 1150). El build copia `dist/index.html` a `dist/proyectos/<slug>/index.html` (`vite.config.js`, lista `caseSlugs`) y `main.jsx` elige la página por la ruta.

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

## Excepciones aprobadas (Contacto y Visita mi oficina)

Aprobadas en el artefacto **"Hero · Augusto Pinto"** (3 nov 2026). Contacto deja de ser un formulario: es **"Pasa por recepción"**, con el agente amarillo de recepción en su escritorio 3D (Three.js r128, `src/lib/contactDesk.js`). Respira, parpadea, mira al cursor, teclea si lo dejas tranquilo y salta al hacerle clic o al tocar el timbre. El botón amarillo **"Pasa a la oficina"** es la pista visible de la función creativa: recepción salta, dice "¡Sígueme!", tres franjas con los colores de los agentes tapan la pantalla y se abre la página **`/oficina/`**. "Volver a recepción" hace el mismo paso al revés y deja al visitante en `/#contacto`.

La oficina vive en su propia página, a pantalla completa. Tiene cuatro versiones intercambiables (Original, Mad Men, Los Soprano, 2001 Odisea) y la conversación con los tres agentes encima: recepción (quién es Augusto y el recado), arquitecto (proyectos) y stack (tecnologías). Las respuestas salen de los temas de `src/content/office.js` (lógica pura con tests en `src/lib/officeChat.js`); el artefacto además usaba un modelo de IA del entorno del lienzo, que el sitio no tiene. Recepción toma nombre, necesidad y correo y arma la ficha del recado. Si `leadEmail` tiene un correo, "Enviar recado" abre el correo del visitante con el recado listo; si es `null`, la ficha lo dice como boceto. Three.js, el motor y los decorados se descargan solo en `/oficina/`; el escritorio de recepción, solo cuando Contacto se acerca a la pantalla.

| Regla del sistema | Excepción | Dónde |
| --- | --- | --- |
| Monocromo, sin acentos | Color propio de cada agente (recepción `#f7c61b`, arquitecto `#2f54d4`, stack `#e0621f`) en el botón "Pasa a la oficina", los globos, el botón de enviar, los puntos del historial y las franjas del paso entre páginas. Las maquetas 3D usan la paleta viva de cada oficina | `--ap-agent-*` en `src/styles/oficina.css`; `src/lib/officeThemes.js`, `src/lib/contactDesk.js` |
| Tokens de color en la UI | Mad Men, Los Soprano y 2001 Odisea pintan la UI del escenario (botones, etiquetas, caja del chat, historial) con su paleta; la Original usa solo tokens | `.ap-off--madmen`, `--sopranos`, `--odisea` (variables `--off-*`) |
| Superficies del sistema | Ficha del recado en crema `#fffbea`, igual en las cuatro oficinas | `.ap-ofd__card` |
| Escala tipográfica fija | Título de la oficina en Oswald 28px (22px bajo 720px); botones, etiquetas, globos de nombre y pistas en mono 10–13px; globos en Geist 15px; nombre de la oficina en el panel de carga en display 700 2rem en mayúsculas | `oficina.css`, `contacto.css` |
| Trazo de 1px | Bordes de 2px en botones, caja del chat, globos y botón de recepción; foco de 3px | `--off-stroke`, `--ct-stroke` |
| Radios del sistema | Caja del chat e historial 22px, globos 16px, selector de serie 28px, globo de recepción 14px | `oficina.css`, `contacto.css` |
| Breakpoint de 600px | Bajo **720px** el botón de vuelta queda solo con la flecha, el selector de serie ocupa el ancho del escenario, se ocultan las etiquetas decorativas y los globos se apilan bajo el selector; bajo **900px** Contacto pasa a una columna | `oficina.css`, `contacto.css` |
| Movimiento | Cambio de oficina con un barrido de cuadrados (72px) y panel de avance en 16 segmentos; paso entre páginas con tres franjas (420ms). Con `prefers-reduced-motion` no hay barrido ni franjas | `hooks/useThemeSwap.js`, `hooks/usePageWipe.js` |

Ajuste del 4 nov 2026: sin los botones de vista (Isométrica / Planta) ni los de agente sobre el escenario; al agente se le habla con un clic en la maqueta. El selector de serie va dentro del escenario, arriba a la izquierda, con los colores de cada oficina (`.ap-ofsw--stage`). La oficina ocupa toda la pantalla, sin borde alrededor ni títulos a la vista (el título y la pista quedan para lectores de pantalla); arriba a la derecha flota el botón "Volver a recepción". La primera vista de cada oficina (al entrar y al cambiar de serie) es la general, sin zoom; después, cuando un agente habla (o le está escribiendo), la cámara se le acerca como recepción en Contacto. El globo de texto solo se ve con ese zoom. Un clic en un agente lo acerca y dice su presentación (`intro` en `src/content/office.js`). Si responden varios, la cámara pasa de uno a otro en orden; cuando la pregunta es de otro agente, quien la recibe lo avisa ("Esa pregunta es para arquitecto, que sabe de los proyectos de Augusto. Te llevo a su escritorio.", `chat.handoff`) y a los 2,2 s la cámara viaja a ese escritorio (~0,8 s). Cada cambio de agente lleva ese aviso antes: si la pregunta también es de otro agente, el que respondió anuncia "Arquitecto sabe de los proyectos de Augusto y te cuenta el resto. Te llevo con él." (`chat.handoffMore`) cuando termina el tiempo de lectura de su respuesta. Si le preguntas a un agente algo que también es suyo, responde él primero. Los pasos a recepción también se avisan: para dejar un recado (`chat.handoffLead`), cuando nadie sabe la respuesta (`chat.handoffUnknown`, y recepción ofrece dejarle la pregunta a Augusto con `chat.noMatchHanded`) y en cualquier otra respuesta de recepción, como las sugerencias de quién visita (`chat.handoffBack`). Esc saca el zoom y el globo y vuelve a la vista general (`FOCUS` y `FOCUS_Y` en `lib/officeEngine.js`); con `prefers-reduced-motion` el cambio de encuadre es inmediato.

Componentes: átomos `OfficeButton` y `PageWipe`; moléculas `OfficeThemeSwitch`, `OfficeLeadCard`, `OfficeChatHistory`, `OfficeSwapCover`; organismos `ContactSection`, `Office`, `OfficeChatDock`, `OfficeHeader`; plantilla `OfficePageTemplate`; página `OfficePage`. Lógica en `hooks/useOfficeScene.js`, `useOfficeChat.js`, `useThemeSwap.js`, `usePageWipe.js`, `useContactDesk.js` y `lib/officeEngine.js`, `officeThemes.js`, `officeKit.js`, `contactDesk.js`, `officeChat.js`. El build copia `dist/index.html` a `dist/oficina/index.html` (`vite.config.js`) y `main.jsx` elige la página por la ruta.

## Excepción aprobada (modo liviano de rendimiento)

Aprobada el 2 nov 2026: en equipos o navegadores que no dan abasto (p. ej. Opera GX con GX Control, WebGL sin GPU), la página baja de calidad sola y mantiene todas las animaciones. Lógica en `src/lib/perfTier.js`: el ticker de GSAP mide la fluidez y, si la media de 60 cuadros supera 24 ms (~42 fps) o el renderizador WebGL es por software, sube un nivel. El nivel nunca baja y se publica en `<html data-perf="lite|min">`.

| Nivel | Qué cambia | Dónde |
| --- | --- | --- |
| Todos | Fondo del hero, oficina y escritorio de recepción con tope de 60 fps; la cinta de logos se pausa fuera de pantalla | `useHeroBackground.js`, `officeEngine.js`, `contactDesk.js`, `TechMarqueeRow` |
| `lite` | Fondo del hero a 30 fps y escala interna máx. 0,6; oficina con pixelRatio 1 y sombras de 1024; escritorio de recepción con pixelRatio 1 y sombras de 512 | mismos archivos |
| `min` | Además: fondo a escala 0,45, oficina a 30 fps, sin grano, pills de la nav en `--surface-raised` sin vidrio y barra móvil en `--surface-canvas` sin desenfoque | `hero-inmersivo.css`, `movil.css` |

Para revisar cada nivel a mano: `?perf=full`, `?perf=lite` o `?perf=min` en la URL.

## Pendientes contra el sistema

- **Contraste del gris destacado (Sobre mí y Proyectos):** `#a3a3a8` sobre `--surface-canvas` da ~2,4:1, bajo el 3:1 de WCAG para texto grande. Proponer un gris de al menos 3:1 antes de publicar.

- **Contenido:** el artefacto del hero trae lorem ipsum. El sistema lo prohíbe: hay que reemplazarlo por textos reales (en `src/content/`) antes de publicar.
- **Logos SVG y Big Shoulders Display:** los archivos binarios del artefacto no se pudieron exportar. El logo se dibuja desde el átomo `Logo`; Big Shoulders está "guardada" y no se usa.
- **Recado de recepción:** falta definir el correo de `leadEmail` (`src/content/office.js`) o un envío real (Lambda + SES); mientras sea `null`, la ficha se muestra como boceto.
- **Nav fuera del hero:** la nav (píldoras en escritorio, barra en móvil) no se muestra sobre el hero; aparece arriba al llegar a la página, con y sin `prefers-reduced-motion`. El hero muestra solo el rol, sin ubicación.
- Decisiones abiertas del sistema: ver `inventario.md` (idioma, foto en el hero…).
