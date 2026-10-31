import { Icon } from '../../atoms/Icon';
import { OfficeButton } from '../../atoms/OfficeButton';

// Panel del agente abierto: sección, nombre, qué hace y las preguntas que responde. Cerrado queda fuera de pantalla e inerte.
export function OfficeAgentPanel({ agent, closeLabel, note, onClose }) {
  const open = !!agent;
  return (
    <div className={['ap-off__panel', open && 'is-open'].filter(Boolean).join(' ')} aria-live="polite" aria-hidden={!open} inert={!open}>
      <div className="ap-off__ptop">
        <div>
          <p className="ap-off__eyebrow label">{agent?.section}</p>
          <h4 className="ap-off__pname heading">{agent?.name}</h4>
        </div>
        <OfficeButton className="ap-off__close" aria-label={closeLabel} onClick={onClose}>
          <Icon name="x" size="md" />
        </OfficeButton>
      </div>
      <p className="ap-off__prole body">{agent?.role}</p>
      <ul className="ap-off__q">
        {agent?.questions.map((q) => <li key={q} className="body-sm">{q}</li>)}
      </ul>
      <p className="ap-off__note label">{note}</p>
    </div>
  );
}
