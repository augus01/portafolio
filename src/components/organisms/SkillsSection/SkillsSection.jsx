import { useId, useRef } from 'react';
import { TechMarqueeRow } from '../../molecules/TechMarqueeRow';
import { SkillCard } from '../../molecules/SkillCard';
import { useSkillPicker } from '../../../hooks/useSkillPicker';

// Superpoderes: "Con qué construyo" (artefacto "Hero · Augusto Pinto"). Encabezado con la tipografía de Sobre mí y
// una cinta de logos 3D en dos filas a velocidades distintas; sin movimiento se ve como grilla.
// Clic en un logo: se abre su ficha y la cinta se detiene hasta cerrarla.
export function SkillsSection({ id, title, eyebrow, lead, rows, card }) {
  const [first, second] = title;
  const sectionRef = useRef(null);
  const cardId = useId();
  const picker = useSkillPicker(sectionRef);
  const shown = rows.flat().find((s) => s.logo === picker.shown) || null;
  return (
    <section id={id} ref={sectionRef} className="hab-mq" aria-labelledby={`${id}-titulo`}>
      <div className="hab-mq__head ap-reveal">
        <div className="hab-mq__intro">
          {eyebrow && <p className="hab-mq__eyebrow label">{eyebrow}</p>}
          <h2 id={`${id}-titulo`} className="hab-mq__title display">{first} <span>{second}</span></h2>
          <p className="hab-mq__lead lead">{lead}</p>
        </div>
      </div>
      <div className="hab-mq__rows">
        {rows.map((items, i) => (
          <TechMarqueeRow
            key={i}
            items={items}
            label={`Tecnologías, fila ${i + 1}`}
            variant={i % 2 ? 'b' : 'a'}
            activeId={picker.open}
            paused={!!picker.open}
            onPick={picker.pick}
            openLabel={card.open}
            controls={cardId}
          />
        ))}
      </div>
      <SkillCard id={cardId} item={shown} open={!!picker.open} n={picker.n} texts={card} onClose={picker.close} />
    </section>
  );
}
