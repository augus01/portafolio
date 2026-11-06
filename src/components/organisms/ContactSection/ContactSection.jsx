import { useEffect, useRef } from 'react';
import { Icon } from '../../atoms/Icon';
import { PageWipe } from '../../atoms/PageWipe';
import { SectionHeadline } from '../SectionHeadline';
import { useContactDesk } from '../../../hooks/useContactDesk';
import { usePageWipe } from '../../../hooks/usePageWipe';

// Contacto: en vez de formulario, el agente amarillo de recepción en su escritorio 3D.
// "Pasa a la oficina" es la pista visible de la función creativa: recepción dice "¡Sígueme!", salta tres veces y te lleva
// a /oficina/. Tres clics seguidos sobre recepción hacen lo mismo.
export function ContactSection({ id, headline, enter, meta, hint, desk }) {
  const stageRef = useRef(null);
  const wipe = usePageWipe();
  const goingRef = useRef(false);
  const go = () => {
    if (goingRef.current) return;
    goingRef.current = true;
    const d = deskRef.current;
    if (!d) { wipe.leave(enter.href); return; }
    d.say(desk.follow, 3, true);
    d.lead(() => wipe.leave(enter.href));
  };
  const deskRef = useContactDesk(stageRef, desk.lines, { onTriple: go, tickles: desk.tickles, ding: desk.ding, elsewhere: desk.elsewhere });
  // Al volver con "Atrás" el navegador puede restaurar la página tal cual: se suelta el seguro para poder entrar otra vez.
  useEffect(() => {
    const reset = () => { goingRef.current = false; };
    window.addEventListener('pageshow', reset);
    return () => window.removeEventListener('pageshow', reset);
  }, []);
  // Al llegar desde la píldora Contacto de la nav (recepción se agachó allá), salta y saluda desde su escritorio.
  useEffect(() => {
    const greet = () => { const d = deskRef.current; if (d) { d.hop(true); d.say(desk.greet, 2.4); } };
    window.addEventListener('ap:recepcion-saluda', greet);
    return () => window.removeEventListener('ap:recepcion-saluda', greet);
  }, [deskRef, desk.greet]);

  const onEnter = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    go();
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
