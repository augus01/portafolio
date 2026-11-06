# Pantallas de Zam para la página del proyecto: plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Llenar `/proyectos/zam/` con 6 pantallas de producto hechas en Claude Design (5 de lo que Zam hace y 1 de la próxima etapa), para que el jurado entienda en diez segundos que Zam pone al minimarket chileno al nivel de un supermercado: control de sus datos y de toda su operación.

**Architecture:** Las pantallas se diseñan en Claude Design (claude.ai/design) usando Claude in Chrome. Parten de un brief que fija los datos de una sola tienda ficticia, para que las cifras calcen entre pantallas, las reglas del design system de Zam y las referencias de Refero. Se exportan como imágenes `.webp` con las medidas de los dispositivos que ya usa la página de caso y se agregan como bloques (`laptop`, `phones`, `duo`, `combo`, `split`) en `src/content/projects.js`. No se cambia ningún componente.

**Tech Stack:** Claude in Chrome (`mcp__claude-in-chrome__*`), Claude Design, artefacto del design system de Zam (`X7ksdXrMacxqaMGQZnNJMR`, leído con `mcp__claude-artifacts__read_file`), Refero Styles, Python + Pillow (conversión a webp), Vitest y Vite (ya están en el repo).

**Spec:** No hay un documento de spec. Lo acordado en el chat del 2026-11-06 está en "Decisiones del usuario", más abajo.

## Decisiones del usuario (chat 2026-11-06)

- Lo que el jurado tiene que entender: Zam es innovador y es la solución para que los minimarkets de Chile queden al nivel de un supermercado, con el control de sus datos y control total de su organización.
- Mínimo 5 pantallas. Se generan, no se hacen bocetos previos; después se itera.
- Fuentes obligatorias: los preDocs de Zam (`C:\Users\augus\Documents\zam\zam-backend\preDocs`), el design system de Zam, los design systems de software de Refero (`https://styles.refero.design/?q=software`) y Claude Design operado con Claude in Chrome.
- Sin elementos de relleno ni genéricos de IA. Tiene que verse profesional, tomando las referencias.
- El mapa 3D de la tienda (qué hay en cada estante, zonas de calor de compra y avisos predictivos de quiebre) va como **próxima etapa**, con una **imagen referencial estática**.

## Global Constraints

- Idioma: español de Chile, tuteando ("te quedan", "pide"). Montos `$180.000`, sin decimales, punto de miles; negativos `-$4.500` (README del DS de Zam).
- Color: monocromo (`canvas #ffffff`, `paper #f5f5f5`, `border #e5e5e5`, `ink #171717`, `ink-secondary #525252`) con un solo acento `accent #2563eb`. La acción primaria es negra. Severidades: `attention #d97706` / `attention-ink #92400e`, `urgent #dc2626` / `urgent-ink #b91c1c`, `ok #15803d` / `ok-ink #166534`, `info #475569`. El color va solo en el indicador (punto, chip o franja), nunca en la card completa.
- Tipografía: display en Plus Jakarta Sans 500 (36–48px, -0.02em); todo lo de 30px o menos en Inter; montos en Inter con `tabular-nums`; Geist Mono solo para códigos de barra, SKU y n.º de boleta.
- Radios: solo 6, 8, 12, 16 y pill. Cards planas con borde de 1px; sombra solo en capas flotantes.
- Iconos: Lucide, trazo 2px, tamaños 16, 20 y 24.
- Prohibido (DS de Zam y pedido del usuario): lorem ipsum, emojis, destellos, insignias "IA" o "con IA", degradados, heros morados o azules, fotos de stock, ilustraciones, avatares de stock, gráficos decorativos sin datos, títulos genéricos tipo "Dashboard" o "Overview", botones "Aceptar" u "OK", métricas inventadas sin relación con otras pantallas y marcas comerciales reales de productos.
- Botones con verbos concretos: `Cobrar`, `Abrir caja`, `Pedir a Distribuidora Sur`, `Guardar gasto`.
- Una alerta = el hecho con su cifra + la acción con su plazo. Ejemplo canónico: "Al ritmo actual te quedan ~4 días de Leche entera 1L. Pide a Distribuidora Sur antes del viernes."
- Solo se muestra lo que dicen los preDocs (`01-producto/producto.md`, `06-modulos/*.md`, `07-clientes/*.md`). La única excepción es la pantalla 6, que lleva el rótulo "Próxima etapa · imagen referencial".
- Medidas de exportación (iguales a las capturas existentes): escritorio **1508×784**, teléfono **387×784**, tablet **813×1150**. Formato `.webp`, calidad 85, en `public/proyectos/casos/zam-*.webp`.
- Contenido de la página: textos solo en `src/content/projects.js`, con el mismo tono que Rumbo e Inkvibe. No se tocan componentes ni `design-system/`.
- Commits pequeños en español con prefijo convencional, autor augus01, **sin `Co-Authored-By`** (CLAUDE.md del repo). Rama `main`; no romper el build.
- Sin cambios en AWS.

