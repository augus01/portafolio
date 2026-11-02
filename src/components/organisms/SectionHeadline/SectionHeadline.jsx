// Encabezado de sección: antetítulo mono, título en display y párrafo de entrada.
// `title` es un texto o un par [inicio, final]; con par, el final va en gris como en Sobre mí, Superpoderes y Proyectos.
export function SectionHeadline({ title: rawTitle, eyebrow, lead, id, as: Heading = 'h2', onDark, className }) {
  const title = Array.isArray(rawTitle) ? <>{rawTitle[0]} <span>{rawTitle[1]}</span></> : rawTitle;
  return (
    <header id={id} className={['ap-headline', onDark && 'ap-headline--on-dark', className].filter(Boolean).join(' ')}>
      {eyebrow && <p className="ap-headline__eyebrow label">{eyebrow}</p>}
      <Heading className="ap-headline__title display">{title}</Heading>
      {lead && <p className="ap-headline__lead lead">{lead}</p>}
    </header>
  );
}
