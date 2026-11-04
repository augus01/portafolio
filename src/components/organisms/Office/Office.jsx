import { useEffect, useId, useMemo, useRef } from 'react';
import { OfficeThemeSwitch } from '../../molecules/OfficeThemeSwitch';
import { OfficeChatHistory } from '../../molecules/OfficeChatHistory';
import { OfficeSwapCover } from '../../molecules/OfficeSwapCover';
import { OfficeChatDock } from '../OfficeChatDock';
import { useOfficeScene } from '../../../hooks/useOfficeScene';
import { useOfficeChat } from '../../../hooks/useOfficeChat';

// Maqueta 3D de la oficina con la conversación encima: el selector de serie arriba, dentro del escenario, globos sobre
// el agente que habla (la cámara se le acerca y solo entonces se ve su globo; Esc vuelve a la vista general), caja para escribir abajo e historial plegable. El cambio de oficina
// (`swap`) la tapa con cuadrados. Arrastrar gira la maqueta; clic en un agente lo elige para hablarle directo.
export function Office({ stageRef, themeId, themes, swap, swapLabel, swapTarget, stage, chat: texts, agents, leadEmail, className }) {
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

  // Esc saca el zoom del agente que habla (y su globo) y vuelve a la vista general.
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') scene.unfocus(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [scene.unfocus]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={['ap-off', `ap-off--${themeId}`, className].filter(Boolean).join(' ')}>
      <div className="ap-off__stage" ref={stageRef}>
        <div className="ap-off__canvas" ref={canvasRef}>
          {scene.failed && <p className="ap-off__fallback body">{stage.fallback}</p>}
        </div>
        <div className="ap-off__labels" ref={labelsRef} />
        <OfficeThemeSwitch
          inStage
          label={themes.label}
          nowLabel={themes.nowLabel}
          items={themes.items}
          current={swap.current}
          target={swap.target}
          busy={swap.busy}
          onPick={swap.go}
        />
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
