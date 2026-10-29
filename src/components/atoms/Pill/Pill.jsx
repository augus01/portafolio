// Píldora flotante de la NavBar: enlace por defecto o botón con `as="button"`.
export function Pill({ as = 'a', current, className, children, ...rest }) {
  const Tag = as;
  return (
    <Tag
      className={['ap-pill', 'body-sm', current && 'is-current', className].filter(Boolean).join(' ')}
      aria-current={current ? 'page' : undefined}
      {...(as === 'button' ? { type: 'button' } : null)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
