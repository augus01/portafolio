import { SectionHeadline } from '../SectionHeadline';

// Contacto: por ahora solo el encabezado, como en el artefacto aprobado.
export function ContactSection({ id, headline }) {
  return (
    <section id={id} className="ap-section ap-section--continued ap-section--tight">
      <SectionHeadline {...headline} className="ap-reveal" />
    </section>
  );
}
