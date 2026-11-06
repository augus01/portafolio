import { useEffect } from 'react';

/**
 * Monta a stack leyendo (Three.js, `lib/stackReader.js`) en `stageRef` mientras su puesto de la cinta está cerca de
 * la pantalla y lo libera al salir, para no acumular contextos WebGL. Three.js se descarga aparte. Si el navegador no
 * tiene contextos libres, reintenta mientras siga a la vista; sin WebGL el puesto queda vacío.
 */
export function useStackReader(stageRef, scare) {
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || typeof IntersectionObserver === 'undefined') return undefined;
    let reader = null;
    let near = false;
    let cancelled = false;
    let retry = 0;
    const tryMount = () => {
      if (reader || !near || cancelled) return;
      import('../lib/stackReader').then(({ mountStackReader }) => {
        if (cancelled || reader || !near) return;
        reader = mountStackReader(stage, { scare });
        if (!reader) retry = setTimeout(tryMount, 500);
      }).catch(() => { /* sin stack 3D */ });
    };
    const io = new IntersectionObserver((es) => {
      near = es[0].isIntersecting;
      if (near) tryMount();
      else {
        clearTimeout(retry);
        if (reader) { reader.dispose(); reader = null; }
      }
    }, { rootMargin: '0px 300px' });
    io.observe(stage);
    return () => {
      cancelled = true;
      clearTimeout(retry);
      io.disconnect();
      if (reader) { reader.dispose(); reader = null; }
    };
  }, [stageRef, scare]);
}
