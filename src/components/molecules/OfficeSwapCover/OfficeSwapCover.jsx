// Tapa del cambio de oficina: grilla de cuadrados sobre el recuadro y un panel con la oficina que llega y su avance.
export function OfficeSwapCover({ swap, label, target }) {
  const { phase, cells, cols, rows, percent, segments } = swap;
  const cls = ['ap-px', phase !== 'idle' && 'ap-px--live', phase === 'cover' && 'ap-px--cover'].filter(Boolean).join(' ');
  const panelOn = phase === 'prep' || phase === 'cover';
  return (
    <>
      <div className={cls} aria-hidden="true" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}>
        {cells.map((c, i) => <span key={i} className="ap-px__cell" style={{ transitionDelay: `${c.delay}ms` }} />)}
      </div>
      <div className={['ap-px__panel', panelOn && 'is-on'].filter(Boolean).join(' ')} role="status" aria-live="polite">
        {panelOn && target && (
          <>
            <div className="ap-px__row">
              <p className="ap-px__k label">{label}</p>
              <p className="ap-px__pct label">{percent}%</p>
            </div>
            <div className="ap-px__name">
              <p className="ap-px__title heading">{target.label}</p>
              <p className="ap-px__place body-sm">{target.place}</p>
            </div>
            <div className="ap-px__segs" aria-hidden="true">
              {segments.map((on, i) => <span key={i} className={['ap-px__seg', on && 'is-on'].filter(Boolean).join(' ')} />)}
            </div>
          </>
        )}
      </div>
    </>
  );
}
