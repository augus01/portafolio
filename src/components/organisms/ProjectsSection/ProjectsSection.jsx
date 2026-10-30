import { ProjectShowcase } from '../ProjectShowcase';

// Proyectos: sigue a Sobre mí sin encabezado propio; cada proyecto aparece al hacer scroll.
export function ProjectsSection({ id, items }) {
  return (
    <section id={id} className="ap-section ap-section--continued ap-projects">
      {items.map((item) => <ProjectShowcase key={item.name + item.description} {...item} className="ap-reveal" />)}
    </section>
  );
}
