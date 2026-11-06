import { useId, useRef, useState } from 'react';
import { NavBar } from '../../molecules/NavBar';
import { MobileNavBar } from '../../molecules/MobileNavBar';
import { HeroStage } from '../../organisms/HeroStage';
import { Footer } from '../../organisms/Footer';
import { MobileMenu } from '../../organisms/MobileMenu';
import { useImmersiveScroll } from '../../../hooks/useImmersiveScroll';
import { useMobileMenu } from '../../../hooks/useMobileMenu';
import { useHashOnLoad } from '../../../hooks/useHashOnLoad';
import { useReceptionPeek } from '../../../hooks/useAgentsOnSite';

// Estructura del landing: nav sticky, hero fijo durante un pin corto (~0,35 pantallas) y la página que sigue.
// Con animación, la página sube un viewport y se funde encima del hero: nunca se ven los dos a la vez.
// Bajo 600px la NavBar de píldoras se cambia por la barra móvil y su menú a pantalla completa (src/styles/movil.css).
// Recepción asoma por detrás de la píldora Contacto en las dos barras (useReceptionPeek).
export function ImmersiveLandingTemplate({ nav, mobileMenu, hero, footer, children }) {
  const rootRef = useRef(null);
  const motionRef = useRef({ tl: null, progress: 0, lenis: null, jump: false });
  const [navTone, setNavTone] = useState('dark');
  const menuId = useId();
  const menu = useMobileMenu(motionRef);
  useImmersiveScroll(rootRef, motionRef, setNavTone);
  useHashOnLoad(motionRef);
  const navRef = useRef(null);
  useReceptionPeek(navRef);
  // La píldora con recepción asomada (`peek` en las acciones) también va en la barra móvil, junto al menú.
  const peek = [...(nav.actions || []), ...nav.items].find((i) => i.peek) || null;

  return (
    <div ref={rootRef} className="ap-page">
      {/* Sticky al tope de la página; el scroll la ubica abajo mientras se ve el hero. */}
      <div className="ap-navwrap" ref={navRef}>
        <NavBar items={nav.items} actions={nav.actions} brand={nav.brand} labels={nav.labels} onNavigate={menu.navigate} tone={navTone} menuPlacement={navTone === 'dark' ? 'up' : 'down'} />
        <MobileNavBar tone={navTone} brand={nav.brand} openLabel={nav.labels?.openMenu} peek={peek} onNavigate={menu.navigate} open={menu.open} menuId={menuId} onOpen={menu.openMenu} buttonRef={menu.openRef} />
        <MobileMenu id={menuId} open={menu.open} {...mobileMenu} onClose={menu.closeMenu} onNavigate={menu.navigate} closeRef={menu.closeRef} />
      </div>
      <div className="ap-track">
        <HeroStage hero={hero} motionRef={motionRef} />
      </div>
      <main className="ap-after">{children}</main>
      {footer && <Footer {...footer} onNavigate={menu.navigate} />}
    </div>
  );
}
