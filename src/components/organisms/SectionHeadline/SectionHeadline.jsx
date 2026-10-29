// Encabezado de sección: antetítulo mono, título en display y párrafo de entrada.
export function SectionHeadline({ title, eyebrow, lead, id, as: Heading = 'h2', onDark, className }) {
  return (
    <header id={id} className={['ap-headline', onDark && 'ap-headline--on-dark', className].filter(Boolean).join(' ')}>
      {eyebrow && <p className="ap-headline__eyebrow label">{eyebrow}</p>}
      <Heading className="ap-headline__title display">{title}</Heading>
      {lead && <p className="ap-headline__lead lead">{lead}</p>}
    </header>
  );
}
