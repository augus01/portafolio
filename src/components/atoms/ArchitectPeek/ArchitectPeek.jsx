// Arquitecto asomado por el borde superior de una portada de Proyectos: botón que abre el plano del proyecto.
// La figura 3D se dibuja en el lienzo `[data-arq-peek]` (hooks/useAgentsOnSite.js, useArchitectPeeks); sube al pasar
// el cursor por la portada o con foco, y muestra "Ver el plano".
export function ArchitectPeek({ label, tip, expanded, controls, onClick }) {
  return (
    <button type="button" className="ap-arq" aria-label={label} aria-haspopup="dialog" aria-expanded={expanded} aria-controls={controls} onClick={onClick}>
      <span className="ap-arq__tip label" aria-hidden="true">{tip}</span>
      <canvas className="ap-arq__gl" data-arq-peek="" width="120" height="120" aria-hidden="true" />
    </button>
  );
}
