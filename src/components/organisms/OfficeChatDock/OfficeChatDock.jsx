import { Icon } from '../../atoms/Icon';
import { OfficeLeadCard } from '../../molecules/OfficeLeadCard';

// Caja de la conversación al pie de la maqueta: estado, tu último mensaje, ficha del recado, chips y campo para escribir.
export function OfficeChatDock({ chat, texts, leadNote, historyId }) {
  const inputId = `${historyId}-in`;
  return (
    <div className="ap-ofd" role="region" aria-label={texts.regionLabel}>
      {chat.typing && <p className="ap-ofd__status label">{chat.typingText}</p>}
      {chat.lastMine && (
        <p className="ap-ofd__me body-sm"><span className="ap-ofd__melabel label">{texts.me}</span><span>{chat.lastMine}</span></p>
      )}
      {chat.card && (
        <OfficeLeadCard card={chat.card} labels={{ ...texts.lead.card, send: texts.lead.send, fix: texts.lead.fix }} note={leadNote} onSend={chat.leadSend} onFix={chat.leadFix} />
      )}
      {chat.chips.length > 0 && (
        <div className="ap-ofd__chips" role="group" aria-label={chat.chipsLabel}>
          {chat.chips.map((c) => <button key={c.label} type="button" className="ap-ofd__chip body-sm" onClick={c.pick}>{c.label}</button>)}
        </div>
      )}
      <form className="ap-ofd__form" onSubmit={(e) => { e.preventDefault(); chat.submit(); }}>
        <label htmlFor={inputId} className="ap-sr">{texts.inputLabel}</label>
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
        <button type="button" className="ap-ofd__hist label" aria-expanded={chat.histOpen} aria-controls={historyId} aria-label={texts.historyAria} onClick={chat.toggleHist}>
          <Icon name="list" size="sm" />
          <span className="ap-ofd__histtxt">{texts.historyLabel}</span>
          <span>{chat.msgs.length}</span>
        </button>
      </form>
    </div>
  );
}
