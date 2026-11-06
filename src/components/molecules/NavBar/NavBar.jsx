import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from '../../atoms/Icon';
import { Pill } from '../../atoms/Pill';
import { PeekPill } from '../../atoms/PeekPill';
import { Logo } from '../../atoms/Logo';

// Un ítem `external` abre en otra pestaña.
const extProps = (item) => (item.external ? { target: '_blank', rel: 'noopener noreferrer' } : null);

// Navegación en píldoras flotantes; en contenedores de menos de 600px se pliega en un botón de menú.
// `brand` ({ href, label }) agrega el logo "apinto" en negro como primer elemento de la cápsula, enlace al inicio;
// en ventanas angostas pasa al monograma "ap" (layout.css).
// `onNavigate(e, href)` recibe los clics en anclas de la misma página (#…), para saltar con el scroll suave del landing.
export function NavBar({ items, actions = [], brand, tone = 'light', menuPlacement = 'down', label = 'Principal', onNavigate, className }) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const rootRef = useRef(null);
  const panelId = useId();

  // Esc cierra y devuelve el foco al botón; un clic fuera también cierra.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); }
    };
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  // Un ítem con `peek` lleva a recepción asomada por detrás de su píldora (PeekPill).
  const pill = (item) => {
    const onClick = onNavigate && item.href.charAt(0) === '#' ? (e) => onNavigate(e, item.href) : undefined;
    return (
      <li key={item.label}>
        {item.peek
          ? <PeekPill href={item.href} current={item.current} onClick={onClick}>{item.label}</PeekPill>
          : <Pill href={item.href} current={item.current} onClick={onClick} {...extProps(item)}>{item.label}</Pill>}
      </li>
    );
  };

  return (
    <div ref={rootRef} className={['ap-nav', `ap-nav--${tone}`, brand && 'ap-nav--brand', className].filter(Boolean).join(' ')}>
      <nav aria-label={label} className="ap-nav__bar">
        {brand && (
          <a className="ap-nav__brand" href={brand.href} aria-label={brand.label}>
            <Logo tone="dark" height={32} decorative className="ap-nav__logo" />
            <Logo variant="monogram" tone="dark" height={32} decorative className="ap-nav__mono" />
          </a>
        )}
        <ul className="ap-nav__group">{items.map(pill)}</ul>
        {actions.length > 0 && <ul className="ap-nav__group ap-nav__group--end">{actions.map(pill)}</ul>}
        {/* Píldora con icono y texto, como en el landing aprobado (ver design-system/INTEGRACION.md). */}
        <Pill
          as="button"
          ref={toggleRef}
          className="ap-nav__toggle"
          current={open}
          aria-current={undefined}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? 'x' : 'menu'} size="sm" />
          <span>{open ? 'Cerrar' : 'Menú'}</span>
        </Pill>
        <div id={panelId} className={`ap-nav__panel ap-nav__panel--${menuPlacement}`} hidden={!open}>
          <ul>
            {[...items, ...actions].map((item) => (
              <li key={item.label}>
                <a
                  className={['ap-nav__item', 'body', item.current && 'is-current'].filter(Boolean).join(' ')}
                  href={item.href}
                  aria-current={item.current ? 'page' : undefined}
                  onClick={(e) => { setOpen(false); if (onNavigate && item.href.charAt(0) === '#') onNavigate(e, item.href); }}
                  {...extProps(item)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}
