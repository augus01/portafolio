import { Icon } from '../../atoms/Icon';

// Barra superior de la página de un proyecto y botón redondo que sigue al scroll para volver a la galería.
export function CaseTopBar({ home, nav, back }) {
  return (
    <>
      <header className="ap-case-top">
        <a href={home.href}>{home.label}</a>
        <nav className="ap-case-top__nav" aria-label="Principal">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className={item.hideSm ? 'ap-case-hide-sm' : undefined} aria-current={item.current ? 'page' : undefined}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>
      <div className="ap-case-fabwrap">
        <a className="ap-case-fab" href={back.href} aria-label={back.label}><Icon name="arrow-left" size="lg" /></a>
      </div>
    </>
  );
}
