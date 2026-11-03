import { useCallback, useEffect, useRef, useState } from 'react';
import { loadOfficeScene } from '../lib/officeThemes';

// Tiempos de la cortina de cuadrados (ms), del artefacto "Oficina · cambio de serie". Con movimiento reducido
// los cuadrados aparecen y se van de una vez y el panel de carga queda un poco más en pantalla.
const TIMING = {
  full: { sweep: 520, row: 45, jitter: 60, cell: 220, hold: 480, panelFade: 160, settle: 260 },
  reduced: { sweep: 0, row: 0, jitter: 0, cell: 0, hold: 700, panelFade: 0, settle: 200 },
};
const SQUARE = 72;

/** Retardos de entrada (`cin`) y salida (`cout`) de cada cuadrado, en ms, y cuánto tarda el más lento de cada fase. */
function buildCells(W, H, T) {
  const cols = Math.max(4, Math.ceil(W / SQUARE)), rows = Math.max(3, Math.ceil(H / SQUARE));
  const mid = (rows - 1) / 2, maxD = Math.ceil(mid);
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const cells = [];
  let maxIn = 0, maxOut = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const sweep = (cols > 1 ? c / (cols - 1) : 0) * T.sweep;
      const d = Math.abs(r - mid);
      const cin = Math.round(sweep + d * T.row + rnd() * T.jitter);
      const cout = Math.round(sweep + (maxD - d) * T.row + rnd() * T.jitter);
      maxIn = Math.max(maxIn, cin); maxOut = Math.max(maxOut, cout);
      cells.push({ cin, cout, delay: cin });
    }
  }
  return { cells, cols, rows, maxIn, maxOut };
}

/**
 * Cambio de serie de la oficina. `go(id)` tapa el escenario con una cortina de cuadrados: la barra nace en la fila
 * del centro, avanza de izquierda a derecha y engorda hacia arriba y abajo. Con la vista tapada cambia `theme`
 * (useOffice monta la oficina nueva) y, cuando la escena ya bajó, los cuadrados se retiran en el orden inverso.
 * `overlayRef` va en la capa de cuadrados (mide el escenario). `phase`: idle → prep → cover → reveal → idle.
 */
export function useOfficeSwap(initial = 'original') {
  const [s, setS] = useState({ theme: initial, target: null, phase: 'idle', cells: [], cols: 1, rows: 1, progress: 0 });
  const overlayRef = useRef(null);
  const timers = useRef([]);
  // Serie actual y candado, fuera del estado: un doble clic antes del próximo render no arranca otro cambio.
  const lock = useRef({ busy: false, theme: initial });

  useEffect(() => () => { timers.current.forEach((t) => { clearTimeout(t); clearInterval(t); }); }, []);

  const go = useCallback((id) => {
    if (lock.current.busy || id === lock.current.theme) return;
    lock.current = { busy: true, theme: id };
    const later = (fn, ms) => { timers.current.push(setTimeout(fn, ms)); };
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const T = reduced ? TIMING.reduced : TIMING.full;
    const el = overlayRef.current;
    const { cells, cols, rows, maxIn, maxOut } = buildCells((el && el.clientWidth) || 1136, (el && el.clientHeight) || 760, T);
    const coverEnd = maxIn + T.cell;
    const total = coverEnd + T.hold;
    // La escena empieza a bajar ya, mientras los cuadrados tapan la vista.
    const scene = loadOfficeScene(id).catch(() => null);

    setS((x) => ({ ...x, phase: 'prep', target: id, cells, cols, rows, progress: 0 }));
    // Dos cuadros de espera: los cuadrados se pintan en escala 0 antes de crecer, así la transición sí corre.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const t0 = performance.now();
      setS((x) => ({ ...x, phase: 'cover' }));
      const tick = setInterval(() => setS((x) => ({ ...x, progress: Math.min(0.99, (performance.now() - t0) / total) })), 50);
      timers.current.push(tick);
      // Pantalla tapada: se cambia la oficina por detrás.
      later(() => setS((x) => ({ ...x, theme: id })), coverEnd + 30);
      // Carga completa: los cuadrados se retiran y aparece la oficina nueva.
      later(() => scene.then(() => {
        clearInterval(tick);
        setS((x) => ({ ...x, progress: 1 }));
        later(() => setS((x) => ({ ...x, phase: 'reveal', cells: x.cells.map((c) => ({ ...c, delay: c.cout + T.panelFade })) })), T.settle);
        later(() => {
          lock.current = { busy: false, theme: id };
          setS((x) => ({ ...x, phase: 'idle', target: null }));
        }, T.settle + T.panelFade + maxOut + T.cell + 60);
      }), total);
    }));
  }, []);

  return { ...s, busy: s.phase !== 'idle', go, overlayRef };
}
