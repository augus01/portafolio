# Rendimiento de animaciones — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que el scroll y las animaciones vayan fluidos en navegadores o equipos limitados (p. ej. Opera GX con GX Control, sin GPU real), sin quitar animaciones y sin que el usuario ajuste nada.

**Architecture:** Un store mínimo de "nivel de rendimiento" (`0` completo, `1` liviano, `2` mínimo) en `src/lib/perfTier.js`, alimentado por los intervalos del ticker de GSAP que ya corre en cada cuadro y por la detección de WebGL por software. El nivel solo sube, nunca baja (sin parpadeo), y se refleja en `<html data-perf="lite|min">` para el CSS y en suscripciones para los bucles WebGL. Además, mejoras para todos sin cambio visible: tope de 60 cuadros por segundo en los bucles WebGL y cinta de logos pausada fuera de pantalla.

**Tech Stack:** React 19 + Vite 8, gsap 3.13.0, lenis 1.3.4, three 0.128.0. Tests de lógica pura con `node --test` (Node 24, sin dependencias nuevas).

**Spec:** Acordado en chat el 2026-11-02 (no hay documento aparte):
- Mejoras sin cambio visible: shader del hero con tope de 60 fps, medición del titular sin forzar layout, pausar la cinta y los loops fuera de pantalla.
- Modo liviano automático por escalones si la página mide baja fluidez o detecta WebGL sin GPU: primero resolución y cuadros del fondo (y de la oficina), después grano y desenfoque de la nav → tono sólido.
- Aceptado por el usuario: en un equipo débil el fondo se ve más suave y la nav pierde el vidrio, a cambio de fluidez.
- Verificar midiendo cuadros por segundo antes y después en Chrome con carga simulada.

## Global Constraints

- Sin dependencias nuevas (`package.json` solo gana el script `"test": "node --test src/lib/"`).
- Tokens del design system para todo valor nuevo de CSS (`var(--surface-*)` etc.); las excepciones del hero se documentan en `design-system/INTEGRACION.md`.
- Atomic Design: hooks en `src/hooks/`, lógica no visual en `src/lib/`; un componente importa solo de su capa o inferiores.
- `prefers-reduced-motion: reduce` sigue igual que hoy (sin Lenis, fondo estático).
- Commits pequeños, en español, prefijo convencional, autor único augus01, **sin `Co-Authored-By`** (CLAUDE.md del proyecto).
- No romper `main`: `npm run build` debe pasar en cada commit.

## Review Focus

1. **Pestaña oculta, capturas o cambio de pestaña** generan un intervalo gigante (segundos): no debe subir el nivel → test `ignora intervalos mayores a 250 ms` (Task 1).
2. **Un tirón aislado** (carga diferida de three.js, fuentes): un solo cuadro de 200 ms en una ventana sana no debe subir el nivel → test `un pico aislado no sube el nivel` (Task 1).
3. **Pantallas de 120/144 Hz**: el tope de 60 fps no debe caer a ~48 fps por redondeo → test `a 144 Hz entrega entre 55 y 60 cuadros por segundo` (Task 1).
4. **El nivel nunca baja** aunque luego se mida fluido (evita que el fondo cambie de calidad una y otra vez) → test `raisePerfTier nunca baja` (Task 1).
5. **Lazo de realimentación**: el ajuste interno de resolución del hero mide cuadros ya limitados a 30 fps; si compara contra 21 ms bajará la resolución al mínimo sin motivo → debe comparar contra el presupuesto del tope (Task 3, verificación con `?perf=lite` en Task 6).

---

### Task 1: Store de nivel, gobernador y tope de cuadros (lógica pura)

**Files:**
- Create: `src/lib/perfTier.js`
- Create: `src/lib/perfTier.test.js`
- Modify: `package.json` (script `test`)

**Interfaces:**
- Produces (todo exportado desde `src/lib/perfTier.js`):
  - `createGovernor({ windowSize = 60, slowMs = 24 } = {}) -> { sample(dtMs: number): boolean }` — `sample` devuelve `true` cuando la media de la ventana completa supera `slowMs` (≈ menos de 42 fps); entonces vacía la ventana. Ignora `dtMs <= 0` y `dtMs > 250`.
  - `createFrameCap(fps: number) -> { ready(now: number): boolean, setFps(fps: number): void }`
  - `isSoftwareRenderer(name: string): boolean` — `true` si `name` coincide con `/swiftshader|llvmpipe|softpipe|software|microsoft basic render/i`.
  - `parsePerfParam(search: string): 0 | 1 | 2 | null` — `?perf=full|lite|min` → `0|1|2`; otro valor o ausente → `null`.
  - `getPerfTier(): 0 | 1 | 2`
  - `raisePerfTier(tier: 0 | 1 | 2): void` — solo sube (máx. 2); si hay `document`, fija `document.documentElement.dataset.perf` en `'lite'` (1) o `'min'` (2); avisa a los suscriptores.
  - `onPerfTier(fn: (tier) => void): () => void` — devuelve la función para desuscribirse.

