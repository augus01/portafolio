// Siguiente proyecto: nombre gigante y una miniatura en su color; debajo, la vuelta a la galería.
export function CaseNext({ labels, next }) {
  const { thumb, logo } = next;
  return (
    <section className="ap-case-next" aria-label={labels.label}>
      <a className="ap-case-next__link" href={next.href} style={{ '--case-next': next.color }}>
        <span className="ap-case-mono ap-case-next__label">{labels.label}</span>
        <span className="ap-case-next__title">{next.name}</span>
        <span className={`ap-case-next__thumb${thumb ? '' : ' ap-case-next__thumb--logo'}`}>
          {thumb
            ? <img src={thumb.src} width={thumb.width} height={thumb.height} alt="" loading="lazy" decoding="async" />
            : <img src={logo.symbol || logo.image} alt="" loading="lazy" decoding="async" />}
        </span>
      </a>
      <div><a className="ap-case-all" href={labels.allHref}>{labels.all}</a></div>
    </section>
  );
}
