import { useState } from 'react';
import { Button } from '../../atoms/Button';
import { TechMarqueeRow } from '../../molecules/TechMarqueeRow';

// Superpoderes: "Con qué construyo" (artefacto "Hero"). Encabezado con la tipografía de Sobre mí y una cinta de
// logos 3D en dos filas a velocidades distintas. Un botón pausa y reanuda la cinta (teclado y toque; WCAG 2.2.2);
// el cursor sobre una fila también la detiene. Sin movimiento (prefers-reduced-motion) se ve como grilla y el botón se oculta.
export function SkillsSection({ id, title, lead, controlHint, pauseLabel, resumeLabel, rows }) {
  const [first, second] = title;
  const [paused, setPaused] = useState(false);
  return (
    <section id={id} className="hab-mq" aria-labelledby={`${id}-titulo`} data-paused={paused}>
      <div className="hab-mq__head ap-reveal">
        <div className="hab-mq__intro">
          <h2 id={`${id}-titulo`} className="hab-mq__title display">{first} <span>{second}</span></h2>
          <p className="hab-mq__lead lead">
            {lead}
            {controlHint && <span className="hab-mq__hint"> {controlHint}</span>}
          </p>
          <Button className="hab-mq__control" onClick={() => setPaused((p) => !p)} aria-controls={`${id}-cinta`}>
            {paused ? resumeLabel : pauseLabel}
          </Button>
        </div>
      </div>
      <div id={`${id}-cinta`} className="hab-mq__rows">
        {rows.map((items, i) => (
          <TechMarqueeRow key={i} items={items} label={`Tecnologías, fila ${i + 1}`} variant={i % 2 ? 'b' : 'a'} />
        ))}
      </div>
    </section>
  );
}
