import { Office } from '../Office';

// "Visita mi oficina": título y pista visible, y la maqueta 3D de los agentes debajo.
export function OfficeSection({ id, title, subtitle, office }) {
  return (
    <section id={id} className="ap-section ap-section--continued ap-office">
      <header className="ap-office__head ap-reveal">
        <h3 className="ap-office__title subheading">{title}</h3>
        <p className="ap-office__subtitle subheading">{subtitle}</p>
      </header>
      <Office {...office} className="ap-reveal" />
    </section>
  );
}
