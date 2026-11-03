import { createPortal } from 'react-dom';

// Tres franjas a pantalla completa con los colores de los agentes (recepción, arquitecto, stack).
// `phase`: 'idle' oculto, 'in' tapan la pantalla, 'out' siguen hacia arriba. Va en <body> para que ningún
// transform de la página lo saque de la pantalla.
export function PageWipe({ phase = 'idle' }) {
  const cls = ['ap-wipe', phase !== 'idle' && 'is-live', phase === 'in' && 'ap-wipe--in', phase === 'out' && 'ap-wipe--out'].filter(Boolean).join(' ');
  return createPortal(
    <div className={cls} aria-hidden="true">
      <span className="ap-wipe__band" />
      <span className="ap-wipe__band" />
      <span className="ap-wipe__band" />
    </div>,
    document.body
  );
}
