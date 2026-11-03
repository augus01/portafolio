import { useRef } from 'react';
import { Icon } from '../../atoms/Icon';
import { PageWipe } from '../../atoms/PageWipe';
import { SectionHeadline } from '../SectionHeadline';
import { useContactDesk } from '../../../hooks/useContactDesk';
import { usePageWipe } from '../../../hooks/usePageWipe';

// Contacto: en vez de formulario, el agente amarillo de recepción en su escritorio 3D.
// "Pasa a la oficina" es la pista visible de la función creativa: recepción salta, dice "¡Sígueme!" y te lleva a /oficina/.
export function ContactSection({ id, headline, enter, meta, hint, desk }) {
  const stageRef = useRef(null);
  const deskRef = useContactDesk(stageRef, desk.lines);
  const wipe = usePageWipe();

  const onEnter = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    const d = deskRef.current;
    const greet = !!d && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (greet) { d.hop(true); d.say(desk.follow, 2); }
    wipe.leave(enter.href, greet ? 380 : 0);
  };

  return (
    <section id={id} className="ap-section ap-section--continued ap-ct">
      <div className="ap-ct__grid">
        <div className="ap-ct__text ap-reveal">
          <SectionHeadline {...headline} />
          <a className="ap-ct__enter label" href={enter.href} onClick={onEnter}>
            {enter.label}
            <Icon name="arrow-right" size="md" />
          </a>
          <p className="ap-ct__meta body-sm">{meta}</p>
        </div>
        <div className="ap-ct__stage ap-reveal" ref={stageRef}>
          <div className="ap-ct__canvas" data-desk-canvas="" aria-hidden="true" />
          <div className="ap-ct__bubble label" data-desk-bubble="" aria-hidden="true" />
          <p className="ap-ct__hint label" aria-hidden="true">{hint}</p>
        </div>
      </div>
      <PageWipe phase={wipe.phase} />
    </section>
  );
}
