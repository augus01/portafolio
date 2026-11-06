import { CaseLockup } from '../../molecules/CaseLockup';

// Otros proyectos: título grande y, lado a lado, cada proyecto con su nombre sobre una banda en su color de marca con
// su logo completo, empezando por el siguiente; debajo, la vuelta a la galería.
export function CaseNext({ labels, others }) {
  return (
    <section className="ap-case-next" aria-labelledby="ap-case-next-title">
      <h2 id="ap-case-next-title" className="ap-case-next__label hero">{labels.label}</h2>
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
