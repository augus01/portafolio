import { useEffect, useRef } from 'react';

/**
 * Monta a stack leyendo (Three.js, `lib/stackReader.js`) en `stageRef` mientras su puesto de la cinta está cerca de
 * la pantalla y lo libera al salir, para no acumular contextos WebGL. Three.js se descarga aparte. Si el navegador no
 * tiene contextos libres, reintenta unas pocas veces (cada intento fallido deja un error en la consola) y después se
 * rinde hasta que el puesto vuelva a entrar; sin WebGL el puesto queda vacío.
 * `cheer` (lib/techMarquee.js, createCheer) avisa cuando el cursor pasa por un logo: stack salta de emoción.
 */
export function useStackReader(stageRef, scare, cheer) {
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || typeof IntersectionObserver === 'undefined') return undefined;
    let reader = null;
    let near = false;
    let cancelled = false;
    let retry = 0;
    let tries = 0;
    const off = cheer ? cheer.on((text) => { if (reader) reader.cheer(text); }) : null;
    const tryMount = () => {
      if (reader || !near || cancelled) return;
      import('../lib/stackReader').then(({ mountStackReader }) => {
        if (cancelled || reader || !near) return;
        reader = mountStackReader(stage, { scare });
        if (!reader && ++tries < 4) retry = setTimeout(tryMount, 1000);
      }).catch(() => { /* sin stack 3D */ });
    };
    const io = new IntersectionObserver((es) => {
      near = es[0].isIntersecting;
      if (near) { tries = 0; tryMount(); }
      else {
        clearTimeout(retry);
        if (reader) { reader.dispose(); reader = null; }
      }
    }, { rootMargin: '0px 300px' });
    io.observe(stage);
    return () => {
      cancelled = true;
      if (off) off();
      clearTimeout(retry);
      io.disconnect();
      if (reader) { reader.dispose(); reader = null; }
    };
  }, [stageRef, scare, cheer]);
}

/**
 * stack de la cinta en la ficha de una tecnología (`SkillCard`): sentado leyendo, girado hacia el logo. Se monta al
 * abrir la ficha y se libera al cerrarla; cada vez que sube `talkKey` (respondió una pregunta) salta de emoción.
 */
export function useStackCard(stageRef, open, talkKey) {
  const readerRef = useRef(null);
  const lastTalk = useRef(talkKey);

  useEffect(() => {
    const stage = stageRef.current;
    if (!open || !stage) return undefined;
    let cancelled = false;
    import('../lib/stackReader').then(({ mountStackReader }) => {
      if (cancelled) return;
      readerRef.current = mountStackReader(stage, { facing: 0.4, size: 1.05, lookY: 0.8 });
    }).catch(() => { /* sin stack 3D */ });
    return () => {
      cancelled = true;
      if (readerRef.current) { readerRef.current.dispose(); readerRef.current = null; }
    };
  }, [open, stageRef]);

  useEffect(() => {
    // Salta solo cuando hay una respuesta nueva (al cambiar de ficha el contador vuelve a 0 y no salta).
    if (talkKey > lastTalk.current) readerRef.current?.cheer();
    lastTalk.current = talkKey;
  }, [talkKey]);
}
