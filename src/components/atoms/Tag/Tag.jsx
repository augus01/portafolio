// Etiqueta informativa del sistema (design-system/components/Tag): mono y mayúsculas, no interactiva.
export function Tag({ variant = 'default', size = 'sm', title, className, children }) {
  return (
    <span
      className={['ap-tag', `ap-tag--${size}`, variant === 'inverse' && 'ap-tag--inverse', 'label', className].filter(Boolean).join(' ')}
      title={title}
    >
      {children}
    </span>
  );
}
