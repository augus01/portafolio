// Interruptor de idioma EN | ES: la perilla se desliza al idioma actual. Es un `role="switch"` que se activa con español
// (`aria-checked`), y se anuncia con `label` ("Spanish" / "Español"); las siglas visibles quedan ocultas para lectores.
export function LangSwitch({ current = 'en', label, onToggle, className }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={current === 'es'}
      aria-label={label}
      data-lang={current}
      className={['ap-lsw', 'body-sm', className].filter(Boolean).join(' ')}
      onClick={onToggle}
    >
      <span className="ap-lsw__thumb" aria-hidden="true" />
      <span className="ap-lsw__opt" lang="en" aria-hidden="true">EN</span>
      <span className="ap-lsw__opt" lang="es" aria-hidden="true">ES</span>
    </button>
  );
}
