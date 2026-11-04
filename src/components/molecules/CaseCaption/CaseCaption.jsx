// Pie de un escenario: número y nombre de la pantalla en mono, y qué muestra.
export function CaseCaption({ n, text }) {
  return (
    <figcaption className="ap-case-cap">
      <span className="ap-case-mono">{n}</span>
      <p>{text}</p>
    </figcaption>
  );
}
