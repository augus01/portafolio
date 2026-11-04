import { useEffect } from 'react';

/**
 * Parallax suave de la portada de un proyecto: cada elemento con `data-par` se desplaza en vertical según qué tan
 * lejos está su contenedor del centro de la ventana (factor `data-par`, tope ±48px). Solo `translate`, en un rAF por
 * scroll; nada con `prefers-reduced-motion`.
 */
export function useCaseParallax(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const els = Array.from(root.querySelectorAll('[data-par]'));
    if (!els.length) return undefined;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const vh = window.innerHeight || 800;
      els.forEach((el) => {
        const r = el.parentElement.getBoundingClientRect();
        const k = parseFloat(el.dataset.par) || 0;
        const d = Math.max(-48, Math.min(48, (r.top + r.height / 2 - vh / 2) * k));
        el.style.translate = `0 ${d.toFixed(1)}px`;
      });
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    tick();
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [rootRef]);
}
