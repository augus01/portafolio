import { useLayoutEffect, useRef, useState } from 'react';
import { Logo } from '../../atoms/Logo';
import { Wordmark } from '../../atoms/Wordmark';

// Apertura a pantalla completa: fondo de rayos, logo, rol (· lugar, opcional) y el nombre gigante.
// En contenedores de menos de 600px el nombre se parte en una línea por palabra.
export function Hero({ name = 'augusto pinto', role, location, uppercase, height = '100svh', regionLabel = 'Presentación', className }) {
  const ref = useRef(null);
  const [narrow, setNarrow] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([entry]) => setNarrow(entry.contentRect.width < 600));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const words = name.trim().split(/\s+/);
  const lines = narrow && words.length > 1 ? words : [words.join(' ')];

  return (
    <section ref={ref} className={['ap-hero', className].filter(Boolean).join(' ')} style={{ minHeight: height }} aria-label={regionLabel}>
      <div className="ap-hero__bg" aria-hidden="true">
        <div className="ap-hero__rays" />
        <div className="ap-hero__vignette" />
      </div>
      <div className="ap-hero__inner">
        <header className="ap-hero__top">
          <Logo tone="light" height={28} />
          <div className="ap-hero__meta">
            <p className="ap-hero__role label">
              <span>{role}</span>
              {location && (
                <>
                  <span aria-hidden="true"> · </span>
                  <span>{location}</span>
                </>
              )}
            </p>
          </div>
        </header>
        <div className="ap-hero__center">
          <Wordmark lines={lines} uppercase={uppercase} />
        </div>
        <div className="ap-hero__bottom" />
      </div>
    </section>
  );
}
