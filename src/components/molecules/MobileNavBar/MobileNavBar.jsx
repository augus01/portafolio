import { Icon } from '../../atoms/Icon';
import { Logo } from '../../atoms/Logo';

// Barra móvil (bajo 600px): logo a la izquierda y botón de menú de solo icono a la derecha.
// `tone="dark"` sobre el hero (transparente, icono blanco); `light` sobre la página (vidrio claro con línea inferior).
export function MobileNavBar({ tone = 'light', open, menuId, onOpen, buttonRef }) {
  return (
    <div className="ap-mnav" data-tone={tone}>
      <Logo tone={tone === 'dark' ? 'light' : 'dark'} height={30} />
      <button
        ref={buttonRef}
        type="button"
        className="ap-mnav__toggle"
        aria-label="Abrir menú"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={onOpen}
      >
        <Icon name="menu" size="lg" />
      </button>
    </div>
  );
}
