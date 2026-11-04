import { Icon } from '../../atoms/Icon';

// Cabecera de la página de la oficina: título y pista, y el enlace de vuelta a recepción. El selector de serie vive
// dentro del escenario (organismo Office).
export function OfficeHeader({ title, subtitle, back, onBack }) {
  return (
    <header className="ap-ofp__head">
      <div className="ap-ofp__titles">
        <h1 className="ap-office__title subheading">{title}</h1>
        <p className="ap-office__subtitle subheading">{subtitle}</p>
      </div>
      <a className="ap-ofp__back label" href={back.href} aria-label={back.label} onClick={onBack}>
        <Icon name="arrow-left" size="md" />
        <span className="ap-ofp__backtxt">{back.label}</span>
      </a>
    </header>
  );
}
