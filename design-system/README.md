# Design system "Augusto Pinto"

Registro visual oficial del portafolio. **Toda la UI se construye con estos tokens y clases.** Es la versión con la que se aprobó el diseño del hero inmersivo.

## Archivos

| Ruta | Qué es | ¿Se importa en la app? |
| --- | --- | --- |
| `tokens.css` | Tokens (color, tipografía, espacio, radios, sombras, movimiento, z-index) + `@font-face` de Geist / Geist Mono + clases tipográficas | Sí (`src/styles/index.css`) |
| `components/bundle.css` | Estilos de los componentes (`.ap-*`). Cada valor sale de un token | Sí (`src/styles/index.css`) |
| `components/bundle.js` | Bundle compilado original (MUI 7, `window.AugustoPinto`). **Solo referencia** del marcado y las props aprobadas | **No.** Los componentes se reimplementan en React con Atomic Design en `src/components` |
| `fonts/` | Geist 400/500/600 y Geist Mono 400/500 (woff2) | Vía `tokens.css` |

No editar estos archivos para "ajustar" un componente: si falta algo, se agrega un token o una clase nueva aquí, documentada en este README.

## Tokens principales

- **Superficies:** `--surface-canvas` `#fbfbf9`, `--surface-raised` `#fff`, `--surface-sunken`, `--surface-inverse` `#0e0f12`, `--surface-float`.
- **Tinta:** `--ink-primary`, `--ink-secondary`, `--ink-disabled`, `--ink-on-dark`, `--ink-on-dark-muted`.
- **Bordes:** `--border-hairline`, `--border-control`, `--border-strong`, `--border-on-dark`.
- **Acción y foco:** `--action`, `--action-hover`, `--action-pressed`, `--on-action`, `--focus-ring`, `--focus-ring-on-dark`.
- **Estado:** `--status-error*`, `--status-success*`, `--scrim`.
- **Fuentes:** `--font-display` (Helvetica Neue), `--font-text` (Geist), `--font-mono` (Geist Mono).
- **Espacio:** `--space-1` 4 · `-2` 8 · `-3` 12 · `-4` 16 · `-6` 24 · `-8` 32 · `-12` 48 · `-16` 64 · `-24` 96 · `--space-section` 128.
- **Radios:** `--radius-sm` 8 · `-md` 12 · `-lg` 20 · `-pill`.
- **Tamaños:** `--control-sm` 36, `--target-min` 44, `--target-lg` 56, `--page-max` 1200, `--icon-sm|md|lg`.
- **Movimiento:** `--dur-press|enter|move`, `--ease-out`, `--ease-in-out`, `--scale-press`, `--scale-recede`.
- **Capas:** `--z-nav` 20, `--z-popover` 30, `--z-scrim` 40, `--z-modal` 50.

## Clases tipográficas

`.wordmark`, `.hero`, `.display`, `.heading`, `.subheading`, `.lead`, `.body`, `.body-sm`, `.meta`, `.label`, `.code`. Se usan siempre en vez de definir `font-size`/`font-weight` a mano.

## Componentes del sistema (catálogo)

Icon, Button, IconButton, Link, Tag, Divider, Logo, Input, FormField, StatusMessage, NavBar, SocialLinks, SkillGroup, Toast, DiscoveryHint, Hero, SectionHeadline, ProjectCard, StoryTimeline, ContactForm, Footer.

Al implementar uno en React se respeta el marcado y las clases `.ap-*` de `bundle.js` (BEM: bloque `ap-x`, elemento `ap-x__y`, modificador `ap-x--z`, estado `is-*`).

## Paleta local del hero (no son tokens del sistema)

Viven en `.ap-sticky` y el shader las lee por posición: `--hero-shadow #062a35`, `--hero-teal #0b4f63`, `--hero-cyan #1fa3c4`, `--hero-cyan-light #9fe3f0`, `--hero-lime #d9d36a`, `--hero-ocre #c9973f`, `--hero-rose #d9a3a0`.

## Reglas

- Solo colores, espacios, radios y duraciones de los tokens. Nada de hex sueltos fuera de la paleta del hero.
- Animar solo `transform` y `opacity`.
- Respetar `prefers-reduced-motion: reduce`.
- Objetivo táctil mínimo `--target-min` (44 px); foco visible con `--focus-ring`.
