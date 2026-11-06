import { useEffect, useState } from 'react';

/** Ancho de la ventana, actualizado al cambiar de tamaño (como máximo una vez por cuadro). */
export function useViewportWidth(fallback = 1440) {
  const [vw, setVw] = useState(() => (typeof window !== 'undefined' && window.innerWidth) || fallback);
  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setVw(window.innerWidth));
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);
  return vw;
}
