// Iconos de Lucide 0.468 (ISC), trazo 1,5. Solo se agregan al mapa los que la página usa.
const PATHS = {
  menu: ['M4 12h16', 'M4 6h16', 'M4 18h16'],
  x: ['M18 6 6 18', 'm6 6 12 12'],
  'arrow-up-right': ['M7 7h10v10', 'M7 17 17 7'],
  'arrow-right': ['M5 12h14', 'm12 5 7 7-7 7'],
  'arrow-left': ['m12 19-7-7 7-7', 'M19 12H5'],
  list: ['M3 12h.01', 'M3 18h.01', 'M3 6h.01', 'M8 12h13', 'M8 18h13', 'M8 6h13'],
};

export function Icon({ name, size = 'md', label, className }) {
  const paths = PATHS[name];
  if (!paths) return null;
  return (
    <span
      className={['ap-icon', `ap-icon--${size}`, className].filter(Boolean).join(' ')}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" focusable="false">
        {paths.map((d) => <path key={d} d={d} />)}
      </svg>
    </span>
  );
}
