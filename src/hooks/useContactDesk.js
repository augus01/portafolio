import { useEffect, useRef } from 'react';

/**
 * Monta el escritorio de recepción (Three.js) en `stageRef` cuando se acerca a la pantalla.
 * Three.js se descarga aparte para no pesar en la carga inicial. Devuelve un ref con `hop(spin)` y `say(texto, s)`;
 * sin WebGL queda en null y la sección se ve igual, sin el personaje.
 */
export function useContactDesk(stageRef, lines) {
  const deskRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    let cancelled = false;
    const io = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      import('../lib/contactDesk').then(({ mountContactDesk }) => {
        if (cancelled) return;
        deskRef.current = mountContactDesk(stage, { lines });
      }).catch(() => { /* sin escritorio 3D */ });
    }, { rootMargin: '600px 0px' });
    io.observe(stage);
    return () => {
      cancelled = true;
      io.disconnect();
      if (deskRef.current) { deskRef.current.dispose(); deskRef.current = null; }
    };
  }, [stageRef, lines]);

  return deskRef;
}