- [ ] **Step 1: Escribir los tests que fallan** en `src/lib/perfTier.test.js` (`import { test } from 'node:test'; import assert from 'node:assert/strict';`):

```js
test('sube cuando la media supera 24 ms', () => {
  const g = createGovernor();
  let raised = false;
  for (let i = 0; i < 60; i++) raised = g.sample(30) || raised;
  assert.equal(raised, true);
});
test('no sube con cuadros sanos a 60 Hz', () => {
  const g = createGovernor();
  for (let i = 0; i < 600; i++) assert.equal(g.sample(16.7), false);
});
test('ignora intervalos mayores a 250 ms', () => {
  const g = createGovernor();
  for (let i = 0; i < 120; i++) assert.equal(g.sample(1000), false);
});
test('un pico aislado no sube el nivel', () => {
  const g = createGovernor();
  for (let i = 0; i < 59; i++) g.sample(16.7);
  assert.equal(g.sample(200), false);
});
test('a 60 Hz con tope 60 dibuja todos los cuadros', () => {
  const c = createFrameCap(60); let n = 0;
  for (let i = 1; i <= 60; i++) if (c.ready(i * 16.667)) n++;
  assert.ok(n >= 59);
});
test('a 120 Hz con tope 60 entrega 60 por segundo', () => {
  const c = createFrameCap(60); let n = 0;
  for (let i = 1; i <= 120; i++) if (c.ready(i * 8.333)) n++;
  assert.ok(n >= 58 && n <= 61);
});
test('a 144 Hz entrega entre 55 y 60 cuadros por segundo', () => {
  const c = createFrameCap(60); let n = 0;
  for (let i = 1; i <= 144; i++) if (c.ready(i * 6.944)) n++;
  assert.ok(n >= 55 && n <= 61);
});
test('setFps(30) a 60 Hz entrega 30 por segundo', () => {
  const c = createFrameCap(60); c.setFps(30); let n = 0;
  for (let i = 1; i <= 60; i++) if (c.ready(i * 16.667)) n++;
  assert.ok(n >= 29 && n <= 31);
});
test('detecta WebGL por software', () => {
  assert.equal(isSoftwareRenderer('ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero)))'), true);
  assert.equal(isSoftwareRenderer('ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11)'), false);
});
test('parsePerfParam', () => {
  assert.equal(parsePerfParam('?perf=lite'), 1);
  assert.equal(parsePerfParam('?perf=min'), 2);
  assert.equal(parsePerfParam('?perf=full'), 0);
  assert.equal(parsePerfParam('?x=1'), null);
});
test('raisePerfTier nunca baja y avisa', () => {
  const seen = [];
  const off = onPerfTier((t) => seen.push(t));
  raisePerfTier(1); raisePerfTier(0); raisePerfTier(2); raisePerfTier(5);
  off();
  assert.equal(getPerfTier(), 2);
  assert.deepEqual(seen, [1, 2]);
});
```

- [ ] **Step 2: Añadir `"test": "node --test src/lib/"` a `package.json` y correr `npm test`.** Esperado: FAIL (no existe `perfTier.js`).

- [ ] **Step 3: Implementar `src/lib/perfTier.js`.** Sin acceso a `window`/`document` al importar (los tests corren en Node); `raisePerfTier` comprueba `typeof document !== 'undefined'`. Algoritmo de `createFrameCap.ready(now)` (no lo determinan los tests por sí solos):

```js
const budget = 1000 / fps;
const elapsed = now - last;
if (elapsed < budget - 1) return false;
last = elapsed > budget * 4 ? now : now - (elapsed % budget);
return true;
```
(`last` arranca en `-Infinity`; el primer `ready` devuelve `true` y fija `last = now`.)

