// Card de lienzo: etiqueta mono, título y párrafo. Plana, con borde hairline y sin sombra.
export function InfoCard({ label, title, children, as: Heading = 'h3', className }) {
  return (
    <article className={['ap-card', className].filter(Boolean).join(' ')}>
      {label && <p className="ap-card__label label">{label}</p>}
      <Heading className="ap-card__title heading">{title}</Heading>
      <p className="ap-card__text body">{children}</p>
    </article>
  );
}
