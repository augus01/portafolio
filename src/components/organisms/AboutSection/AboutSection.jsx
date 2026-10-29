import { SectionHeadline } from '../SectionHeadline';

// Sobre mí: encabezado y dos columnas de texto.
export function AboutSection({ id, headline, paragraphs }) {
  return (
    <section id={id} className="ap-section">
      <SectionHeadline {...headline} className="ap-reveal" />
      <div className="ap-columns ap-reveal">
        {paragraphs.map((text) => <p key={text} className="body">{text}</p>)}
      </div>
    </section>
  );
}
