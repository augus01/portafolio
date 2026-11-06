import { Icon } from '../../atoms/Icon';

// Cabecera de la página de la oficina: la oficina ocupa toda la pantalla, así que el título y la pista quedan solo para
// lectores de pantalla y a la vista queda el botón de vuelta a recepción, sobre el escenario (arriba a la derecha).
// `langToggle` ({ label, ariaLabel, target, onSelect }) agrega la píldora de idioma junto al botón de vuelta.
export function OfficeHeader({ title, subtitle, back, onBack, langToggle }) {
  return (
    <header className="ap-ofp__head">
      <div className="ap-sr">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {langToggle && (
        // Mismo botón redondo que "Volver a recepción", para que la cabecera de la oficina se lea como un solo juego.
        <button type="button" className="ap-ofp__back ap-ofp__lang label" lang={langToggle.target} aria-label={langToggle.ariaLabel} onClick={langToggle.onSelect}>{langToggle.label}</button>
      )}
      <a className="ap-ofp__back label" href={back.href} aria-label={back.label} onClick={onBack}>
        <Icon name="arrow-left" size="md" />
        <span className="ap-ofp__backtxt">{back.label}</span>
      </a>
    </header>
  );
}
