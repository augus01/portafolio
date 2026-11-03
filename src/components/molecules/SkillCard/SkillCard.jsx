import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../../atoms/Icon';

// Halo detrás del logo: el color de la marca al 22%.
const halo = (hex) => {
  const n = parseInt(String(hex || '#121212').replace('#', ''), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, 0.22)`;
};

// Ficha de una tecnología, al centro de la pantalla sobre un velo: categoría, logo a color flotando en 3D,
// qué logré con ella y en qué proyectos la usé. Va en <body> para quedar sobre la página. Al abrir, el foco va a "Cerrar".
export function SkillCard({ id, item, open, n, texts, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => { if (open) closeRef.current?.focus({ preventScroll: true }); }, [open, n]);
  if (!item) return null;
  return createPortal(
    <>
      <button type="button" className={['hab-veil', open && 'is-open'].filter(Boolean).join(' ')} onClick={onClose} tabIndex={-1} aria-hidden="true" />
      <aside
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label={texts.dialog(item.name)}
        aria-hidden={!open}
        inert={!open}
        className={['hab-pop', open && 'is-open'].filter(Boolean).join(' ')}
        style={{ '--hab-tint': halo(item.tint) }}
        data-lenis-prevent=""
      >
        <div className="hab-pop__top">
          <p className="hab-pop__eyebrow label">{item.cat}</p>
          <button type="button" ref={closeRef} className="hab-pop__close" aria-label={texts.close} onClick={onClose}><Icon name="x" size="md" /></button>
        </div>
        <div className="hab-pop__stage">
          <span className="hab-pop__float">
            <img key={n} className="hab-pop__logo" src={`/habilidades/${item.logo}-color.webp`} alt={texts.alt(item.name)} width="480" height="480" />
          </span>
          <span className="hab-pop__shadow" aria-hidden="true" />
        </div>
        <h3 className="hab-pop__name heading">{item.name}</h3>
        <p className="hab-pop__desc body">{item.desc}</p>
        {item.projects.length > 0 && (
          <div className="hab-pop__projects">
            <p className="hab-pop__label label">{texts.usedIn}</p>
            <ul className="hab-pop__chips">
              {item.projects.map((p) => <li key={p} className="hab-pop__chip body-sm">{p}</li>)}
            </ul>
          </div>
        )}
      </aside>
    </>,
    document.body
  );
}
