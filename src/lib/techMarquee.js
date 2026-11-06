// Puestos de la cinta de Superpoderes con stack leyendo (artefacto "Hero · Augusto Pinto", 6 nov 2026).
// Un período = N logos + el puesto de stack; la pista lleva el período dos veces (la segunda copia oculta) y avanza la
// mitad de su ancho. N depende del ancho de la pantalla: así un stack ocupa un poco más de media vuelta y el de la otra
// fila, a media vuelta de distancia, toma el relevo. Las dos filas miden lo mismo y van a la misma velocidad.
// Los anchos deben coincidir con --hab-item-width y --hab-rd-width (src/styles/layout.css y agentes.css).
export const MQ_ITEM = 208;
export const MQ_READER = 320;

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

/** Logos por período según el ancho de la pantalla (entre 10 y 26). */
export function marqueeCount(vw) {
  return clamp(Math.round((2 * (vw + MQ_READER) - MQ_READER) / MQ_ITEM) - 2, 10, 26);
}

/**
 * Un período de la fila `row` (0 o 1): `{ item, copy }` por logo (`copy` = repetido, oculto a lectores y fuera de Tab)
 * y `{ reader: true }` para stack. En la fila 0 stack va justo antes del logo `before`; en la 1, a media vuelta.
 */
export function marqueePeriod(items, row, vw, before) {
  const n = marqueeCount(vw);
  const slots = [];
  for (let i = 0; i < n; i++) slots.push({ item: items[i % items.length], copy: i >= items.length });
  let at;
  if (row === 0) {
    const k = items.findIndex((s) => s.logo === before);
    at = k < 0 ? Math.min(3, n) : k;
  } else {
    const period = n * MQ_ITEM + MQ_READER;
    at = clamp(Math.round((3 * MQ_ITEM + period / 2) / MQ_ITEM), 1, n);
  }
  slots.splice(at, 0, { reader: true });
  return slots;
}

/** Aviso de la cinta a los stack montados: `emit(texto)` los hace saltar de emoción; `on(fn)` devuelve cómo soltarse. */
export function createCheer() {
  const subs = new Set();
  return {
    on(fn) { subs.add(fn); return () => subs.delete(fn); },
    emit(text) { subs.forEach((fn) => fn(text)); },
  };
}