## Review Focus

1. **Cifras que no calzan entre pantallas.** Por ejemplo, ventas del día distintas en el panel web y en el cierre de caja, o un stock de leche que contradice la alerta. Lo esperable: todas salen de `datos-tienda.md` (Tarea 1). El check es la Tarea 6, paso 1.
2. **Texto en inglés o placeholder que Claude Design deje dentro de la imagen** ("Search…", "John Doe", "Lorem", "Q3 Revenue"). Lo esperable: cero. Se revisa con zoom en cada pantalla (Tareas 3–5, paso "Revisar").
3. **La imagen 3D leída como algo que ya existe.** Lo esperable: tanto la imagen como su caption dicen "Próxima etapa". Lo fija el test `zam: la etapa 3D se rotula como próxima etapa` (Tarea 6).
4. **Una ruta de imagen sin archivo, o con medidas distintas a las del dispositivo** (se vería deformada o rota). Lo fija el test `zam: cada imagen existe y tiene la medida de su dispositivo` (Tarea 6).
5. **Móvil.** El bloque `phones` pasa a carrusel en el teléfono; un texto chico dentro de la imagen no se lee a 387px. Lo esperable: ningún texto bajo 12px efectivos dentro de las capturas de teléfono. Se revisa en `npm run preview` con un viewport de 390px (Tarea 7).

---

### Tarea 1: Brief y datos de la tienda

**Files:**
- Create: `docs/zam-pantallas/brief.md`
- Create: `docs/zam-pantallas/datos-tienda.md`

**Interfaces:**
- Produces: `brief.md` (el prompt base que se pega en Claude Design, con las reglas del DS, las referencias de Refero de la Tarea 2 y la lista de prohibidos) y `datos-tienda.md` (la única fuente de nombres, productos, cifras y fechas que usan todas las pantallas).

- [ ] **Paso 1: Escribir `datos-tienda.md`** con la tienda ficticia **"Minimarket El Roble"** (Ñuñoa, Santiago), con dueña y cajero ficticios. Incluye:
  - fecha de referencia: jueves 6 nov 2026;
  - 12 productos genéricos sin marca, cada uno con SKU/código EAN-13 ficticio, precio con IVA, stock, venta diaria promedio, proveedor y lead time (Leche entera 1L, Pan amasado por kg (granel), Huevos bandeja 30, Bebida cola 3L, Arroz grado 2 1kg, Aceite maravilla 1L, Yogurt batido 1L, Termo 2L, Detergente 3L, Papel higiénico 4 rollos, Cerveza lata 470cc pack 6, Queso gauda laminado 250g);
  - 2 proveedores: Distribuidora Sur y Lácteos del Maipo;
  - ventas del día con el total, la cantidad de boletas, el ticket promedio y el desglose efectivo/tarjeta/transferencia, que suman exacto;
  - 1 caja abierta con su efectivo esperado;
  - las 4 alertas del día, calculadas con la regla de `06-modulos/alerts.md`: `QUIEBRE_STOCK` de Leche (stock ÷ venta diaria ≈ 4 días; lead time + margen de 2 días), `VENCIMIENTO_PROXIMO` de Yogurt (8 u., 10 días), `CAPITAL_ESTANCADO` de Termo ($180.000, 30 días) e `INFLACION_PROVEEDOR` de Arroz (18 % en 3 meses).

  Antes de seguir, comprueba a mano que cada cifra derivada calza.

