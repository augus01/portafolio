import { useId, useMemo, useRef } from 'react';
import { OfficeButton } from '../../atoms/OfficeButton';
import { OfficeChatHistory } from '../../molecules/OfficeChatHistory';
import { OfficeSwapCover } from '../../molecules/OfficeSwapCover';
import { OfficeChatDock } from '../OfficeChatDock';
import { useOfficeScene } from '../../../hooks/useOfficeScene';
import { useOfficeChat } from '../../../hooks/useOfficeChat';

// Maqueta 3D de la oficina con la conversación encima: vistas y agentes arriba, globos sobre cada agente,
// caja para escribir abajo e historial plegable. El cambio de oficina (`swap`) la tapa con cuadrados.
// Arrastrar gira la maqueta; clic en un agente (o en su botón) lo elige para hablarle directo.
export function Office({ stageRef, themeId, swap, swapLabel, swapTarget, stage, chat: texts, agents, leadEmail, className }) {
  const canvasRef = useRef(null);
  const labelsRef = useRef(null);
  const historyId = useId();
  const agentList = useMemo(() => Object.values(agents), [agents]);
  const chatRef = useRef(null);
  const scene = useOfficeScene({
    stageRef, canvasRef, labelsRef, themeId, agents: agentList,
    onPick: (id) => chatRef.current?.setTo(id, true),
  });
  const chat = useOfficeChat({ chat: texts, agents, scene, leadEmail });
  chatRef.current = chat;

  return (
    <div className={['ap-off', `ap-off--${themeId}`, className].filter(Boolean).join(' ')}>
      <div className="ap-off__stage" ref={stageRef}>
        <div className="ap-off__canvas" ref={canvasRef}>
          {scene.failed && <p className="ap-off__fallback body">{stage.fallback}</p>}
        </div>
        <div className="ap-off__labels" ref={labelsRef} />
        <div className="ap-off__bar">
          <div className="ap-off__row ap-off__row--views" role="group" aria-label={stage.viewsLabel}>
            {stage.views.map((v) => (
              <OfficeButton key={v.id} pressed={scene.mode === v.id} onClick={() => scene.setMode(v.id)}>{v.label}</OfficeButton>
            ))}
          </div>
          <div className="ap-off__row" role="group" aria-label={stage.agentsLabel}>
            {agentList.map((a) => (
              <OfficeButton key={a.id} pressed={chat.to === a.id} onClick={() => chat.setTo(chat.to === a.id ? null : a.id)}>{a.name}</OfficeButton>
            ))}
          </div>
        </div>
        <OfficeChatDock chat={chat} texts={texts} historyId={historyId} leadNote={leadEmail ? texts.lead.noteMail : texts.lead.noteDraft} />
        <OfficeChatHistory
          id={historyId}
          open={chat.histOpen}
          title={texts.historyLabel}
          ariaLabel={texts.historyAria}
          closeLabel={texts.closeHistory}
          me={texts.me}
          msgs={chat.msgs}
          agents={agents}
          onClose={chat.toggleHist}
        />
        <p className="ap-sr" aria-live="polite">{chat.live}</p>
        <OfficeSwapCover swap={swap} label={swapLabel} target={swapTarget} />
      </div>
    </div>
  );
}
