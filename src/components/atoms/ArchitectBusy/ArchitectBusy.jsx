import { useRef } from 'react';
import { useArchitectBusy } from '../../../hooks/useAgentsOnSite';

// Círculo de la portada cuando el proyecto todavía no tiene app pública: en vez del enlace "Ver la app", arquitecto
// (3D) trabaja sobre el plano de la tienda y debajo se lee el estado. No es un enlace. Sin WebGL queda solo el texto.
export function ArchitectBusy({ label }) {
  const glRef = useRef(null);
  useArchitectBusy(glRef);
  return (
    <p className="ap-case-cta ap-case-cta--wip">
      <canvas ref={glRef} className="ap-case-cta__gl" width="160" height="160" aria-hidden="true" />
      <span className="ap-case-cta__wip-label">{label}</span>
    </p>
  );
}
