import { useEffect, useRef } from 'react';
import { Icon } from '../../atoms/Icon';
import { OfficeButton } from '../../atoms/OfficeButton';

// Historial plegable de la conversación: cada mensaje con el punto de color de quien habla. Baja solo al último.
export function OfficeChatHistory({ id, open, title, ariaLabel, closeLabel, me, msgs, agents, onClose }) {
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [msgs, open]);
  return (
    <aside id={id} className={['ap-ofh', open && 'is-open'].filter(Boolean).join(' ')} aria-label={ariaLabel} inert={!open} data-lenis-prevent="">
      <div className="ap-ofh__top">
        <p className="ap-ofh__title label">{title}</p>
        <OfficeButton className="ap-off__close" aria-label={closeLabel} onClick={onClose}><Icon name="x" size="md" /></OfficeButton>
      </div>
      <div className="ap-ofh__log" ref={logRef}>
        {msgs.map((m) => {
          const ag = agents[m.who];
          return (
            <div key={m.id} className="ap-ofh__msg">
              <span className="ap-ofh__who label">
                <span className={`ap-ofh__dot ap-ofh__dot--${ag ? m.who : 'visitor'}`} />
                {ag ? ag.name : me}
              </span>
              <p className="ap-ofh__text body-sm">{m.text}</p>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
