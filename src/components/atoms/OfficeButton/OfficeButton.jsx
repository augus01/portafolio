// Botón de la oficina 3D: píldora mono en mayúsculas; `pressed` marca la vista o el agente activo.
export function OfficeButton({ pressed, className, children, ...rest }) {
  return (
    <button
      type="button"
      className={['ap-off__btn', 'label', className].filter(Boolean).join(' ')}
      aria-pressed={pressed === undefined ? undefined : pressed}
      {...rest}
    >
      {children}
    </button>
  );
}
