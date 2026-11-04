import { Icon } from '../../atoms/Icon';
import { Logo } from '../../atoms/Logo';

// Barra móvil (bajo 600px): logo a la izquierda y botón de menú de solo icono a la derecha.
// `tone="dark"` sobre el hero (transparente, icono blanco); `light` sobre la página (vidrio claro con línea inferior).
// Con `brand` ({ href, label }) el logo es el enlace al inicio.
export function MobileNavBar({ tone = 'light', brand, open, menuId, onOpen, buttonRef }) {
  const logo = <Logo tone={tone === 'dark' ? 'light' : 'dark'} height={30} decorative={Boolean(brand)} />;
  return (
    <div className="ap-mnav" data-tone={tone}>
      {brand ? <a className="ap-mnav__brand" href={brand.href} aria-label={brand.label}>{logo}</a> : logo}
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
