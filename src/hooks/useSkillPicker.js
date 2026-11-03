import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Tecnología elegida en la cinta de Superpoderes. `pick(id)` la abre (o la cierra si ya estaba abierta) y `close()`
 * la cierra devolviendo el foco al botón que la abrió. Esc la cierra, y también si la sección sale de pantalla.
 * `shown` sigue en la última elegida mientras la ficha se cierra; `n` cambia en cada apertura para repetir la entrada.
 */
export function useSkillPicker(sectionRef) {
  const [s, setS] = useState({ open: null, shown: null, n: 0 });
  const triggerRef = useRef(null);

  const close = useCallback(() => {
    setS((st) => (st.open ? { ...st, open: null } : st));
    const t = triggerRef.current;
    if (t && document.contains(t)) t.focus({ preventScroll: true });
  }, []);

  const pick = useCallback((id, trigger) => {
    triggerRef.current = trigger || null;
    setS((st) => (st.open === id ? { ...st, open: null } : { open: id, shown: id, n: st.n + 1 }));
  }, []);

  useEffect(() => {
    if (!s.open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    const io = typeof IntersectionObserver === 'undefined' ? null
      : new IntersectionObserver((es) => { if (!es[0].isIntersecting) setS((st) => ({ ...st, open: null })); }, { threshold: 0 });
    if (io && sectionRef.current) io.observe(sectionRef.current);
    return () => { document.removeEventListener('keydown', onKey); if (io) io.disconnect(); };
  }, [s.open, close, sectionRef]);

  return { ...s, pick, close };
}
