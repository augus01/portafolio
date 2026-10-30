// Sobre mí: frase de impacto (un tramo en gris) y tres párrafos desplazados a la derecha bajo ella.
export function AboutSection({ id, statement, paragraphs }) {
  return (
    <section id={id} className="ap-section ap-about">
      <h2 className="display ap-about__statement ap-reveal">
        {statement.map(({ text, muted }) => (muted ? <span key={text} className="ap-about__muted">{text}</span> : text))}
      </h2>
      <div className="ap-about__body">
        <div className="ap-about__text ap-reveal">
          {paragraphs.map((text) => <p key={text} className="lead">{text}</p>)}
        </div>
      </div>
    </section>
  );
}
