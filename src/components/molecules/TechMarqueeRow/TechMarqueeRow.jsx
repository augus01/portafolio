import { useRef } from 'react';
import { useInView } from '../../../hooks/useInView';

// Una fila de la cinta de tecnologías. Los logos van dos veces: la pista avanza la mitad de su ancho y vuelve a
// empezar sin salto. La copia queda oculta para lectores de pantalla (y para la vista sin movimiento).
// Fuera de pantalla la pista se pausa para no gastar cuadros en algo que no se ve.
export function TechMarqueeRow({ items, label, variant = 'a' }) {
  const rowRef = useRef(null);
  const inView = useInView(rowRef);
  const renderItem = (item, copy) => (
    <li key={`${copy ? 'copia-' : ''}${item.logo}`} className="hab-mq__item" aria-hidden={copy || undefined}>
      <img src={`/habilidades/${item.logo}.webp`} alt="" width="128" height="128" loading="lazy" decoding="async" className="hab-mq__logo" />
      <span className="hab-mq__name body-sm">{item.name}</span>
    </li>
  );
  return (
    <div ref={rowRef} className={inView ? 'hab-mq__row' : 'hab-mq__row is-paused'} role="group" aria-label={label}>
      <ul className={`hab-mq__track hab-mq__track--${variant}`}>
        {items.map((item) => renderItem(item, false))}
        {items.map((item) => renderItem(item, true))}
      </ul>
    </div>
  );
}
