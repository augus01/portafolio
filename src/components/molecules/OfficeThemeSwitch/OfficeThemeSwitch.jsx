import { useId } from 'react';

// Selector de oficina: una píldora por serie y debajo la oficina actual. Mientras cambia, los botones quedan en espera.
// `inStage`: va sobre la maqueta con los colores de la oficina; el título y la oficina actual quedan solo para lectores.
export function OfficeThemeSwitch({ label, nowLabel, items, current, target, busy, onPick, inStage, className }) {
  const labelId = useId();
  const cur = items.find((t) => t.id === current) || items[0];
  const pressed = target || current;
  return (
    <div className={['ap-ofsw', inStage && 'ap-ofsw--stage', className].filter(Boolean).join(' ')}>
      <p className={inStage ? 'ap-sr' : 'ap-ofsw__label label'} id={labelId}>{label}</p>
      <div className="ap-ofsw__group" role="group" aria-labelledby={labelId}>
        {items.map((t) => (
          <button
            key={t.id}
            type="button"
            className="ap-ofsw__btn label"
            aria-pressed={t.id === pressed}
            aria-disabled={busy || undefined}
            onClick={() => onPick(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className={inStage ? 'ap-sr' : 'ap-ofsw__now body-sm'}>{nowLabel}: {cur.label} · {cur.place}</p>
    </div>
  );
}
