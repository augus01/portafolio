import { forwardRef } from 'react';
import { AgentFigure } from '../../atoms/AgentFigure';

// Tarjeta de un agente en "¿Con quién quieres hablar?": su figura, nombre y qué sabe. Cerrada muestra dos preguntas
// listas y "Hablar con …"; abierta (con quien conversas) lleva la marca "Conversando" y, como `children`, el hilo y la
// caja para escribir.
export const OfficeAgentCard = forwardRef(function OfficeAgentCard({ agent, open, texts, onAsk, onTalk, children }, ref) {
  return (
    // Cerrada, toda la tarjeta elige al agente (el botón "Hablar con …" sigue siendo el control para teclado).
    <article
      className={['ap-ofc', `ap-ofc--${agent.id}`, open ? 'is-open' : 'is-pickable'].join(' ')}
      aria-label={agent.name}
      onClick={open ? undefined : (e) => { if (!e.target.closest('button')) onTalk(); }}
    >
      <div className="ap-ofc__head">
        <AgentFigure agent={agent.id} className="ap-ofc__av" />
        <div className="ap-ofc__name">
          <p className="ap-ofc__who subheading">{agent.name}</p>
          <p className="ap-ofc__blurb body-sm">{agent.card.blurb}</p>
        </div>
        {open && <span className="ap-ofc__state label">{texts.talking}</span>}
      </div>
      {open ? children : (
        <>
          <ul className="ap-ofc__qs">
            {agent.card.questions.map((q) => (
              <li key={q}><button type="button" className="ap-ofc__q body-sm" onClick={() => onAsk(q)}>{q}</button></li>
            ))}
          </ul>
          <button type="button" ref={ref} className="ap-ofc__go label" onClick={onTalk}>{texts.talkTo(agent.name)}</button>
        </>
      )}
    </article>
  );
});
