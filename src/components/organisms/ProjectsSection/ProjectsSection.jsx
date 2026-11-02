import { ProjectTile } from '../../molecules/ProjectTile';

// Proyectos: galería de dos columnas (una bajo 720px) con el logo de cada proyecto sobre blanco.
export function ProjectsSection({ id, title, count, items }) {
  const [first, second] = title;
  return (
    <section id={id} className="ap-section ap-section--continued ap-gal-wrap">
      <header className="ap-gal-head">
        <h2 className="ap-gal-title hero">{first} <span>{second}</span></h2>
        <p className="ap-gal-count label">{count}</p>
      </header>
      <div className="ap-gal">
        {items.map((item, i) => (
          <ProjectTile key={item.name} index={String(i + 1).padStart(2, '0')} {...item} className="ap-reveal" />
        ))}
      </div>
    </section>
  );
}