- [ ] **Paso 2: Escribir `brief.md`** con: el contexto del producto en 5 líneas (desde `01-producto/producto.md` §1–3), las Global Constraints de este plan copiadas tal cual, la tabla de tokens de color, tipografía, radios y sombras del DS de Zam (de `project/tokens.json` en el artefacto) y una sección "Referencias" que se completa en la Tarea 2.

- [ ] **Paso 3: Commit**

```bash
git add docs/zam-pantallas
git commit -m "docs: brief y datos de tienda para las pantallas de Zam"
```

### Tarea 2: Referencias de Refero

**Files:**
- Modify: `docs/zam-pantallas/brief.md` (sección "Referencias")

**Interfaces:**
- Consumes: `brief.md` (Tarea 1).
- Produces: de 3 a 4 referencias con el nombre del sitio, la URL de su DESIGN.md en Refero y **qué se toma concretamente**. Por ejemplo: la densidad de las tablas, el header de 56px con un selector a la izquierda, el ritmo de las métricas en una fila sin cards o el estado vacío con una frase y una acción.

- [ ] **Paso 1:** con Claude in Chrome (`tabs_context_mcp`, y luego una pestaña nueva), abrir `https://styles.refero.design/?q=software` y revisar las colecciones "Light minimal SaaS" y "Linear-style SaaS". Elegir solo estilos **claros y monocromos**, compatibles con el DS de Zam (se descartan los oscuros y los de acento de color fuerte).
- [ ] **Paso 2:** abrir cada estilo elegido y leer su DESIGN.md con `get_page_text`. Anotar en `brief.md` solo los patrones de layout y densidad; nunca colores, fuentes ni logos, porque estos los manda el DS de Zam.
- [ ] **Paso 3: Commit** `docs: referencias de Refero para las pantallas de Zam`

### Tarea 3: Proyecto en Claude Design y pantallas web del dueño (1, 2)

**Files:**
- Create: `public/proyectos/casos/zam-web-inicio.webp` (1508×784)
- Create: `public/proyectos/casos/zam-web-ingreso.webp` (1508×784)

**Interfaces:**
- Consumes: `brief.md`, `datos-tienda.md`.
- Produces: las dos imágenes anteriores y el link del proyecto de Claude Design, anotado al final de `brief.md`.

Pantallas:
1. **Inicio del dueño (web).** El selector de tienda "Minimarket El Roble" está en el header. "Cómo va hoy" muestra las ventas del día (`amount-lg`), las boletas, el ticket promedio y el desglose por medio de pago. Al lado van las 4 alertas del día, cada una con su chip de severidad, el hecho, la acción y su botón con verbo. También aparecen la caja abierta con su efectivo esperado y una tabla de las últimas 6 ventas con el n.º de boleta en mono. El sidebar de 240px tiene las secciones de `07-clientes/web-dueno.md` §1.
2. **Ingreso de mercadería (web).** Es un ingreso de Distribuidora Sur con su cabecera: flete $12.000 prorrateado. Las líneas tienen presentación (caja x12), factor de conversión, costo unitario *landed* calculado y fecha de vencimiento obligatoria en los perecibles. Un aviso en línea indica que el ingreso cubre primero el faltante de 3 u. de Pan. El botón primario es `Registrar ingreso`.

