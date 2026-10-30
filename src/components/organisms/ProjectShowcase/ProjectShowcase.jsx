import { MediaCard } from '../../molecules/MediaCard';

// Un proyecto: nombre y rol | descripción, y debajo sus cards. Ambas filas usan la misma rejilla para que alineen.
// Bajo 720px las cards pasan a carrusel horizontal; `data-lenis-prevent` deja el gesto al navegador.
export function ProjectShowcase({ name, role, description, cards, className }) {
  return (
    <article className={['ap-proj', className].filter(Boolean).join(' ')}>
      <header className="ap-proj__grid ap-proj__head">
        <div className="ap-proj__who">
          <h3 className="ap-proj__title subheading">{name}</h3>
          <p className="ap-proj__role subheading">{role}</p>
        </div>
        <p className="ap-proj__desc lead">{description}</p>
      </header>
      <div className="ap-proj__grid ap-proj__cards" data-lenis-prevent>
        {cards.map((card, i) => (
          <MediaCard key={card.title + i} index={String(i + 1).padStart(2, '0')} {...card} />
        ))}
      </div>
    </article>
  );
}
