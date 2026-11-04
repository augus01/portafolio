// Uno de los tres agentes de la oficina dibujado plano, como sus personajes 3D: cabeza en gota con ojos y sonrisa,
// en su color (--ap-agent-*). Stack lleva su antena. Decorativo: el nombre va en el enlace que lo contiene.
export function AgentFigure({ agent, className }) {
  return (
    <svg
      className={['ap-agent', `ap-agent--${agent}`, className].filter(Boolean).join(' ')}
      viewBox="0 -12 60 88"
      aria-hidden="true"
      focusable="false"
    >
      {agent === 'stack' && (
        <>
          <path d="M30 6V-4" className="ap-agent__antenna" />
          <circle cx="30" cy="-6" r="4" className="ap-agent__bulb" />
        </>
      )}
      <path className="ap-agent__body" d="M30 74C22 60 8 47 8 29a22 22 0 0 1 44 0c0 18-14 31-22 45Z" />
      <circle cx="22" cy="27" r="6" className="ap-agent__eye" />
      <circle cx="38" cy="27" r="6" className="ap-agent__eye" />
      <circle cx="23.5" cy="28" r="3" className="ap-agent__pupil" />
      <circle cx="39.5" cy="28" r="3" className="ap-agent__pupil" />
      <path d="M23 38q7 6 14 0" className="ap-agent__smile" />
    </svg>
  );
}
