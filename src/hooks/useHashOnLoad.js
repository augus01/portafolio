import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Si la página se abre con un ancla (p. ej. /#contacto al volver de la oficina), salta a ella al cargar.
 * El navegador no lo hace solo: la página se monta después de que él busca el ancla, y el paso guiado del hero
 * cambia el alto del documento. Se salta sin animación, con Lenis si está activo, marcando `motionRef.current.jump`.
 */
export function useHashOnLoad(motionRef) {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return undefined;
    let raf = 0;
    const timer = setTimeout(() => {
      raf = requestAnimationFrame(() => {
        const target = document.getElementById(id);
        if (!target) return;
        ScrollTrigger.refresh();
        const motion = motionRef.current;
        const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
        if (!motion.lenis) { target.scrollIntoView(); return; }
        motion.jump = true;
        motion.lenis.scrollTo(target, { immediate: true, force: true, offset: -margin });
        setTimeout(() => { motion.jump = false; }, 300);
      });
    }, 120);
    return () => { clearTimeout(timer); cancelAnimationFrame(raf); };
  }, [motionRef]);
}
