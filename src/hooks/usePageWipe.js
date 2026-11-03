import { useCallback, useEffect, useRef, useState } from 'react';

const FLAG = 'ap-wipe';
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const readFlag = () => { try { return sessionStorage.getItem(FLAG) === '1'; } catch (e) { return false; } };
const setFlag = (on) => { try { if (on) sessionStorage.setItem(FLAG, '1'); else sessionStorage.removeItem(FLAG); } catch (e) { /* sin almacenamiento */ } };

/**
 * Paso entre recepción y la oficina: tres franjas con los colores de los agentes suben, tapan la pantalla,
 * se cambia de página y en la página nueva siguen hacia arriba. Estados: 'idle' | 'in' | 'out'.
 * `leave(href, wait)` hace la salida (con `wait` ms antes de empezar); sin animación navega de inmediato.
 */
export function usePageWipe() {
  // Si llegamos desde la otra página, la pantalla parte tapada para que no se vea un salto.
  const [phase, setPhase] = useState(() => (readFlag() && !reduced() ? 'in' : 'idle'));
  const timers = useRef([]);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  useEffect(() => {
    setFlag(false);
    if (phase === 'in') {
      requestAnimationFrame(() => requestAnimationFrame(() => setPhase('out')));
      later(() => setPhase('idle'), 700);
    }
    // Al volver con el botón Atrás, el navegador puede restaurar la página tapada: se destapa.
    const onShow = (e) => { if (e.persisted) setPhase('idle'); };
    window.addEventListener('pageshow', onShow);
    const list = timers.current;
    return () => { window.removeEventListener('pageshow', onShow); list.forEach(clearTimeout); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const leave = useCallback((href, wait = 0) => {
    if (reduced()) { window.location.assign(href); return; }
    setFlag(true);
    later(() => {
      setPhase('in');
      later(() => window.location.assign(href), 560);
    }, wait);
  }, []);

  return { phase, leave };
}
