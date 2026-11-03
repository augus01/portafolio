import { useCallback, useEffect, useRef, useState } from 'react';

const SEGMENTS = 16;
const SQUARE = 72;

/**
 * Cambio de oficina con cuadrados: una barra nace en la fila del centro del recuadro `stageRef`, avanza de izquierda
 * a derecha y engorda hasta taparlo; detrás se cambia la oficina (`current`) y los cuadrados se retiran.
 * Mientras tanto un panel muestra el avance en 16 segmentos. Con `prefers-reduced-motion` no hay barrido.
 */
export function useThemeSwap(stageRef, initial) {
  const [s, setS] = useState({ current: initial, target: null, phase: 'idle', cells: [], cols: 1, rows: 1, progress: 0 });
  const timers = useRef([]);
  const tick = useRef(0);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => () => { timers.current.forEach(clearTimeout); clearInterval(tick.current); }, []);

  const go = useCallback((id) => {
    if (s.phase !== 'idle' || id === s.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const stage = stageRef.current;
    const W = stage?.clientWidth || 1136, H = stage?.clientHeight || 760;
    const cols = Math.max(4, Math.ceil(W / SQUARE)), rows = Math.max(3, Math.ceil(H / SQUARE));
    const mid = (rows - 1) / 2, maxD = Math.ceil(mid);
    const SWEEP = reduced ? 0 : 520, ROW = reduced ? 0 : 45, JIT = reduced ? 0 : 60, CELL = reduced ? 0 : 220;
    let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const cells = [];
    let maxIn = 0, maxOut = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const sweep = (cols > 1 ? c / (cols - 1) : 0) * SWEEP;
        const d = Math.abs(r - mid);
        const cin = Math.round(sweep + d * ROW + rnd() * JIT);
        const cout = Math.round(sweep + (maxD - d) * ROW + rnd() * JIT);
        maxIn = Math.max(maxIn, cin); maxOut = Math.max(maxOut, cout);
        cells.push({ cin, cout, delay: cin });
      }
    }
    const coverEnd = maxIn + CELL;
    const hold = reduced ? 700 : 480;
    const panelFade = reduced ? 0 : 160;
    const total = coverEnd + hold;
    const settle = reduced ? 200 : 260;
    setS((st) => ({ ...st, phase: 'prep', target: id, cells, cols, rows, progress: 0 }));
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const t0 = performance.now();
      setS((st) => ({ ...st, phase: 'cover' }));
      tick.current = setInterval(() => setS((st) => ({ ...st, progress: Math.min(0.99, (performance.now() - t0) / total) })), 50);
      // Recuadro tapado: se cambia la oficina por detrás.
      later(() => setS((st) => ({ ...st, current: id })), coverEnd + 30);
      // Carga completa: los cuadrados se retiran y aparece la oficina nueva.
      later(() => {
        clearInterval(tick.current);
        setS((st) => ({ ...st, progress: 1 }));
        later(() => setS((st) => ({ ...st, phase: 'reveal', cells: cells.map((x) => ({ ...x, delay: x.cout + panelFade })) })), settle);
        later(() => setS((st) => ({ ...st, phase: 'idle', target: null, cells: [] })), settle + panelFade + maxOut + CELL + 60);
      }, total);
    }));
  }, [s.phase, s.current, stageRef]);

  const filled = Math.round(s.progress * SEGMENTS);
  return {
    current: s.current,
    target: s.target,
    busy: s.phase !== 'idle',
    phase: s.phase,
    cells: s.cells,
    cols: s.cols,
    rows: s.rows,
    percent: Math.round(s.progress * 100),
    segments: Array.from({ length: SEGMENTS }, (_, i) => i < filled),
    go,
  };
}
