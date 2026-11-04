import { Icon } from '../../atoms/Icon';

// Cabecera de la página de la oficina: la oficina ocupa toda la pantalla, así que el título y la pista quedan solo para
// lectores de pantalla y a la vista queda el botón de vuelta a recepción, sobre el escenario (arriba a la derecha).
export function OfficeHeader({ title, subtitle, back, onBack }) {
  return (
    <header className="ap-ofp__head">
      <div className="ap-sr">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <a className="ap-ofp__back label" href={back.href} aria-label={back.label} onClick={onBack}>
        <Icon name="arrow-left" size="md" />
        <span className="ap-ofp__backtxt">{back.label}</span>
      </a>
    </header>
  );
}
