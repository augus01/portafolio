import { InfoCard } from '../../molecules/InfoCard';

// Sobre mí: frase de impacto (un tramo en gris), ficha con los datos clave para escanear rápido y tres
// párrafos desplazados a la derecha.
export function AboutSection({ id, statement, summaryLabel, summary, paragraphs }) {
  return (
    <section id={id} className="ap-section ap-about">
      <h2 className="display ap-about__statement ap-reveal">
        {statement.map(({ text, muted }) => (muted ? <span key={text} className="ap-about__muted">{text}</span> : text))}
      </h2>
      {summary && <InfoCard className="ap-reveal" label={summaryLabel} items={summary} />}
      <div className="ap-about__body">
        <div className="ap-about__text ap-reveal">
          {paragraphs.map((text) => <p key={text} className="lead">{text}</p>)}
        </div>
      </div>
    </section>
  );
}
