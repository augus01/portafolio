import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../../atoms/Icon';
import { AgentLink } from '../../atoms/AgentLink';
import { useAgentCard } from '../../../hooks/useAgentsOnSite';
import { officeHref } from '../../../lib/officeLink';

// Plano de un proyecto, al centro sobre un velo: lo abre arquitecto desde la portada. Las piezas de `plan.chain` van en
// línea y las de `plan.legs` se reparten debajo; al tocar una, arquitecto (3D, de cuerpo entero) la explica en su globo.
// "Seguir con arquitecto en la oficina" abre la oficina con él elegido y `plan.ask` ya escrita. Esc, el velo o "Cerrar"
// lo cierran (el foco vuelve a la portada, desde ProjectsSection).
export function ArchitectPlan({ id, project, open, texts, onClose }) {
  const closeRef = useRef(null);
  const glRef = useRef(null);
  const plan = project?.plan;
  const [piece, setPiece] = useState(plan?.def);
  useEffect(() => { if (open) { setPiece(plan?.def); closeRef.current?.focus({ preventScroll: true }); } }, [open, plan]);
  useAgentCard(glRef, texts.agent, open, piece);
  if (!plan) return null;
  const all = plan.chain.concat(plan.legs);
  const cur = all.find((x) => x.id === piece) || all[0];
  const node = (x) => (
    <button key={x.id} type="button" className="arq-pl__node body" aria-pressed={x.id === cur.id} onClick={() => setPiece(x.id)}>
      {x.label}<small className="label">{x.sub}</small>
    </button>
  );
  return createPortal(
    <>
      <button type="button" className={['arq-veil', open && 'is-open'].filter(Boolean).join(' ')} onClick={onClose} tabIndex={-1} aria-hidden="true" />
      <aside
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label={texts.dialog(project.name)}
        aria-hidden={!open}
        inert={!open}
        className={['arq-pop', open && 'is-open'].filter(Boolean).join(' ')}
        data-lenis-prevent=""
      >
        <div className="arq-pop__top">
          <div>
            <p className="arq-pop__k label">{texts.eyebrow(project.name)}</p>
            <p className="arq-pop__title subheading">{texts.title}</p>
          </div>
          <button type="button" ref={closeRef} className="arq-pop__close" aria-label={texts.close} onClick={onClose}><Icon name="x" size="md" /></button>
        </div>
        <div className="arq-pl">
          {plan.chain.map((x, i) => (
            <div key={x.id} className="arq-pl__step">
              {node(x)}
              {(i < plan.chain.length - 1 || plan.legs.length > 0) && <span className="arq-pl__v" aria-hidden="true" />}
            </div>
          ))}
          {plan.legs.length > 0 && (
            <div className="arq-pl__split" style={{ '--legs': plan.legs.length }}>
              {plan.legs.map((x) => <div key={x.id} className="arq-pl__leg">{node(x)}</div>)}
            </div>
          )}
        </div>
        <div className="arq-pop__say">
          <div className="arq-pop__fig"><canvas ref={glRef} className="arq-pop__gl" role="img" aria-label={texts.figure} /></div>
          <p className="arq-pop__bubble body" role="status"><span className="arq-pop__who label">{texts.agent} · {cur.label}</span>{cur.text}</p>
        </div>
        <AgentLink agent="arquitecto" className="arq-pop__more" href={officeHref(texts.office, texts.agent, plan.ask)}>
          {texts.toOffice}
        </AgentLink>
      </aside>
    </>,
    document.body
  );
}
