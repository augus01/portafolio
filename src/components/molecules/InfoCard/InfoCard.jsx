// Ficha para escanear rápido: pares rótulo y dato en una lista de definiciones (el lector de pantalla
// anuncia cada rótulo con su dato). Superficie del lienzo: raised, borde hairline, sin sombra.
export function InfoCard({ label, items, className }) {
  return (
    <dl className={['ap-info', className].filter(Boolean).join(' ')} aria-label={label}>
      {items.map(({ label: term, value }) => (
        <div key={term} className="ap-info__item">
          <dt className="ap-info__term label">{term}</dt>
          <dd className="ap-info__value body">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