- [ ] **Paso 1:** en Chrome, abrir `https://claude.ai/design` y crear el proyecto "Zam — pantallas de portfolio". Cargar el design system de Zam si Claude Design ofrece elegirlo; si no, pegar en el primer mensaje la sección de tokens de `brief.md`.
- [ ] **Paso 2:** pedir la pantalla 1 con `brief.md` + la parte pertinente de `datos-tienda.md` + la descripción de arriba, con un lienzo de 1508×784.
- [ ] **Paso 3: Revisar.** Hacer zoom por cuadrantes con `computer` → `zoom` y compararlo con la checklist de prohibidos de Global Constraints y con `datos-tienda.md`. Cada falla se corrige pidiendo el cambio en el chat de Claude Design, nunca editando la imagen.
- [ ] **Paso 4:** repetir los pasos 2 y 3 con la pantalla 2.
- [ ] **Paso 5: Exportar.** Abrir la vista previa o compartida a tamaño exacto (`resize_window` o la exportación PNG de Claude Design), capturar con `save_to_disk` y convertir con Pillow a webp de calidad 85, recortando o escalando a 1508×784 exactos. Script en el scratchpad, no en el repo.
- [ ] **Paso 6: Commit** `feat: pantallas web de Zam (inicio del dueño e ingreso de mercadería)`

### Tarea 4: Pantallas de la app (3, 4, 5)

**Files:**
- Create: `public/proyectos/casos/zam-tel-caja.webp` (387×784)
- Create: `public/proyectos/casos/zam-tel-alerta.webp` (387×784)
- Create: `public/proyectos/casos/zam-tel-asistente.webp` (387×784)

**Interfaces:**
- Consumes: el proyecto de Claude Design (Tarea 3), `datos-tienda.md`.

Pantallas (móvil, `body` de 16px, objetivos táctiles de 44/56px):
3. **Caja del cajero.** Una venta en curso con 4 líneas (incluye Pan amasado 0,350 kg a granel y una línea libre "Sin código, $1.200" marcada como venta suelta). El total va en `amount-xl`, junto al botón negro `Cobrar` de 56px y el acceso a escanear. El encabezado dice "Caja 1 · abierta 08:02".
4. **Alerta de quiebre (dueño).** Es el detalle de `QUIEBRE_STOCK` de Leche entera 1L. Muestra el texto canónico en `body-lg`, el stock actual, la venta diaria promedio, el lead time de Lácteos del Maipo y una barra de días restantes. La acción primaria es `Pedir a Lácteos del Maipo` y la secundaria `Ajustar aviso`.
5. **Asistente (dueño).** Muestra la foto de una boleta de gasto como miniatura, enviada por el dueño. Zam responde con un borrador: proveedor, monto $48.600, categoría "Mercadería" y la fecha. Los botones son `Guardar gasto` y `Corregir`. Las frases son cortas, con la cifra primero, sin la palabra "IA" ni insignias (`06-modulos/assistant.md`, README del DS).

- [ ] **Paso 1–3:** generar, revisar con zoom y corregir cada pantalla, igual que en la Tarea 3.
- [ ] **Paso 4:** exportar a 387×784 webp de calidad 85.
- [ ] **Paso 5: Commit** `feat: pantallas de la app de Zam (caja, alerta de quiebre y asistente)`

### Tarea 5: Próxima etapa, el mapa 3D de la tienda (6)

**Files:**
- Create: `public/proyectos/casos/zam-web-mapa-3d.webp` (1508×784)

Pantalla 6, **imagen referencial estática:** una vista isométrica de la planta de Minimarket El Roble con 6 estantes rotulados (Lácteos, Panadería, Bebidas, Abarrotes, Aseo, Congelados) y una capa de zonas de calor de compra. Es la única excepción al monocromo: escala de un solo matiz `attention`, documentada en el brief. Lleva un panel lateral con el estante Lácteos seleccionado, sus productos y el aviso predictivo "Leche entera 1L se acaba en ~4 días en este estante". Arriba a la izquierda, el rótulo fijo **"Próxima etapa · imagen referencial"**.

- [ ] **Paso 1:** generarla en Claude Design como composición estática. No es una escena 3D real: el isométrico se dibuja como ilustración de interfaz.
- [ ] **Paso 2: Revisar**, igual que en la Tarea 3, comprobando además que el rótulo se lee.
- [ ] **Paso 3:** exportar a 1508×784.
- [ ] **Paso 4: Commit** `feat: imagen referencial del mapa 3D de Zam (próxima etapa)`

