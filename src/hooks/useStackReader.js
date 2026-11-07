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
 * stack de la cinta en la ficha de una tecnología (`SkillCard`): sin pufón ni libro, de pie y atento al usuario
 * (sigue el cursor con la mirada). Se monta apagado cuando Superpoderes se acerca (`warm`), en un momento libre, y
 * queda listo: al abrir la ficha solo se prende, sin crear el contexto WebGL ni compilar sombreadores en ese instante
 * (en un teléfono eso tardaba en mostrarlo). Se libera cuando la sección se aleja y la ficha está cerrada.
 * Cada vez que sube `talkKey` (respondió una pregunta) salta de emoción.
 */
export function useStackCard(stageRef, open, talkKey, warm = false) {
  const readerRef = useRef(null);
  const lastTalk = useRef(talkKey);
  const openRef = useRef(open);
  openRef.current = open;
  const keep = warm || open;

  useEffect(() => {
    const stage = stageRef.current;
    if (!keep || !stage) return undefined;
    let cancelled = false, idle = 0;
    const mount = () => import('../lib/stackReader').then(({ mountStackReader }) => {
      if (cancelled || readerRef.current) return;
      readerRef.current = mountStackReader(stage, { attentive: true, facing: Math.PI / 4 - 0.2, size: 1.0, lookY: 0.8, active: openRef.current });
    }).catch(() => { /* sin stack 3D */ });
    // Abierta: de inmediato. Solo precarga: cuando el navegador esté libre, para no trabar el scroll.
    if (openRef.current || typeof requestIdleCallback === 'undefined') mount();
    else idle = requestIdleCallback(mount, { timeout: 2000 });
    return () => {
      cancelled = true;
      if (idle && typeof cancelIdleCallback !== 'undefined') cancelIdleCallback(idle);
      if (readerRef.current) { readerRef.current.dispose(); readerRef.current = null; }
    };
  }, [keep, stageRef]);

  useEffect(() => { readerRef.current?.setActive(open); }, [open]);

  useEffect(() => {
    // Salta solo cuando hay una respuesta nueva (al cambiar de ficha el contador vuelve a 0 y no salta).
    if (talkKey > lastTalk.current) readerRef.current?.cheer();
    lastTalk.current = talkKey;
  }, [talkKey]);
}