- [ ] **Step 4: `npm test`.** Esperado: los 11 tests en PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/perfTier.js src/lib/perfTier.test.js package.json
git commit -m "feat: nivel de rendimiento adaptativo y tope de cuadros (lógica pura con tests)"
```

---

### Task 2: Alimentar el nivel (ticker, WebGL por software, parámetro `?perf=`)

**Files:**
- Modify: `src/main.jsx` (leer `?perf=` antes de montar)
- Modify: `src/hooks/useImmersiveScroll.js:42-47` (muestrear en el `tick` del ticker de GSAP)
- Modify: `src/lib/heroGL.js` (exponer el nombre del renderizador)
- Modify: `src/hooks/useHeroBackground.js` (subir a nivel 2 si es WebGL por software)

**Interfaces:**
- Consumes: `createGovernor`, `raisePerfTier`, `getPerfTier`, `parsePerfParam`, `isSoftwareRenderer` (Task 1).
- Produces: el objeto que devuelve `createHeroGL` gana `rendererName(): string` (vía la extensión `WEBGL_debug_renderer_info` si existe; si no, `gl.getParameter(gl.RENDERER)`; `''` si falla).

- [ ] **Step 1: `src/main.jsx`:** antes de `createRoot`, `const p = parsePerfParam(location.search); if (p) raisePerfTier(p);` (`?perf=full` = 0 no cambia nada; sirve para comparar).
- [ ] **Step 2: `useImmersiveScroll`:** crear `const gov = createGovernor();` dentro de la rama con movimiento; el `tick` pasa a `(t, dt) => { lenis.raf(t * 1000); if (gov.sample(dt)) raisePerfTier(getPerfTier() + 1); }`. Firma del ticker de GSAP: `(time /* s */, deltaTime /* ms */, frame)`.
- [ ] **Step 3: `heroGL.rendererName()` y en `useHeroBackground`,** justo después de crear `gl`, `if (isSoftwareRenderer(gl.rendererName())) raisePerfTier(2);`.
- [ ] **Step 4: Verificar.** `npm test` PASS y `npm run build` sin errores. Con `npm run dev`, abrir `/?perf=lite` y comprobar en la consola `document.documentElement.dataset.perf === 'lite'`.
- [ ] **Step 5: Commit** — `feat: el nivel de rendimiento sube solo si la página no llega a ~42 fps o no hay GPU`

---

### Task 3: Bucle del hero — tope de cuadros, escalones y titular sin layout por cuadro

**Files:**
- Modify: `src/hooks/useHeroBackground.js`

**Interfaces:**
- Consumes: `createFrameCap`, `getPerfTier`, `onPerfTier` (Task 1).

Valores fijados:

| Nivel | fps del fondo | escala interna máx. |
|---|---|---|
| 0 | 60 | `min(devicePixelRatio, 1.5)` (como hoy) |
| 1 | 30 | 0.6 |
| 2 | 30 | 0.45 |

- [ ] **Step 1:** `const cap = createFrameCap(getPerfTier() ? 30 : 60);`. En `frame(now)`, si `!cap.ready(now)` reprogramar `requestAnimationFrame` y salir **antes** de tocar `t`, `flow` o `drive`. `dt` se mide entre cuadros dibujados (`last` solo se actualiza al dibujar) y el tope de 0,05 s sigue, así que el movimiento mantiene su velocidad real.
- [ ] **Step 2:** al suscribirse con `onPerfTier`, aplicar la tabla: `cap.setFps(30)`, `scale = Math.min(scale, máx)` y `gl.resize(...)`. Al montar con nivel > 0, aplicar lo mismo. Desuscribirse en el cleanup.
- [ ] **Step 3:** el ajuste interno de resolución existente (cada 90 cuadros) compara `acc / 90` contra `budget * 1.25` (`budget = 1/60` o `1/30` s según el nivel), no contra 0,021 fijo, y su piso pasa a ser el máximo del nivel actual o 0,45, el menor de los dos.
- [ ] **Step 4:** `textBox`: buscar `.ap-overlay` y `.ap-overlay__inner` una sola vez al montar (no en cada cuadro) y salir antes de `getBoundingClientRect` si el titular está vacío.
- [ ] **Step 5: Verificar.** `npm run build` OK. En `npm run dev`, con un medidor de rAF en la consola (Task 6, snippet A), el hero dibuja a ~60 en una pantalla de 120 Hz; con `/?perf=lite` dibuja a ~30 y la escala se queda en 0,6 (no baja a 0,45 sola).
- [ ] **Step 6: Commit** — `perf: fondo del hero con tope de 60 fps y escalones de calidad`

---

### Task 4: Oficina 3D — tope de cuadros y escalones

**Files:**
- Modify: `src/lib/officeEngine.js` (`mountOffice`)

**Interfaces:**
- Consumes: `createFrameCap`, `getPerfTier`, `onPerfTier` (Task 1).

| Nivel | fps | pixelRatio | sombra (`sun.shadow.mapSize`) |
|---|---|---|---|
| 0 | 60 | `min(dpr, 1.5)` (como hoy) | 2048 |
| 1 | 60 | 1 | 1024 |
| 2 | 30 | 1 | 1024 |

- [ ] **Step 1:** en `frame`, reprogramar y salir si `!cap.ready(performance.now())`, antes de interpolar la cámara (la interpolación usa factores fijos por cuadro; a 30 fps se mueve igual de fluida, solo un poco más lenta, lo que está aceptado).
- [ ] **Step 2:** función `applyTier(tier)` según la tabla. Para cambiar la sombra: `sun.shadow.mapSize.set(1024, 1024)`, y si `sun.shadow.map` existe, `sun.shadow.map.dispose(); sun.shadow.map = null;` (three r128 la recrea). Llamarla al montar y vía `onPerfTier`; desuscribirse en `dispose()`.
- [ ] **Step 3: Verificar.** `npm run build` OK. En dev, ir a `#oficina` con `/?perf=lite`: la escena se ve, gira y abre agentes sin errores en la consola.
- [ ] **Step 4: Commit** — `perf: oficina 3D con tope de 60 fps y sombras más livianas en modo liviano`

