// Botón del sistema (design-system/components/Button): variantes primary y secondary, tamaños md y lg.
// Se implementa solo lo que la página usa; el label siempre es un verbo concreto.
export function Button({ variant = 'secondary', size = 'md', type = 'button', className, children, ...rest }) {
  return (
    <button
      type={type}
      className={['ap-btn', `ap-btn--${variant}`, `ap-btn--${size}`, 'body-sm', className].filter(Boolean).join(' ')}
      {...rest}
    >
      <span className="ap-btn__content">{children}</span>
    </button>
  );
}
