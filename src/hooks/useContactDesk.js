import { useEffect, useRef } from 'react';

/**
 * Monta el escritorio de recepción (Three.js) en `stageRef` cuando se acerca a la pantalla.
 * Three.js se descarga aparte para no pesar en la carga inicial. Devuelve un ref con `hop(spin)`, `say(texto, s)` y
 * `lead(done)` (tres saltos y luego `done`); sin WebGL queda en null y la sección se ve igual, sin el personaje.
 * `onTriple` corre al hacerle tres clics seguidos a recepción; `tickles`, lo que dice con el primer y segundo clic.
 */
export function useContactDesk(stageRef, lines, { onTriple, tickles } = {}) {
  const deskRef = useRef(null);
  const tripleRef = useRef(onTriple);
  tripleRef.current = onTriple;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    let cancelled = false;
    const io = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      import('../lib/contactDesk').then(({ mountContactDesk }) => {
        if (cancelled) return;
        deskRef.current = mountContactDesk(stage, { lines, tickles, onTriple: () => tripleRef.current?.() });
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
