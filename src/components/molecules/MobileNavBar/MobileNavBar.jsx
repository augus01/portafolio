import { Icon } from '../../atoms/Icon';
import { Logo } from '../../atoms/Logo';
import { PeekPill } from '../../atoms/PeekPill';

// Barra móvil (bajo 600px): logo a la izquierda y botón de menú de solo icono a la derecha.
// `tone="dark"` sobre el hero (transparente, icono blanco); `light` sobre la página (vidrio claro con línea inferior).
// Con `brand` ({ href, label }) el logo es el enlace al inicio. Con `peek` ({ href, label }) la píldora Contacto queda
// junto al menú, con recepción asomada por detrás; `onNavigate(e, href)` la hace saltar con el scroll suave.
export function MobileNavBar({ tone = 'light', brand, peek, onNavigate, open, menuId, onOpen, buttonRef, openLabel = 'Abrir menú' }) {
  const logo = <Logo tone={tone === 'dark' ? 'light' : 'dark'} height={30} decorative={Boolean(brand)} />;
  return (
    <div className="ap-mnav" data-tone={tone}>
      {brand ? <a className="ap-mnav__brand" href={brand.href} aria-label={brand.label}>{logo}</a> : logo}
      {peek && (
        <PeekPill href={peek.href} className="ap-mnav__peek" onClick={onNavigate ? (e) => onNavigate(e, peek.href) : undefined}>{peek.label}</PeekPill>
      )}
      <button
        ref={buttonRef}
        type="button"
        className="ap-mnav__toggle"
        aria-label={openLabel}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={onOpen}
      >
        <Icon name="menu" size="lg" />
      </button>
    </div>
  );
}
