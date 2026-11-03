import { useEffect, useState } from 'react';

/**
 * `true` mientras `ref` está cerca de la pantalla (con `rootMargin` de holgura). Sirve para pausar animaciones
 * que no se ven. Sin IntersectionObserver queda siempre en `true`.
 */
export function useInView(ref, { rootMargin = '200px 0px' } = {}) {
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver((es) => setInView(es[0].isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);

  return inView;
}
