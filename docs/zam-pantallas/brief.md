# Brief: pantallas de Zam para el portfolio

Es el prompt base para Claude Design. Se pega al empezar el proyecto y se cita en cada pantalla. Los datos salen solo de `datos-tienda.md`.

## Producto

Zam es el sistema de caja, inventario y finanzas del minimarket de barrio en Chile. Busca que un almacén tenga el mismo control de sus datos que un supermercado.
- Tiene dos superficies con audiencias distintas: la **app móvil** (el cajero vende, con fila esperando; el dueño ve alertas, ventas del día y habla con Zam) y la **web** (solo el dueño: catálogo, mercadería, stock, proveedores, equipo, caja).
- El dueño no sabe de contabilidad ni de inventario y tiene que entender en segundos qué pasa con su negocio y su plata.
- Cada alerta explica un hecho con su cifra y propone una acción con plazo. El asistente propone borradores y nunca guarda sin confirmación.
- La venta nunca se bloquea: si un producto no está en el catálogo, se agrega como línea libre.

## Reglas visuales (design system de Zam)

- **Color:** monocromo. canvas `#ffffff`, paper `#f5f5f5`, border `#e5e5e5`, border-strong `#d4d4d4`, border-control `#8f8f8f`, ink `#171717`, ink-secondary `#525252`, ink-muted `#737373` (solo sobre canvas). Un solo acento: accent `#2563eb`, con accent-soft `#dbeaff` y accent-strong `#1e40af`. Va en enlaces, el ítem activo y el anillo de foco; nunca de fondo en superficies grandes.
- **Acción primaria:** negra (`#171717`, con texto blanco). Hay una sola por superficie.
- **Severidades** (el color va solo en el punto, el chip o una franja delgada, nunca en la card entera; cada una lleva además palabra y forma):
  - Informativa: `#475569` sobre chip `#f1f5f9`, círculo.
  - Atención: indicador `#d97706`, texto `#92400e`, chip `#fef3c7`, triángulo.
  - Urgente: indicador `#dc2626`, texto `#b91c1c`, chip `#fee2e2`, octágono.
  - Todo en orden: indicador `#15803d`, texto `#166534`, chip `#dcfce7`, check.
- **Tipografía:**
  - Plus Jakarta Sans 500, con -0.02em, solo para display (36–48px).
  - Inter para todo lo de 30px o menos. Títulos: 30/24/20px, peso 500. Cuerpo: 16px en móvil y 14px en la web.
  - Montos en Inter 500 con tabular-nums: 48px el total de la caja, 32px las cifras principales de un panel, 20px un monto en fila, 16px en tablas.
  - Geist Mono solo para códigos de barra, SKU y n.º de boleta.
  - La jerarquía se marca con peso y tamaño, no con color.
- **Radios:** solo 6 (inputs), 8 (botones), 12 (cards, tablas, burbujas), 16 (cards grandes, sheets) y pill (chips, badges, avatares).
- **Profundidad:** cards, tablas e inputs planos, con borde de 1px y sin sombra. Solo las capas flotantes (nav, sheet, popover) son de vidrio translúcido `rgba(255,255,255,.72)`, con blur de 20px y sombra suave.
- **Espacio:** escala de 4px. Padding de card 16px, grupos a 8px. Secciones de la web a 64px. En móvil, toque mínimo de 44px; los botones principales y las teclas de la caja, de 56px.
- **Web:** sidebar de 240px y contenido de 1200px como máximo, alineado a la izquierda.
- **Iconos:** Lucide, trazo de 2px, 16, 20 o 24px.

## Contenido

- Español de Chile, tuteando. Frases en sentence case, sin signos de exclamación.
- Montos `$180.000`, sin decimales; negativos `-$4.500`. Los costos unitarios pueden llevar decimales con coma (`$1.171,11`).
- Botones con verbos concretos: `Cobrar`, `Abrir caja`, `Registrar ingreso`, `Pedir a Lácteos del Maipo`, `Guardar gasto`. Nunca `Aceptar` ni `OK`.
- Alerta = hecho con cifra + acción con plazo: "Al ritmo actual te quedan ~4 días de Leche entera 1L. Pide a Lácteos del Maipo antes del sábado."

## Prohibido

Lorem ipsum, emojis, destellos, insignias "IA" o "con IA", degradados, heros morados o azules, fotos de stock, ilustraciones decorativas, avatares con foto (solo iniciales en pill), gráficos decorativos sin datos, títulos genéricos ("Dashboard", "Overview", "Welcome back"), cualquier texto en inglés ("Search…", "Settings", "John Doe"), cifras que no salgan de `datos-tienda.md` y marcas comerciales reales de productos.

## Referencias de Refero (solo layout y densidad; color y fuentes los manda Zam)

De la búsqueda "Light minimal SaaS with neutral surfaces" en Refero Styles se eligieron solo estilos claros y casi monocromos:

1. **Seline Analytics**: https://styles.refero.design/style/7967c6d9-e50c-42b5-b4d1-74003ba41781
   - Se toma: líneas de 1px como estructura principal en vez de paneles pesados; un solo color con voz propia, que es lo más fuerte de la pantalla por la contención de todo lo demás; densidad compacta con separación de 8px dentro de un grupo; los datos reales del producto como prueba.
   - No se toma: el fondo cálido, el cian, la mascota ni los botones pill.
2. **Hellotime**: https://styles.refero.design/style/dbc5ecba-7309-456f-93b4-4356c6b0d293
   - Se toma: la jerarquía por contraste de peso tipográfico y no por color; superficies planas con borde fino y sin elevación; el botón oscuro como único elemento lleno, para que cada acción se sienta deliberada.
   - No se toma: el degradado azul de los titulares (prohibido en Zam) ni los titulares de 64–80px.
3. **Visitors**: https://styles.refero.design/style/e7876363-181a-44a9-9e5c-2255cf98aea5
   - Se toma: la columna vertebral en escala de grises de un producto de analítica; no mezclar acentos dentro de un componente; sombras chicas o ninguna.
   - No se toma: el lavanda ni la tipografía OpenRunde.

Patrones concretos para las pantallas:
- Las cifras del día van en una fila, separadas por líneas verticales de 1px, sin una card por cifra.
- Las tablas son de filas de 44px con borde inferior de 1px, encabezado en 13px peso 500 color ink-secondary, montos alineados a la derecha en tabular-nums y n.º de boleta en mono.
- El header de la web mide 56px, con el selector de tienda a la izquierda y la fecha y las iniciales de la dueña a la derecha.
- Hay una acción negra por pantalla y el resto son botones con borde.
- El aire viene del espacio, no de cajas: se agrupa con espacio y líneas antes que con cards.

## Pantallas

| # | Archivo | Superficie | Medida |
|---|---|---|---|
| 1 | zam-web-inicio.webp | Web del dueño, inicio del día | 1508×784 |
| 2 | zam-web-ingreso.webp | Web, ingreso de mercadería | 1508×784 |
| 3 | zam-tel-caja.webp | App, caja del cajero | 387×784 |
| 4 | zam-tel-alerta.webp | App, alerta de quiebre | 387×784 |
| 5 | zam-tel-asistente.webp | App, asistente con gasto | 387×784 |
| 6 | zam-web-mapa-3d.webp | Próxima etapa, mapa 3D (imagen referencial) | 1508×784 |

Excepción de la pantalla 6: las zonas de calor usan una escala de un solo matiz derivada de attention (`#fef3c7` → `#d97706`). Es el único lugar donde el color cubre una superficie, y va rotulado como "Próxima etapa · imagen referencial".
