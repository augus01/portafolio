import { InfoCard } from '../../molecules/InfoCard';
import { SectionHeadline } from '../SectionHeadline';

// Proyectos: encabezado y grilla de cards.
export function ProjectsSection({ id, headline, items }) {
  return (
    <section id={id} className="ap-section ap-section--continued">
      <SectionHeadline {...headline} className="ap-reveal" />
      <div className="ap-cards">
        {items.map((item) => (
          <InfoCard key={item.title} label={item.label} title={item.title} className="ap-reveal">
            {item.text}
          </InfoCard>
        ))}
      </div>
    </section>
  );
}
