import { useRef } from 'react';
import { OfficeButton } from '../../atoms/OfficeButton';
import { OfficeAgentPanel } from '../../molecules/OfficeAgentPanel';
import { OfficeSwapCurtain } from '../../molecules/OfficeSwapCurtain';
import { useOffice } from '../../../hooks/useOffice';

// Escenario de la oficina 3D: lienzo, etiquetas, barra de vistas y agentes, pista y panel del agente.
// Arrastrar gira la maqueta; clic en un agente (o su botón) acerca la cámara y abre el panel.
// `theme` elige la oficina de la serie (y sus colores de UI, clase .ap-off--<serie>); `curtain` trae la cortina
// de cuadrados del cambio de serie (ver useOfficeSwap).
export function Office({ agents, views, viewsLabel, agentsLabel, hint, note, closeLabel, fallback, theme = 'original', curtain, className }) {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const labelsRef = useRef(null);
  const office = useOffice(stageRef, canvasRef, labelsRef, agents, theme);
  const active = agents.find((a) => a.id === office.active) || null;

  return (
    <div className={['ap-off', `ap-off--${theme}`, className].filter(Boolean).join(' ')}>
      <div className="ap-off__stage" ref={stageRef}>
        <div className="ap-off__canvas" ref={canvasRef}>
          {office.failed && <p className="ap-off__fallback body">{fallback}</p>}
        </div>
        <div className="ap-off__labels" ref={labelsRef} />
        <div className="ap-off__bar">
          <div className="ap-off__row" role="group" aria-label={viewsLabel}>
            {views.map((v) => (
              <OfficeButton key={v.id} pressed={office.mode === v.id} onClick={() => office.setMode(v.id)}>{v.label}</OfficeButton>
            ))}
          </div>
          <div className="ap-off__row" role="group" aria-label={agentsLabel}>
            {agents.map((a) => (
              <OfficeButton key={a.id} pressed={office.active === a.id} onClick={() => office.toggle(a.id)}>{a.name}</OfficeButton>
            ))}
          </div>
        </div>
        <p className={['ap-off__hint', 'label', active && 'is-hidden'].filter(Boolean).join(' ')}>{hint}</p>
        <OfficeAgentPanel agent={active} closeLabel={closeLabel} note={note} onClose={office.close} />
        {curtain && <OfficeSwapCurtain {...curtain} />}
      </div>
    </div>
  );
}
