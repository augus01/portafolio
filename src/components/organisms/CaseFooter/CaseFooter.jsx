// Pie de la página de proyecto: versión a la izquierda y el contacto a la derecha.
export function CaseFooter({ items }) {
  return (
    <footer className="ap-case-bottom">
      {items.map((it) => (
        <div key={it.label}>
          <span className="ap-case-mono">{it.label}</span>
          <p>{it.link ? <a href={it.link.href}>{it.link.label}</a> : it.text}</p>
        </div>
      ))}
    </footer>
  );
}
