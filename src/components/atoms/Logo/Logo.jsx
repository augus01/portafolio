// Logo "apinto" y monograma "ap": trazo continuo de 6 unidades, solo en blanco o negro.
export function Logo({ variant = 'logotype', tone = 'dark', height = 32, label = 'Augusto Pinto', decorative, className }) {
  const mono = variant === 'monogram';
  return (
    <svg
      className={['ap-logo', `ap-logo--${tone}`, className].filter(Boolean).join(' ')}
      viewBox={mono ? '4 9.5 100 100' : '1 9.5 220 100'}
      width={mono ? height : height * 2.2}
      height={height}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative ? true : undefined}
      focusable="false"
    >
      <g fill="none" stroke="currentColor" strokeWidth={6} strokeLinecap="butt" strokeLinejoin="miter">
        <circle cx="37" cy="55" r="15" />
        <path d="M52 40V70" />
        <path d="M10 70V34A12 12 0 0 1 22 22H74A24 24 0 0 1 74 70H66" />
        <path d="M66 40V100" />
        {!mono && (
          <>
            <path d="M112 40V70" />
            <rect x="109" y="25" width="6" height="6" fill="currentColor" stroke="none" />
            <path d="M126 40V70M126 52A12 12 0 0 1 150 52V70" />
            <path d="M168 26V70M159 40H177" />
            <circle cx="200" cy="55" r="15" />
          </>
        )}
      </g>
    </svg>
  );
}
