import { useRef } from 'react';
import { HeroCanvas } from '../../atoms/HeroCanvas';
import { GrainOverlay } from '../../atoms/GrainOverlay';
import { Hero } from '../Hero';
import { useHeroBackground } from '../../../hooks/useHeroBackground';

// Escenario fijo del hero inmersivo: fondo WebGL, Hero del sistema, grano, salida a la página y titular opcional.
// `motionRef` comparte con el scroll el timeline del pin, para que el fondo siga sus fases.
export function HeroStage({ hero, motionRef, title, lead }) {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const isGL = useHeroBackground(canvasRef, stageRef, motionRef);

  return (
    <div ref={stageRef} className={isGL ? 'ap-sticky is-gl' : 'ap-sticky'}>
      <HeroCanvas ref={canvasRef} />
      <Hero {...hero} />
      <GrainOverlay />
      <div className="ap-exit" aria-hidden="true" />
      {/* Titular opcional sobre el hero. Vacío a propósito: si se le pone texto, el velo y la máscara del shader se activan solos. */}
      <div className="ap-overlay">
        <div className="ap-overlay__inner">
          {title && <h2 className="ap-overlay__title">{title}</h2>}
          {lead && <p className="ap-overlay__lead">{lead}</p>}
        </div>
      </div>
    </div>
  );
}
