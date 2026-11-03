import { useRef } from 'react';
import { useInView } from '../../../hooks/useInView';

// Una fila de la cinta de tecnologías. Los logos van dos veces: la pista avanza la mitad de su ancho y vuelve a
// empezar sin salto. La copia queda oculta para lectores de pantalla y fuera del orden de Tab.
// Cada logo es un botón: al pasar gira a su versión a color; al hacer clic abre su ficha (`onPick`).
// La pista se detiene con el cursor encima, con una ficha abierta (`paused`) y fuera de pantalla.
export function TechMarqueeRow({ items, label, variant = 'a', activeId, paused, onPick, openLabel, controls }) {
  const rowRef = useRef(null);
  const inView = useInView(rowRef);
  const renderItem = (item, copy) => {
    const active = activeId === item.logo;
    return (
      <li key={`${copy ? 'copia-' : ''}${item.logo}`} className="hab-mq__item" aria-hidden={copy || undefined}>
        <button
          type="button"
          className={['hab-mq__btn', active && 'is-active'].filter(Boolean).join(' ')}
          tabIndex={copy ? -1 : undefined}
          aria-pressed={active}
          aria-controls={controls}
          aria-label={openLabel(item.name)}
          onClick={(e) => onPick(item.logo, e.currentTarget)}
        >
          <span className="hab-mq__pic">
            <img src={`/habilidades/${item.logo}.webp`} alt="" width="128" height="128" loading="lazy" decoding="async" className="hab-mq__logo" />
            <img src={`/habilidades/${item.logo}-color.webp`} alt="" width="128" height="128" loading="lazy" decoding="async" className="hab-mq__logo hab-mq__logo--color" />
          </span>
          <span className="hab-mq__name body-sm">{item.name}</span>
        </button>
      </li>
    );
  };
  return (
    <div ref={rowRef} className={inView && !paused ? 'hab-mq__row' : 'hab-mq__row is-paused'} role="group" aria-label={label}>
      <ul className={`hab-mq__track hab-mq__track--${variant}`}>
        {items.map((item) => renderItem(item, false))}
        {items.map((item) => renderItem(item, true))}
      </ul>
    </div>
  );
}
