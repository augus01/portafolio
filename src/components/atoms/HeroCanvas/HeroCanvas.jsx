// Lienzo del fondo WebGL del hero. Es decorativo.
export function HeroCanvas({ ref }) {
  return <canvas ref={ref} className="ap-hero__gl" aria-hidden="true" />;
}
