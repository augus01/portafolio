// Nombre gigante del Hero: una línea por elemento de `lines`, cada una animable por separado.
export function Wordmark({ lines, uppercase, className }) {
  return (
    <h1 className={['ap-hero__name', 'wordmark', uppercase && 'is-upper', className].filter(Boolean).join(' ')}>
      {lines.map((line) => (
        <span key={line} className="ap-hero__line"><span>{line}</span></span>
      ))}
    </h1>
  );
}
