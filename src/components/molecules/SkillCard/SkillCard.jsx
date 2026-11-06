import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../../atoms/Icon';
import { AgentLink } from '../../atoms/AgentLink';
import { useStackCard } from '../../../hooks/useStackReader';
import { officeHref } from '../../../lib/officeLink';

// Halo detrás del logo: el color de la marca al 22%.
const halo = (hex) => {
  const n = parseInt(String(hex || '#121212').replace('#', ''), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, 0.22)`;
};

// Ficha de una tecnología, al centro de la pantalla sobre un velo: categoría, logo a color flotando en 3D con stack
// (el mismo de la cinta, sin pufón ni libro: de pie, atento y siguiendo el cursor; salta de emoción al responder), qué logré con ella y en qué proyectos la usé. Stack responde las preguntas
// listas de `ask` en un hilo y "Seguir con stack en la oficina" abre la oficina con él elegido y la pregunta escrita.
// Va en <body> para quedar sobre la página. Al abrir, el foco va a "Cerrar".
export function SkillCard({ id, item, ask = [], open, n, texts, onClose }) {
  const closeRef = useRef(null);
  const glRef = useRef(null);
  const [asked, setAsked] = useState([]);
  useEffect(() => { if (open) closeRef.current?.focus({ preventScroll: true }); }, [open, n]);
  useEffect(() => { setAsked([]); }, [n]);
  useStackCard(glRef, open, asked.length);
  if (!item) return null;
  const pending = ask.map((x, i) => ({ ...x, i })).filter((x) => !asked.includes(x.i));
  return createPortal(
    <>
      <button type="button" className={['hab-veil', open && 'is-open'].filter(Boolean).join(' ')} onClick={onClose} tabIndex={-1} aria-hidden="true" />
      <aside
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label={texts.dialog(item.name)}
        aria-hidden={!open}
        inert={!open}
        className={['hab-pop', open && 'is-open'].filter(Boolean).join(' ')}
        style={{ '--hab-tint': halo(item.tint) }}
        data-lenis-prevent=""
      >
        <div className="hab-pop__top">
          <p className="hab-pop__eyebrow label">{item.cat}</p>
          <button type="button" ref={closeRef} className="hab-pop__close" aria-label={texts.close} onClick={onClose}><Icon name="x" size="md" /></button>
        </div>
        <div className="hab-pop__stage hab-pop__stage--agent">
          <span className="hab-pop__float">
            <img key={n} className="hab-pop__logo" src={`/habilidades/${item.logo}-color.webp`} alt={texts.alt(item.name)} width="480" height="480" />
          </span>
          <span className="hab-pop__shadow" aria-hidden="true" />
          <span ref={glRef} className="hab-pop__gl" aria-hidden="true"><span className="hab-rd__gl" data-rd-canvas="" /></span>
        </div>
        <h3 className="hab-pop__name heading">{item.name}</h3>
        <div className="hab-pop__thread" aria-live="polite">
          <p className="hab-pop__desc body">{item.desc}</p>
          {asked.map((i) => (
            <div key={i} className="hab-pop__qa">
              <p className="hab-pop__me body-sm">{ask[i].q}</p>
              <p className="hab-pop__say body-sm"><span className="hab-pop__who label">{texts.agent}</span>{ask[i].a}</p>
            </div>
          ))}
        </div>
        {item.projects.length > 0 && (
          <div className="hab-pop__projects">
            <p className="hab-pop__label label">{texts.usedIn}</p>
            <ul className="hab-pop__chips">
              {item.projects.map((p) => <li key={p} className="hab-pop__chip body-sm">{p}</li>)}
            </ul>
          </div>
        )}
        {pending.length > 0 && (
          <div className="hab-pop__ask">
            <p className="hab-pop__label label">{texts.askLabel}</p>
            <div className="hab-pop__pills">
              {pending.map((x) => (
                <button key={x.i} type="button" className="hab-pop__pill body-sm" onClick={() => setAsked((a) => a.concat(x.i))}>{x.q}</button>
              ))}
            </div>
          </div>
        )}
        <AgentLink agent="stack" className="hab-pop__btn" href={officeHref(texts.office, texts.agent, texts.draft(item.name))}>
          {texts.toOffice}
        </AgentLink>
      </aside>
    </>,
    document.body
  );
}
