import { useId, useMemo, useRef } from 'react';
import { TechMarqueeRow } from '../../molecules/TechMarqueeRow';
import { SkillCard } from '../../molecules/SkillCard';
import { useSkillPicker } from '../../../hooks/useSkillPicker';
import { useViewportWidth } from '../../../hooks/useViewportWidth';
import { createCheer, marqueePeriod } from '../../../lib/techMarquee';

// Superpoderes: "Con qué construyo" (artefacto "Hero · Augusto Pinto"). Encabezado con la tipografía de Sobre mí y
// una cinta de logos 3D en dos filas a velocidades distintas; sin movimiento se ve como grilla.
// Clic en un logo: se abre su ficha (con stack y sus preguntas listas de `ask`) y la cinta se detiene hasta cerrarla.
// En cada fila va stack sentado leyendo (`reader`); en la de arriba justo antes de `reader.before` y en la de abajo a
// media vuelta, así se turnan.
export function SkillsSection({ id, title, eyebrow, lead, rows, card, ask = {}, reader, rowLabel = (n) => `Tecnologías, fila ${n}` }) {
  const [first, second] = title;
  const sectionRef = useRef(null);
  const cardId = useId();
  const picker = useSkillPicker(sectionRef);
  const shown = rows.flat().find((s) => s.logo === picker.shown) || null;
  const vw = useViewportWidth();
  // Un solo aviso para la sección: al pasar por cualquier logo saltan todos los stack que estén a la vista.
  const cheer = useMemo(() => createCheer(), []);
  const stackReader = useMemo(() => (reader ? { ...reader, cheer } : null), [reader, cheer]);
  const periods = useMemo(() => rows.map((items, i) => marqueePeriod(items, i, vw, reader?.before)), [rows, vw, reader]);
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
        {periods.map((slots, i) => (
          <TechMarqueeRow
            key={i}
            slots={slots}
            reader={stackReader}
            label={rowLabel(i + 1)}
            variant={i % 2 ? 'b' : 'a'}
            activeId={picker.open}
            paused={!!picker.open}
            onPick={picker.pick}
            openLabel={card.open}
            controls={cardId}
          />
        ))}
      </div>
      <SkillCard id={cardId} item={shown} ask={(shown && ask[shown.logo]) || []} open={!!picker.open} n={picker.n} texts={card} onClose={picker.close} />
    </section>
  );
}