### Tarea 6: Integrar en la página del proyecto

**Files:**
- Modify: `src/content/projects.js:195-239` (el caso `zam`)
- Create: `src/content/projects.test.js`

**Interfaces:**
- Consumes: las 6 imágenes de las Tareas 3–5 y los tipos de bloque de `src/components/organisms/CaseStage/CaseStage.jsx` (`laptop`, `phones`, `duo`, `combo`, `split`, `columns`).

- [ ] **Paso 1: Cruzar cifras.** Revisar las 6 imágenes contra `datos-tienda.md` (Review Focus 1). Si hay diferencias, se vuelve a la tarea dueña.
- [ ] **Paso 2: Escribir el test que falla** en `src/content/projects.test.js` (Vitest, mismo estilo que `office.test.js`):
  - `zam: tiene al menos 5 capturas de producto`: cuenta los `src` de `zam-*.webp` en `cover.phones` y `stages` (sin repetidos) y espera `≥ 6`.
  - `zam: cada imagen existe y tiene la medida de su dispositivo`: para cada `src`, `existsSync('public' + src)`. La medida se lee del encabezado VP8/VP8L del webp con `readFileSync` (sin dependencias nuevas). Se espera 1508×784 en `laptop`/`combo.laptop`/`duo.laptop` y 387×784 en `phones`/`phone`/`cover.phones`.
  - `zam: cada imagen tiene alt en español y no vacío`: `alt.length > 20`.
  - `zam: la etapa 3D se rotula como próxima etapa`: el bloque cuyo `src` termina en `zam-web-mapa-3d.webp` tiene un caption o copy cuyo texto contiene `"Próxima etapa"`.
  - `zam: el texto ya no dice que no hay capturas`: `intro.body` no contiene `"no tiene capturas"`.
- [ ] **Paso 3:** `npx vitest run src/content/projects.test.js` → FAIL.
- [ ] **Paso 4: Editar el caso `zam`:**
  - `cover.phones`: caja, alerta y asistente.
  - `intro.body`: se reescribe en 3–4 frases con el tono de Rumbo e Inkvibe y se quita "Todavía no tiene capturas públicas". Debe decir para quién es y qué control le da al dueño.
  - `facts`: se mantienen los hechos y se cambia uno por "7 tipos de alerta que explican y proponen" (`06-modulos/alerts.md`).
  - `stages`, en este orden:
    - `tint` "El dueño en la web": `laptop` inicio (01) + `laptop` ingreso (02).
    - `light` "En la tienda": `duo` con copy (03, caja) + `phones` caja/alerta/asistente (04).
    - `brand` "Próxima etapa": `split` (05, "Ver la tienda como la ve un supermercado.", qué hace el mapa y por qué, dicho como plan) + `laptop` mapa 3D con caption "06 — Próxima etapa · imagen referencial".
    - el stage de arquitectura que ya existe, al final.
  - `nextThumb`: `{ src: zam-tel-alerta.webp, ...PHONE }`.
  - Actualizar el comentario de la cabecera del archivo, porque Zam ya tiene capturas.
- [ ] **Paso 5:** `npx vitest run` → todo PASS.
- [ ] **Paso 6: Commit** `feat: pantallas de Zam en la página del proyecto`

### Tarea 7: Verificar en el navegador

- [ ] **Paso 1:** `npm run build`, que termina sin errores, y después `npm run preview`.
- [ ] **Paso 2:** con Claude in Chrome, abrir `http://localhost:4173/proyectos/zam/` a 1440px y a 390px de ancho. Comprobar que se ven la portada con 3 teléfonos, las 4 etapas, el carrusel en móvil, cero errores en la consola (`read_console_messages`) y textos legibles en las capturas de teléfono (Review Focus 5).
- [ ] **Paso 3:** guardar 2 screenshots (escritorio y móvil) para el write-up del Builder Center en `docs/sensible/capturas/` (local).
- [ ] **Paso 4:** cerrar las pestañas creadas. Mostrarle al usuario el resultado y la lista de pantallas para la iteración que pidió.
