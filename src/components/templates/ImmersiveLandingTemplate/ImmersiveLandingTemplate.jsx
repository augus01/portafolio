import { useRef, useState } from 'react';
import { NavBar } from '../../molecules/NavBar';
import { HeroStage } from '../../organisms/HeroStage';
import { useImmersiveScroll } from '../../../hooks/useImmersiveScroll';

// Estructura del landing: nav sticky, hero fijo durante un pin corto (~0,35 pantallas) y la página que sigue.
// Con animación, la página sube un viewport y se funde encima del hero: nunca se ven los dos a la vez.
export function ImmersiveLandingTemplate({ nav, hero, children }) {
  const rootRef = useRef(null);
  const motionRef = useRef({ tl: null, progress: 0 });
  const [navTone, setNavTone] = useState('dark');
  useImmersiveScroll(rootRef, motionRef, setNavTone);

  return (
    <div ref={rootRef} className="ap-page">
      {/* Sticky al tope de la página; el scroll la ubica abajo mientras se ve el hero. */}
      <div className="ap-navwrap">
        <NavBar items={nav.items} actions={nav.actions} tone={navTone} menuPlacement={navTone === 'dark' ? 'up' : 'down'} />
      </div>
      <div className="ap-track">
        <HeroStage hero={hero} motionRef={motionRef} />
      </div>
      <main className="ap-after">{children}</main>
    </div>
  );
}
