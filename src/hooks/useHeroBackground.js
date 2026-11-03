import { useEffect, useState } from 'react';
import { createHeroGL } from '../lib/heroGL';
import { isSoftwareRenderer, raisePerfTier } from '../lib/perfTier';

const PALETTE = ['shadow', 'teal', 'cyan', 'cyan-light', 'lime', 'ocre', 'rose'];

// Máscara elíptica detrás del titular opcional: el shader oscurece solo ahí, según lo visible que esté el texto.
function textBox(stage, canvas) {
  const o = stage.querySelector('.ap-overlay');
  const i = stage.querySelector('.ap-overlay__inner');
  if (!o || !i) return null;
  // Sin titular ni párrafo no hay nada que proteger: sin máscara (evita una franja oscura vacía).
  if (!i.textContent.trim()) return null;
  const op = (o.style.opacity === '' ? 1 : parseFloat(o.style.opacity)) * (i.style.opacity === '' ? 1 : parseFloat(i.style.opacity));
  if (!(op > 0.001)) return null;
  const cr = canvas.getBoundingClientRect();
  const r = i.getBoundingClientRect();
  if (!cr.width || !cr.height) return null;
  return [
    (r.left + r.width / 2 - cr.left) / cr.width,
    1 - (r.top + r.height / 2 - cr.top) / cr.height,
    Math.max(0.05, (r.width / 2) * 1.35 / cr.width),
    Math.max(0.05, (r.height / 2) * 1.9 / cr.height),
    op,
  ];
}

/**
 * Enciende el fondo WebGL sobre `canvasRef`, leyendo la paleta `--hero-*` de `stageRef`.
 * `motionRef.current.tl` (timeline del pin) marca las fases: hero, túnel y salida.
 * Devuelve `true` si hay WebGL, `false` si se usa el fallback CSS y `null` mientras arranca.
 */
export function useHeroBackground(canvasRef, stageRef, motionRef) {
  const [isGL, setIsGL] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return undefined;

    const cs = getComputedStyle(stage);
    const pal = [];
    PALETTE.forEach((n) => {
      const h = (cs.getPropertyValue('--hero-' + n).trim() || '#000000').replace('#', '');
      pal.push(parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255);
    });
    let gl = null;
    try { gl = createHeroGL(canvas, pal); } catch { gl = null; }
    if (!gl) { setIsGL(false); return undefined; }
    setIsGL(true);
    // WebGL sin GPU real (SwiftShader, llvmpipe…): directo al nivel mínimo.
    if (isSoftwareRenderer(gl.rendererName())) raisePerfTier(2);

    let scale = Math.min(window.devicePixelRatio || 1, 1.5);
    const isStatic = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const drawStatic = () => gl.render(6.0, 0.9, 0, 0, 0);
    const size = () => {
      gl.resize(canvas.clientWidth, canvas.clientHeight, scale);
      if (isStatic) drawStatic();
    };
    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    size();

    let t = 0, flow = 0, drive = 0, acc = 0, n = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    let loop = 0, last = 0, visible = true;
    let io = null, onVis = null, onMove = null;

    const frame = (now) => {
      loop = 0;
      if (!visible || document.hidden) return;
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      t += dt;
      // Fases del pin: 0–0,25 hero; 0,05–0,7 túnel (solo rayos más rápidos y más zoom); 0,7–1 salida a la página.
      // El fondo sigue al timeline, no al scroll crudo.
      const m = motionRef.current;
      const pr = m.tl ? m.tl.progress() : m.progress;
      const heroP = Math.min(1, pr / 0.25);
      const tun = Math.max(0, Math.min(1, (pr - 0.05) / 0.65));
      const exit = Math.max(0, Math.min(1, (pr - 0.7) / 0.3));
      flow += dt * 0.28 * (1 + 1.4 * heroP + 1.6 * tun);
      drive = (drive + dt * (0.6 + 7.0 * tun)) % 1000;
      if (flow > 100) flow -= 100;
      // Si el equipo no llega a ~50fps, baja la resolución interna (el fondo es difuso: no se nota).
      acc += dt; n += 1;
      if (n === 90) {
        if (acc / 90 > 0.021 && scale > 0.6) { scale = Math.max(0.6, scale * 0.8); gl.resize(canvas.clientWidth, canvas.clientHeight, scale); }
        acc = 0; n = 0;
      }
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      gl.render(t, flow, cx, -cy, heroP, textBox(stage, canvas), [tun, exit, drive]);
      loop = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (loop || !visible || document.hidden) return;
      last = performance.now();
      loop = requestAnimationFrame(frame);
    };

    if (isStatic) {
      drawStatic();
    } else {
      io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; kick(); }, { threshold: 0 });
      io.observe(canvas);
      onVis = () => kick();
      document.addEventListener('visibilitychange', onVis);
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        onMove = (e) => { tx = (e.clientX / window.innerWidth) * 2 - 1; ty = (e.clientY / window.innerHeight) * 2 - 1; };
        window.addEventListener('pointermove', onMove, { passive: true });
      }
      kick();
    }

    return () => {
      if (loop) cancelAnimationFrame(loop);
      ro.disconnect();
      if (io) io.disconnect();
      if (onVis) document.removeEventListener('visibilitychange', onVis);
      if (onMove) window.removeEventListener('pointermove', onMove);
      gl.destroy();
    };
  }, [canvasRef, stageRef, motionRef]);

  return isGL;
}
