import { TechMarqueeRow } from '../../molecules/TechMarqueeRow';

// Superpoderes: "Con qué construyo" (artefacto "Hero"). Encabezado con la tipografía de Sobre mí y una cinta de
// logos 3D en dos filas a velocidades distintas; el cursor detiene la fila y sin movimiento se ve como grilla.
export function SkillsSection({ id, title, lead, rows }) {
  const [first, second] = title;
  return (
    <section id={id} className="hab-mq" aria-labelledby={`${id}-titulo`}>
      <div className="hab-mq__head ap-reveal">
        <div className="hab-mq__intro">
          <h2 id={`${id}-titulo`} className="hab-mq__title display">{first} <span>{second}</span></h2>
          <p className="hab-mq__lead lead">{lead}</p>
        </div>
      </div>
      <div className="hab-mq__rows">
        {rows.map((items, i) => (
          <TechMarqueeRow key={i} items={items} label={`Tecnologías, fila ${i + 1}`} variant={i % 2 ? 'b' : 'a'} />
        ))}
      </div>
    </section>
  );
}
