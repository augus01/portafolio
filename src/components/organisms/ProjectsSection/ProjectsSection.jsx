import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { ProjectTile } from '../../molecules/ProjectTile';
import { ArchitectPlan } from '../ArchitectPlan';
import { useArchitectPeeks } from '../../../hooks/useAgentsOnSite';

// Proyectos: galería de dos columnas (una bajo 720px) con portadas a sangre en el color de cada app; si el último
// proyecto queda solo en su fila, se centra. Arquitecto asoma por el borde de cada portada con `plan` y abre su plano
// (`architect` son sus textos); al cerrarlo, el foco vuelve al botón que lo abrió.
export function ProjectsSection({ id, title, count, items, architect }) {
  const [first, second] = title;
  const sectionRef = useRef(null);
  const planId = useId();
  const [open, setOpen] = useState(null);
  const [shown, setShown] = useState(null);
  const triggerRef = useRef(null);
  useArchitectPeeks(sectionRef, open);

  const close = useCallback(() => {
    setOpen(null);
    const t = triggerRef.current;
    if (t && document.contains(t)) t.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    if (open === null) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  const peek = (item, i) => (architect && item.plan ? {
    label: architect.open(item.name),
    tip: architect.tip,
    expanded: open === i,
    controls: planId,
    onClick: (e) => { triggerRef.current = e.currentTarget; setShown(i); setOpen(i); },
  } : undefined);

  return (
    <section id={id} ref={sectionRef} className="ap-section ap-section--continued ap-gal-wrap">
      <header className="ap-gal-head">
        <h2 className="ap-gal-title display">{first} <span>{second}</span></h2>
        <p className="ap-gal-count meta">{count}</p>
      </header>
      <div className="ap-gal">
        {items.map((item, i) => (
          <ProjectTile key={item.name} {...item} architect={peek(item, i)} className="ap-reveal" />
        ))}
      </div>
      {architect && (
        <ArchitectPlan id={planId} project={items[shown ?? 0]} open={open !== null} texts={architect} onClose={close} />
      )}
    </section>
  );
}
