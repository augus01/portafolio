import { useRef } from 'react';
import { useStackReader } from '../../../hooks/useStackReader';

// stack sentado leyendo en su puesto de la cinta de Superpoderes (artefacto "Hero · Augusto Pinto"). Al pasar el
// cursor (o tocarlo) salta asustado y dice `scare` en su globo; con `cheer` salta de emoción cuando pasas por un logo. Es decorativo: no entra al orden de Tab ni a lectores.
export function StackReader({ scare, cheer }) {
  const stageRef = useRef(null);
  useStackReader(stageRef, scare, cheer);
  return (
    <span ref={stageRef} className="hab-rd">
      <span className="hab-rd__gl" data-rd-canvas="" />
      <span className="hab-rd__say" data-rd-bubble="" />
    </span>
  );
}
