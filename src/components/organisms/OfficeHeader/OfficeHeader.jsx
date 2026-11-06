import { Icon } from '../../atoms/Icon';
import { LangSwitch } from '../../atoms/LangSwitch';

// Cabecera de la página de la oficina: la oficina ocupa toda la pantalla, así que el título y la pista quedan solo para
// lectores de pantalla y a la vista queda el botón de vuelta a recepción, sobre el escenario (arriba a la derecha).
// `langToggle` ({ label, current, onSelect }) agrega el interruptor de idioma junto al botón de vuelta.
export function OfficeHeader({ title, subtitle, back, onBack, langToggle }) {
  return (
    <header className="ap-ofp__head">
      <div className="ap-sr">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {langToggle && (
        // Con el mismo borde que "Volver a recepción", para que la cabecera de la oficina se lea como un solo juego.
        <LangSwitch current={langToggle.current} label={langToggle.label} onToggle={langToggle.onSelect} />
      )}
      <a className="ap-ofp__back label" href={back.href} aria-label={back.label} onClick={onBack}>
        <Icon name="arrow-left" size="md" />
        <span className="ap-ofp__backtxt">{back.label}</span>
      </a>
    </header>
  );
}
