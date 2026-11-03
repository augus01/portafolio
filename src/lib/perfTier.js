// Nivel de rendimiento de la página: 0 completo, 1 liviano, 2 mínimo. Solo sube (nunca baja) para no parpadear.
// Se refleja en <html data-perf="lite|min"> para el CSS y en suscripciones para los bucles WebGL.
// Sin acceso a window/document al importar: la lógica pura se prueba con `node --test`.

const MAX_TIER = 2;
const NAMES = { full: 0, lite: 1, min: 2 };
let tier = 0;
let locked = false;
const listeners = new Set();

/** Media móvil de intervalos entre cuadros; `sample` devuelve true cuando la página no llega a ~42 fps. */
export function createGovernor({ windowSize = 60, slowMs = 24 } = {}) {
  let sum = 0, n = 0;
  return {
    sample(dtMs) {
      // Pestaña oculta, capturas o cambio de pestaña: no dicen nada de la fluidez.
      if (!(dtMs > 0) || dtMs > 250) return false;
      // Cada muestra pesa como máximo 50 ms: varios tirones de carga (three.js, fuentes) no bajan de nivel a un
      // equipo sano, y una lentitud sostenida (33 ms o más por cuadro) igual se detecta.
      sum += Math.min(dtMs, 50); n += 1;
      if (n < windowSize) return false;
      const slow = sum / n > slowMs;
      sum = 0; n = 0;
      return slow;
    },
  };
}

/** Tope de cuadros por segundo con arrastre del resto, para no caer a ~48 fps en pantallas de 144 Hz. */
export function createFrameCap(fps) {
  let budget = 1000 / fps;
  let last = -Infinity;
  return {
    ready(now) {
      const elapsed = now - last;
      if (elapsed < budget - 1) return false;
      // El resto solo se arrastra si se pasó del presupuesto: con la tolerancia de 1 ms, `elapsed` puede quedar
      // apenas bajo `budget` y su módulo sería casi un cuadro entero (dibujaría todos los cuadros a 120 Hz).
      last = elapsed > budget * 4 || elapsed < budget ? now : now - (elapsed % budget);
      return true;
    },
    setFps(next) { budget = 1000 / next; },
  };
}

export function isSoftwareRenderer(name) {
  return /swiftshader|llvmpipe|softpipe|software|microsoft basic render/i.test(name || '');
}

/** `?perf=full|lite|min` fuerza un nivel para revisarlo a mano. */
export function parsePerfParam(search) {
  const v = new URLSearchParams(search || '').get('perf');
  return v in NAMES ? NAMES[v] : null;
}

export function getPerfTier() { return tier; }

function publish() {
  if (typeof document !== 'undefined') {
    if (tier) document.documentElement.dataset.perf = tier === 1 ? 'lite' : 'min';
    else delete document.documentElement.dataset.perf;
  }
  listeners.forEach((fn) => fn(tier));
}

export function raisePerfTier(next) {
  const t = Math.min(MAX_TIER, next);
  if (locked || !(t > tier)) return;
  tier = t;
  publish();
}

/** Fija el nivel y desactiva las subidas automáticas (para `?perf=`, que debe mostrar ese nivel y no otro). */
export function forcePerfTier(next) {
  tier = Math.max(0, Math.min(MAX_TIER, next));
  locked = true;
  publish();
}

export function onPerfTier(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
