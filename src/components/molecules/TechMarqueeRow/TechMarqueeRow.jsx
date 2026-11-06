import { useRef } from 'react';
import { useInView } from '../../../hooks/useInView';
import { StackReader } from '../../atoms/StackReader';

// Una fila de la cinta de tecnologías. `slots` es un período (logos y el puesto de stack leyendo, lib/techMarquee.js);
// la pista lo lleva dos veces y avanza la mitad de su ancho para volver a empezar sin salto. Los logos repetidos y la
// segunda copia quedan ocultos para lectores de pantalla y fuera del orden de Tab.
// Cada logo es un botón: al pasar gira a su versión a color; al hacer clic abre su ficha (`onPick`).
// La pista se detiene con el cursor encima, con una ficha abierta (`paused`) y fuera de pantalla.
export function TechMarqueeRow({ slots, label, variant = 'a', activeId, paused, onPick, openLabel, controls, reader }) {
  const rowRef = useRef(null);
  const inView = useInView(rowRef);
  const renderSlot = (slot, i, second) => {
    const key = `${second ? 'b' : 'a'}-${i}`;
    if (slot.reader) {
      return (
        <li key={key} className="hab-mq__item hab-mq__item--rd" aria-hidden="true">
          <StackReader scare={reader?.scare} />
        </li>
      );
    }
    const { item } = slot;
    const copy = second || slot.copy;
    const active = activeId === item.logo;
    return (
      <li key={key} className="hab-mq__item" aria-hidden={copy || undefined}>
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
        {slots.map((slot, i) => renderSlot(slot, i, false))}
        {slots.map((slot, i) => renderSlot(slot, i, true))}
      </ul>
    </div>
  );
}
