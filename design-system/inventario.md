# Inventario

Tercera entrega: el sistema se recortó a lo que necesita un portafolio, que no es una app. Quedan 17 componentes en tres capas sobre Material UI 7 con los tokens del sistema; cada uno tiene preview a ancho teléfono y escritorio y README con propiedades, teclado y uso.

## Arquitectura por capas

Todas las superficies son web (escritorio y móvil, mismo comportamiento). Material: Lienzo (plano, con borde hairline, sin sombra) o Flotante, que queda solo para la NavBar fija y su menú móvil.

### Capa 1 · Átomos

| Componente | Material | Qué resuelve | Estado |
| --- | --- | --- | --- |
| Button | Lienzo | Acción primaria (`action`, tinta) o secundaria (contorno `border-strong`), en `md` y `lg` | Construido. Sin terciaria ni `sm`: para eso está Link |
| Link | Lienzo | Enlace en texto, interno o externo con flecha | Construido |
| Tag | Lienzo | Tecnología, estado de proyecto o disponibilidad, en `default` o `inverse` | Construido. Sin `outline` |
| Logo | Lienzo | Logotipo "apinto" y monograma "ap", en blanco y negro | Construido. Archivos en `assets/Logo/` |
| Icon | Lienzo | Iconos Lucide en tres tamaños | Construido |
| Divider | Lienzo | Corte de sección | Construido |

### Capa 2 · Moléculas

| Componente | Material | Qué resuelve | Estado |
| --- | --- | --- | --- |
| FormField | Lienzo | Etiqueta + campo (una o varias líneas) + ayuda + error o correcto | Construido. Incluye el campo de texto, que ya no se exporta solo |
| NavBar | Flotante | Navegación en píldoras; en móvil, botón de menú y menú sólido | Construido. Incluye el botón de solo icono, que ya no se exporta solo |
| SocialLinks | Lienzo | GitHub, LinkedIn y correo | Construido |
| SkillGroup | Lienzo | Grupo de Tags bajo un título | Construido |

### Capa 3 · Organismos

| Componente | Material | Qué resuelve | Estado |
| --- | --- | --- | --- |
| Hero | Lienzo | Rayos en grises, "augusto pinto" ajustado al ancho, logo, rol, disponibilidad opcional y navegación | Construido. Nueva prop `availability` |
| SectionHeadline | Lienzo | Antetítulo mono, titular `display` y párrafo `lead` | Construido |
| ProjectCard | Lienzo | `featured`: card con índice, nombre, rol, resumen, resultado, stack y acciones junto a captura o panel. `compact`: fila de índice para proyectos secundarios | Rediseñado. Nuevas props `variant`, `index` y `result` |
| StoryTimeline | Lienzo | Sobre mí: recorrido en pocos hitos | Construido |
| DiscoveryHint | Lienzo | Pista visible que lleva a la función creativa | Construido |
| ContactForm | Lienzo | Formulario con validación, envío y avisos de error o confirmación en línea | Construido. Incluye el aviso en línea, que ya no se exporta solo |
| Footer | Lienzo | Pie oscuro con logo, enlaces y nota | Construido |
| CreativeFeature | Flotante | La función creativa interactiva | Pendiente (decisión 1) |

### Capa 4 · Plantillas

| Plantilla | Qué resuelve | Estado |
| --- | --- | --- |
| PortfolioPage | Hero · Sobre mí · Superpoderes técnicos · Proyectos · Contacto · Pie | Pendiente |
| ProjectDetail | Página de un proyecto, destino del link "Ver caso" de ProjectCard | Pendiente |

### Eliminados en esta entrega

Toast (la confirmación vive en ContactForm), y como exportaciones sueltas: StatusMessage, Input e IconButton, que siguen existiendo solo dentro de ContactForm, FormField y NavBar.

### Íconos (Lucide 0.468, ISC)

`arrow-up-right`, `arrow-right`, `arrow-down`, `chevron-down`, `menu`, `x`, `check-circle`, `alert-circle`, `info`, `mail`, `terminal`, `copy`, `check`.

## Estado

Construidos y verificados (render a 1100px y 390px sin errores de consola; teclado probado en Button, NavBar, ContactForm y la lista compact de ProjectCard): los 17 componentes de las tres capas. Pendientes: CreativeFeature y las plantillas.

## Decisiones

| # | Decisión | Estado |
| --- | --- | --- |
| 1 | Función creativa | Pendiente. Encaja con este estilo una terminal donde se escribe `ls proyectos`. Define también su pista visible |
| 2 | Idioma del sitio | Pendiente. Español como base; ¿conmutador ES/EN o inglés solo en el resumen del proyecto para el jurado de AWS? |
| 3 | Tema oscuro | Pendiente. Solo claro por ahora |
| 4 | Tipografías | En prueba: Helvetica Bold para títulos (sin archivo, usa la del equipo con Arial de respaldo). Geist y Geist Mono con archivos en `fonts/`. Big Shoulders Display guardada |
| 5 | Qué proyectos mostrar | Resuelto en parte: Inkvibe y Helix son `featured`, con los datos que confirmaste. Faltan capturas reales, resultados reales y el resto de la lista `compact` |
| 6 | Color de acento | Resuelto: monocromo, sin acento |
| 7 | Nombre del Hero | En minúsculas como el logo. Con `uppercase` vuelve a mayúsculas |
| 8 | Foto en el Hero | Abierta de nuevo: al eliminar `scrim`, una foto en el Hero solo lleva la viñeta de bordes oscuros y el contraste del nombre sobre zonas claras no está garantizado. Sin foto (rayos en grises) no hay problema. Si se usará foto, hace falta un token de velo propio del Hero |
| 9 | Modales y capas | Resuelto: el portafolio no usa modales, sheets ni popovers. El material Flotante queda solo para la NavBar |

## Tokens propuestos que esperan aprobación

`action-hover`, `action-pressed`, `focus-ring*`, `status-error*`, `status-success*`, `icon-*`, `control-sm`, `blur-hero`, el estilo tipográfico `wordmark`, duraciones, easings, `scale-press` y `z-nav`. Nuevo en esta entrega: `scale-hover` (1,02), para el hover de la imagen de ProjectCard. Eliminados: `scrim`, `scale-recede`, `z-scrim`, `z-modal` y `z-popover`.

## Valores sin token

- `min-height` del Hero (`100svh` por defecto, prop `height`) y el tamaño de los nombres que se ajustan al ancho (Hero y panel de ProjectCard), que calcula el componente.
- Tamaño del nombre en la columna de texto de ProjectCard y en la fila `compact`: usan `space-12`/`space-16` y `space-8` como medida. Conviene crear estilos tipográficos `wordmark-md` y `wordmark-sm` en vez de tomar prestada la escala de espacio.
- Desplazamiento de la flecha en hover: `space-1 ÷ 2` (2px).
- Proporción 16/10 del panel en contenedores angostos.
- Medidas de lectura en `ch` y `rem` (`40ch`, `60ch`, `46rem`, columna de 12rem en StoryTimeline) y los cortes de container queries (480, 560, 600, 640, 720 y 900px).
- Filtros de imagen (`grayscale(1)`, `contrast(1.1)`) y las paradas del degradado del Hero.
- MUI conserva sus z-index por defecto para modal, tooltip y snackbar, que el sistema ya no usa.
