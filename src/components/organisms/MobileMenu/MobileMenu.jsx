import { Icon } from '../../atoms/Icon';
import { Logo } from '../../atoms/Logo';

// Menú móvil a pantalla completa: logo y botón cerrar arriba, enlaces grandes al centro, llamada principal y pie abajo.
// Cerrado queda `inert` (fuera del foco y del lector de pantalla).
const extProps = (item) => (item.external ? { target: '_blank', rel: 'noopener noreferrer' } : null);

export function MobileMenu({ id, open, links, cta, secondary, meta, onClose, onNavigate, closeRef }) {
  const go = (href) => (e) => onNavigate(e, href);
  return (
    <div id={id} className={open ? 'ap-menu is-open' : 'ap-menu'} role="dialog" aria-modal="true" aria-label="Menú de navegación" inert={!open}>
      <div className="ap-menu__top">
        <Logo tone="dark" height={30} />
        <button ref={closeRef} type="button" className="ap-menu__close" aria-label="Cerrar menú" onClick={() => onClose()}>
          <Icon name="x" size="lg" />
        </button>
      </div>
      <nav className="ap-menu__nav" aria-label="Principal">
        {links.map((link) => (
          <a key={link.label} className="ap-menu__link" href={link.href} onClick={go(link.href)}>
            <span className="ap-menu__txt heading">{link.label}</span>
          </a>
        ))}
      </nav>
      <div className="ap-menu__foot">
        <a className="ap-menu__cta meta" href={cta.href} onClick={go(cta.href)}>{cta.label}</a>
        {secondary && <a className="ap-menu__cta ap-menu__cta--ghost meta" href={secondary.href} onClick={go(secondary.href)} {...extProps(secondary)}>{secondary.label}</a>}
        {meta && <p className="ap-menu__meta label">{meta}</p>}
      </div>
    </div>
  );
}
