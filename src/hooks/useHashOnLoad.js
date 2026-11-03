import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Si la página se abre con un ancla (p. ej. /#contacto al volver de la oficina), salta a ella al cargar.
 * El navegador no lo hace solo: la página se monta después de que él busca el ancla, y el paso guiado del hero
 * cambia el alto del documento. Se espera a que carguen la página y las fuentes, se vuelven a medir ScrollTrigger y
 * Lenis (Lenis recorta el salto al alto que midió al iniciar) y se salta sin animación, marcando `motionRef.current.jump`.
 */
export function useHashOnLoad(motionRef) {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return undefined;
    let cancelled = false;
    const jump = () => {
      if (cancelled) return;
      const target = document.getElementById(id);
      if (!target) return;
      ScrollTrigger.refresh();
      const motion = motionRef.current;
      const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      if (!motion.lenis) { target.scrollIntoView(); return; }
      motion.jump = true;
      motion.lenis.resize();
      motion.lenis.scrollTo(target, { immediate: true, force: true, offset: -margin });
      setTimeout(() => { motion.jump = false; }, 300);
    };
    const loaded = document.readyState === 'complete' ? Promise.resolve() : new Promise((r) => window.addEventListener('load', r, { once: true }));
    const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
    Promise.all([loaded, fonts]).then(() => requestAnimationFrame(jump));
    return () => { cancelled = true; };
  }, [motionRef]);
}
