import { useEffect, useRef } from 'react';
import { clampOffset, isDrag, wrapOffset } from '../lib/techMarquee';

const MOBILE = '(max-width: 599px)';

/**
 * Cinta de Superpoderes en móvil: la mueve JavaScript en vez de la animación CSS y se puede arrastrar con el dedo
 * (con inercia al soltar). Avanza sola mientras `running` (fila a la vista y sin ficha abierta) y retoma un momento
 * después de soltarla. Sin movimiento no avanza sola ni da la vuelta: queda una fila que se desliza de borde a borde.
 * Un toque sigue abriendo la ficha; un arrastre no. Fuera de móvil no hace nada (queda la animación CSS).
 */
export function useMarqueeDrag(rowRef, running) {
  const runRef = useRef(running);
  runRef.current = running;
  const kickRef = useRef(null);

  useEffect(() => { kickRef.current?.(); }, [running]);

  useEffect(() => {
    const row = rowRef.current;
    if (!row || !window.matchMedia) return undefined;
    const mq = window.matchMedia(MOBILE);
    let stop = null;
    const sync = () => {
      if (stop) { stop(); stop = null; }
      if (mq.matches) stop = start(row, runRef, kickRef);
    };
    sync();
    mq.addEventListener('change', sync);
    return () => { mq.removeEventListener('change', sync); if (stop) stop(); kickRef.current = null; };
  }, [rowRef]);
}

function start(row, runRef, kickRef) {
  const track = row.querySelector('.hab-mq__track');
  if (!track) return null;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const css = getComputedStyle(row);
  const seconds = parseFloat(css.getPropertyValue(track.classList.contains('hab-mq__track--b') ? '--hab-speed-b' : '--hab-speed-a')) || 80;

  let half = 0, trackW = 0, rowW = 0, speed = 0;
  const measure = () => {
    trackW = track.scrollWidth; rowW = row.clientWidth;
    half = trackW / 2; speed = half / seconds;
  };
  measure();

  let x = 0, v = 0, raf = 0, last = 0, resumeAt = 0;
  const norm = (n) => (reduced ? clampOffset(n, trackW, rowW) : wrapOffset(n, half));
  const apply = () => { track.style.transform = `translate3d(${x}px,0,0)`; };

  /* Arrastre */
  let id = null, sx = 0, sy = 0, x0 = 0, dragging = false, px = 0, pt = 0, swallow = 0;
  const onDown = (e) => {
    if (id !== null || (e.pointerType === 'mouse' && e.button !== 0)) return;
    id = e.pointerId; sx = e.clientX; sy = e.clientY; x0 = x; dragging = false; v = 0;
  };
  const onMove = (e) => {
    if (e.pointerId !== id) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (!dragging) {
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { id = null; return; }
      if (!isDrag(dx, dy)) return;
      dragging = true;
      row.setAttribute('data-lenis-prevent-touch', '');
      try { row.setPointerCapture(id); } catch { /* sin captura */ }
      px = x; pt = e.timeStamp;
    }
    x = norm(x0 + dx);
    const dt = (e.timeStamp - pt) / 1000;
    if (dt > 0.008) { v = Math.max(-3000, Math.min(3000, (x0 + dx - px) / dt)); px = x0 + dx; pt = e.timeStamp; }
    apply();
  };
  const onUp = (e) => {
    if (e.pointerId !== id) return;
    id = null;
    if (!dragging) return;
    dragging = false;
    row.removeAttribute('data-lenis-prevent-touch');
    if (e.timeStamp - pt > 120) v = 0;
    swallow = performance.now() + 400;
    resumeAt = performance.now() + 1200;
    kick();
  };
  // El clic que sigue a un arrastre no abre la ficha.
  const onClick = (e) => { if (performance.now() < swallow) { e.preventDefault(); e.stopPropagation(); swallow = 0; } };

  const frame = (t) => {
    raf = 0;
    const dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
    last = t;
    if (!dragging) {
      if (Math.abs(v) > 8) { x = norm(x + v * dt); v *= Math.exp(-dt * 3.2); }
      else {
        v = 0;
        if (!reduced && runRef.current && t >= resumeAt) x = norm(x - speed * dt);
      }
      apply();
    }
    const moving = dragging || v !== 0 || (!reduced && runRef.current);
    if (moving) raf = requestAnimationFrame(frame);
    else last = 0;
  };
  const kick = () => { if (!raf) { last = 0; raf = requestAnimationFrame(frame); } };
  kickRef.current = kick;

  const ro = new ResizeObserver(() => { measure(); x = norm(x); apply(); });
  ro.observe(track); ro.observe(row);
  row.addEventListener('pointerdown', onDown);
  row.addEventListener('pointermove', onMove);
  row.addEventListener('pointerup', onUp);
  row.addEventListener('pointercancel', onUp);
  row.addEventListener('click', onClick, true);
  row.dataset.drag = '';
  apply();
  kick();

  return () => {
    if (raf) cancelAnimationFrame(raf);
    ro.disconnect();
    row.removeEventListener('pointerdown', onDown);
    row.removeEventListener('pointermove', onMove);
    row.removeEventListener('pointerup', onUp);
    row.removeEventListener('pointercancel', onUp);
    row.removeEventListener('click', onClick, true);
    row.removeAttribute('data-lenis-prevent-touch');
    delete row.dataset.drag;
    track.style.transform = '';
  };
}
