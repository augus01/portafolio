import { Icon } from '../../atoms/Icon';

// Botón redondo que sigue al scroll, bajo la nav, para volver a la galería de proyectos.
export function CaseBackButton({ href, label }) {
  return (
    <div className="ap-case-fabwrap">
      <a className="ap-case-fab" href={href} aria-label={label}><Icon name="arrow-left" size="lg" /></a>
    </div>
  );
}
