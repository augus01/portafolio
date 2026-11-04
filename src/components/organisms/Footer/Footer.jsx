import { Logo } from '../../atoms/Logo';
import { Icon } from '../../atoms/Icon';
import { AgentFigure } from '../../atoms/AgentFigure';

const extProps = (item) => (item.external ? { target: '_blank', rel: 'noopener noreferrer' } : null);

// Pie oscuro (ajuste del 4 nov 2026, sobre design-system/components/Footer): arriba el logo blanco, la pregunta grande y
// la llamada a la oficina con su círculo de flecha; a la derecha, los menús en mayúsculas. Debajo de la línea, los tres
// agentes de colores (enlace a la oficina), el año y, a la derecha, dónde está desplegado y el repositorio.
// `onNavigate(e, href)` recibe los clics en anclas de la misma página (#…), para el scroll suave del landing.
export function Footer({ brand, title, cta, nav = [], agents, copyright, note, links = [], onNavigate, className }) {
  const go = (href) => (onNavigate && href.charAt(0) === '#' ? (e) => onNavigate(e, href) : undefined);
  return (
    <footer className={['ap-footer', 'ap-foot', className].filter(Boolean).join(' ')}>
      <div className="ap-foot__inner">
        <div className="ap-foot__top">
          <div className="ap-foot__pitch">
            <a className="ap-foot__brand" href={brand.href} aria-label={brand.label}>
              <Logo tone="light" height={32} decorative />
            </a>
            <p className="ap-foot__title">{title}</p>
            <a className="ap-foot__cta" href={cta.href}>
              <span>{cta.label}</span>
              <span className="ap-foot__circle" aria-hidden="true"><Icon name="arrow-right" size="lg" /></span>
            </a>
          </div>
          <nav className="ap-foot__nav" aria-label={nav.label}>
            <ul>
              {nav.items.map((item) => (
                <li key={item.label}>
                  <a href={item.href} onClick={go(item.href)} {...extProps(item)}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="ap-foot__bottom">
          <div className="ap-foot__left">
            <a className="ap-foot__agents" href={agents.href} aria-label={agents.label}>
              {agents.items.map((id) => <AgentFigure key={id} agent={id} />)}
            </a>
            <p className="ap-foot__copy">{copyright}</p>
          </div>
          <p className="ap-foot__note">
            {note}
            {links.map((link) => (
              <span key={link.href}> · <a href={link.href} {...extProps(link)}>{link.label}</a></span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
