import { CaseLockup } from '../../molecules/CaseLockup';

// Otros proyectos: lado a lado, cada uno con su nombre grande y una banda en su color de marca con su logo completo,
// empezando por el siguiente; debajo, la vuelta a la galería.
export function CaseNext({ labels, others }) {
  return (
    <section className="ap-case-next" aria-label={labels.label}>
      <span className="ap-case-mono ap-case-next__label">{labels.label}</span>
      <ul className="ap-case-next__list">
        {others.map((o) => (
          <li key={o.href}>
            <a className="ap-case-next__link" href={o.href} style={{ '--case-next': o.color }}>
              <span className="ap-case-next__title">{o.name}</span>
              <span className="ap-case-next__thumb"><CaseLockup {...o.logo} lazy /></span>
            </a>
          </li>
        ))}
      </ul>
      <div><a className="ap-case-all" href={labels.allHref}>{labels.all}</a></div>
    </section>
  );
}
