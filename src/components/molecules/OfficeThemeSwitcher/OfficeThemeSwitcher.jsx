import { useId } from 'react';

// Selector de serie de la oficina: rótulo, grupo de píldoras y la oficina actual debajo.
// `selected` es la serie marcada (la que se está cargando, o la actual); con `busy` los botones quedan en
// aria-disabled (conservan el foco) y no responden hasta que termine el cambio.
export function OfficeThemeSwitcher({ label, nowLabel, items, current, selected, busy, onPick }) {
  const labelId = useId();
  const cur = items.find((t) => t.id === current) || items[0];
  return (
    <div className="ap-off-sw">
      <p className="ap-off-sw__label label" id={labelId}>{label}</p>
      <div className="ap-off-sw__group" role="group" aria-labelledby={labelId}>
        {items.map((t) => (
          <button
            key={t.id}
            type="button"
            className="ap-off-sw__btn label"
            aria-pressed={t.id === selected}
            aria-disabled={busy || undefined}
            onClick={() => { if (!busy) onPick(t.id); }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="ap-off-sw__now body-sm">{nowLabel}: {cur.label} · {cur.place}</p>
    </div>
  );
}
