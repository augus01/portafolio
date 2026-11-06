// Otros proyectos: cada uno con su nombre gigante y una banda en su color con solo su logo, empezando por el
// siguiente; debajo, la vuelta a la galería.
export function CaseNext({ labels, others }) {
  return (
    <section className="ap-case-next" aria-label={labels.label}>
      <span className="ap-case-mono ap-case-next__label">{labels.label}</span>
      <ul className="ap-case-next__list">
        {others.map((o) => (
          <li key={o.href}>
            <a className="ap-case-next__link" href={o.href} style={{ '--case-next': o.color }}>
              <span className="ap-case-next__title">{o.name}</span>
              <span className={`ap-case-next__thumb ap-case-next__thumb--${o.logo.image ? 'word' : 'symbol'}`}>
                <img src={o.logo.symbol || o.logo.image} alt="" loading="lazy" decoding="async" />
              </span>
            </a>
          </li>
        ))}
      </ul>
      <div><a className="ap-case-all" href={labels.allHref}>{labels.all}</a></div>
    </section>
  );
}