---

### Task 5: CSS del nivel mínimo y cinta pausada fuera de pantalla

**Files:**
- Create: `src/hooks/useInView.js`
- Modify: `src/components/molecules/TechMarqueeRow/TechMarqueeRow.jsx`
- Modify: `src/styles/layout.css` (cinta)
- Modify: `src/styles/hero-inmersivo.css` (grano y pills con `data-perf`)
- Modify: `src/styles/movil.css` (barra móvil con `data-perf`)
- Modify: `design-system/INTEGRACION.md` (sección corta "Modo liviano")

**Interfaces:**
- Produces: `useInView(ref, { rootMargin = '200px 0px' } = {}) -> boolean` (`true` hasta que el IntersectionObserver diga lo contrario; sin IntersectionObserver queda en `true`).

- [ ] **Step 1:** `TechMarqueeRow` usa `useInView` sobre `.hab-mq__row` y le agrega la clase `is-paused` cuando no está a la vista. CSS: `.hab-mq__row.is-paused .hab-mq__track{animation-play-state:paused}`.
- [ ] **Step 2:** reglas del nivel mínimo (todo con tokens existentes):
  - `html[data-perf="min"] .ap-grain{display:none}`
  - `html[data-perf="min"] .ap-navwrap .ap-nav--dark .ap-pill{-webkit-backdrop-filter:none;backdrop-filter:none;background:var(--surface-raised)}`
  - `html[data-perf="min"] .ap-mnav[data-tone="light"]{-webkit-backdrop-filter:none;backdrop-filter:none;background:var(--surface-canvas)}`
- [ ] **Step 3:** en `INTEGRACION.md`, documentar los niveles (`data-perf`, qué baja en cada uno, `?perf=full|lite|min` para revisarlos) como excepción aprobada del hero (2026-11-02).
- [ ] **Step 4: Verificar.** `npm run build` OK. En dev con `/?perf=min`: sin grano sobre el hero, pills sólidas, barra móvil (ventana < 600 px) sólida. Al bajar más allá de Superpoderes, `getAnimations()` de las pistas reporta `playState === 'paused'`.
- [ ] **Step 5: Commit** — `perf: cinta pausada fuera de pantalla y nivel mínimo sin grano ni desenfoque`

---

### Task 6: Verificación en el navegador

**Files:** ninguno (si algo falla, se corrige en la task dueña y se commitea ahí).

Snippet A (medidor, pegar en la consola o vía `javascript_tool`): registrar los intervalos de `requestAnimationFrame` durante 5 s y reportar la mediana, el p95 y el conteo de cuadros sobre 33 ms.

Snippet B (simular un equipo lento): un `requestAnimationFrame` que ocupe el hilo 22 ms por cuadro (`while (performance.now() - s < 22) {}`).

- [ ] **Step 1:** `npm run build && npm run preview`. En Chrome con snippet A, scroll del hero a Proyectos: mediana ≈ 16,7 ms o menos, p95 < 20 ms, sin errores en la consola.
- [ ] **Step 2:** en una recarga, activar snippet B desde el inicio: en ≤ 3 s, `data-perf` pasa a `lite` y luego a `min`, y el scroll sigue respondiendo. Anotar el p95 con y sin el cambio para comparar (`/?perf=full` + snippet B = antes; sin parámetro + snippet B = después).
- [ ] **Step 3:** `/?perf=lite` y `/?perf=min` en un viewport móvil (390 × 844): las tres secciones, el hero y la oficina se ven y funcionan.
- [ ] **Step 4:** pedirle al usuario que pruebe en Opera GX (con GX Control activo) contra el build de preview y confirme que va fluido.
- [ ] **Step 5:** `git push` solo si el usuario lo pide.

Nota para compartir por túnel: usar `npm run build && npm run preview` en vez de `npm run dev` (el modo de desarrollo manda ~100 archivos sueltos y hace lenta la primera carga).
