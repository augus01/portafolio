// Cortina del cambio de serie: una grilla de cuadrados que tapa el escenario y, encima, el panel de carga con
// el porcentaje, la serie que llega y 16 segmentos de avance. Solo tapa el escenario, no la página.
const SEGMENTS = 16;

export function OfficeSwapCurtain({ overlayRef, phase, cells, cols, rows, progress, item, loadingLabel }) {
  const busy = phase !== 'idle';
  const filled = Math.round(progress * SEGMENTS);
  const panelOn = phase === 'prep' || phase === 'cover';
  return (
    <>
      <div
        ref={overlayRef}
        className={['ap-off-swap', busy && 'is-live', phase === 'cover' && 'is-cover'].filter(Boolean).join(' ')}
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}
        aria-hidden="true"
      >
        {busy && cells.map((c, i) => <span key={i} className="ap-off-swap__cell" style={{ transitionDelay: `${c.delay}ms` }} />)}
      </div>
      <div className={['ap-off-swap__panel', panelOn && 'is-on'].filter(Boolean).join(' ')} role="status" aria-live="polite">
        {busy && item && (
          <>
            <div className="ap-off-swap__top">
              <p className="ap-off-swap__meta label">{loadingLabel}</p>
              <p className="ap-off-swap__pct label" aria-hidden="true">{Math.round(progress * 100)}%</p>
            </div>
            <div className="ap-off-swap__title">
              <p className="ap-off-swap__name heading">{item.label}</p>
              <p className="ap-off-swap__place body-sm">{item.place}</p>
            </div>
            <div className="ap-off-swap__segs" aria-hidden="true">
              {Array.from({ length: SEGMENTS }, (_, i) => <span key={i} className={['ap-off-swap__seg', i < filled && 'is-on'].filter(Boolean).join(' ')} />)}
            </div>
          </>
        )}
      </div>
    </>
  );
}
