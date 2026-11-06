import { useEffect, useRef } from 'react';
import { Icon } from '../../atoms/Icon';
import { OfficeLeadCard } from '../../molecules/OfficeLeadCard';
import { OfficeAgentCard } from '../../molecules/OfficeAgentCard';

// Conversación al pie de la maqueta (artefacto "Chat B · Elige con quién hablar"): en la vista general, "¿Con quién
// quieres hablar?" y las tarjetas de los tres agentes; al elegir uno, la cámara se le acerca y queda solo su tarjeta. La de quien conversas (al entrar, recepción) se abre con el hilo, la ficha del recado,
// los chips y la caja para escribir; las otras ofrecen dos preguntas listas y "Hablar con …".
export function OfficeChatDock({ chat, texts, agents, leadNote, historyId }) {
  const inputId = `${historyId}-in`;
  const goRefs = useRef({});
  const rootRef = useRef(null);
  // El hilo baja solo al último mensaje.
  useEffect(() => {
    const th = rootRef.current?.querySelector('.ap-ofc__thread');
    if (th) th.scrollTop = th.scrollHeight;
  }, [chat.msgs.length, chat.typing, chat.active, chat.histOpen]);
  const list = Object.values(agents);
  // Historial de cada agente: lo que le dijiste a él y lo que respondió él. Oculto hasta tocar "Historial".
  const threadOf = (id) => chat.msgs.filter((m) => (m.who === 'visitor' ? m.to === id : m.who === id));
  // Vista cercana: solo la tarjeta del agente con quien conversas. "Cambiar de agente" vuelve a la vista general con las
  // tres tarjetas y deja el foco en "Hablar con …" del siguiente.
  const near = !!chat.focus;
  // Vista general: las tres tarjetas iguales, sin ninguna abierta, con recepción al medio.
  const order = ['arquitecto', 'recepcion', 'stack'];
  const sorted = [...list].sort((x, y) => order.indexOf(x.id) - order.indexOf(y.id));
  const shown = near ? list.filter((a) => a.id === chat.active) : sorted;
  const changeAgent = () => {
    const other = list.find((a) => a.id !== chat.active);
    chat.unfocus();
    requestAnimationFrame(() => goRefs.current[other.id]?.focus());
  };
  return (
    <section className={['ap-ofd', near && 'is-near'].filter(Boolean).join(' ')} ref={rootRef} aria-label={texts.regionLabel}>
      {!near && (
        <div className="ap-ofd__ask">
          <h2 className="ap-ofd__title subheading">{texts.pick.title}</h2>
          <p className="ap-ofd__lead body-sm">{texts.pick.lead}</p>
        </div>
      )}
      <div className="ap-ofd__cards">
        {shown.map((a) => (
          <OfficeAgentCard
            key={a.id}
            ref={(el) => { goRefs.current[a.id] = el; }}
            agent={a}
            open={near && a.id === chat.active}
            texts={texts.pick}
            onAsk={(q) => chat.ask(a.id, q)}
            onTalk={() => chat.setTo(a.id)}
          >
            {chat.histOpen && (
              <div className="ap-ofc__thread" id={historyId} aria-label={texts.pick.thread(a.name)}>
                {threadOf(a.id).map((m) => (
                  <p key={m.id} className={['ap-ofc__msg', 'body-sm', m.who === 'visitor' ? 'is-me' : `is-${m.who}`].join(' ')}>{m.text}</p>
                ))}
              </div>
            )}
            {chat.typing && <p className="ap-ofd__status label">{chat.typingText}</p>}
            {chat.card && (
              <OfficeLeadCard card={chat.card} labels={{ ...texts.lead.card, send: texts.lead.send, fix: texts.lead.fix }} note={leadNote} onSend={chat.leadSend} onFix={chat.leadFix} />
            )}
            {chat.chips.length > 0 && (
              <div className="ap-ofd__chips" role="group" aria-label={chat.chipsLabel}>
                {chat.chips.map((c) => <button key={c.label} type="button" className="ap-ofd__chip body-sm" onClick={c.pick}>{c.label}</button>)}
              </div>
            )}
            <form className="ap-ofd__form" onSubmit={(e) => { e.preventDefault(); chat.submit(); }}>
              <label htmlFor={inputId} className="ap-sr">{texts.pick.input(a.name)}</label>
              <input
                id={inputId}
                className="ap-ofd__in body"
                type="text"
                value={chat.draft}
                onChange={(e) => chat.setDraft(e.target.value)}
                placeholder={chat.placeholder}
                autoComplete="off"
                maxLength={400}
              />
              <button type="submit" className="ap-ofd__send" aria-label={texts.sendLabel}><Icon name="arrow-right" size="md" /></button>
            </form>
            <div className="ap-ofc__foot">
              <button type="button" className="ap-ofc__more label" onClick={changeAgent}>{texts.pick.change}</button>
              <button type="button" className="ap-ofd__hist label" aria-expanded={chat.histOpen} aria-controls={historyId} aria-label={texts.historyAria} onClick={chat.toggleHist}>
                <Icon name="list" size="sm" />
                <span className="ap-ofd__histtxt">{texts.historyLabel}</span>
                <span>{threadOf(a.id).length}</span>
              </button>
            </div>
          </OfficeAgentCard>
        ))}
      </div>
    </section>
  );
}
