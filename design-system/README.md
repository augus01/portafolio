# Design system "Augusto Pinto" (v8)

> Copia local del design system oficial (artefacto "Augusto Pinto", v8, última modificación 28 oct 2026).
> **Uso obligatorio** en todo el proyecto. La integración con este repo (React + Atomic Design, excepciones del hero) está en [`INTEGRACION.md`](INTEGRACION.md).

Sistema de diseño del portafolio de Augusto Pinto, estudiante de Ingeniería Civil Informática y futuro AI Engineer. Es una sola superficie web, en español, pensada para que un jurado lea quién es en menos de un minuto y encuentre una función creativa que funcione. Carácter: claro, limpio y técnico. Monocromo sobrio: neutros cálidos, tinta y tipografía directa; todo lo demás es aire.

## Fundamentos de contenido

- Escribe en español de Chile, en primera persona, sentence case. Las mayúsculas sostenidas existen solo en `Display` (nombre y títulos) y en `label` (mono); el texto corrido nunca va en mayúsculas.
- Una frase afirma un hecho (con su cifra cuando exista de verdad; nunca se inventan) y luego dice qué sigue. Ejemplo de estructura: "Fui el único developer frontend de Inkvibe, un marketplace de tatuajes para Latinoamérica. Aquí está el repositorio."
- Los botones son verbos concretos: `Ver proyecto`, `Abrir repositorio`, `Enviar mensaje`. Nunca `Aceptar`, `OK` ni `Enviar` a secas.
- Los errores dicen qué pasó y qué hacer, sin culpar: "No pudimos enviar tu mensaje. Revisa tu conexión y vuelve a intentarlo; lo que escribiste sigue aquí."
- Sin signos de exclamación en mensajes del sistema, sin emojis, sin Lorem ipsum. Textos de ejemplo reales y en español.
- Fechas: `27 oct 2026`; relativas ("hace 2 h") con la fecha completa en `title`. Cifras con punto de miles y coma decimal, en cifras tabulares.
- Los vacíos se diseñan: explican por qué están vacíos y ofrecen la siguiente acción.

## Fundamentos visuales

### Color
- Estructura con neutros: `surface-canvas` para la página, `surface-raised` para cards e inputs, `surface-sunken` para secciones alternas, `surface-inverse` para el pie, la terminal y paneles oscuros.
- Texto principal en `ink-primary`; secundario y ayudas en `ink-secondary`. Sobre `surface-inverse`, `ink-on-dark` y `ink-on-dark-muted`. Nunca uses `ink-on-dark-muted` ni `ink-disabled` sobre claro.
- No hay color de marca por ahora. La acción primaria rellena con `action` (tinta) y escribe en `on-action`; hover usa `action-hover` y presionado `action-pressed`. El énfasis se logra con peso, tamaño, `surface-inverse` y espacio, nunca con un cromático.
- Los enlaces van en `ink-primary` con subrayado. La pista de la función creativa usa `surface-sunken` con `border-strong`, no color.
- Los estados usan `status-error` (rojo profundo) y `status-success` (indicador, `-text`, `-soft`), nunca el acento, y siempre llevan icono y palabra.
- Bordes de controles: `border-control` (≥3:1). `border-hairline` es solo decorativo.
- Sin degradados, brillos ni fondos de color en superficies grandes. Única excepción: el fondo de rayos del `Hero`, hecho solo con grises del sistema (`surface-inverse`, `ink-secondary`, `border-control`, `border-on-dark`) y `blur-hero`; ninguna zona supera a `border-control`, así el texto blanco encima mantiene al menos 5:1.

### Tipografía
- Tres familias con un rol cada una. `Display` (Helvetica Bold, `--font-display`; prueba en curso) para el nombre y los títulos: grotesca neutra y directa, siempre en mayúsculas. `Text` (Geist, `--font-text`) para todo el texto corrido. `Mono` (Geist Mono, `--font-mono`) para etiquetas, terminal y datos técnicos.
- Títulos con `hero`, `display`, `heading` y `subheading`, en peso 700 y con tracking ligeramente negativo. Párrafos con `lead`, `body`, `body-sm` y `meta`. Etiquetas en `label`, en mayúsculas.
- El nombre del Hero usa `wordmark`: Helvetica en minúsculas, apretado, como el logo "apinto". El componente lo escala para que ocupe todo el ancho; en contenedores angostos se parte en "augusto" / "pinto". El mismo estilo nombra los proyectos en `ProjectCard`.
- Tamaños en `rem`. `hero` se escala por ancho de contenedor en móvil. El mínimo del sistema es `label` (12px). Párrafos alineados a la izquierda, ancho máximo 640px.

