import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from '../../atoms/Icon';
import { Pill } from '../../atoms/Pill';

// Navegación en píldoras flotantes; en contenedores de menos de 600px se pliega en un botón de menú.
export function NavBar({ items, actions = [], tone = 'light', menuPlacement = 'down', label = 'Principal', className }) {
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

  const pill = (item) => (
    <li key={item.label}>
      <Pill href={item.href} current={item.current}>{item.label}</Pill>
    </li>
  );

  return (
    <div ref={rootRef} className={['ap-nav', `ap-nav--${tone}`, className].filter(Boolean).join(' ')}>
      <nav aria-label={label} className="ap-nav__bar">
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
                  onClick={() => setOpen(false)}
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
