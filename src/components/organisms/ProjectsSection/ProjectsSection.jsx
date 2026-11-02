import { ProjectTile } from '../../molecules/ProjectTile';

// Proyectos: galería de dos columnas (una bajo 720px) con portadas a sangre en el color de cada app; si el último
// proyecto queda solo en su fila, se centra.
export function ProjectsSection({ id, title, count, items }) {
  const [first, second] = title;
  return (
    <section id={id} className="ap-section ap-section--continued ap-gal-wrap">
      <header className="ap-gal-head">
        <h2 className="ap-gal-title display">{first} <span>{second}</span></h2>
        <p className="ap-gal-count meta">{count}</p>
      </header>
      <div className="ap-gal">
        {items.map((item) => (
          <ProjectTile key={item.name} {...item} className="ap-reveal" />
        ))}
      </div>
    </section>
  );
}
