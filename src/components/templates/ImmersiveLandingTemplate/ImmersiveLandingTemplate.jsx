import { useId, useRef, useState } from 'react';
import { NavBar } from '../../molecules/NavBar';
import { MobileNavBar } from '../../molecules/MobileNavBar';
import { HeroStage } from '../../organisms/HeroStage';
import { Footer } from '../../organisms/Footer';
import { MobileMenu } from '../../organisms/MobileMenu';
import { useImmersiveScroll } from '../../../hooks/useImmersiveScroll';
import { useMobileMenu } from '../../../hooks/useMobileMenu';
import { useHashOnLoad } from '../../../hooks/useHashOnLoad';

// Estructura del landing: nav sticky, hero fijo durante un pin corto (~0,35 pantallas) y la página que sigue.
// Con animación, la página sube un viewport y se funde encima del hero: nunca se ven los dos a la vez.
// Bajo 600px la NavBar de píldoras se cambia por la barra móvil y su menú a pantalla completa (src/styles/movil.css).
export function ImmersiveLandingTemplate({ nav, mobileMenu, hero, footer, children }) {
  const rootRef = useRef(null);
  const motionRef = useRef({ tl: null, progress: 0, lenis: null, jump: false });
  const [navTone, setNavTone] = useState('dark');
  const menuId = useId();
  const menu = useMobileMenu(motionRef);
  useImmersiveScroll(rootRef, motionRef, setNavTone);
  useHashOnLoad(motionRef);

  return (
    <div ref={rootRef} className="ap-page">
      {/* Sticky al tope de la página; el scroll la ubica abajo mientras se ve el hero. */}
      <div className="ap-navwrap">
        <NavBar items={nav.items} actions={nav.actions} brand={nav.brand} onNavigate={menu.navigate} tone={navTone} menuPlacement={navTone === 'dark' ? 'up' : 'down'} />
        <MobileNavBar tone={navTone} brand={nav.brand} open={menu.open} menuId={menuId} onOpen={menu.openMenu} buttonRef={menu.openRef} />
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
