import { useEffect, useRef } from 'react';

// Los agentes en el sitio (src/lib/agentsOnSite.js). Three.js se descarga aparte y solo cuando hace falta: la página
// funciona igual sin WebGL (los lienzos quedan vacíos y los botones siguen funcionando).
const load = () => import('../lib/agentsOnSite');
const idle = (fn) => {
  if (window.requestIdleCallback) { const id = window.requestIdleCallback(fn, { timeout: 2500 }); return () => window.cancelIdleCallback(id); }
  const id = setTimeout(fn, 1200);
  return () => clearTimeout(id);
};

/**
 * Recepción asoma sobre la píldora Contacto (`.ap-pk`, en la nav de escritorio y en la barra móvil) dentro de `rootRef`.
 * Mientras Contacto está en pantalla se agacha (ya está en su escritorio). Al tocar la píldora se agacha, la página baja
 * a `#contactId` y, al llegar, avisa con el evento `ap:recepcion-saluda` para que salude desde su escritorio.
 */
export function useReceptionPeek(rootRef, { contactId = 'contacto', greetDelay = 1700 } = {}) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const canvases = [...root.querySelectorAll('[data-pk-gl]')];
    const links = [...root.querySelectorAll('.ap-pk')];
    if (!links.length) return undefined;
    let cancelled = false, peek = null, inContact = false, ducking = false;
    const timers = [];
    const setDuck = () => links.forEach((l) => l.classList.toggle('is-duck', inContact || ducking));
    const ct = document.getElementById(contactId);
    const io = ct && 'IntersectionObserver' in window
      ? new IntersectionObserver((es) => { inContact = es[0].isIntersecting; setDuck(); }, { threshold: 0.35 })
      : null;
    if (io) io.observe(ct);
    const onClick = (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      ducking = true;
      setDuck();
      timers.push(setTimeout(() => {
        ducking = false;
        setDuck();
        window.dispatchEvent(new CustomEvent('ap:recepcion-saluda'));
      }, greetDelay));
    };
    links.forEach((l) => l.addEventListener('click', onClick));
    const stopIdle = idle(() => {
      load().then(({ mountReceptionPeek }) => { if (!cancelled) peek = mountReceptionPeek(canvases); }).catch(() => { /* sin WebGL */ });
    });
    return () => {
      cancelled = true;
      stopIdle();
      timers.forEach(clearTimeout);
      if (io) io.disconnect();
      links.forEach((l) => l.removeEventListener('click', onClick));
      if (peek) peek.dispose();
    };
  }, [rootRef, contactId, greetDelay]);
}

/**
 * Arquitecto asoma por el borde de cada portada de `sectionRef` (lienzos `[data-arq-peek]` dentro de su botón `.ap-arq`).
 * Se monta cuando la sección se acerca y solo se anima mientras se ve. `openIndex` es la portada con su plano abierto.
 */
export function useArchitectPeeks(sectionRef, openIndex) {
  const openRef = useRef(openIndex);
  openRef.current = openIndex;
  const ctlRef = useRef(null);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec || !('IntersectionObserver' in window)) return undefined;
    let cancelled = false, loading = false, visible = false;
    const io = new IntersectionObserver((es) => {
      visible = es[0].isIntersecting;
      if (ctlRef.current) { ctlRef.current.setVisible(visible); return; }
      if (!visible || loading) return;
      loading = true;
      load().then(({ mountArchitectPeeks }) => {
        if (cancelled) return;
        const items = [...sec.querySelectorAll('[data-arq-peek]')].map((canvas) => ({
          canvas, btn: canvas.closest('.ap-arq'), item: canvas.closest('.ap-gal__item'),
        }));
        ctlRef.current = mountArchitectPeeks(items, (i) => openRef.current === i);
        if (ctlRef.current) ctlRef.current.setVisible(visible);
      }).catch(() => { /* sin WebGL */ });
    }, { rootMargin: '300px 0px' });
    io.observe(sec);
    return () => {
      cancelled = true;
      io.disconnect();
      if (ctlRef.current) { ctlRef.current.dispose(); ctlRef.current = null; }
    };
  }, [sectionRef]);

  useEffect(() => { ctlRef.current?.kick(); }, [openIndex]);
}

/**
 * Agente de cuerpo entero en `canvasRef` (arquitecto en el plano, stack en la ficha de una tecnología). Se monta la
 * primera vez que `open` es true y solo se anima con la ventana abierta. Cada cambio de `talkKey` le da un saltito.
 */
export function useAgentCard(canvasRef, agent, open, talkKey) {
  const ctlRef = useRef(null);
  const firstTalk = useRef(true);

  useEffect(() => {
    if (!open) { ctlRef.current?.setActive(false); return undefined; }
    if (ctlRef.current) { ctlRef.current.setActive(true); return undefined; }
    let cancelled = false;
    load().then(({ mountAgentCard }) => {
      if (cancelled || !canvasRef.current || ctlRef.current) return;
      ctlRef.current = mountAgentCard(canvasRef.current, agent);
    }).catch(() => { /* sin WebGL */ });
    return () => { cancelled = true; };
  }, [open, agent, canvasRef]);

  useEffect(() => {
    if (firstTalk.current) { firstTalk.current = false; return; }
    ctlRef.current?.talk();
  }, [talkKey]);

  useEffect(() => () => { if (ctlRef.current) { ctlRef.current.dispose(); ctlRef.current = null; } }, []);
}

/**
 * Los tres agentes del pie en 3D, dentro del enlace `hostRef` (lienzo `[data-trio-gl]`). Se montan cuando el pie se
 * acerca; al lograrlo, el enlace lleva `is-3d` y las figuras planas (respaldo sin WebGL) se ocultan.
 */
export function useAgentTrio(hostRef) {
  useEffect(() => {
    const host = hostRef.current;
    const canvas = host && host.querySelector('[data-trio-gl]');
    if (!canvas || !('IntersectionObserver' in window)) return undefined;
    let cancelled = false, ctl = null;
    const io = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      load().then(({ mountAgentTrio }) => {
        if (cancelled) return;
        ctl = mountAgentTrio(canvas, host);
        if (ctl) host.classList.add('is-3d');
      }).catch(() => { /* sin WebGL: quedan las figuras planas */ });
    }, { rootMargin: '400px 0px' });
    io.observe(host);
    return () => { cancelled = true; io.disconnect(); if (ctl) ctl.dispose(); host.classList.remove('is-3d'); };
  }, [hostRef]);
}

/**
 * Arquitecto trabajando en su plano dentro del lienzo `canvasRef` (círculo "en construcción" de la portada). Se monta
 * cuando se acerca a la pantalla y solo se anima mientras se ve.
 */
export function useArchitectBusy(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !('IntersectionObserver' in window)) return undefined;
    let cancelled = false, loading = false, visible = false, ctl = null;
    const io = new IntersectionObserver((es) => {
      visible = es[0].isIntersecting;
      if (ctl) { ctl.setVisible(visible); return; }
      if (!visible || loading) return;
      loading = true;
      load().then(({ mountArchitectBusy }) => {
        if (cancelled) return;
        ctl = mountArchitectBusy(canvas);
        if (ctl) { canvas.closest('.ap-case-cta')?.classList.add('is-3d'); ctl.setVisible(visible); }
      }).catch(() => { /* sin WebGL: queda el texto */ });
    }, { rootMargin: '200px 0px' });
    io.observe(canvas.closest('.ap-case-cta') || canvas); // el lienzo está oculto hasta que carga el 3D
    return () => { cancelled = true; io.disconnect(); if (ctl) ctl.dispose(); };
  }, [canvasRef]);
}
