import { useCallback, useEffect, useRef, useState } from 'react';

const MOBILE = '(max-width: 599px)';

/**
 * Menú móvil a pantalla completa: abre y cierra, detiene el scroll (Lenis y el documento) mientras está abierto,
 * lleva el foco al botón cerrar y lo devuelve al de abrir, y cierra con Esc o al pasar a escritorio.
 * `navigate` salta a un ancla con Lenis (1,6 s) marcando `motionRef.current.jump`, para que el paso guiado del hero no lo interrumpa.
 */
export function useMobileMenu(motionRef) {
  const [open, setOpen] = useState(false);
  const openRef = useRef(null);
  const closeRef = useRef(null);
  const focusBack = useRef(false);

  const openMenu = useCallback(() => setOpen(true), []);
  const closeMenu = useCallback((restoreFocus = true) => {
    focusBack.current = restoreFocus;
    setOpen(false);
  }, []);

  useEffect(() => {
    const lenis = motionRef.current.lenis;
    if (open) {
      lenis?.stop();
      document.documentElement.style.overflow = 'hidden';
      closeRef.current?.focus({ preventScroll: true });
    } else {
      lenis?.start();
      document.documentElement.style.overflow = '';
      if (focusBack.current) openRef.current?.focus({ preventScroll: true });
    }
    focusBack.current = false;
  }, [open, motionRef]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') closeMenu(); };
    const mq = window.matchMedia(MOBILE);
    const onChange = () => { if (!mq.matches) closeMenu(false); };
    document.addEventListener('keydown', onKey);
    mq.addEventListener('change', onChange);
    return () => {
      document.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onChange);
    };
  }, [open, closeMenu]);

  useEffect(() => () => { document.documentElement.style.overflow = ''; }, []);

  const navigate = useCallback((e, href) => {
    closeMenu(false);
    if (!href || href.charAt(0) !== '#' || href.length < 2) return;
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    e.preventDefault();
    const motion = motionRef.current;
    // Se reanuda antes del salto: `lenis.start()` resetea y cancelaría el scrollTo si llegara después (en el efecto).
    document.documentElement.style.overflow = '';
    if (!motion.lenis) { target.scrollIntoView(); return; }
    motion.lenis.start();
    motion.jump = true;
    const release = () => { motion.jump = false; };
    motion.lenis.scrollTo(target, { duration: 1.6, force: true, onComplete: release });
    setTimeout(release, 2400);
  }, [closeMenu, motionRef]);

  return { open, openMenu, closeMenu, navigate, openRef, closeRef };
}