### Espaciado y layout
- Solo valores `space-*`. Entre secciones, `space-section` en contenedores anchos y `space-16` en angostos. Padding de card: `space-6` o `space-8`. Separación entre elementos: `space-4`.
- Contenido a `page-max`. Adapta con container queries, no media queries; el mismo componente se ve a ancho teléfono y escritorio. Sin scroll horizontal desde 320px.

### Formas y materiales
- Radios: `radius-sm` chips, `radius-md` botones e inputs, `radius-lg` cards y paneles, `radius-pill` navegación y el interruptor de la función creativa.
- Dos materiales. Lienzo: plano, con `border-hairline`, sin sombra (`shadow-none`); es todo lo demás. Flotante: solo la `NavBar` fija, con sus píldoras en `surface-float`, `blur-float`, `border-hairline` y `shadow-float`, y su menú móvil, que es sólido (`surface-raised`, `border-hairline`, `shadow-float`) y vive en `z-nav`. Sobre flotante, el texto es `ink-primary` o `ink-secondary`.

### Foco, táctil y movimiento
- Foco siempre visible: anillo `focus-ring` de `focus-ring-width` con `focus-ring-offset` (`focus-ring-on-dark` sobre oscuro). Nunca `outline: none` sin reemplazo.
- Objetivo táctil mínimo `target-min`; acciones principales en móvil, `target-lg`.
- Solo se animan `transform` y `opacity`, con `dur-*` y `ease-*`. Detalle en [`movimiento.md`](movimiento.md).

### Iconografía
- Biblioteca única: Lucide (licencia ISC), trazo de 1,5px, tamaños `icon-sm`, `icon-md`, `icon-lg`. Un icono solo siempre lleva nombre accesible. Error: círculo con exclamación. Correcto: círculo con check.
- La marca es el logo "apinto" y su monograma "ap", solo en blanco y negro (`assets/Logo/`): negro sobre superficies claras, blanco sobre `surface-inverse`. El nombre AUGUSTO PINTO en `hero` acompaña al logo, no lo reemplaza.

## Componentes

- La librería original se construyó sobre Material UI 7 (MUI) como `window.AugustoPinto`. **En este repo se reimplementa en React con Atomic Design** (ver `INTEGRACION.md`), respetando el marcado y las clases `.ap-*` de `components/bundle.css` y las props de `components/index.d.ts`.
- Prefiere los componentes propios (`Button`, `FormField`, `NavBar`, `Hero`…). Si algo se repite y el sistema no lo cubre, se propone como componente.
- Capas: Átomos (`Icon`, `Button`, `Link`, `Tag`, `Divider`, `Logo`), Moléculas (`FormField`, `NavBar`, `SocialLinks`, `SkillGroup`) y Organismos (`Hero`, `SectionHeadline`, `ProjectCard`, `StoryTimeline`, `DiscoveryHint`, `ContactForm`, `Footer`). El portafolio no es una app: no hay toasts, modales ni botones de solo icono sueltos. El campo de texto vive dentro de `FormField`, el botón de menú dentro de `NavBar` y los avisos dentro de `ContactForm`.
- `Button` tiene solo `primary` y `secondary`, en `md` y `lg`; para acciones de baja jerarquía usa `Link`. `Tag` tiene solo `default` e `inverse`.
- `ProjectCard` tiene dos variantes: `featured` para los 3 o 4 proyectos principales y `compact` para el resto, en lista. Resumen de máximo dos líneas en escritorio (unos 140 caracteres); si un texto se pasa, el componente no lo corta: acórtalo. `result` solo con resultados reales.
- Los componentes se adaptan con container queries: el mismo componente funciona a ancho teléfono y escritorio según el espacio que le des.
- Iconos de Lucide 0.468 (ISC); solo los del inventario.

Documentación por componente: `components/<Nombre>/README.md`. Tipos y props: `components/index.d.ts`. Inventario y decisiones abiertas: `inventario.md`. Producto y audiencias: `contexto.md`.

## Prohibido

- Cualquier color de acento (naranja, azul, violeta o lila quedaron descartados), degradados, sombras en el lienzo, tipografías redondeadas en los títulos y comunicar algo solo con color.
- Más de tres familias tipográficas; `Display` en texto corrido.
- Comunicar algo solo con color, solo con posición o solo con hover.
- Valores literales de color, tamaño, radio o duración en componentes: si falta un token, se detiene el trabajo y se propone.
