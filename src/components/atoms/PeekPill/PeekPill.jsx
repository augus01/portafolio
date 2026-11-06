import { Pill } from '../Pill';

// Píldora de la nav con recepción asomada por detrás (Contacto). La cabeza 3D se dibuja en el lienzo `[data-pk-gl]`
// (hooks/useAgentsOnSite.js, useReceptionPeek); una ventana recortada termina en el borde superior de la barra, así
// solo asoma hasta los ojos. Decorativa: el enlace se lee por su texto.
export function PeekPill({ href, current, onClick, className, children }) {
  return (
    <a className={['ap-pk', className].filter(Boolean).join(' ')} href={href} onClick={onClick} aria-current={current ? 'page' : undefined}>
      <span className="ap-pk__peek" aria-hidden="true"><canvas className="ap-pk__head" data-pk-gl="" /></span>
      <Pill as="span" current={current} aria-current={undefined} className="ap-pk__pill">{children}</Pill>
    </a>
  );
}
